import {
    column,
    BaseModel,
    belongsTo,
    BelongsTo,
    beforeCreate
} from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import { v1 as uuidv1 } from "uuid";

import User from 'App/Models/User';
import Product from 'App/Models/Product';

export default class UserFavoriteProduct extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: string

    @column({ serializeAs: 'userId' })
    public userId: string

    @column({ serializeAs: 'productId' })
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
    public static async assignId(userFavoriteProduct: UserFavoriteProduct) {
        if (!userFavoriteProduct.id) {
            userFavoriteProduct.id = uuidv1()
        }
    }

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>

    @belongsTo(() => Product)
    public product: BelongsTo<typeof Product>
}