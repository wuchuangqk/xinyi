import {
	request
} from '../../util/http.js'

export function getWenXuan(pageIndex, pageSize) {
	return request({
		url: `/oa/api/oa/wenxuan/index/queryList`,
		method: 'get',
		data: {
			infoTitle: '',
			pageIndex,
			pageSize
		}
	})
}

// 根据id查看详情
export function getInfo(id) {
	return request({
		url: `/oa/api/oa/wenxuan/index/queryById/${id}`,
		method: 'get'
	})
}
