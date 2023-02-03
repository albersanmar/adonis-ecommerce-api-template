import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Config from '@ioc:Adonis/Core/Config'
export default class UserPermissions extends BaseSchema {
    protected tableName = Config.get('rolePermission.user_permissions', 'user_permissions')
    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary()
            table
                .uuid('user_id')
                .references('id')
                .inTable(Config.get('rolePermission.user_table', 'users'))
            table
                .uuid('permission_id')
                .references('id')
                .inTable(Config.get('rolePermission.permission_table', 'permissions'))
            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).notNullable()
        })
    }
    public async down() {
        this.schema.dropTable(this.tableName)
    }
}