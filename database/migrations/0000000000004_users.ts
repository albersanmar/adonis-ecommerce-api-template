import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('email', 256).unique()
      table.string('password', 128).nullable()
      table.string('phone', 16).unique()
      table.string('remember_me_token').nullable()
      table.string('confirm_token').nullable()
      table.string('recover_token').nullable()
      table.boolean('confirm').defaultTo(false)
      table.boolean('blocked').defaultTo(false)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
