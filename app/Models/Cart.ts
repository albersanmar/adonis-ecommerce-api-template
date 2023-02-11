import {
    column,
    BaseModel,
    beforeCreate,
    hasOne,
    HasOne,
    hasMany,
    HasMany,
} from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'

import { v1 as uuidv1 } from "uuid";

import CartItem from 'App/Models/CartItem'
import User from 'App/Models/User';

export default class Cart extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: string

    @column()
    public total: number

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

    @beforeCreate()
    public static async assignId(cart: Cart) {
        if (!cart.id) {
            cart.id = uuidv1()
        }
    }

    @hasOne(() => User) 
    public user: HasOne<typeof User>

    @hasMany(() => CartItem)
    public items: HasMany<typeof CartItem>
}