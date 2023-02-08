import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		selectedUsers: [], // 加班申请选择的用户
	},
	mutations: {
		selectedUsers(state, val) {
			state.selectedUsers = val
		}
	},
	actions: {
		selectedUsers({ commit }, val) {
			commit('selectedUsers', val)
		}
	}
})

export default store
