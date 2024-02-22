const { authSecret } = require('../.env') // pega o token
const passport = require('passport') // pega o framework no package
const passportJwt = require('passport-jwt') // pega o framework no package
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: authSecret, // decodifica o token
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => { // recebe o payload
        app.db('users')
            .where({ id: payload.id }) // payload = id
            .first() // pega somente um id
            .then(user => done(null, user ? { ...payload } : false)) // caso o user seja nulo retone false
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false }) // sem controle de sessao
    }
}