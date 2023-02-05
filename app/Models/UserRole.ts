import {
    column,
    BaseModel,
    belongsTo,
    BelongsTo,
    SnakeCaseNamingStrategy,
    beforeCreate
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import User from 'App/Models/User'
import Role from 'App/Models/Role'

import { v1 as uuidv1 } from "uuid";

export default class UserRole extends BaseModel {
    public static namingStrategy = new SnakeCaseNamingStrategy()
    public static primaryKey = 'id'
    public static table = 'user_roles'
    public static selfAssignPrimaryKey = false
    @column({
        isPrimary: true,
    })
    public id: string

    @column({ serializeAs: 'userId' })
    public userId: string

    @column({ serializeAs: 'roleId' })
    public roleId: string

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
    public static async assignId(userRole: UserRole) {
        if (!userRole.id) {
            userRole.id = uuidv1()
        }
    }

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>

    @belongsTo(() => Role)
    public role: BelongsTo<typeof Role>
}
