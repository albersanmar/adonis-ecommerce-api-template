import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  belongsTo,
  BelongsTo,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm'

import UserType from 'App/Models/UserType'

import { v1 as uuidv1 } from "uuid";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column({ serializeAs: 'lastName' })
  public lastName: string

  @column({ serializeAs: 'fullName' })
  public fullName: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public phone: string

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @column({ serializeAs: null })
  public confirmToken?: string

  @column({ serializeAs: null })
  public recoverToken?: string

  @column({ serializeAs: null })
  public confirm?: boolean

  @column({ serializeAs: null })
  public blocked?: boolean

  @column({ serializeAs: 'userTypeId' })
  public userTypeId?: string

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

  @belongsTo(() => UserType)
  public userType: BelongsTo<typeof UserType>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeSave()
  public static async fullName(user: User) {
    user.fullName = `${user.name} ${user.lastName}`
  }

  @beforeCreate()
  public static async assignId(user: User) {
    user.id = uuidv1()
  }
}
