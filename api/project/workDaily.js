import {
	request
} from '../../util/http.js'
// /api/project/journal/getInfoByTime
// 根据日期查看
export function getInfoByTime(projectId, time, type) {
	return request({
		url: `/project/api/project/journal/getInfoByTime`,
		method: 'GET',
		data: {
			projectId,
			time,
			type
		}
	})
}

// /project/journal/getInfoById/{journalId}
// 根据Id查看
export function getInfoById(journalId) {
	return request({
		url: `/project/api/project/journal/getInfoById/${journalId}`,
		method: 'GET',
	})
}
// /api/project/coincided/getDetailById/{id}
// 根据Id获取旬报明细
export function getDetailById(id) {
	return request({
		url: `/project/api/project/coincided/getDetailById/${id}`,
		method: 'get',
	})
}

///api/project/construction/getListByProjectId/{projectId}
//根据项目Id获取具体每天的施工日志
export function getListByProjectId(data) {
	return request({
		url: `/project/api/project/construction/getListByProjectId/${data.projectId}`,
		method: 'get',
		data
	})
}

// /api/project/construction/listSave
// 批量保存施工日志
export function listSave(data) {
	return request({
		url: `/project/api/project/construction/listSave`,
		method: 'post',
		data
	})
}

// /api/manager/param/getPageList
// 获取项目参数列表
export function getParams(PType) {
	return request({
		url: `/project/api/manager/param/getPageList`,
		method: 'get',
		params: {
			PType,
			pageIndex: 1,
			pageSize: 100
		}
	})
}

// /api/project/journal/saveOrUpdate
// 新增/修改
export function saveOrUpdate(data) {
  return request({
    url: `/project/api/project/journal/saveOrUpdate`,
    method: 'post',
    data
  })
}