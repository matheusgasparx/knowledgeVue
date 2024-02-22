const schedule = require('node-schedule') // importa o schedule do packgejson

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function () {
        const usersCount = await app.db('users').count('id').first()
        const categoriesCount = await app.db('categories').count('id').first()
        const articlesCount = await app.db('articles').count('id').first()

        const { Stat } = app.api.stat

        const lastStat = await Stat.findOne({}, {}, // pega a ultima estatistica do mongodb
            { sort: { 'createdAt' : -1 } })

        const stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            createdAt: new Date()
        })

        const changeUsers = !lastStat || stat.users !== lastStat.users // lastat nao ta setada ou usuario é diferente de laststat = usuario mudou
        const changeCategories = !lastStat || stat.categories !== lastStat.categories // se laststat ou stat categories for diferente de laststat categories
        const changeArticles = !lastStat || stat.articles !== lastStat.articles // qualquer diferença significa que mudou

        if(changeUsers || changeCategories || changeArticles) { // se mudou .. .. ..
            stat.save().then(() => console.log('[Stats] Estatíticas atualizadas!')) // qualquer atualização salva a nova modificação
        }
    })
}