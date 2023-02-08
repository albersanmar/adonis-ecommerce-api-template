import { ErrorReporter } from 'App/Reporters/ErrorReporter';
import CustomMessages from 'App/Utils/CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category';

export default class RoleController {
    async store({ request, response }) {
        const customSchema = schema.create({
            name: schema.string({ trim: true }, [
                rules.unique({ table: 'categories', column: 'name' }),
                rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/gm)
            ]),
            description: schema.string.optional({ trim: true }, [
                rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/gm)
            ]),
            parentCategoryId: schema.string.optional({ trim: true }, [
                rules.exists({ table: 'categories', column: 'id' })
            ]),
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

            let category = await Category.create({ ...payload })
            category = await Category.query()
                .where('id', category.id)
                .preload('parentCategory')
                .preload('media')
                .first() as Category
            return response.send({ category: category })
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
                rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/gm)
            ]),
            description: schema.string.optional({ trim: true }, [
                rules.minLength(3),
                rules.maxLength(32),
                rules.regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/gm)
            ]),
            parentCategoryId: schema.string.optional({ trim: true }, [
                rules.exists({ table: 'categories', column: 'id' })
            ]),
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

            let category = await Category.find(id)
            if (!category) {
                return response.badRequest({
                    code: 'CATEGORY_NOT_FOUND',
                    message: 'La categoría no existe'
                })
            }

            if (payload.name) {
                const cResp = await Category.query()
                    .where('id', '!=', id)
                    .where('name', payload.name)
                    .first()
                if (cResp) {
                    return response.badRequest({
                        code: 'NAME_EXISTS',
                        message: 'El nombre ya esta en uso'
                    })
                }
            }

            await category.merge({
                name: payload.name ?? undefined,
                description: payload.description ?? undefined,
                parentCategoryId: payload.parentCategoryId ?? undefined,
                mediaId: payload.mediaId ?? undefined
            }).save()

            category = await Category.query()
                .where('id', id)
                .preload('parentCategory')
                .preload('media')
                .first() as Category
            return response.send({ category: category })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
    async show({ request, response }) {
        try {
            const { slug } = request.all()

            let promise = Category.query()

            if (slug) promise = promise.where('slug', slug)

            const categories = await promise
                .preload('parentCategory')
                .preload('media')
            return response.send({
                categories: categories
            })
        } catch (error) {
            console.log(error)
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
    async index({ request, response }) {
        try {
            const { id } = request.params()
            const category = await Category.query()
                .where('id', id)
                .preload('parentCategory')
                .preload('media')
                .first()
            if (!category) {
                return response.badRequest({
                    code: 'CATEGORY_NOT_FOUND',
                    message: 'La categoría no existe'
                })
            }
            return response.send({
                category: category
            })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
}