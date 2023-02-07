import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		pushMessage: '',
		cid: '',
		userInfo: {}
	},
	mutations: {
		SET_PUSH_MESSAGE: (state, pushMessage) => {
			state.pushMessage = pushMessage
		},
		SET_CID: (state, cid) => {
			state.cid = cid
		},
		SET_USER_INFO: (state, userInfo) => {
			state.userInfo = userInfo
		}
	},
	actions: {
		setPushMessage({
			commit
		}, pushMessage) {
			commit('SET_PUSH_MESSAGE', pushMessage)
		},
		setCID({
			commit
		}, cid) {
			commit('SET_CID', cid)
		},
		setUserInfo({
			commit
		}, userInfo) {
			commit('SET_USER_INFO', userInfo)
		}
	}
})

export default store
