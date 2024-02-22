exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary() // incrementa o id para o primeiro da lista
        table.string('name').notNull()  // adiciona nome e não pode ser deixado em branco
        table.string('email').notNull().unique() // adiciona email e não pode ser deixado em branco
        table.string('password').notNull()  // adiciona senha e não pode ser deixado em branco
        table.boolean('admin').notNull().defaultTo(false)   // seta admin t or f nao deixa em branco e torna falso como padrão
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users')
};
