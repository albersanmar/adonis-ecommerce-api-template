import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.uuid('user_type_id').references('id').inTable('user_types').onDelete('SET NULL')
    })
  }
}
