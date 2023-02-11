import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CartsSchema extends BaseSchema {
    protected tableName = 'carts'
    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary()
            table.double('total').defaultTo(0)

            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).notNullable()

            table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
        })
    }
    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
