import {request} from '../../util/http.js'

// /core/depart/selectTree
// 获取部门树状列表
export function getDept() {
  return request({
    url: `/core/core/depart/selectTree`,
    method: 'GET',
  })
}

// /core/depart/getById/{id}
// 查看部门
export function getDeptInfo(id) {
  return request({
    url: `/core/core/depart/getById/{id}`,
    method: 'GET',
    data: {id}
  })
}
