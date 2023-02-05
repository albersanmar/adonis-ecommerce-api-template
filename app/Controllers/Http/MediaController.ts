import Drive from '@ioc:Adonis/Core/Drive'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import { DateTime } from 'luxon'

import { ErrorReporter } from 'App/Reporters/ErrorReporter';
import CustomMessages from 'App/Utils/CustomMessages';
import Media from 'App/Models/Media'
import User from 'App/Models/User';

export default class MediaController {
    public async store({ auth, request, response }) {
        const customSchema = schema.create({
            file: schema.file({
                size: '1mb',
            }),
            path: schema.string.optional({ trim: true }, [
                rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ/]*$/gm)
            ])
        })
        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })
            let user = await auth.use('api').user
            user = await User.find(user.id)
            const hasRoleClient = await user.hasRole('cliente')

            const { file, path = '' } = payload

            const index = file.clientName.indexOf(`.${file.extname}`)
            const fileName = file.clientName.slice(0, index) + '-' + DateTime.now().toMillis() + `.${file.extname}`
            let media = await Media.create({
                basePath: path,
                fileName: fileName,
                mimeType: `${file.type}/${file.subtype}`,
                userId: hasRoleClient ? user.id : undefined
            })
            await file.moveToDisk(media.basePath, {
                name: media.fileName,
                contentType: media.mimeType,
                visibility: 'private'
            })
            return response.send({ media: media })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }

    }
    public async show({ auth, response }) {
        try {
            let user = await auth.use('api').user
            user = await User.find(user.id)
            const hasRoleClient = await user.hasRole('cliente')

            let promise
            if (hasRoleClient) {
                promise = Media.query()
                    .where('userId', user.id)
            } else {
                promise = Media.all()
            }

            const media = await promise
            return response.send({ media: media })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
    public async index({ request, response }) {
        try {
            const { id } = request.params()
            const media = await Media.find(id)
            if (!media) {
                return response.badRequest({
                    code: 'MEDIA_NOT_FOUND',
                    message: 'Archivo no encontrado'
                })
            }
            return response.send({ media: media })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
    public async update({ auth, request, response }) {
        const customSchema = schema.create({
            file: schema.file({
                size: '1mb',
            }),
        })
        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })
            const { id } = request.params()
            const media = await Media.find(id)
            if (!media) {
                return response.badRequest({
                    code: 'MEDIA_NOT_FOUND',
                    message: 'Archivo no encontrado'
                })
            }

            let user = await auth.use('api').user
            user = await User.find(user.id)

            const hasRole = await user.hasRole('cliente')
            if (hasRole && media.userId !== user.id) {
                return response.badRequest({
                    code: "UNAUTHORIZED_ACCESS",
                    message: "Usuario no autorizado",
                })
            }

            await Drive.delete(media.fullPath)

            const path = media.basePath
            const file = payload.file

            const index = file.clientName.indexOf(`.${file.extname}`)
            const fileName = file.clientName.slice(0, index) + '-' + DateTime.now().toMillis() + `.${file.extname}`
            await media!.merge({
                basePath: path,
                fileName: fileName,
                mimeType: `${file.type}/${file.subtype}`
            }).save()
            await file.moveToDisk(media.basePath, {
                name: media.fileName,
                contentType: media.mimeType,
                visibility: 'private'
            })
            return response.send({ media: media })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
    public async delete({ auth, request, response }) {
        try {
            const { id } = request.params()
            const media = await Media.find(id)
            if (!media) {
                return response.badRequest({
                    code: 'MEDIA_NOT_FOUND',
                    message: 'Archivo no encontrado'
                })
            }

            let user = await auth.use('api').user
            user = await User.find(user.id)

            const hasRole = await user.hasRole('cliente')
            if (hasRole && media.userId !== user.id) {
                return response.badRequest({
                    code: "UNAUTHORIZED_ACCESS",
                    message: "Usuario no autorizado",
                })
            }

            await media!.delete()
            await Drive.delete(media.fullPath)
            return response.send({
                code: 'MEDIA_DELETED',
                message: 'Archivo eliminado'
            })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
}