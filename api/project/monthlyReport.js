import {request} from '../../util/http.js'

// /project/tender/getPageList
// 获取项目招标列表
export function getPageList(projectId,reportTime) {
  return request({
    url: `/project/api/project/report/getPageList/{projectId}`,
    method: 'GET',
		data: {projectId,reportTime}
  })
}
