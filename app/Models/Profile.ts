import { DateTime } from 'luxon'

import {
    column,
    beforeSave,
    BaseModel,
    beforeCreate,
    hasOne,
    HasOne,
} from '@ioc:Adonis/Lucid/Orm'

import { v1 as uuidv1 } from "uuid";
import User from 'App/Models/User';

export default class Profile extends BaseModel {
    @column({ isPrimary: true })
    public id: string

    @column()
    public name: string

    @column({ serializeAs: 'lastName' })
    public lastName: string

    @column({ serializeAs: 'fullName' })
    public fullName: string

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

    @beforeSave()
    public static async fullName(profile: Profile) {
        if (profile.name && profile.lastName) {
            profile.name = profile.name.trim().replace(/\s\s+/g, " ")
            profile.lastName = profile.lastName.trim().replace(/\s\s+/g, " ")
            profile.fullName = `${profile.name} ${profile.lastName}`
        }
    }

    @beforeCreate()
    public static async assignId(profile: Profile) {
        if (!profile.id) {
            profile.id = uuidv1()
        }
    }

    @hasOne(() => User)
    public user: HasOne<typeof User>
}
