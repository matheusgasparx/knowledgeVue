module.exports = app => {
    function existsOrError(value, msg) { // existe ou erro
        if (!value) throw msg // se esse valor for verdadeiro lança msg
        if (Array.isArray(value) && value.length === 0) throw msg // se for um array vazio lança msg
        if (typeof value === 'string' && !value.trim()) throw msg // caso seja um string vazia lança msg
    }
    
    function notExistsOrError(value, msg) { // não existe ou erro
        try {
            existsOrError(value, msg)
        } catch (msg) {
            return
        }
        throw msg
    }
    
    function equalsOrError(valueA, valueB, msg) {
        if(valueA !== valueB) throw msg
    }
    
        return { existsOrError, notExistsOrError, equalsOrError }
}