module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation // vem de app.api

    const save = (req, res) => {
        const category = {
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
        }
        
        if(req.params.id) category.id = req.params.id // se vier o id no params

        try {
            existsOrError(category.name, 'Nome não informado') // se não existir
        } catch(msg) {
            return res.status(400).send(msg) // se ja existir retorne a msg 400 e return para não manter o erro
        }

        if(category.id) { // se tiver setado a category id
            app.db('categories')
                .update(category) // vai atualizar a categoria
                .where({ id: category.id }) // selecionando o id para atualizar somente essa categoria
                .then(_ => res.status(204).send()) // se der tudo certo retorne 204 success
                .catch(err => res.status(500).send(err)) // se der erro retorne 500
        } else {
            app.db('categories') // se não tiver setado então irá incluir
                .insert(category)// insert para inserir no category
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código da Categoria não informado.') // o id deve está presente

            const subcategory = await app.db('categories')
                .where({ parentId: req.params.id }) // verifica se a categoria possui subcategorias
            notExistsOrError(subcategory, 'Categoria possui subcategorias.')

            const articles = await app.db('articles')
                .where({ categoryId: req.params.id }) // verifica se a categoria possui algo associado
            notExistsOrError(articles, 'Categoria possui artigos.') // notExistsOrErros === se Existir

            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del() // deleta a linha
            existsOrError(rowsDeleted, 'Categoria não foi encontrada.') // Se não existir, retorna category not found

            res.status(204).send() // retorna a confirmação
        } catch(msg) {
            res.status(400).send(msg) // caso caia no catch retorne o status 400
        }
    }

    const withPath = categories => { // gera categoria pai > filho > filho no crud
        const getParent = (categories, parentId) => { // pega categoria pai e retorna o parent
            const parent = categories.filter(parent => parent.id === parentId) // filtra o id do parentId
            return parent.length ? parent[0] : null // se o parent for maior que 0 retorne o parent caso nao : null
        }

        const categoriesWithPath = categories.map(category => { // transformando array de category em outro array com outro atrib path
            let path = category.name // pegando o name da category
            let parent = getParent(categories, category.parentId) // procura o parent se existir

            while(parent) { // enquanto existir / while nó
                path = `${parent.name} > ${path}` // recebe o pai e filho
                parent = getParent(categories, parent.parentId)
            }

            return { ...category, path }
        })

        categoriesWithPath.sort((a, b) => { // ordena em ordem alfabetica
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories))) // pega as categorias com path em json
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id }) // id vem de requisição id
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(c => !c.parentId) // filtra as categorias que nao tiver o parent id setado
        tree = tree.map(parentNode => { // buscar os filhos do parentNode // se o parentid nao tiver setado retorna true
            const isChild = node => node.parentId == parentNode.id // pega os filhos do pai, retorna o pai e mostra abaixo
            parentNode.children = toTree(categories, categories.filter(isChild)) // filtrando os filhos
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(categories))) // retorna o json em tooTree
            .catch(err => res.status(500).send(err))// pega o resultado em json e retorna como resposta
    }

    return { save, remove, get, getById, getTree }
}