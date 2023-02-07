import {request} from '../../util/http.js'

// /param/getColumnName
// 请假统计动态列
export function getColumnName() {
  return request({
    url: `/oa/api/param/getColumnName`,
    method: 'get',
  })
}