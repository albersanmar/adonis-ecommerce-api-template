import { DateTime } from 'luxon'

import {
    column,
    BaseModel,
    belongsTo,
    BelongsTo,
    SnakeCaseNamingStrategy,
    beforeCreate
} from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'
import Permission from 'App/Models/Permission'

import { v1 as uuidv1 } from "uuid";

export default class UserPermission extends BaseModel {
    public static namingStrategy = new SnakeCaseNamingStrategy()
    public static primaryKey = 'id'
    public static table = 'user_permissions'
    public static selfAssignPrimaryKey = false
    @column({
        isPrimary: true,
    })
    public id: string

    @column()
    public user_id: string

    @column()
    public permission_id: string

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
    public static async assignId(userPermission: UserPermission) {
        if (!userPermission.id) {
            userPermission.id = uuidv1()
        }
    }

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>

    @belongsTo(() => Permission)
    public permission: BelongsTo<typeof Permission>
}