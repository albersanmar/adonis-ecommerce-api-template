import { ErrorReporter } from 'App/Reporters/ErrorReporter';
import CustomMessages from 'App/Utils/CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Permission from "App/Models/Permission"

export default class PermissionController {
    async show({ response }) {
        const permissions = await Permission.all()
        return response.send({
            permissions: permissions
        })
    }

    async index({ request, response }) {
        const { id } = request.params()

        const permission = await Permission.find(id)
        if (!permission) {
            return response.badRequest({
                code: 'PERMISSION_NOT_FOUND',
                message: 'El permiso no existe'
            })
        }

        return response.send({
            permission: permission
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
        })

        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            const permission = await Permission.create(payload)

            return response.send({ permission: permission })
        } catch (error) {
            console.log(error)
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
        })

        try {
            const { id } = request.params()

            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            const permission = await Permission.find(id)
            if (!permission) {
                return response.badRequest({
                    code: 'PERMISSION_NOT_FOUND',
                    message: 'El permiso no existe'
                })
            }

            if (payload.name) {
                const pResp = await Permission.query()
                    .where('name', payload.name)
                    .where('id', '!=', id)
                    .first()
                if (pResp) {
                    return response.badRequest({
                        code: 'NAME_EXISTS',
                        message: 'El nombre ya esta en uso'
                    })
                }
            }

            await permission!.merge(payload).save()

            return response.send({ permission: permission })
        } catch (error) {
            console.log(error)
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }


    async destroy({ request, response }) {
        const { id } = request.params()
        const permission = await Permission.find(id)
        if (!permission) {
            response.badRequest({
                code: 'PERMISSION_NOT_FOUND',
                message: 'El permiso no existe'
            })
        }

        await permission!.delete()

        return response.send({
            code: 'PERMISSION_DELETED',
            message: 'Permiso eliminado'
        })
    }
}