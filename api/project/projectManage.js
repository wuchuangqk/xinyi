import {
	request
} from '../../util/http.js'

// 模糊查询带分页
// /api/project/manager/getManagerPageList
export function getManagerPageList({buildStageType,params,pageIndex,pageSize}) {
	return request({
		url: `/project/api/project/manager/getManagerPageList`,
		method: 'get',
		data: {buildStageType,params,pageIndex,pageSize}
	})
}
/* 跳转权限 */
export function getJumpRights (projectId, userId) {
  return request({
    url: '/project/api/project/info/validUserSys',
    method: 'GET',
    data:{userId, projectId}
  })
}