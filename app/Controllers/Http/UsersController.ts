import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { ErrorReporter } from 'App/Reporters/ErrorReporter';

import Database from '@ioc:Adonis/Lucid/Database'

import UserRole from 'App/Models/UserRole';
import Profile from 'App/Models/Profile';
import User from "App/Models/User";

import CustomMessages from 'App/Utils/CustomMessages';
import { string } from '@ioc:Adonis/Core/Helpers'

export default class UsersController {
  public async create({ request, response }) {
    const customSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' })
      ]),
      password: schema.string([
        rules.minLength(8),
        rules.maxLength(32),
        rules.regex(/^[a-z\d\-_\s#$!]+$/i)
      ]),
      phone: schema.string({ trim: true }, [
        rules.minLength(10),
        rules.unique({ table: 'users', column: 'phone' })
      ]),
      name: schema.string({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(64),
        rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/gm)
      ]),
      lastName: schema.string({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(64),
        rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/gm)
      ]),
      roles: schema.array().members(schema.string({ trim: true }, [
        rules.exists({ table: 'roles', column: 'id' })
      ]))
    })

    try {
      const payload = await request.validate({
        schema: customSchema,
        messages: CustomMessages,
        reporter: ErrorReporter
      })

      let user = await User.create({
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        confirm: true
      })

      for (let role of payload.roles) {
        await UserRole.create({
          userId: user.id,
          roleId: role
        })
      }

      const profile = await Profile.create({
        name: payload.name,
        lastName: payload.lastName,
        userId: user.id,
      })

      await user.merge({ profileId: profile.id }).save()

      user = await User.query()
        .where('id', user.id)
        .preload('profile')
        .preload('roles')
        .first() as User

      return response.send({
        user: user
      })
    } catch (error) {
      if (error.messages?.errors?.length > 0) {
        return response.badRequest(error.messages.errors[0])
      }
      return response.badRequest(error)
    }
  }
  public async update({ auth, request, response }) {
    const customSchema = schema.create({
      email: schema.string.optional({ trim: true }, [
        rules.email(),
      ]),
      password: schema.string.optional([
        rules.minLength(8),
        rules.maxLength(32),
        rules.regex(/^[a-z\d\-_\s#$!]+$/i)
      ]),
      phone: schema.string.optional({ trim: true }, [
        rules.minLength(10),
      ]),
      name: schema.string.optional({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(64),
        rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/gm)
      ]),
      lastName: schema.string.optional({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(64),
        rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/gm)
      ]),
      roles: schema.array.optional().members(schema.string({ trim: true }, [
        rules.exists({ table: 'roles', column: 'id' })
      ]))
    })

    try {
      const payload = await request.validate({
        schema: customSchema,
        messages: CustomMessages,
        reporter: ErrorReporter
      })

      const { id } = request.params()

      let user = await auth.use('api').user
      user = await User.find(user.id)

      const hasRole = await user.hasRole('cliente')
      if (hasRole && id !== user.id) {
        return response.badRequest({
          code: "UNAUTHORIZED_ACCESS",
          message: "Usuario no autorizado",
        })
      }

      user = await User.find(id)
      if (!user) {
        return response.badRequest({
          code: 'USER_NOT_FOUND',
          message: 'El usuario no existe'
        })
      }

      const keys = ['email', 'phone']
      for (let key of keys) {
        if (payload[key]) {
          const resp = await Database.query()
            .from('users')
            .where(key, payload[key])
            .where('id', '!=', id)
            .count('*', 'count')
          if (resp[0].count > 0) {
            return response.badRequest({
              code: `${key.toUpperCase()}_ALREADY_EXISTS`,
              message: `${string.capitalCase(key)} ya esta en uso`
            })
          }
        }
      }

      await user!.merge({
        email: payload.email ?? undefined,
        phone: payload.phone ?? undefined,
        password: payload.password ?? undefined,
      }).save()

      const profile = await Profile.find(user.profileId)
      await profile!.merge({
        name: payload.name ?? undefined,
        lastName: payload.lastName ?? undefined,
      }).save()

      if (payload.roles && payload.roles.length > 0) {
        user.related('roles').detach()
        const userRoles: any[] = []
        payload.roles.forEach((r) => {
          userRoles.push({
            userId: user!.id,
            roleId: r
          })
        })
        await UserRole.createMany(userRoles)
      }

      user = await User.query()
        .where('id', id)
        .preload('profile')
        .preload('roles')
        .first()

      return response.send({
        user: user
      })
    } catch (error) {
      if (error.messages?.errors?.length > 0) {
        return response.badRequest(error.messages.errors[0])
      }
      return response.badRequest(error)
    }
  }
  public async show({ response }) {
    const users = await User.query()
      .preload('profile')
      .preload('roles');
    return response.send({
      users: users,
    });
  }
  public async index({ request, response }) {
    const { id } = request.params()
    const user = await User.query()
      .where("id", id)
      .preload('profile')
      .preload("roles")
      .first();
    return response.send({
      user: user,
    });
  }
  public async me({ auth, response }) {
    const authUser = auth.use("api").user!

    const user = await User.query()
      .where("id", authUser.id)
      .preload('profile')
      .preload("roles")
      .first()

    response.send({
      user: user,
    });
  }
}
