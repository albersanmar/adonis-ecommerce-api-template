import { ErrorReporter } from 'App/Reporters/ErrorReporter';
import CustomMessages from 'App/Utils/CustomMessages';
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Cart from 'App/Models/Cart';
import User from 'App/Models/User';
import CartItem from 'App/Models/CartItem';

export default class UserFavoriteProductsController {
    async show({ auth, response }) {
        const user = await auth.use('api').user!
        const cartItems = await CartItem.query()
            .where('cartId', user.cartId)
            .preload('product')

        const total = cartItems.reduce((value, ci) => (value + ci.product.price * ci.quantity), 0)

        let cart = await Cart.find(user.cartId) as Cart
        await cart.merge({
            total: total
        }).save()

        cart = await Cart.query()
            .where('id', user.cartId)
            .preload('items', (queryCartItem) => {
                queryCartItem.preload('product', (queryProduct) => {
                    queryProduct
                        .preload('categories')
                        .preload('commerce')
                        .preload('gallery')
                        .preload('user')
                })
            })
            .first() as Cart

        return response.send({
            cart: cart
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

            let cart: Cart
            let user: User = await auth.use('api').user
            user = await User.find(user.id) as User
            if (!user.cartId) {
                cart = await Cart.create({
                    userId: user.id,
                })
                await user.merge({
                    cartId: cart.id
                }).save()
            }

            await CartItem.create({
                productId: payload.productId,
                cartId: user.cartId
            })

            const cartItems = await CartItem.query()
                .where('cartId', user.cartId)
                .preload('product')

            const total = cartItems.reduce((value, ci) => (value + ci.product.price * ci.quantity), 0)

            cart = await Cart.find(user.cartId) as Cart
            await cart.merge({
                total: total
            }).save()

            return response.send({
                code: 'PRODUCT_ADDED',
                message: 'Producto agregado aal carrito'
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

            let cart: Cart
            let user: User = await auth.use('api').user
            user = await User.find(user.id) as User
            if (!user.cartId) {
                cart = await Cart.create({
                    userId: user.id,
                })
                await user.merge({
                    cartId: cart.id
                }).save()
            }

            let cartItem = await CartItem.query()
                .where('cartId', user.cartId)
                .where('productId', payload.productId)
                .first()
            if (!cartItem) {
                return response.badRequest({
                    code: 'CART_ITEM_NOT_FOUND',
                    message: 'El producto no se encuentra en el carrito'
                })
            }

            cartItem = await CartItem.find(cartItem.id)
            await cartItem!.delete()

            const cartItems = await CartItem.query()
                .where('cartId', user.cartId)
                .preload('product')

            const total = cartItems.reduce((value, ci) => (value + ci.product.price * ci.quantity), 0)

            cart = await Cart.find(user.cartId) as Cart
            await cart.merge({
                total: total
            }).save()

            return response.send({
                code: 'PRODUCT_REMOVE_FROM_CART',
                message: 'Producto eliminado del carrito'
            })
        } catch (error) {
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.badRequest(error)
        }
    }
}