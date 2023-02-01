import { column, BaseModel, belongsTo, BelongsTo, SnakeCaseNamingStrategy, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v1 as uuidv1 } from "uuid";

import Role from 'App/Models/Role'
import Permission from 'App/Models/Permission'

export default class RolePermission extends BaseModel {
    public static namingStrategy = new SnakeCaseNamingStrategy()
    public static primaryKey = 'id'
    public static table = 'role_permissions'
    public static selfAssignPrimaryKey = false

    @column({
        isPrimary: true,
    })
    public id: string

    @column({ serializeAs: 'roleId' })
    public roleId: string

    @column({ serializeAs: 'permissionId' })
    public permissionId: string

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
    public static async assignId(rolePermission: RolePermission) {
        if (!rolePermission.id) {
            rolePermission.id = uuidv1()
        }
    }

    @belongsTo(() => Role, {
        localKey: 'role_id',
    })
    public role: BelongsTo<typeof Role>

    @belongsTo(() => Permission, {
        localKey: 'permission_id',
    })
    public permission: BelongsTo<typeof Permission>
}