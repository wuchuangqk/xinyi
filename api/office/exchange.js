import {
	request
} from '../../util/http.js'

// /api/OaTrendOfWork/add
// 新增工作交流
export function save(data) {
	return request({
		url: `/oa/api/OaTrendOfWork/add`,
		method: 'POST',
		data
	})
}
/// /OaTrendOfWork/edit/{id}
// 修改工作交流
export function edit(data) {
	return request({
		url: `/oa/api/OaTrendOfWork/edit/${data.infoId}`,
		method: 'POST',
		data
	})
}
// /api/OaTrendOfWork/all
// 全部共享列表
export function all(data) {
	return request({
		url: `/oa/api/OaTrendOfWork/all`,
		method: 'GET',
		data
		// params:{pageIndex,pageSize}
	})
}
/*/api/OaTrendOfWork/geRen
个人信息列表*/
export function geRen(data) {
	return request({
		url: `/oa/api/OaTrendOfWork/geRen`,
		method: 'GET',
		data
	})
}
// /api/OaTrendOfWork/KeShi
// 科室信息列表
export function keShi(data) {
	return request({
		url: `/oa/api/OaTrendOfWork/KeShi`,
		method: 'GET',
		data
	})
}
// /api/OaTrendOfWork/SiRen
// 私人信息列表
export function siRen(data) {
	return request({
		url: `/oa/api/OaTrendOfWork/SiRen`,
		method: 'GET',
		data
	})
}

// /OaTrendOfWork/GETAllInfo
// 汇总查看
export function getAllInfo(data) {
	return request({
		url: `/oa/api/OaTrendOfWork/getAllInfo`,
		method: 'GET',
		data
	})
}
// /OaTrendOfWork/DELETEByIds
// 根据id批量删除列表
export function deleteMethod(data) {
	return request({
		url: `/oa/api/OaTrendOfWork/deleteByIds`,
		method: 'DELETE',
		data
	})
}
// /OaTrendOfWork/GETInfoById/{id}
// 根据id查详情
export function getInfoById(id) {
	return request({
		url: `/oa/api/OaTrendOfWork/getInfoById/${id}`,
		method: 'GET',
	})
}
// /OaTrendOfWork/setReadedByIds
// 根据id批量设置为已读
export function setReadedByIds(data) {
	return request({
		url: `/oa/api/OaTrendOfWork/setReadedByIds`,
		method: 'POST',
		data
	})
}
// /OaTrendOfWork/setReaded/{id}
// 根据id设置为已读
export function setReaded(id, data) {
	return request({
		url: `/oa/api/OaTrendOfWork/setReaded/${id}`,
		method: 'POST',
		data
	})
}

// /api/OaTrendOfWork/getOaTrendOfWorkTypeMap
// 获取工作交流用途下拉框
export function getOaTrendOfWorkTypeMap() {
  return request({
    url: `/oa/api/OaTrendOfWork/getOaTrendOfWorkTypeMap`,
    method: 'GET',
  })
}
