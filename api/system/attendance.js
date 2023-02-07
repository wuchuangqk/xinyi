import {
	request
} from '../../util/http.js'

// 获取考勤设置
export function getOne(baseUrl) {
	return request({
		url: `/core/core/atta/getOne`,
		method: 'POST'
	})
}

// /core/user_atta/clock
// 用户打卡
export function clock(data) {
	return request({
		url: `/core/core/user_atta/clock`,
		method: 'POST',
		data
	})
}
// /core/user_atta/getClockForDay
// 查看用户某天的考勤
export function getClockForDay(day, userId) {
	return request({
		url: `/core/core/user_atta/getClockForDay`,
		method: 'GET',
		data: {
			day,
			userId
		}
	})
}

// /core/user_atta/getPageListForDay
// 用户考勤记录分页查询
export function getPageListForDay(day, userName, pageIndex, pageSize) {
	return request({
		url: `/core/core/user_atta/getPageListForDay`,
		method: 'GET',
		data: {
			day,
			userName,
			pageIndex,
			pageSize
		}
	})
}

// /core/user_atta/supply
// 用户补卡(只有下午未打卡的才可以补，并且时间不能超过24小时)
export function reissueSupply({address, id, type, userId}) {
  return request({
    url: `/core/core/user_atta/supply?address=${address}&id=${id}&type=${type}&userId=${userId}`,
    method: 'POST',
  })
}
