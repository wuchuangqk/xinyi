import {request} from '../../util/http.js'

// /core/menu/getMenuForUser
// 获取当前登录人权限菜单
export function getMenuForUser(platformCode) {
  return request({
    url: `/core/core/menu/getMenuForUser`,
    method: 'GET',
		data: {platformCode}
  })
}

// /core/file/getFileInfo/{fileId}
// 查询文件信息
export function getFileInfo(fileId) {
  return request({
    url: `/core/core/file/getFileInfo/${fileId}`,
    method: 'POST'
  })
}