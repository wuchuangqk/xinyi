import { BASE_URL } from './constants.js'
const permissionMap = {
	'OA_PERMISSION': null,
	'PROJECT_PERMISSION': null
}

export function savePermission(platform, permissions) {
	permissionMap[platform] = []
	_buildPermissionArr(permissions, permissionMap[platform])
	uni.setStorageSync(platform, permissionMap[platform])
}

function _buildPermissionArr(target, arr) {
	target.forEach(val => {
		arr.push({
			key: val.routeName,
			enable: val.isHasSys === 1
		})
		if (val.children && val.children.length) {
			_buildPermissionArr(val.children, arr)
		}
	})
}

export function hasPermission(permissionKey, platform) {
	if (platform === undefined) {
		throw new Error('缺少必要参数：平台标识')
	}
	if (permissionMap[platform] === null) {
		permissionMap[platform] = uni.getStorageSync(platform)
	}
	const temp = permissionMap[platform].find(v => v.key === permissionKey)
	if (temp === undefined) {
		return false
	}
	return temp.enable
}

/**
 * 对象格式转成数组格式
 */
export function objectConversionArray(obj) {
	let arr = [];
	for (const val of Object.keys(obj)) {
		arr.push({
			label: obj[val],
			value: parseInt(val),
		});
	}
	return arr
}

/**
 * 小数转整然后相加
 * @param arr
 */
export function calcHelper(arr) {
	const rating = 10000
	let sum = 0
	arr.forEach(num => {
		sum += (num || 0) * rating
	})
	return sum / rating
}

/**
 * 格式化数字对应的文字
 * @param {*} value 接口返回的值
 * @param {*} arr 选项数组
 * @param {*} multiple 值是否有多个
 * @returns 匹配后的中文名称
 */
export function matchLabel(value, arr, multiple = false) {
	let result = ''
	if (multiple) {
		const labelArr = [];
		('' + value).split(',').forEach(v => {
			const temp = arr.find(val => val.value === v)
			if (temp) {
				labelArr.push(temp.label)
			} else {
				labelArr.push(v)
			}
		})
		result = labelArr.join(',')
	} else {
		const temp = arr.find(v => v.value === value)
		result = temp ? temp.label : value
	}
	return result
}

export const setFileUrl = (url) => {
	const index = url.indexOf('/upload')
	if (index === -1) {
		return url
	}
	return BASE_URL + url.substring(index)
}

export const notNull = (val) => {
	return val !== undefined && val !== null && val !== ''
}