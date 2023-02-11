import {
    column,
    BaseModel,
    beforeCreate,
    belongsTo,
    BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'

import { v1 as uuidv1 } from "uuid";

import Product from 'App/Models/Product'
import Cart from 'App/Models/Cart'

export default class CartItem extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: string

    @column()
    public quantity: number

    @column({ serializeAs: null })
    public cartId: string

    @column({ serializeAs: null })
    public productId: string

    @column.dateTime({
        autoCreate: true,
        serializeAs: 'createdAt',
        serialize: (value: DateTime) => {
            return value.setZone('utc').toISO()
        },
    })
    public createdAt: DateTime

    @column.dateTime({
        autoCreate: true,
        autoUpdate: true,
        serializeAs: 'updatedAt',
        serialize: (value: DateTime) => {
            return value.setZone('utc').toISO()
        },
    })
    public updatedAt: DateTime

    @beforeCreate()
    public static async assignId(cartItem: CartItem) {
        if (!cartItem.id) {
            cartItem.id = uuidv1()
        }
    }

    @belongsTo(() => Product)
    public product: BelongsTo<typeof Product>

    @belongsTo(() => Cart)
    public cart: BelongsTo<typeof Cart>
}