import { ErrorReporter } from 'App/Reporters/ErrorReporter';
import CustomMessages from 'App/Utils/CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import UserFavoriteProduct from 'App/Models/UserFavoriteProduct';

export default class UserFavoriteProductsController {
    async show({ auth, response }) {
        const user = await auth.use('api').user!
        const userFavoritesProducts = await UserFavoriteProduct.query()
            .where('userId', user.id)
            .preload('product', (query) => {
                query.preload('categories')
                query.preload('gallery')
                query.preload('user')
            })
        const favorites = userFavoritesProducts.map((ufp) => ufp.product)
        return response.send({
            favorites: favorites
        })
    }
    async store({ auth, request, response }) {
        const customSchema = schema.create({
            productId: schema.string({ trim: true }, [
                rules.exists({ table: 'products', column: 'id' }),
            ]),
        })

        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            const user = await auth.use('api').user
            const userFavoriteProduct = await UserFavoriteProduct.query()
                .where('userId', user.id)
                .where('productId', payload.productId)
                .first()
            if (userFavoriteProduct) {
                return response.badRequest({
                    code: 'FAVORITE_EXISTS',
                    message: 'Este producto ya esta en favoritos'
                })
            }

            await UserFavoriteProduct.create({
                productId: payload.productId,
                userId: user!.id
            })

            return response.send({ 
                code: 'USER_FAVORITE_PRODUCT_CREATED',
                message: 'Producto agregado a favoritos'
             })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }

    async delete({ auth, request, response }) {
        const customSchema = schema.create({
            productId: schema.string({ trim: true }, [
                rules.exists({ table: 'products', column: 'id' }),
            ]),
        })
        try {
            const payload = await request.validate({
                schema: customSchema,
                messages: CustomMessages,
                reporter: ErrorReporter
            })

            const user = await auth.use('api').user
            let userFavoriteProduct = await UserFavoriteProduct.query()
                .where('userId', user.id)
                .where('productId', payload.productId)
                .first()
            if (!userFavoriteProduct) {
                return response.badRequest({
                    code: 'FAVORITE_NOT_FOUND',
                    message: 'Este producto no esta en tus favoritos'
                })
            }

            userFavoriteProduct = await UserFavoriteProduct.find(userFavoriteProduct.id)
            await userFavoriteProduct!.delete()

            return response.send({ 
                code: 'FAVORITE_PRODUCT_DETACH',
                message: 'Producto eliminado de tus favoritos'
             })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
}