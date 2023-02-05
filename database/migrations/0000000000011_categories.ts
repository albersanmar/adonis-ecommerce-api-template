import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductCategoriesSchema extends BaseSchema {
    protected tableName = 'categories'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary()
            table.string('name').unique()
            table.string('slug').unique()
            table.string('description').nullable()

            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).notNullable()

            table.uuid('parent_category_id').references('id').inTable('categories').onDelete('SET NULL')
            table.uuid('media_id').references('id').inTable('media').onDelete('SET NULL')
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
