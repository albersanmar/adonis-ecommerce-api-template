import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.string('last_name').notNullable()
      table.string('full_name').notNullable()
      table.string('email', 255).unique()
      table.string('password', 180).nullable()
      table.string('phone').unique()
      table.string('remember_me_token').nullable()
      table.string('confirm_token').nullable()
      table.string('recover_token').nullable()
      table.boolean('confirm').nullable()
      table.boolean('blocked').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
