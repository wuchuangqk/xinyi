import {
	request
} from '../../util/http.js'

// /api/project/comprehensive/getByList
// 综合成本查询
export function getByList(data) {
  return request({
    url: `/project/api/project/comprehensive/getByList`,
    method: 'post',
    data
  })
}

export function getTotalCost() {
  return request({
    url: `/project/api/project/bill/getTotalCost`,
    method: 'get',
  })
}

// /api/project/comprehensive/saveList
// 综合成本新增修改
export function saveList(data) {
  return request({
    url: `/project/api/project/comprehensive/saveList`,
    method: 'post',
    data
  })
}

// /api/project/accounts/getSelectList
// 项目下拉框
export function getSelectList() {
  return request({
    url: `/project/api/project/accounts/getSelectList`,
    method: 'get',
  })
}

// /api/project/accounts/saveOrUpdate
// 添加/修改项目决算
export function saveOrUpdate(data) {
  return request({
    url: `/project/api/project/accounts/saveOrUpdate`,
    method: 'post',
    data
  })
}

// /api/project/accounts/getPageList
// 获取项目决算分页
export function getAccounts( projectId, pageIndex, pageSize) {
  return request({
    url: `/project/api/project/accounts/getPageList
		?projectId=${projectId}
		&pageIndex=${pageIndex}
		&pageSize=${pageSize}
		`,
    method: 'post',
  })
}

// /api/project/accounts/deleteById/{id}
// 删除项目决算
export function deleteById(id) {
  return request({
    url: `/project/api/project/accounts/deleteById/{id}?id=${id}`,
    method: 'delete',
  })
}

