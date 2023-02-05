import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
    protected tableName = 'users'

    public async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.uuid('profile_id').references('id').inTable('profiles').onDelete('CASCADE')
        })
    }

    public async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn('profile_id')
        })
    }
}
