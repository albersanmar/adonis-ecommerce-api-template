import { ErrorReporter } from 'App/Reporters/ErrorReporter';
import CustomMessages from 'App/Utils/CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User';
import Product from 'App/Models/Product';
import CategoryProduct from 'App/Models/CategoryProduct';
import MediaProduct from 'App/Models/MediaProduct';

export default class ProductController {
    async show({ response }) {
        const products = await Product.query()
            .preload('user')
            .preload('commerce')
            .preload('categories')
            .preload('gallery')
            .first() as Product
        return response.send({
            products: products
        })
    }
    async index({ request, response }) {
        const { id } = request.params()
        const product = await Product.query()
            .where('id', id)
            .preload('user')
            .preload('commerce')
            .preload('categories')
            .preload('gallery')
            .first() as Product
        if (!product) {
            return response.badRequest({
                code: 'PRODUCT_NOT_FOUND',
                message: 'El producto no existe'
            })
        }
        return response.send({
            product: product
        })
    }
    async store({ auth, request, response }) {
        const customSchema = schema.create({
            name: schema.string({ trim: true }, []),
            description: schema.string({ trim: true }, []),
            price: schema.number(),
            categories: schema.array.optional().members(schema.string({ trim: true }, [
                rules.exists({ table: 'categories', column: 'id' })
            ])),
            gallery: schema.array.optional().members(schema.string({ trim: true }, [
                rules.exists({ table: 'media', column: 'id' })
            ])),
        })

        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            let user: User = await auth.use('api').user
            user = await User.find(user.id) as User

            const hasRoleAdmin = await user.hasRole('administrador', 'root')
            const hasRoleClient = await user.hasRole('cliente')

            if (hasRoleAdmin)
                payload.belongsAdmin = true

            if (hasRoleClient) {
                payload.userId = user.id
                payload.commerceId = user.commerceId
            }

            const {
                gallery = [],
                categories = [],
                ...data } = payload
            let product = await Product.create(data)

            if (categories.length > 0) {
                const categoryProducts: any[] = []
                categories.forEach((c) => {
                    categoryProducts.push({
                        productId: product.id,
                        categoryId: c
                    })
                })
                await CategoryProduct.createMany(categoryProducts)
            }
            if (gallery.length > 0) {
                const mediaProducts: any[] = []
                gallery.forEach((g) => {
                    mediaProducts.push({
                        productId: product.id,
                        mediaId: g
                    })
                })
                await MediaProduct.createMany(mediaProducts)
            }

            product = await Product.query()
                .where('id', product.id)
                .preload('user')
                .preload('commerce')
                .preload('categories')
                .preload('gallery')
                .first() as Product

            return response.send({ product: product })
        } catch (error) {
            console.log(error)
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
            price: schema.number.optional(),
            categories: schema.array.optional().members(schema.string({ trim: true }, [
                rules.exists({ table: 'categories', column: 'id' })
            ])),
            gallery: schema.array.optional().members(schema.string({ trim: true }, [
                rules.exists({ table: 'media', column: 'id' })
            ])),
        })

        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            const { id } = request.params()

            let product = await Product.find(id)
            if (!product) {
                return response.badRequest({
                    code: 'PRODUCT_NOT_FOUND',
                    message: 'El producto no existe'
                })
            }

            let user: User = await auth.use('api').user
            user = await User.find(user.id) as User

            const hasRoleClient = await user.hasRole('cliente')

            if (hasRoleClient && product!.userId !== user.id) {
            }

            const {
                gallery = [],
                categories = [],
                ...data } = payload
            await product!.merge({
                ...data
            }).save()

            if (categories.length > 0) {
                product.related('categories').detach()
                const categoryProducts: any[] = []
                categories.forEach((c) => {
                    categoryProducts.push({
                        productId: product!.id,
                        categoryId: c
                    })
                })
                await CategoryProduct.createMany(categoryProducts)
            }
            if (gallery.length > 0) {
                product.related('gallery').detach()
                const mediaProducts: any[] = []
                gallery.forEach((g) => {
                    mediaProducts.push({
                        productId: product!.id,
                        mediaId: g
                    })
                })
                await MediaProduct.createMany(mediaProducts)
            }

            product = await Product.query()
                .where('id', product.id)
                .preload('user')
                .preload('commerce')
                .preload('categories')
                .preload('gallery')
                .first() as Product

            return response.send({ product: product })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
}