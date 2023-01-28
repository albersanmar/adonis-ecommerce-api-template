import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Config from '@ioc:Adonis/Core/Config'

export default class Roles extends BaseSchema {
    protected tableName = Config.get('rolePermission.role_table', 'roles')
    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary()
            table.string('name', 191).unique()
            table.string('slug', 191).nullable().unique()
            table.string('description', 191).nullable()

            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).notNullable()
        })
    }
    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
