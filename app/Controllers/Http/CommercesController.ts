import { ErrorReporter } from 'App/Reporters/ErrorReporter';
import CustomMessages from 'App/Utils/CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Commerce from 'App/Models/Commerce';
import User from 'App/Models/User';

export default class RoleController {
    async store({ auth, request, response }) {
        const customSchema = schema.create({
            name: schema.string({ trim: true }, []),
            description: schema.string({ trim: true }, []),
            mediaId: schema.string({ trim: true }, [
                rules.exists({ table: 'media', column: 'id' })
            ])
        })

        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            let user: User = await auth.use('api').user
            user = await User.find(user.id) as User
            const hasRoleAdminRoot = await user.hasRole('administrador', 'root')
            if (hasRoleAdminRoot)
                payload.belongsAdmin = true
            const hasRoleClient = await user.hasRole('cliente')
            if (hasRoleClient) {
                if (user.commerceId) {
                    return response.badRequest({
                        code: 'COMMERCE_EXISTS',
                        message: 'Este usuario ya cuenta con un comercio'
                    })
                }
                payload.userId = user.id
            }

            let commerce = await Commerce.create({ ...payload })
            if (hasRoleClient) {
                await user.merge({
                    commerceId: commerce.id
                }).save()
            }

            commerce = await Commerce.query()
                .where('id', commerce.id)
                .preload('user')
                .preload('media')
                .first() as Commerce
            return response.send({ commerce: commerce })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
    async update({ auth, request, response }) {
        const customSchema = schema.create({
            name: schema.string.optional({ trim: true }, []),
            description: schema.string.optional({ trim: true }, []),
            mediaId: schema.string.optional({ trim: true }, [
                rules.exists({ table: 'media', column: 'id' })
            ])
        })

        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            const { id } = request.params()

            let commerce = await Commerce.find(id)
            if (!commerce) {
                return response.badRequest({
                    code: 'COMMERCE_NOT_FOUND',
                    message: 'El comercio no existe'
                })
            }

            let user: User = await auth.use('api').user
            user = await User.find(user.id) as User
            const hasRoleClient = await user.hasRole('cliente')
            if (hasRoleClient && user.id !== commerce.userId) {
                return response.badRequest({
                    code: "UNAUTHORIZED_ACCESS",
                    message: "Usuario no autorizado",
                })
            }

            await commerce.merge({
                name: payload.name ?? undefined,
                description: payload.description ?? undefined,
                mediaId: payload.mediaId ?? undefined
            }).save()

            commerce = await Commerce.query()
                .where('id', id)
                .preload('user')
                .preload('media')
                .first() as Commerce
            return response.send({ commerce: commerce })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
    async show({ request, response }) {
        try {
            const { slug, userId } = request.all()

            let promise = Commerce.query()
            if (slug) promise = promise.where('slug', slug)
            if (userId) promise = promise.where('userId', userId)

            const commerces = await promise
                .preload('user')
                .preload('media')
            return response.send({
                commerces: commerces
            })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
    async index({ request, response }) {
        try {
            const { id } = request.params()
            const commerce = await Commerce.query()
                .where('id', id)
                .preload('user')
                .preload('media')
                .first()
            if (!commerce) {
                return response.badRequest({
                    code: 'COMMERCE_NOT_FOUND',
                    message: 'El comercio no existe'
                })
            }
            return response.send({
                commerce: commerce
            })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
    async showMe({ auth, response }) {
        try {
            const user = await User.find(await auth.use('api').user.id)
            const commerce = await Commerce.query()
                .where('id', user!.commerceId)
                .preload('user')
                .preload('media')
                .first()
            return response.send({
                commerce: commerce
            })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
    async updateMe({ auth, request, response }) {
        const customSchema = schema.create({
            name: schema.string.optional({ trim: true }, []),
            description: schema.string.optional({ trim: true }, []),
            mediaId: schema.string.optional({ trim: true }, [
                rules.exists({ table: 'media', column: 'id' })
            ])
        })

        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            const user = await User.find(await auth.use('api').user.id)

            let commerce = await Commerce.find(user!.commerceId)
            if (!commerce) {
                commerce = await Commerce.create({
                    ...payload,
                    userId: user!.id
                })
                await user!.merge({
                    commerceId: commerce.id
                }).save()
            } else {
                await commerce.merge({
                    name: payload.name ?? undefined,
                    description: payload.description ?? undefined,
                    mediaId: payload.mediaId ?? undefined
                }).save()
            }

            commerce = await Commerce.query()
                .where('id', commerce.id)
                .preload('user')
                .preload('media')
                .first() as Commerce
            return response.send({ commerce: commerce })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
}