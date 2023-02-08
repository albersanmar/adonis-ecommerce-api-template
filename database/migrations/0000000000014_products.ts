import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductsSchema extends BaseSchema {
    protected tableName = 'products'
    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary()
            table.string('name', 516).notNullable()
            table.string('slug', 516).unique()
            table.string('description').notNullable()
            table.boolean('active').defaultTo(true)
            table.boolean('belongs_admin').defaultTo(false)
            table.double('price').notNullable()

            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).notNullable()

            table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
            table.uuid('commerce_id').references('id').inTable('commerces').onDelete('CASCADE')
        })
    }
    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
