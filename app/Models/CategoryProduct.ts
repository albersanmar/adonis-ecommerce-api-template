import {
    column,
    BaseModel,
    belongsTo,
    BelongsTo,
    beforeCreate
} from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import { v1 as uuidv1 } from "uuid";

import Media from 'App/Models/Media';
import Product from 'App/Models/Product';

export default class CategoryProduct extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: string

    @column({ serializeAs: 'categoryId' })
    public categoryId: string

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
    public static async assignId(categoryProduct: CategoryProduct) {
        if (!categoryProduct.id) {
            categoryProduct.id = uuidv1()
        }
    }

    @belongsTo(() => Media)
    public media: BelongsTo<typeof Media>

    @belongsTo(() => Product)
    public product: BelongsTo<typeof Product>
}