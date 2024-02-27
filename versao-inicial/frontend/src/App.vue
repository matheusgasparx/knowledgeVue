<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible || !user}">
		<Header title="Cod3r - Base de Conhecimento" 
			:hideToggle="!user"
			:hideUserDropdown="!user" />
		<Menu v-if="user" />
		<Loading v-if="validatingToken" />
		<Content v-else />
		<Footer />
	</div>
</template>

<script>
import axios from "axios"
import { baseApiUrl, userKey } from "@/global"
import { mapState } from "vuex"
import Header from "@/components/template/Header"
import Menu from "@/components/template/Menu"
import Content from "@/components/template/Content"
import Footer from "@/components/template/Footer"
import Loading from "@/components/template/Loading"

export default {
	name: "App",
	components: { Header, Menu, Content, Footer, Loading }, // declarando todos os components
	computed: mapState(['isMenuVisible', 'user']), // declarando a sanfona do menu
	data: function() {
		return {
			validatingToken: true
		}
	},
	methods: {
		async validateToken() {
			this.validatingToken = true

			const json = localStorage.getItem(userKey)
			const userData = JSON.parse(json)
			this.$store.commit('setUser', null)

			if(!userData) {
				this.validatingToken = false
				this.$router.push({ name: 'auth' })
				return
			}

			const res = await axios.post(`${baseApiUrl}/validateToken`, userData)

			if (res.data) {
				this.$store.commit('setUser', userData)
				
				if(this.$mq === 'xs' || this.$mq === 'sm') {
					this.$store.commit('toggleMenu', false)
				}
			} else {
				localStorage.removeItem(userKey)
				this.$router.push({ name: 'auth' })
			}

			this.validatingToken = false
		}
	},
	created() {
		this.validateToken()
	}
}
</script>

<style>
	* {
		font-family: "Lato", sans-serif;
	}

	body {
		margin: 0;
	}

	#app {
		-webkit-font-smoothing: antialiased; /* imprime as fontes com sutileza */		
		-moz-osx-font-smoothing: grayscale; /* também */

		height: 100vh; /* ira tomar a tela inteira */
		display: grid; 
		grid-template-rows: 60px 1fr 40px; /* tres linhas */
		grid-template-columns: 300px 1fr; /** no 300px é onde coloca o menu */
		grid-template-areas:
			"header header" /** coloca o header em toda aplicação */
			"menu content" /** menu do lado esquerdo, content no lado direito */
			"menu footer"; /** menu e footer */
	}

	#app.hide-menu { /* aqui esconde o menu ao ser clickado la no template */
		grid-template-areas:
			"header header"
			"content content"
			"footer footer";
	}
</style>