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
import User from 'App/Models/User';

import { v1 as uuidv1 } from "uuid";


export default class Commerce extends BaseModel {
    public static table = 'commerces'

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

    @column({ serialize: Boolean, serializeAs: null })
    public belongsAdmin: boolean

    @column({ serializeAs: null })
    public mediaId: string

    @column({ serializeAs: null })
    public userId: string

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
    public static async assignId(commerce: Commerce) {
        if (!commerce.id) {
            commerce.id = uuidv1()
        }
    }

    @beforeSave()
    public static async saveSlug(commerce: Commerce) {
        if (commerce.$dirty.name) {
            commerce.slug = string.dashCase(commerce.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) + '-' + DateTime.now().toMillis()
        }
    }

    @belongsTo(() => Media)
    public media: BelongsTo<typeof Media>

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>
}