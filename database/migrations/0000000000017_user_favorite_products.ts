import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserFavoriteProductsSchema extends BaseSchema {
    protected tableName = 'user_favorite_products'
    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary()

            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).notNullable()

            table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
            table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE')
        })
    }
    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
