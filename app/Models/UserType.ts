import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'

export default class UserType extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => User)
  public users: HasMany<typeof User>
}
