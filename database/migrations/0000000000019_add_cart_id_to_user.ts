import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
    protected tableName = 'users'
    public async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.uuid('cart_id').references('id').inTable('carts').onDelete('CASCADE')
        })
    }
    public async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('cart_id')
        })
    }
}
