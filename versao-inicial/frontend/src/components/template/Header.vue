<template>
    <header class="header">     <!-- @click ele seta que cada vez que clica ele recolhe -->
        <a class="toggle" @click="toggleMenu" v-if="!hideToggle">  <!-- toogle setando o SE não estiver escondido então ele ira mostrar, necessario negar -->
            <i class="fa fa-lg" :class="icon"></i> <!-- class icon é uma propriedade disponivel no componente-->
        </a>
        <h1 class="title">
            <router-link to="/">{{ title }}</router-link>
        </h1>
        <UserDropdown v-if="!hideUserDropdown" /> <!-- não esconde o hideuserDropDown -->
    </header>
</template>

<script>
import UserDropdown from './UserDropdown'

export default {
    name: 'Header',
    components: { UserDropdown },
    props: {
        title: String,              // setando o toggle
        hideToggle: Boolean,
        hideUserDropdown: Boolean
    },
    computed: {
        icon() {        //
            return this.$store.state.isMenuVisible ? "fa-angle-left" : "fa-angle-down" // o menuVisivle ta visivel? se tiver fecha, se não tiver abre
        }                       // alterna o icone
    },
    methods: {          // 
        toggleMenu() {
            this.$store.commit('toggleMenu') // chama a função togglemenu
        }
    }
}
</script>

<style>
    .header {
        grid-area: header;
        background: linear-gradient(to right, #1e469a, #49a7c1);

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .title {
        font-size: 1.2rem;
        color: #fff;
        font-weight: 100;
        flex-grow: 1; /* cresce o title junto com o flex container */
        text-align: center;
    }

    .title a {
        color: #FFF;
        text-decoration: none;
    }

    .title a:hover {
        color: #FFF;
        text-decoration: none;
    }

    header.header > a.toggle {
        width: 60px;
        height: 100%;
        color: #fff;
        justify-self: flex-start;
        text-decoration: none;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    header.header > a.toggle:hover {
        color: #fff;
        background-color: rgba(0, 0, 0, 0.2);
    }
</style>
