
exports.up = function(knex, Promise) {
    return knex.schema.createTable('articles', table => {
        table.increments('id').primary()    // primeiro incremento
        table.string('name').notNull()
        table.string('description', 1000).notNull() // descrição
        table.string('imageUrl', 1000)  //url da imagem
        table.binary('content').notNull()   // campo binario, clob dentro do campo binario
        table.integer('userId').references('id')    // userId referencia na tabela users
            .inTable('users').notNull()
        table.integer('categoryId').references('id')    // categoryId referencia id da tabela categories
            .inTable('categories').notNull()    // tabela categories
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('articles')
};
