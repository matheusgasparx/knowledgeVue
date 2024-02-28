import Vue from 'vue'

export const userKey = '__knowledge_user'
export const baseApiUrl = 'http://localhost:3000'

export function showError(e) {
    // se e e response estiver setado e data estiver setado retorna mensagem de erro:
    if(e && e.response && e.response.data) {
        Vue.toasted.global.defaultError({ msg : e.response.data })
    } else if(typeof e === 'string') {
        Vue.toasted.global.defaultError({ msg : e })
    } else { // caso não seja nenhum dos anteriores retorna erro geral
        Vue.toasted.global.defaultError()
    }
}

export default { baseApiUrl, showError, userKey }