import Vue from 'vue'
import Toasted from 'vue-toasted'

// aqui seta a mensagem toasted de eventos
Vue.use(Toasted, {
    iconPack: 'fontawesome',
    duration: 3000
})

// mensagem de sucesso
Vue.toasted.register(
    'defaultSuccess',
    
    // payload mensagem não está setado? se tiver lança suces, se não tiver ai payload
    payload => !payload.msg ? 'Operação realidada com sucesso!' : payload.msg,
    { type: 'success', icon: 'check' }
)

// mensagem de erro
Vue.toasted.register(
    'defaultError',
    // payload mensagem não está setado? se não tiver " ops.. " se tiver payload.msg
    payload => !payload.msg ? 'Oops.. Erro inesperado.' : payload.msg,
    { type : 'error', icon : 'times' }
)