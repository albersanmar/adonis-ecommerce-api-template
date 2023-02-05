import {
    column,
    BaseModel,
    beforeCreate,
    beforeSave,
    belongsTo,
    BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import { string } from '@ioc:Adonis/Core/Helpers';

import Media from 'App/Models/Media';

import { v1 as uuidv1 } from "uuid";


export default class Category extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: string

    @column()
    public name: string

    @column()
    public slug: string

    @column()
    public description: string

    @column({ serializeAs: null })
    public parentCategoryId: string

    @column({ serializeAs: null })
    public mediaId: string

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
    public static async assignId(category: Category) {
        if (!category.id) {
            category.id = uuidv1()
        }
    }

    @beforeSave()
    public static async saveSlug(category: Category) {
        if (category.$dirty.name) {
            console.log(category.$dirty.name, category.name)
            category.slug = string.dashCase(category.name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))// + '-' + DateTime.now().toMillis()
        }
    }

    @belongsTo(() => Category, {
        foreignKey: 'parentCategoryId'
    })
    public parentCategory: BelongsTo<typeof Category>

    @belongsTo(() => Media)
    public media: BelongsTo<typeof Media>
}