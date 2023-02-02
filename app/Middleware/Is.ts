import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'

import User from 'App/Models/User'
 
export default class Is {
    public async handle(
        { auth, response }: HttpContextContract,
        next: () => Promise<void>,
        roleNames: string[]
    ) {
        const user = await auth.use("api").user
        if (!user) {
            return response.unauthorized({ error: 'Must be logged in' })
        }
        const hasRole = await this.checkHasRoles(user, roleNames)
        if (!hasRole) {
            return response.badRequest({
                code: "UNAUTHORIZED_ACCESS",
                message: "Usuario no autorizado",
            })
        }
        await next()
    }
    private async checkHasRoles(user: User, roleNames: Array<string>): Promise<boolean> {
        const resp = await Database.query()
            .from('users')
            .join('user_roles', 'user_roles.user_id', '=', 'users.id')
            .join('roles', 'roles.id', '=', 'user_roles.role_id')
            .where('users.id', user.id)
            .whereIn('roles.slug', roleNames)
            .count('*', 'count')

        const roleCount = resp[0].count
        return roleCount > 0
    }
}