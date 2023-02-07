import {
	request
} from '../../util/http.js'

/* 开票管理 */
// /api/project/bill/getPageList
// 分页查询
export function getInvoicingList({
	customer,
	type,
	projectId,
	pageIndex,
	pageSize
}) {
	return request({
		url: `/project/api/project/bill/getPageList?
		customer=${customer}&
		type=${type}&
		projectId=${projectId}&
		pageIndex=${pageIndex}&
		pageSize=${pageSize}`,
		method: 'post',
	})
}
// /api/project/invoicing/saveOrUpdate
// 添加或修改
export function saveInvoicing(data) {
	return request({
		url: `/project/api/project/bill/saveOrUpdate`,
		method: 'post',
		data
	})
}
// /api/project/invoicing/getById/{id}
// 详情
export function getInvoicing(id) {
	return request({
		url: `/project/api/project/bill/getById/${id}`,
		method: 'get',
	})
}
// /api/project/invoicing/delete/{id}
// 删除
export function delInvoicing(id) {
	return request({
		url: `/project/api/project/bill/delete/${id}`,
		method: 'delete',
	})
}

/* 开票抬头 */
// /api/project / invoicing / getPageList
// 分页查询
export function getRiseSelect() {
  return request({
    url: `/project/api/project/invoicing/getPageList?pageIndex=1&pageSize=9999`,
    method: 'post',
  })
}