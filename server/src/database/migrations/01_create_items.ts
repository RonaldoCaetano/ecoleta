import Knex from 'knex'

export async function up(knex: Knex) {
	// CRIAR A TABELA
	return knex.schema.createTable('items', (table) => {
		table.increments('id').primary()
		table.string('image').notNullable()
		table.string('titulo').notNullable()
	})
}

export async function down(knex: Knex) {
	// DESFAZER AS ALTERAÇÕES QUE FORAM FEITAS NO UP
	return knex.schema.dropTable('items')
}
