import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProfilesSchema extends BaseSchema {
    protected tableName = 'profiles'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary()
            table.string('name').notNullable()
            table.string('last_name').notNullable()
            table.string('full_name').notNullable()

            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).notNullable()

            table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
