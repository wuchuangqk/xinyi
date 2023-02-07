import {
	request
} from '../../util/http.js'

// 模糊查询带分页
export function getNoticeList(isJurisdiction, noticeTitle, isRead, startTime, endTime, pageIndex, pageSize) {
	return request({
		url: `/oa/api/notice/getList`,
		method: 'get',
		data: {
			isJurisdiction,
			noticeTitle,
			isRead,
			startTime,
			endTime,
			pageIndex,
			pageSize
		}
	})
}

// 模糊查询带分页
export function getUnreadNotice(isJurisdiction, pageIndex, pageSize) {
	return request({
		url: `/oa/api/notice/getList`,
		method: 'get',
		data: {
			isJurisdiction,
			pageIndex: 1,
			pageSzie: 10
		}
	})
}
// 新增通知
export function save(notice) {
	return request({
		url: `/oa/api/notice/saveNotice`,
		method: 'post',
		data: notice
	})
}
// 根据id删除通知列表
export function deleteMethod(idArr) {
	return request({
		url: `/oa/api/notice/deleteNoticeByIds`,
		method: 'delete',
		data: idArr
	})
}
// 根据id查通知列表
export function getById(id) {
	return request({
		url: `/oa/api/notice/getNoticeById/${id}`,
		method: 'get'
	})
}
//根据id删除评论
export function deletest(id) {
	return request({
		url: `/oa/api/oa_comments/delete/${id}`,
		method: 'delete',
	})
}
// 修改通知
export function update(notice) {
	return request({
		url: `/oa/api/notice/UpdateNotice/${notice.noticeId}`,
		method: 'post',
		data: notice
	})
}
// /notice/publish
// 发布
export function publish(data) {
	return request({
		url: `/oa/api/notice/publish`,
		method: 'put',
		data
	})
}

// /notice/undoPublish
// 取消发布
export function undoPublish(data) {
	return request({
		url: `/oa/api/notice/undoPublish`,
		method: 'put',
		data
	})
}

// /system/department/getSelectModelGroupList
// 集团选择框
export function getSelectModelGroupList() {
	return request({
		url: `/oa/api/system/department/getSelectModelGroupList`,
		method: 'get',
	})
}

// /api/notice/setReaded/{id}
// 根据id设置为已读
export function setHasReaded(id) {
	return request({
		url: `/oa/api/notice/setReaded/{id}`,
		method: 'post',
		data: {
			id
		}
	})
}

/// /notice/getList
// 已发布的通知公告
export function yiFaBuNotice(isJurisdiction, pageIndex, pageSize) {
	return request({
		url: `/oa/api/notice/getList`,
		method: 'get',
		data: {
			isJurisdiction,
			pageIndex,
			pageSize
		}
	})
}

// /notice/setReaded/{id}
// 根据id设置为已读
export function setReaded(id, data) {
	return request({
		url: `/oa/api/notice/setReaded/${id}`,
		method: 'post',
		data
	})
}
