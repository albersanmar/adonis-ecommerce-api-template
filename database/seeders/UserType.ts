import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import UserType from "App/Models/UserType";

import { DateTime } from 'luxon'

export default class UserTypeSeeder extends BaseSeeder {
  public async run () {
    await UserType.createMany([
      {
        id: 'dff0dd30-b794-11ec-abe0-236257eb5adb',
        name: 'Administrador',
        createdAt: DateTime.utc(),
        updatedAt: DateTime.utc(),
      },
      {
        id: '01f92010-c7d8-11ec-a218-f9aad418431a',
        name: 'Cliente',
        createdAt: DateTime.utc(),
        updatedAt: DateTime.utc(),
      }
    ])
  }
}
