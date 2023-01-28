import { column, BaseModel, belongsTo, BelongsTo, SnakeCaseNamingStrategy, beforeCreate } from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import { string } from '@ioc:Adonis/Core/Helpers'

import moment from 'moment'

import { v1 as uuidv1 } from "uuid";

import Role from 'App/Models/Role'

export default class Permission extends BaseModel {
    public static namingStrategy = new SnakeCaseNamingStrategy()
    public static primaryKey = 'id'
    public static table = 'permissions'
    public static selfAssignPrimaryKey = false

    @column({
        isPrimary: true,
    })
    public id: string

    @column()
    public slug: string

    @column()
    public name: string

    @column()
    public description: string

    @column.dateTime({
        autoCreate: true,
        serializeAs: 'createdAt',
        serialize: (value: DateTime | null) => {
            return value ? value.setZone('utc').toISO() : value
        },
    })
    public createdAt: DateTime

    @column.dateTime({
        autoCreate: true,
        autoUpdate: true,
        serializeAs: 'updatedAt',
        serialize: (value: DateTime | null) => {
            return value ? value.setZone('utc').toISO() : value
        },
    })
    public updatedAt: DateTime

    @beforeCreate()
    public static async assignId(permission: Permission) {
        permission.id = uuidv1()
        permission.slug = string.dashCase(permission.name)
    }

    @belongsTo(() => Role)
    public role: BelongsTo<typeof Role>
}