import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CartItemssSchema extends BaseSchema {
    protected tableName = 'cart_items'
    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary()
            table.integer('quantiy').defaultTo(0)

            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).notNullable()

            table.uuid('cart_id').references('id').inTable('carts').onDelete('CASCADE')
            table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE')
        })
    }
    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
