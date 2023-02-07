import {
	request
} from '../../util/http.js'

// /api/project/attendance/getUserList/{projectId}
// 获取该项目参与考核的人员列表(项目考勤先调用这个接口)
export function getUserList(projectId) {
	return request({
		url: `/project/api/project/attendance/getUserList/${projectId}`,
		method: 'GET',
	})
}
// /api/project/attendance/getList/{projectId}
// 查看项目月份考勤(直返会存在考勤的数据)
export function getList(projectId, yearAndMonth) {
	return request({
		url: `/project/api/project/attendance/getList/${projectId}`,
		method: 'GET',
		data: {
			yearAndMonth
		}
	})
}
// /api/project/attendance/abnormal
// 确认工时（App员工操作对于工时有问题）
export function abnormal(attendanceId) {
	return request({
		url: `/project/api/project/attendance/abnormal?attendanceId=${attendanceId}`,
		method: 'POST',
	})
}
// /api/project/attendance/confirm
// 确认工时（App员工操作确认工时正确）
export function confirm(attendanceId) {
	return request({
		url: `/project/api/project/attendance/confirm?attendanceId=${attendanceId}`,
		method: 'POST',
	})
}
// /api/project/attendance/saveOrUpdate
// 添加
export function saveOrUpdate(data) {
	return request({
		url: `/project/api/project/attendance/saveOrUpdate`,
		method: 'POST',
		data
	})
}

// /api/project/attendance/listSaveOrUpdate
// 批量添加
export function batchSave(data) {
	return request({
		url: `/project/api/project/attendance/listSaveOrUpdate`,
		method: 'POST',
		data
	})
}

// /api/project/attendance/getAppList/{projectId}
// App查看当天的考勤
export function getAppList(projectId,name,days) {
	return request({
		url: `/project/api/project/attendance/getAppList/${projectId}`,
		method: 'GET',
		data: {name,days}
	})
}

// /api/project/attendance/getById/{id}
// 查看考勤详情
export function getById(id) {
	return request({
		url: `/project/api/project/attendance/getById/${id}`,
		method: 'GET',
	})
}
// /api/project/attendance/getInfo/{projectId}/{userId}/{days}
// 查询人员具体项目具体日期考勤
export function getInfo(projectId, userId, days) {
	return request({
		url: `/project/api/project/attendance/getInfo/${projectId}/${userId}/${days}`,
		method: 'GET',
	})
}

// /api/project/attendance/getListForUserId/{userId}
// App首页我的考勤接口
export function getListForUserId(userId, yearAndMonth) {
	return request({
		url: `/project/api/project/attendance/getListForUserId/${userId}`,
		method: 'GET',
		data: {yearAndMonth}
	})
}