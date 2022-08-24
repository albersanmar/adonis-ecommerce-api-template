import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'

import UserType from 'App/Models/UserType'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public confirmToken?: string

  @column()
  public recoverToken?: string

  @column()
  public confirm?: boolean

  @column()
  public blocked?: boolean

  @column({ serializeAs: 'userTypeId' })
  public userTypeId?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => UserType)
  public userType: BelongsTo<typeof UserType>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
