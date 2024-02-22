const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation //importando

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10) // gera uma hash temporaria 
        return bcrypt.hashSync(password, salt) // senha criptografada
    }

    const save = async (req, res) => { // salva o usuario e salva criação de artigos/categorias
        const user = { ...req.body } // bodyparser json
        if(req.params.id) user.id = req.params.id // se tiver setado, coloca no user os params da requisição

        if(!req.originalUrl.startsWith('/users')) user.admin = false // se não tiver /users = não sera admin
        if(!req.user || !req.user.admin) user.admin = false // nao é admin ou nao tem user = nao sera admin

        try {
            existsOrError(user.name, 'Nome não informado') // se não  existir informe a msg
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword, // compara as senhas equals
                'Senhas não conferem')

            const userFromDB = await app.db('users') // acessando tabela && asyn await para buscar um user no banco de dados atraves do knex
                .where({ email: user.email }).first()
            if(!user.id) { //   SE NÃO TEM user.id
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch(msg) { // da um catch
            return res.status(400).send(msg) // erro do lado do cliente
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword // deleta a confirmação da senha no db

        if(user.id) { // se tiver id
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send()) // se deu tudo certo não retorna nenhum dado
                .catch(err => res.status(500).send(err)) // caso de erro, caia no catch erro do servidor
        } else {
            app.db('users') // se não tiver setado então inserir o user no bd
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .then(users => res.json(users)) // retorna no json
            .catch(err => res.status(500).send(err)) // caso nao de certo gere msg
    }

    const getById = (req, res) => {
        app.db('users') // mostra o user por id
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id }) // recebe o id
            .whereNull('deletedAt')
            .first() // apenas 1 usuario
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const articles = await app.db('articles')
                .where({ userId: req.params.id }) // peguei o id do usuario que veio nos paramentos da req
            notExistsOrError(articles, 'Usuário possui artigos.') // se nao existe 

            const rowsUpdated = await app.db('users')
                .update({deletedAt: new Date()}) // se achou ele atualiza o deletedAt
                .where({ id: req.params.id }) // se nao achou retorna msg
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}