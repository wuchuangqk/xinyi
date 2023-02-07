import {
	request
} from '../../util/http.js'

// /core/cbd/getPageList
export function getByFlowId(flowId) {
	return request({
		url: `/project/api/exmamine/my/getByFlowId/{flowId}`,
		method: 'GET',
		data: {
			flowId
		}
	})
}
