import Env from "@ioc:Adonis/Core/Env";
import Mail from '@ioc:Adonis/Addons/Mail'

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { ErrorReporter } from 'App/Reporters/ErrorReporter';

import User from "App/Models/User";
import UserRole from 'App/Models/UserRole';
import Profile from 'App/Models/Profile';

import Hash from '@ioc:Adonis/Core/Hash';
import CustomMessages from 'App/Utils/CustomMessages';

export default class AuthController {
    public async register({ request, response }) {
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
            ])
        })

        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            const min = 1000, max = 9999
            const code = Math.floor(Math.random() * (max - min) + min)

            const user = await User.create({
                ...payload,
                email: payload.email,
                phone: payload.phone,
                password: payload.password,
                confirmToken: code
            })

            await UserRole.create({
                userId: user.id,
                roleId: '276d9720-a0e2-11ed-b16b-f79849cd9fd9' // RoleId del cliente
            })

            const profile = await Profile.create({
                name: payload.name,
                lastName: payload.lastName,
                userId: user.id,
            })

            await user.merge({ profileId: profile.id }).save()

            await Mail.use('ses')
                .send((message) => {
                    message
                        .from(Env.get('SES_EMAIL'))
                        .to(payload.email)
                        .subject('Verifica tu cuenta')
                        .htmlView('emails/confirm', { code: code })
                })
            return response.send({
                user: user
            })
        } catch (error) {
            console.log(error)
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
    public async login({ auth, request, response }) {
        const customSchema = schema.create({
            email: schema.string({ trim: true }, [
                rules.email(),
            ]),
            password: schema.string([
                rules.minLength(8),
                rules.maxLength(32),
                rules.regex(/^[a-z\d\-_\s#$!]+$/i)
            ]),
        })

        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            const user = await User
                .query()
                .where('email', payload.email)
                .first()

            if (!user) {
                return response.badRequest({
                    code: 'USER_NOT_FOUND',
                    message: 'El usuario no existe'
                })
            }

            if (!(await Hash.verify(user!.password, payload.password))) {
                return response.badRequest({
                    code: 'INVALID_CREDENTIALS',
                    message: 'Usuario o contraseña invalido'
                })
            }

            if (!user.confirm) {
                return response.badRequest({
                    code: "USER_NOT_CONFIRMED",
                    message: "El usuario no ha sido confirmado",
                })
            }
            if (user.blocked) {
                return response.badRequest({
                    code: "USER_BLOCKED",
                    message: "Usuario bloqueado",
                })
            }

            const token = await auth.use('api').generate(user)

            return response.send(token)
        } catch (error) {
            console.log(error)
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
    public async logout({ auth, response }) {
        await auth.use("api").revoke();
        return response.send({
            code: "SESSION_CLOSED",
            message: "Sesión cerrada correctamente",
        });
    }
    public async confirm({ request, response }) {
        const customSchema = schema.create({
            code: schema.string({ trim: true }, [
                rules.minLength(4),
                rules.maxLength(4),
                rules.regex(/^[0-9]*$/gm)
            ]),
            email: schema.string({ trim: true }, [
                rules.email(),
            ]),
        })

        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            const user = await User.query()
                .where('email', payload.email)
                .first()

            if (!user) {
                return response.badRequest({
                    code: 'USER_NOT_FOUND',
                    message: 'El usuario no existe'
                })
            }

            if (user!.confirmToken !== payload.code) {
                return response.badRequest({
                    code: 'CODE_NOT_VALID',
                    message: 'Código no valido'
                })
            }

            await User.query()
                .where('id', user!.id)
                .update({ confirmToken: null, confirm: true })

            return response.send({
                code: 'USER_CONFIRMED',
                message: 'Usuario confirmado'
            })
        } catch (error) {
            console.log(error)
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
}
