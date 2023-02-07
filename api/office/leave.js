import {
	request
} from '../../util/http.js'

// /app/leave/getMyLeavePageList
// 我的申请
// /api/qingjia/index
export function getMyLeavePageList(pageIndex, pageSize, userId) {
	return request({
		url: '/oa/app/leave/getMyLeavePageList',
		method: 'GET',
		data: {
			leaveType: 1,
			pageIndex,
			pageSize,
			userId
		}
	})
}

// 待我审批
export function getMyWaitPageList(pageIndex, pageSize, userId) {
	return request({
		url: '/oa/app/leave/getMyWaitPageList',
		method: 'GET',
		data: {
			leaveType: 1,
			pageIndex,
			pageSize,
			userId
		}
	})
}

// 已办审批
export function getMyEndPageList(pageIndex, pageSize, userId) {
	return request({
		url: '/oa/app/leave/getMyEndPageList',
		method: 'GET',
		data: {
			leaveType: 1,
			pageIndex,
			pageSize,
			userId
		}
	})
}

// 流程监控
export function getFlowMonitorPageList(pageIndex, pageSize, userId, creatorName, qjleaveType) {
	return request({
		url: '/oa/app/leave/getFlowMonitorPageList',
		method: 'GET',
		data: {
			leaveType: 1,
			userId,
			pageIndex,
			pageSize,
			creatorName,
			qjleaveType
		}
	})
}

// /app/leave/getQJinfo/{id}
// 请假详情
export function getQJinfo(id) {
	return request({
		url: `/oa/api/qingjia/info/${id}`,
		method: 'GET',
	})
}

// /api/qingjia/flowList/{id}
// 签署流程
export function flowList(id) {
	return request({
		url: `/oa/api/qingjia/flowList/${id}`,
		method: 'GET',
	})
}

// /api/approval/accept
// 审批 -> 保存
export function accept(data) {
	return request({
		url: `/oa/api/approval/accept`,
		method: 'POST',
		data
	})
}

// /api/approval/rollback
// 审批 -> 退回
export function rollback(data) {
	return request({
		url: `/oa/api/approval/rollback`,
		method: 'POST',
		data
	})
}

// 获取请假审批人流程
export function getProcessConfigure(id) {
	return request({
		url: `/oa/api/tSysProcessConfigure/getProcessConfigure/{affairTypeId}?affairTypeId=${id}`,
		method: 'GET',
	})
}

// 获取请假类型
export function getLeaveType() {
	return request({
		url: `/oa/api/param/getColumnName`,
		method: 'GET',
	})
}

// 
export function save(data) {
	return request({
		url: `/oa/api/approval/add`,
		method: 'post',
		data
	})
}

// /api/approval/returnUserList/{approvalId}
// 退回用户集合
export function returnUserList(approvalId) {
	return request({
		url: `/oa/api/approval/returnUserList/${approvalId}`,
		method: 'GET',
	})
}

// /api/approval/updateDone
// 修改已审核信息
export function updateDone(data) {
	return request({
		url: `/oa/api/approval/updateDone`,
		method: 'POST',
		data
	})
}

export function del(id) {
	return request({
		url: '/oa/api/approval/deleteByAppIds',
		method: 'delete',
		data: [id]
	})
}

// /qingjia/saveCc
// 添加抄送
export function copyTo(data) {
  return request({
    url: `/oa/api/qingjia/saveCc`,
    method: 'post',
    data
  })
}

// /api/qingjia/determine/{approvalId}
// 请假确定--Anna操作
export function determine(approvalId) {
  return request({
    url: `/oa/api/qingjia/determine/${approvalId}`,
    method: 'get',
  })
}