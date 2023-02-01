import { column, BaseModel, SnakeCaseNamingStrategy, beforeCreate, manyToMany, ManyToMany, beforeSave } from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import { string } from '@ioc:Adonis/Core/Helpers'

import { v1 as uuidv1 } from "uuid";

import Permission from 'App/Models/Permission'

export default class Role extends BaseModel {
    public static namingStrategy = new SnakeCaseNamingStrategy()
    public static primaryKey = 'id'
    public static table = 'roles'
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
    public static async assignId(role: Role) {
        if (!role.id) {
            role.id = uuidv1()
        }
    }

    @beforeSave()
    public static async saveSlug(role: Role) {
        role.slug = string.dashCase(role.name)
    }

    @manyToMany(() => Permission, {
        pivotTable: 'role_permissions'
    })
    public permissions: ManyToMany<typeof Permission>
}