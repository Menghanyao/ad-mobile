import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	adminInfo: {
		avatar: 'default.jpg'
	},
	vueUser: {
		userId: null,
		userName: '',
		userPhone: null,
		userPassword: '',
		userToken: '',
		userGender: '',
		userAge: null,
		userCity: '',
		isStudent: null,
		userLevel: null,
		usetType: null,
		userStatus: 1,
		userCash: null,
		gmtCreate: null,
		gmtModified: null
	},
}

const mutations = {
	savevueUser(state, loggedUser){
		state.vueUser = loggedUser;
	}
}

const actions = {
			actionSaveUser({commit}, user){
				console.log("在vuex中执行更新user")
				commit('savevueUser', user)
			}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
