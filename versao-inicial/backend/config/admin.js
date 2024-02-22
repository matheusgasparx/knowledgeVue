module.exports = middleware => {
    return (req, res, next) => {
        if(req.user.admin) {
            middleware(req, res, next) // caso o user seja admin
        } else {
            res.status(401).send('Usuário não é administrador.') // caso nao retorne msg
        }
    }
}