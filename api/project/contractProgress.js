import {request} from '../../util/http.js'

// /project/tender/getPageList
// 获取项目招标列表
export function getPageList(projectId, pageIndex, pageSize) {
  return request({
    url: `/project/project/xmContractSpeed/getByPage`,
    method: 'GET',
		data: {projectId, pageIndex, pageSize}
  })
}

// /project/tender/getById/{id}
// 查看项目招标
export function getById(id) {
  return request({
    url: `/project/project/xmContractSpeed/getById/${id}`,
    method: 'GET',
		data: {id}
  })
}
