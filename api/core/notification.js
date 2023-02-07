import {
	request
} from '../../util/http.js'

// 待办
export function getTodoWork(id) {
  return request({
    url: `/core/api/system/msg/getDaiBan/${id}`,
    method: 'get',
  })
}

// 待阅
export function getTodoRead(id) {
  return request({
    url: `/core/api/system/msg/getDaiYue/${id}`,
    method: 'get',
  })
}