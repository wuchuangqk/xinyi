import {
	request
} from '../../util/http.js'

export function getPageList(userName, deptId,state, pageIndex, pageSize) {
	return request({
		url: `/core/core/cbd/getPageList?userName=${userName}&pageIndex=${pageIndex}&pageSize=${pageSize}&deptId=${deptId}&state=${state}`,
		method: 'post'
	})
}

///core/cbd/getUserGroup
//传帮带人员选择器
export function getUserGroup() {
	return request({
		url: `/core/core/cbd/getUserGroup`,
		method: 'get'
	})
}
