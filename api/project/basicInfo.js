import {request} from '../../util/http.js'

// /project/info/getById/{projectId}
// 获取项目详情
export function getById(projectId) {
  return request({
    url: `/project/api/project/info/getById/${projectId}`,
    method: 'GET',
  })
}

// 项目类型
export function getProjectTypeList() {
  return request({
    url: `/project/api/manager/projectCode/getProjectTypeList`,
    method: 'GET',
  })
}
// 建设性质
export function getNatureTypeMap() {
  return request({
    url: `/project/api/project/info/getNatureTypeMap`,
    method: 'GET',
  })
}
// 建设阶段
export function getStageTypeMap() {
  return request({
    url: `/project/api/project/info/getStageTypeMap`,
    method: 'GET',
  })
}
// 工程性质
export function getProgrammeTypeMap() {
  return request({
    url: `/project/api/project/info/getProgrammeTypeMap`,
    method: 'GET',
  })
}
// 单位类型
export function getXmCompanyTypeMap() {
  return request({
    url: `/project/api/manager/param/getXmCompanyTypeMap`,
    method: 'GET',
  })
}