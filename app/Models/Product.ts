import { DateTime } from 'luxon'
import { string } from '@ioc:Adonis/Core/Helpers';

import {
    column,
    beforeSave,
    BaseModel,
    beforeCreate,
    belongsTo,
    BelongsTo,
    manyToMany,
    ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import { v1 as uuidv1 } from "uuid";
import User from 'App/Models/User';
import Media from 'App/Models/Media';
import Category from 'App/Models/Category';
import Commerce from 'App/Models/Commerce';

export default class Product extends BaseModel {
    @column({ isPrimary: true })
    public id: string

    @column()
    public name: string

    @column()
    public slug: string

    @column()
    public description: string

    @column()
    public price: number

    @column({ serialize: Boolean })
    public active: boolean

    @column({ serialize: Boolean, serializeAs: null })
    public belongsAdmin: boolean

    @column({ serializeAs: null })
    public userId: string

    @column({ serializeAs: null })
    public commerceId: string

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
    public static async assignId(product: Product) {
        if (!product.id) {
            product.id = uuidv1()
        }
    }

    @beforeSave()
    public static async saveSlug(product: Product) {
        if (product.$dirty.name) {
            product.slug = string.dashCase(product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) + '-' + DateTime.now().toMillis()
        }
    }

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>

    @belongsTo(() => Commerce)
    public commerce: BelongsTo<typeof Commerce>

    @manyToMany(() => Media, {
        pivotTable: 'media_products'
    })
    public gallery: ManyToMany<typeof Media>

    @manyToMany(() => Category, {
        pivotTable: 'category_products'
    })
    public categories: ManyToMany<typeof Category>

    @manyToMany(() => User, {
        pivotTable: 'user_favorite_products'
    })
    public favoriteUsersAttached: ManyToMany<typeof User>
}
