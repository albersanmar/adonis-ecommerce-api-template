import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Profile from "App/Models/Profile";
import User from 'App/Models/User';

import { DateTime } from 'luxon'

export default class UserSeeder extends BaseSeeder {
    public async run() {
        await Profile.createMany([
            {
                // Cliente
                id: 'f7eaa8c3-e03d-4904-a987-2e4717bea4e0',
                name: 'Alberto',
                lastName: 'Sánchez Martínez',
                fullName: 'Alberto Sánchez Martínez',
                userId: 'd6934380-9aca-11ed-9a73-ad2ecd89790f',
                createdAt: DateTime.utc(),
                updatedAt: DateTime.utc(),
            },
            {
                // Root
                id: '94f8a3e4-558c-41f0-ad8d-2bd8ebde43c2',
                name: 'Vortex',
                lastName: 'Dev Ops',
                fullName: 'Vortex Dev Ops',
                userId: '36866b40-a0e4-11ed-be80-87a6daf5deaa',
                createdAt: DateTime.utc(),
                updatedAt: DateTime.utc(),
            },
        ])

        const ids = [
            {
                profileId: 'f7eaa8c3-e03d-4904-a987-2e4717bea4e0',
                userId: 'd6934380-9aca-11ed-9a73-ad2ecd89790f',
            },
            {
                profileId: '94f8a3e4-558c-41f0-ad8d-2bd8ebde43c2',
                userId: '36866b40-a0e4-11ed-be80-87a6daf5deaa',
            },
        ]
        for (let id of ids) {
            const user = await User.find(id.userId)
            await user!.merge({ profileId: id.profileId }).save()
        }
    }
}
