import {
	request
} from '../../util/http.js'

// 待办
export function getTodoWork(id) {
  return request({
    url: `/oa/api/oa/wenxuan/getDaiBan/${id}`,
    method: 'get',
  })
}

// 待阅
export function getTodoRead(id) {
  return request({
    url: `/oa/api/oa/wenxuan/getDaiYue/${id}`,
    method: 'get',
  })
}