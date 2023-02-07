import {request} from '../../util/http.js'

// /project/tender/getPageList
// 获取项目招标列表
export function getPageList(projectId, pageIndex, pageSize) {
  return request({
    url: `/project/api/project/tender/getPageList`,
    method: 'GET',
		data: {projectId, pageIndex, pageSize}
  })
}

// /project/tender/getById/{id}
// 查看项目招标
export function getById(id) {
  return request({
    url: `/project/api/project/tender/getById/{id}`,
    method: 'GET',
		data: {id}
  })
}
// 发包方式
export function getContractType() {
  return request({
    url: `/project/api/manager/param/getPageList`,
    method: 'GET',
		data: {PType: 82}
  })
}

// 办理类型
export function getProjectBiddingTypeMap() {
  return request({
    url: `/project/api/manager/param/getProjectBiddingTypeMap`,
    method: 'GET',
  })
}