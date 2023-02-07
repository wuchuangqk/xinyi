import {
	request
} from '../../util/http.js'

/* 获取阅读列表 */
export function getReadingList(dataId, dataType) {
	return request({
		url: `/oa/api/notice/readingRecord`,
		method: 'GET',
		data: {
			dataId,
			dataType,
			pageIndex: 1,
			pageSize: 9999
		}
	})
}

// /app/other/update_version
// 版本检测
export function update_version(version) {
	return request({
		url: `/oa/app/other/update_version`,
		method: 'GET',
		data: {
			version
		}
	})
}

// /office/oaReminder/getByUserId/{userId}
// App获取有效的一条温馨提示
export function getReminder(userId) {
	return request({
		url: `/oa/api/reminder/getByUserId/${userId}`,
		method: 'GET',
	})
}

