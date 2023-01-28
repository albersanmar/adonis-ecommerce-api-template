import Role from "App/Models/Role"

export default class RoleController {
    async index() {
        const roles = await Role.query().preload('permissions')
        return { roles: roles }
    }

    async show({ params }) {
        const role = await Role.findOrFail(params.id)

        await role.with('permissions')

        return role
    }

    async store({ request }) {
        const { permissions, ...data } = request.only(['name', 'slug', 'description', 'permission'])

        const role = await Role.create(data)

        if (permissions) {
            await role.permissions().attach(permissions)
        }

        await role.load('permissions')

        return role
    }

    async update({ request, params }) {
        const { permissions, ...data } = request.only(['name', 'slug', 'description', 'permission'])

        const role = await Role.findOrFail(params.id)

        role.merge(data)

        await role.save()

        if (permissions) {
            await role.permissions().sync(permissions)
        }

        await role.load('permissions')

        return role
    }

    async destroy({ params }) {
        const role = await Role.findOrFail(params.id)

        await role.delete()
    }
}