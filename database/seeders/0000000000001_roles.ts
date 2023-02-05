import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Role from "App/Models/Role";

import { DateTime } from 'luxon'

export default class UserTypeSeeder extends BaseSeeder {
  public async run () {
    await Role.createMany([
      {
        id: '19e7fb40-a0e2-11ed-b16b-f79849cd9fd9',
        name: 'Root',
        slug: 'root',
        createdAt: DateTime.utc(),
        updatedAt: DateTime.utc(),
      },
      {
        id: '1f34f210-a0e2-11ed-b16b-f79849cd9fd9',
        name: 'Administrador',
        slug: 'administrador',
        createdAt: DateTime.utc(),
        updatedAt: DateTime.utc(),
      },
      {
        id: '276d9720-a0e2-11ed-b16b-f79849cd9fd9',
        name: 'Cliente',
        slug: 'cliente',
        createdAt: DateTime.utc(),
        updatedAt: DateTime.utc(),
      }
    ])
  }
}
