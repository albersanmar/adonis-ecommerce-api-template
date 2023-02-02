import { ErrorReporter } from 'App/Reporters/ErrorReporter';
import CustomMessages from 'App/Utils/CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Role from "App/Models/Role"
import RolePermission from "App/Models/RolePermission"

export default class RoleController {
    async index({ response }) {
        const roles = await Role.query()
            .preload('permissions')
        return response.send({
            roles: roles
        })
    }

    async show({ request, response }) {
        const { id } = request.params()
        const role = await Role.query()
            .where('id', id)
            .preload('permissions')
            .first()

        if (!role) {
            return response.badRequest({
                code: 'ROLE_NOT_FOUND',
                message: 'El role no existe'
            })
        }

        return response.send({
            role: role
        })
    }

    async store({ request, response }) {
        const customSchema = schema.create({
            name: schema.string({ trim: true }, [
                rules.unique({ table: 'roles', column: 'name' }),
                rules.minLength(3),
                rules.maxLength(32),
                rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/gm)
            ]),
            description: schema.string.optional({ trim: true }, [
                rules.minLength(3),
                rules.maxLength(32),
                rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/gm)
            ]),
            permissions: schema.array.optional().members(schema.string({ trim: true }, [
                rules.exists({ table: 'permissions', column: 'id' })
            ]))
        })

        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            const { permissions = [], ...data } = payload
            let role = await Role.create(data)

            const rolePermissions: any[] = []
            permissions.forEach((p) => {
                rolePermissions.push({
                    roleId: role.id,
                    permissionId: p
                })
            })
            await RolePermission.createMany(rolePermissions)

            role = await Role.query()
                .where('id', role.id)
                .preload('permissions')
                .first() as Role

            return response.send({ role: role })
        } catch (error) {
            // console.log(error)
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }

    async update({ request, response }) {
        const customSchema = schema.create({
            name: schema.string.optional({ trim: true }, [
                rules.minLength(3),
                rules.maxLength(32),
                rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/gm)
            ]),
            description: schema.string.optional({ trim: true }, [
                rules.minLength(3),
                rules.maxLength(32),
                rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/gm)
            ]),
            permissions: schema.array.optional().members(schema.string({ trim: true }, [
                rules.exists({ table: 'permissions', column: 'id' })
            ]))
        })

        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            const { id } = request.params()

            const { permissions = [], ...data } = payload
            let role = await Role.find(id)
            if (!role) {
                return response.badRequest({
                    code: 'ROLE_NOT_FOUND',
                    message: 'El permiso no existe'
                })
            }

            if (payload.name) {
                const rResp = await Role.query()
                    .where('name', payload.name)
                    .where('id', '!=', id)
                    .first()
                if (rResp) {
                    return response.badRequest({
                        code: 'NAME_EXISTS',
                        message: 'El nombre ya esta en uso'
                    })
                }
            }

            await role!.merge(data).save()
            if (permissions && permissions.length > 0) {
                role.related('permissions').detach()

                const rolePermissions: any[] = []
                permissions.forEach((p) => {
                    rolePermissions.push({
                        roleId: role!.id,
                        permissionId: p
                    })
                })
                await RolePermission.createMany(rolePermissions)
            }

            role = await Role.query()
                .where('id', role.id)
                .preload('permissions')
                .first()

            return response.send({ role: role })
        } catch (error) {
            // console.log(error)
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
}