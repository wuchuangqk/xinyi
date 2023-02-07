import {
	request
} from '../../util/http.js'

// 模糊查询带分页
// /api/project/manager/getManagerPageList
export function getManagerPageList(buildNatureType,buildStageType,params,programmeType,projectType,pageIndex,pageSize) {
	return request({
		url: `/project/api/project/manager/getManagerPageList`,
		method: 'get',
		data: {buildNatureType,buildStageType,params,programmeType,projectType,pageIndex,pageSize}
	})
}
// /api/project/info/getById/{projectId}
// 获取项目详情
export function getById(projectId){
	return request({
		url: `/project/api/project/info/getById/{projectId}?projectId=${projectId}`,
		method: 'get',
	})
}

// /api/project/info/getStageTypeMap
// 获取建设阶段
export function getStageTypeMap(){
	return request({
		url:'/project/api/project/info/getStageTypeMap',
		method:'get'
	})
}

// /api/project/info/getNatureTypeMap
// 获取建设性质
export function getNatureTypeMap(){
	return request({
		url:'/project/api/project/info/getNatureTypeMap',
		method:'get'
	})
}

// /api/project/info/getPageList
// 我的项目
export function getPageList(buildStageType,queryContent,pageIndex,pageSize) {
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