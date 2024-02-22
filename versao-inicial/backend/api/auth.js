const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {// compara email da req com senha da req 
        if (!req.body.email || !req.body.password) { // se e-mail ou senha !nao estiver setado
            return res.status(400).send('Informe usuário e senha!') 
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if (!user) return res.status(400).send('Usuário não encontrado!')

        const isMatch = bcrypt.compareSync(req.body.password, user.password) // pega a senha do body aplica para validar com o user password
        if (!isMatch) return res.status(401).send('Email/Senha inválidos!') // com o hash

        const now = Math.floor(Date.now() / 1000) // pega a data e hora atual

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now, // emitido em: now
            exp: now + (60 * 60 * 24 * 3) // expira em 3 dias
        }

        res.json({ // responde a senha em json
            ...payload, // operador sprading recebe todo payload e retorna o token
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)// decodifica o token
                if(new Date(token.exp * 1000) > new Date()) { // * 1000 para transformar em segundos
                    return res.send(true)
                }
            }
        } catch(e) {
            // problema com o token
        }

        res.send(false)
    }

    return { signin, validateToken }
}