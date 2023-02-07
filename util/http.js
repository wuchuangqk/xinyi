import store from '../store/index.js'
import {
	storageKeys
} from './constants.js'

// 接口地址前缀
const baseUrl = 'http://118.195.182.157:18500'
// 本地开发环境接口地址前缀
const devUrl = {
	oa: 'http://192.168.0.107:8303',
	core: 'http://192.168.0.107:8305',
	project: 'http://192.168.0.107:8304',
}

export const uploadHost = {
	oa: 'http://192.168.0.107:8303',
	core: 'http://192.168.0.107:8305',
	project: 'http://192.168.0.107:8304'
	// oa: 'http://118.195.182.157:18500/oa',
	// core: 'http://118.195.182.157:18500/core',
	// project: 'http://118.195.182.157:18500/project'
}

// 使用Promise封装uniapp请求
export function request(options) {
	return new Promise((resolved, rejected) => {
		uni.request({
			// url: productMode(baseUrl + options.url),
			url: devMode(options.url),
			method: options.method,
			data: options.data,
			header: {
				token: uni.getStorageSync(storageKeys.TOKEN)
			},
			success: (res) => {
				const {
					data,
					statusCode
				} = res
				if (statusCode === 500) {
					rejected(data)
				} else if (statusCode === 401) {
					uni.setStorageSync(storageKeys.IS_LOGIN, false); // 存储登录状态为未登录
					uni.reLaunch({
						url: '/pages/login/login'
					});
					uni.showToast({
						title: '您的登录已过期，请重新登录',
						icon: 'none'
					})
					rejected(data)
				} else {
					resolved(data);
				}
			},
			fail: (err) => {
				rejected(err)
			}
		})
	})
}

function devMode(url) {
	if (url.indexOf('/oa') === 0) {
		url = devUrl.oa + url.replace(/^\/oa/, '')
	} else if (url.indexOf('/project') === 0) {
		url = devUrl.project + url.replace(/^\/project/, '')
	} else if (url.indexOf('/core') === 0) {
		url = devUrl.core + url.replace(/^\/core/, '')
	}
	if (url.indexOf('?') !== -1) {
		url += '&token=' + uni.getStorageSync(storageKeys.TOKEN)
	} else {
		url += '?token=' + uni.getStorageSync(storageKeys.TOKEN)
	}
	return url
}

function productMode(url) {
	if (url.indexOf('?') !== -1) {
		url += '&token=' + uni.getStorageSync(storageKeys.TOKEN)
	} else {
		url += '?token=' + uni.getStorageSync(storageKeys.TOKEN)
	}
	return url
}
