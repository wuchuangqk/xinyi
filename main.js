import Vue from 'vue'
import App from './App'
import store from './store'
import {storageKeys, events} from './util/constants.js'
import dayjs from 'dayjs'
import {hasPermission} from '@/util/index.js'
import { doGet, doPost } from '@/util/request'
import ListTabbar from '@/components/list-tabbar'
import FloatButton from '@/components/float-button'
import PageEmpty from '@/components/page-empty'
import uView from 'uview-ui';

Vue.config.productionTip = false
Vue.prototype.$store = store // 挂载vuex
Vue.prototype.$const = storageKeys // 挂载常量
Vue.prototype.$events = events // 挂载事件
Vue.prototype.$dayjs = dayjs // 挂载时间格式化工具库
Vue.prototype.$hasPermission = hasPermission // 挂载权限验证函数
Vue.prototype.doGet = doGet
Vue.prototype.doPost = doPost
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
Vue.use(uView);
Vue.component('list-tabbar', ListTabbar)
Vue.component('float-button', FloatButton)
Vue.component('page-empty', PageEmpty)
app.$mount()