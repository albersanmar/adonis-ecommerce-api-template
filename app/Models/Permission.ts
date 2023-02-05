import {
    column,
    BaseModel,
    hasMany,
    HasMany,
    SnakeCaseNamingStrategy,
    beforeCreate,
    beforeSave
} from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import { string } from '@ioc:Adonis/Core/Helpers'

import { v1 as uuidv1 } from "uuid";

import Role from 'App/Models/Role';

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
    public static async assignId(permission: Permission) {
        if (!permission.id) {
            permission.id = uuidv1()
        }
    }

    @beforeSave()
    public static async saveSlug(permission: Permission) {
        permission.slug = string.dashCase(permission.name)

    }

    @hasMany(() => Role)
    public roles: HasMany<typeof Role>
}