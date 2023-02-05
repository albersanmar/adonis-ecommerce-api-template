import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
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

import Database from '@ioc:Adonis/Lucid/Database'
import Role from 'App/Models/Role';
import Profile from 'App/Models/Profile';

import { v1 as uuidv1 } from "uuid";

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

  @column({ serializeAs: null })
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

  async hasRole(...roles: string[]) {
    const resp = await Database.query()
      .from('users')
      .join('user_roles', 'user_roles.user_id', '=', 'users.id')
      .join('roles', 'roles.id', '=', 'user_roles.role_id')
      .where('users.id', this.id)
      .whereIn('roles.slug', roles)
      .count('*', 'count')
    const roleCount = resp[0].count
    return roleCount > 0
  }
}
