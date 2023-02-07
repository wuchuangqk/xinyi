import {
	request
} from '../../util/http.js'

// 调入记录
export function getInPageList(data) {
  return request({
    url: `/project/api/project/allocation/getInPageList`,
    method: 'get',
    data
  })
}
// 调出记录
export function getOutPageList(data) {
  return request({
    url: `/project/api/project/allocation/getOutPageList`,
    method: 'get',
    data
  })
}

// 修改调拨记录--修改状态 修改报道日期
export function updateAllot(data) {
  return request({
    url: `/project/api/project/allocation/update`,
    method: 'post',
    data
  })
}

// /api/project/coordinate/getListById/{proCoorId}
// 获取协调小组
export function getCoordinateUsers(proCoorId) {
  return request({
    url: `/project/api/project/coordinate/getListById/${proCoorId}`,
    method: 'get',
  })
}

// /api/project/disclose/getByProjectId/{projectId}
// 进场交底详情
export function getWorkDetail(projectId) {
  return request({
    url: `/project/api/project/disclose/getByProjectId/${projectId}`,
    method: 'get',
  })
}

// /api/project/disclose/infoSave
// 确认交底添加
export function confirmDetail(data) {
  return request({
    url: `/project/api/project/disclose/infoSave`,
    method: 'post',
    data
  })
}