import {request} from '../../util/http.js'

// 分段验收
export function getStagePageList(projectId) {
  return request({
    url: `/project/api/project/examine/getStagePageList`,
    method: 'GET',
		data: {projectId}
  })
}
// 分段验收详情
export function getStageById(id) {
  return request({
    url: `/project/api/project/examine/getStageById/{id}`,
    method: 'GET',
		data: {id}
  })
}
// 综合验收
export function getComprehensive(projectId) {
  return request({
    url: `/project/api/project/examine/getComprehensiveByProjectId/{projectId}`,
    method: 'GET',
		data: {projectId}
  })
}
// 财务决算
export function getFinance(projectId) {
  return request({
    url: `/project/api/project/examine/getFinanceByProjectId/{projectId}`,
    method: 'GET',
		data: {projectId}
  })
}
