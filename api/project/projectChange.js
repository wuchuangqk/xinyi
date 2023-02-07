import {request} from '../../util/http.js'

// /project/tender/getPageList
// 获取项目招标列表
export function getPageList(projectId, pageIndex, pageSize) {
  return request({
    url: `/project/api/project/change/getPageList/{projectId}`,
    method: 'GET',
		data: {projectId, pageIndex, pageSize}
  })
}

// /project/tender/getById/{id}
// 查看项目招标
export function getById(changeId) {
  return request({
    url: `/project/api/project/change/getById/{changeId}`,
    method: 'GET',
		data: {changeId}
  })
}
// 根据合同id查合同码
export function getByContract(contractId) {
  return request({
    url: `/project/api/projectInfo/xmContract/getById/${contractId}`,
    method: 'GET',
  })
}
// 根据合同码查询统计数量
export function getDatasByContractCode(contractCode) {
  return request({
    url: `/project/api/project/change/getDatasByContractCode/{contractCode}`,
    method: 'GET',
		data: {contractCode}
  })
}
