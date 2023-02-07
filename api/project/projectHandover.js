import {
	request
} from '../../util/http.js'

// 模糊查询带分页
// /api/project/manager/getManagerPageList
export function getManagerPageList({state,params,pageIndex,pageSize}) {
	return request({
		url: `/project/api/project/handover/getPageList?state=${state}&params=${params}`,
		method: 'POST',
		data: {pageIndex,pageSize}
	})
}

export function getById(id) {
	return request({
		url: `/project/api/project/handover/getById/{id}`,
		method: 'get',
		data: {id}
	})
}

// 拒绝交接
export function refuseHandoverById(id) {
	return request({
		url: `/project/api/project/handover/refuseHandoverById/{id}`,
		method: 'get',
		data: {id}
	})
}
// 确认交接
export function confirmHandoverById(id) {
	return request({
		url: `/project/api/project/handover/confirmHandoverById/{id}`,
		method: 'get',
		data: {id}
	})
}
// /api/project/handover/save
// 添加项目交接
export function save(data) {
  return request({
    url: `/project/api/project/handover/save`,
    method: 'POST',
    data
  })
}

// /api/project/handover/getMyDutyProject
// 获取我负责的项目列表
export function getMyDutyProject() {
  return request({
    url: `/project/api/project/handover/getMyDutyProject`,
    method: 'get',
  })
}

// /api/manager/coordinate/getInfoListAll
// 获取小组及小组人员
export function getInfoListAll() {
  return request({
    url: `/project/api/manager/coordinate/getInfoListAll`,
    method: 'get',
  })
}