import {
	request
} from '../../util/http.js'

// /api/project/info/getPageList
// 我的项目
export function getPageList({buildStageType,queryContent,pageIndex,pageSize}) {
	return request({
		url: `/project/api/project/info/getPageList`,
		method: 'get',
		data: {buildStageType,queryContent,pageIndex,pageSize}
	})
}

// /api/manager/projectCode/getProjectTypeList
// 获取项目类型下拉框
export function getProjectTypeList(){
	return request({
		url:'/project/api/manager/projectCode/getProjectTypeList',
		method:'get'
	})
}

// 建设阶段
export function getStageTypeMap(){
	return request({
		url:'/project/api/project/info/getStageTypeMap',
		method:'get'
	})
}

// /api/projectInfo/xmContract/getByProjectId/{projectId}
// 根据项目Id获取合同信息
export function getByProjectId(projectId){
	return request({
		url: `/project/api/projectInfo/xmContract/getByProjectId/${projectId}`,
		method:'get'
	})
}

// /api/project/info/getTeamTypeMap
// 获取工程队
export function getTeamTypeMap() {
  return request({
    url: `/project/api/project/info/getTeamTypeMap`,
    method: 'get',
  })
}
