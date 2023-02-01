import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from "App/Models/User";

import { DateTime } from 'luxon'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        id: '36866b40-a0e4-11ed-be80-87a6daf5deaa',
        email: 'admin@vortexdevops.com',
        password: 'AdminAdmin',
        phone: '1234567890',
        confirm: true,
        createdAt: DateTime.utc(),
        updatedAt: DateTime.utc(),
      },
      {
        id: 'd6934380-9aca-11ed-9a73-ad2ecd89790f',
        email: 'albersanmar4@gmail.com',
        password: 'password',
        phone: '2222062058',
        confirm: true,
        createdAt: DateTime.utc(),
        updatedAt: DateTime.utc(),
      },
    ])
  }
}
