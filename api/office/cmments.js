import {
 	request
 } from '../../util/http.js'

 // 新增评论
 export function saveComments(data) {
 	return request({
 		url: `/oa/api/oa_comments/add/${data.refId}`,
 		method: 'post',
 		data
 	})
 }
 // /oa_comments/index/{refId}
 // 评论列表
 export function getComments(refId, refType) {
 	return request({
 		url: `/oa/api/oa_comments/index/${refId}`,
 		method: 'get',
 		data: {
 			refType
 		}
 	})
 }
 // /oa_comments/delete/{id}
 // 根据id删除评论
 export function deleteComents(id, refType) {
 	return request({
 		url: `/oa/api/oa_comments/delete/${id}`,
 		method: 'delete'
 	})
 }
