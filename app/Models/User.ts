import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  beforeCreate,
  manyToMany,
  ManyToMany,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'

import { v1 as uuidv1 } from "uuid";
import Role from 'App/Models/Role';
import Profile from 'App/Models/Profile';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

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

  @column({ serializeAs: 'profileId' })
  public profileId: string

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
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static async assignId(user: User) {
    if (!user.id) {
      user.id = uuidv1()
    }
  }

  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  @manyToMany(() => Role, {
    pivotTable: 'user_roles'
  })
  public roles: ManyToMany<typeof Role>
}
