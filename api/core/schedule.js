import {
	request
} from '@/util/http.js'

// /core/schedule/getListByMonth
// 根据月份获取行程
export function getListByMonth(month ) {
  return request({
    url: `/core/core/schedule/getListByMonth`,
    method: 'GET',
    data: { month }
  })
}

// /core/schedule/saveOrUpdate
// 新增修改行程
export function save(data) {
  return request({
    url: `/core/core/schedule/saveOrUpdate`,
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: `/core/core/schedule/saveOrUpdate`,
    method: 'post',
    data
  })
}

// /core/schedule/deleteById/{id}
// 删除日程
export function deleteMethod(id) {
  return request({
    url: `/core/core/schedule/deleteById/${id}`,
    method: 'delete',
  })
}

// /core/schedule/getById/{id}
// 查看日程
export function getById(id) {
  return request({
    url: `/core/core/schedule/getById/${id}`,
    method: 'get'
  })
}

// /core/schedule/complete/{id}
// 完成日程
export function complete(data) {
  return request({
    url: `/core/core/schedule/complete`,
    method: 'post',
		data
  })
}

///core/schedule/confirm/{id}
// 确认接收
export function confirm(id) {
  return request({
    url: `/core/core/schedule/confirm/${id}`,
    method: 'get'
  })
}
