import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from "App/Models/User";

import { DateTime } from 'luxon'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        id: 'ecf11f80-c7c6-11ec-84b9-6b79972dbe46',
        name: 'Administrador',
        email: 'admin@vortexdevops.com',
        password: 'AdminAdmin',
        phone: '1231231212',
        confirm: true,
        createdAt: DateTime.utc(),
        updatedAt: DateTime.utc(),
        userTypeId: 'dff0dd30-b794-11ec-abe0-236257eb5adb',
      },
    ])
  }
}
