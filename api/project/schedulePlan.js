import {
	request
} from '../../util/http.js'

// /api/project/node/getList
// 获取项目计划
export function getList(projectId, projectStageId) {
	return request({
		url: `/project/api/project/node/getList`,
		method: 'get',
		data: {
			projectId,
			projectStageId
		}
	})
}

// /api/project/node/getNodeById/{dataId}
// 查看节点详情
export function getNodeById(dataId) {
	return request({
		url: `/project/api/project/node/getNodeById/${dataId}`,
		method: 'get',
	})
}
