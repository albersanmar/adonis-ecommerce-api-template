import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import UserRole from 'App/Models/UserRole';

import { DateTime } from 'luxon'

export default class UserSeeder extends BaseSeeder {
    public async run() {
        await UserRole.createMany([
            {
                // Cliente
                id: '591b4f9a-d6d8-4e0d-ba08-1d85ef44ae53',
                userId: 'd6934380-9aca-11ed-9a73-ad2ecd89790f',
                roleId: '276d9720-a0e2-11ed-b16b-f79849cd9fd9',
                createdAt: DateTime.utc(),
                updatedAt: DateTime.utc(),
            },
            {
                // Root
                id: 'c93d4de7-86b8-41f5-96b0-e594e33bc432',
                userId: '36866b40-a0e4-11ed-be80-87a6daf5deaa',
                roleId: '1f34f210-a0e2-11ed-b16b-f79849cd9fd9',
                createdAt: DateTime.utc(),
                updatedAt: DateTime.utc(),
            },
        ])
    }
}
