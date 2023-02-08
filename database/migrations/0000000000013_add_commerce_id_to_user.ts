import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
    protected tableName = 'users'
    public async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.uuid('commerce_id').references('id').inTable('commerces').onDelete('CASCADE')
        })
    }
    public async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('commerce_id')
        })
    }
}
