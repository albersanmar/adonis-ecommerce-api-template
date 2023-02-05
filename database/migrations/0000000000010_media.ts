import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MediaSchema extends BaseSchema {
    protected tableName = 'media'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary()
            table.string('base_path').defaultTo('')
            table.string('file_name').unique()
            table.string('full_path').notNullable()
            table.string('mime_type').notNullable()

            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).notNullable()

            table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
