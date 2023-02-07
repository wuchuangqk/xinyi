import {request} from '../../util/http.js'

// /project/tender/getPageList
// 获取项目招标列表
export function getPageList(projectId, pageIndex, pageSize) {
  return request({
    url: `/project/api/project/security/getPageList?projectId=${projectId}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: 'POST',
  })
}

// 消息来源
export function getXmSecurityTypeMap() {
  return request({
    url: `/project/api/manager/param/getXmSecurityTypeMap`,
    method: 'GET',
  })
}

// /project/tender/getById/{id}
// 查看项目招标
export function getById(id) {
  return request({
    url: `/project/api/project/security/getById/{id}`,
    method: 'GET',
		data: {id}
  })
}
