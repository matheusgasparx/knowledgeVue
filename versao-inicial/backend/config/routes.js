const admin = require('./admin')

module.exports = app => {
    app.post('/signup', app.api.user.save) // para se registrar
    app.post('/signin', app.api.auth.signin) // para logar
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .all(app.config.passport.authenticate()) // autentificação
        .post(admin(app.api.user.save)) // inserir o usuario
        .get(admin(app.api.user.get)) // pega o usuario

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save)) // nesse caso altera o usuario
        .get(admin(app.api.user.getById)) // mostra o usuario pelo id
        .delete(admin(app.api.user.remove)) // remove o user

    app.route('/categories')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.category.get)) // pega o category
        .post(admin(app.api.category.save)) // inseri a categoria

    // Cuidado com ordem! Tem que vir antes de /categories/:id
    app.route('/categories/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getTree)

    app.route('/categories/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getById) // mostra pelo id
        .put(admin(app.api.category.save)) // altera a categoria
        .delete(admin(app.api.category.remove)) // remove a categoria

    app.route('/articles')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.article.get))
        .post(admin(app.api.article.save))

    app.route('/articles/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getById)
        .put(admin(app.api.article.save))
        .delete(admin(app.api.category.remove)) // remove a article pelo admin

    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getByCategory)
    
    app.route('/stats')
        .all(app.config.passport.authenticate())
        .get(app.api.stat.get)
}