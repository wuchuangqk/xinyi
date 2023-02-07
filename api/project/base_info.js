import {request} from '../../util/http.js'

// /project/info/getById/{projectId}
// 获取项目详情
export function getById(projectId) {
  return request({
    url: `/project/api/project/info/getById/{projectId}`,
    method: 'GET',
		data: {projectId}
  })
}