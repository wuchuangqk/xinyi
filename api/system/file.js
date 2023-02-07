import {request} from '../../util/http.js'

// /core/file/getFileInfo/{fileId}
// 查询文件信息
export function getFileInfo(fileId) {
  return request({
    url: `/core/core/file/getFileInfo/${fileId}`,
    method: 'post'
  })
}