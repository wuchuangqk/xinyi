import {
	request
} from '../util/http.js'

// 登录
export function login(data) {
	return request({
		url: '/core/core/user/login',
		method: 'POST',
		data
	})
}

// /core/user/register
// 用户注册申请
export function register({userLogin,password,userName,mobile}) {
	return request({
		url: `/core/core/user/register?userLogin=${userLogin}&password=${password}&userName=${userName}&mobile=${mobile}`,
		method: 'POST',
	})
}

// 绑定cid
export function setToken(data) {
	return request({
		url: '/core/core/user/setToken',
		method: 'GET',
		data
	})
}

// /system/sysUserInfo/getByUserId/{userId}
// 使用用户Id获取用户明细
export function getByUserId(userId) {
	return request({
		url: `/core/core/core/info/getByUserId/${userId}`,
		method: 'GET',
	})
}

// /core/user/getById/{id}
// 获取用户明细
export function getById(id) {
	return request({
		url: `/core/core/user/getById/{id}`,
		method: 'GET',
		data: {id}
	})
}

// /system/sysUserInfo/getByUserId/{userId}
// 使用用户Id获取用户明细
export function getEmpInfo(userId) {
  return request({
    url: `/core/core/info/getByUserId/${userId}`,
    method: 'GET'
  })
}

// /system/sysUserInfo/saveOrUpdate
// 新增修改
export function saveOrUpdateEmp(data) {
  return request({
    url: `/core/core/info/saveOrUpdate`,
    method: 'POST',
    data
  })
}

// /core/user/logOut
// 退出登录
export function logOut(userId) {
  return request({
    url: `/core/core/user/logOut`,
    method: 'get',
    params:{userId}
  })
}

// /core/user/getPageList
// 获取用户列表
export function getUserByDept(departId) {
  return request({
    url: `/core/core/user/getPageList`,
    method: 'get',
    data:{departId, pageIndex: 1, pageSize: 9999}
  })
}

///core/user/getPageList
// 获取用户列表
export function getUserList(userName,departId,posId, userSate = null) {
  return request({
    url: `/core/core/user/getPageList`,
    method: 'get',
    data:{
      userName,
      departId,
      posId,
			userSate,
      pageIndex: 1,
      pageSize: 9999
    }
  })
}

// /core/user/update
// 修改用户
export function updateUser(data) {
  return request({
    url: `/core/core/user/update`,
    method: 'post',
    data
  })
}

// /core/user/uploadHeadImg
// 上传用户头像
export function uploadHeadImg(headImg, userId) {
  return request({
    url: `/core/core/user/uploadHeadImg?headImg=${headImg}&userId=${userId}`,
    method: 'post',
  })
}

// /core/user/updatePassword
// 修改密码
export function updatePassword(password, userId) {
  return request({
    url: `/core/core/user/updatePassword?password=${password}&userId=${userId}`,
    method: 'post',
  })
}

// /core/user/getPageList
// 获取用户列表
export function getUsersByDept(departId, userName, pageIndex, pageSize) {
  return request({
    url: `/core/core/user/getPageList`,
    method: 'get',
		data: {departId, userName, pageIndex, pageSize, userSate: 1}
  })
}

// 获取抄送的用户
export function getCopyUser() {
  return request({
    url: `/oa/app/leave/getCCUsers`,
    method: 'get',
  })
}
