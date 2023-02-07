import {request} from '../../util/http.js'

// 资料汇总
export function getDataPageList(projectId) {
  return request({
    url: `/project/api/project/data/getDataPageList`,
    method: 'GET',
		data: {projectId}
  })
}

// 项目附件
export function getFilesPageList(projectId) {
  return request({
    url: `/project/api/project/data/getFilesPageList`,
    method: 'GET',
		data: {projectId}
  })
}
// 项目附件
export function getById(id) {
  return request({
    url: `/project/api/project/data/getById/{id}`,
    method: 'GET',
		data: {id}
  })
}