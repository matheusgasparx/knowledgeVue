<template>
    <div class="home">
        <PageTitle icon="fa fa-home" main="Dashboard"
            sub="Base de Conhecimento" />
        <div class="stats">
                                        <!-- // value recebe.... -->
            <Stat title="Categorias" :value="stat.categories"
                icon="fa fa-folder" color="#d54d50" />
            <Stat title="Artigos" :value="stat.articles"
                icon="fa fa-file" color="#3bc480" />
            <Stat title="Usuários" :value="stat.users"
                icon="fa fa-user" color="#3282cd" />
        </div>
    </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import Stat from './Stat'
import axios from 'axios'
import { baseApiUrl } from '@/global'

export default {
    name: 'Home',
    components: { PageTitle, Stat },
    data: function() { // aqui ele ira realizar uma requisição onde retornara um objeto contendo                   
        return {       // a quantidade de usuario, artigos, categorias
            stat: {}
        }
    },
    methods: {
        getStats() {    // realizando requisição no backend | setando o res data no this.stat e retorando no objeto anterior
            axios.get(`${baseApiUrl}/stats`).then(res => this.stat = res.data)
        }
    },  // assim que o componente for montado, ele envia para get stats
    mounted() {
        this.getStats()
    }
}
</script>

<style>
    .stats {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
</style>
