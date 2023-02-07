import {request} from '../../util/http.js'

///core/position/getPageList
// 获取职位列表
export function getPosition() {
  return request({
    url: `/core/core/position/getPageList`,
    method: 'GET',
    data: {
      pageIndex: 1,
      pageSize: 9999
    }
  })
}
