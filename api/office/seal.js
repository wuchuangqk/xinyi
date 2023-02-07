import {
	request
} from '../../util/http.js'

// /api/apply/index
// 报销管理
export function getMyClaimPageList(data) {
	return request({
		url: '/oa/api/apply/index',
		method: 'GET',
		data
	})
}

// /api/apply/auditList
// 报销审批列表
export function getMyWaitPageList(data) {
	return request({
		url: '/oa/api/apply/auditList',
		method: 'GET',
		data
	})
}

// /api/apply/doneList
// 报销已办审批列表
export function getMyEndPageList(data) {
	return request({
		url: '/oa/api/apply/doneList',
		method: 'GET',
		data
	})
}

// /api/apply/getliuChengJianKongList
// 流程监控
export function getFlowMonitorPageList(data) {
	return request({
		url: '/oa/api/apply/getliuChengJianKongList',
		method: 'GET',
		data
	})
}

// /api/apply/info/{id}
// 详情
export function getClaimInfo(id) {
	return request({
		url: `/oa/api/apply/apply/${id}`,
		method: 'GET',
	})
}

// /api/apply/flowList/{id}
// 签署流程
export function flowList(id) {
	return request({
		url: `/oa/api/baoXiao/flowList/${id}`,
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

// 
export function save(data) {
	return request({
		url: `/oa/api/apply/saveOrUpdate`,
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

// /api/apply/uploadPayment
// 上传报销费用单
export function uploadPayment(data) {
	return request({
		url: '/oa/api/apply/uploadPayment',
		method: 'post',
		data
	})
}
// 获取报销说明
export function getExpenseType() {
	return request({
		url: `/oa/api/set/getExpenseType`,
		method: 'post'
	})
}

// 获取项目报销的报销用途
export function queryAllLevelTwoParamMap() {
	return request({
		url: `/oa/api/param/getTypeForTwo`,
		method: 'get',
		data: {
			pType: '报销用途'
		}
	})
}

// 项目报销新增/修改
export function saveProjectClaim(data) {
	return request({
		url: `/oa/api/project/expenseSaveOrUpdate`,
		method: 'post',
		data
	})
}

// 报销申请
export function getProjectApplyList(data) {
	return request({
		url: `/oa/api/project/getMyExpenseList`,
		method: 'get',
		data
	})
}
// 待办
export function getProjectWaitList(data) {
	return request({
		url: `/oa/api/project/getAuditExpenseList`,
		method: 'get',
		data
	})
}
// 已办
export function getProjectDoneList(data) {
	return request({
		url: `/oa/api/project/getDoneExpenseList`,
		method: 'get',
		data
	})
}
// 流程监控
export function getProjectMonitoringList(data) {
	return request({
		url: `/oa/api/project/getAllExpenseList`,
		method: 'get',
		data
	})
}
// 获取报销
export function getProjectClaim(id) {
	return request({
		url: `/oa/api/project/getExpenseById/${id}`,
		method: 'get',
	})
}


/* ---------请款--------- */
// 报销申请
export function getMoneyApplyList(data) {
	return request({
		url: `/oa/api/project/getMyRequestList`,
		method: 'get',
		data
	})
}
// 待办
export function getMoneyWaitList(data) {
	return request({
		url: `/oa/api/project/getAuditRequestList`,
		method: 'get',
		data
	})
}
// 已办
export function getMoneyDoneList(data) {
	return request({
		url: `/oa/api/project/getDoneRequestList`,
		method: 'get',
		data
	})
}
// 流程监控
export function getMoneyMonitoringList(data) {
	return request({
		url: `/oa/api/project/getAllRequestList`,
		method: 'get',
		data
	})
}
// 获取报销
export function getMoneyApply(id) {
	return request({
		url: `/oa/api/project/getRequestById/${id}`,
		method: 'get',
	})
}

// 新增/修改
export function saveMoneyApply(data) {
	return request({
		url: `/oa/api/project/requestSaveOrUpdate`,
		method: 'post',
		data
	})
}

// 获取参数
export function getSystemParams(type) {
	return new Promise(resolve => {
		request({
			url: `/core/core/oaparam/getPageList`,
			method: 'get',
			data: {
				type,
				pageIndex: 1,
				pageSize: 9999
			}
		}).then(res => {
			res.records = res.records || []
			resolve(res.records.map(v => {
				return {
					label: v.pname,
					value: v.pid
				}
			}))
		})
	})
}
