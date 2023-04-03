import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		selectedUsers: [], // 加班申请选择的用户,
		listDetail: null, // 列表详情
	},
	mutations: {
		selectedUsers(state, val) {
			state.selectedUsers = val
		},
		listDetail(state, val) {
			state.listDetail = val
		}
	},
	actions: {
		selectedUsers({ commit }, val) {
			commit('selectedUsers', val)
		},
		selectedListDetail({ commit }, val) {
			commit('listDetail', val)
		}
	}
})

export default store
