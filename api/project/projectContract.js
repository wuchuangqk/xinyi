import {
	request
} from '../../util/http.js'

// /api/projectInfo/xmContract/getByPage
// 工程合同表分页查询(根据项目Id查询的合同列表)
export function list(projectId, pageIndex, pageSize) {
	return request({
		url: `/project/api/projectInfo/xmContract/getByPage`,
		method: 'get',
		data: {
			projectId,
			pageIndex,
			pageSize
		}
	})
}

// /api/projectInfo/xmContract/getById/{id}
// 工程合同表详情
export function getById(id) {
	return request({
		url: `/project/api/projectInfo/xmContract/getById/${id}`,
		method: 'get'
	})
}

// /api/projectInfo/xmContract/getContractCodeMap
// 获取合同码下拉框
export function getContractCodeMap(projectId) {
	return request({
		url: `/project/api/projectInfo/xmContract/getContractCodeMap`,
		method: 'get',
		data: {
			projectId
		}
	})
}

// /api/project/tender/getContractCodeMap
// 获取招标码下拉框
export function getTenderCodeMap(projectId) {
	return request({
		url: `/project/api/project/tender/getContractCodeMap`,
		method: 'get',
		data: {
			projectId
		}
	})
}

// /api/manager/param/getSysProjectPayTypeMap
// 获取合同支付方式下拉框
export function getSysProjectPayTypeMap() {
	return request({
		url: `/project/api/manager/param/getSysProjectPayTypeMap`,
		method: 'get',
	})
}

// /project/xmContractPay/getByPage/{contractId}
// 合同支付表分页查询（根据合同Id查询支付信息）
export function getContractPay(contractId) {
	return request({
		url: `/project/project/xmContractPay/getByPage/${contractId}`,
		method: 'get',
		data: {
			pageIndex: 1,
			pageSize: 9999
		}
	})
}

// /api/project/change/getPageList/{projectId}
// 获取工程变更列表
export function getProjectChange(projectId, contractId) {
	return request({
		url: `/project/api/project/change/getPageList/{projectId}`,
		method: 'get',
		data: {
			projectId,
			contractId,
			pageIndex: 1,
			pageSize: 9999
		}
	})
}

// /api/projectInfo/xmContract/getContractSpeedMap
// 获取进度类型下拉框
export function getContractSpeedMap() {
	return request({
		url: `/project/api/projectInfo/xmContract/getContractSpeedMap`,
		method: 'get',
	})
}

// /api/projectInfo/xmContract/queryContractListByContractId/{contractId}
// 获取补充合同列表(根据项目Id查询的补充合同列表)
export function queryContractListByContractId(contractId) {
	return request({
		url: `/project/api/projectInfo/xmContract/queryContractListByContractId/${contractId}`,
		method: 'get',
		data: {
			pageIndex: 1,
			pageSize: 9999
		}
	})
}

// /project/xmContractSpeed/querySpeedListByContractId/{contractId}
// 根据合同Id 查询关联的合同进度数据
export function querySpeedListByContractId(contractId) {
	return request({
		url: `/project/project/xmContractSpeed/querySpeedListByContractId/${contractId}`,
		method: 'get',
		data: {
			pageIndex: 1,
			pageSize: 9999
		}
	})
}

// /project/xmContractPenalty/queryBondPayFinancial
// 保证金支付
export function queryBondPayFinancial(contractId) {
	return request({
		url: `/project/project/xmContractPenalty/queryBondPayFinancial`,
		method: 'get',
		data: {
			contractId,
			pageIndex: 1,
			pageSize: 9999
		}
	})
}

// /project/xmContractPenalty/queryGuaranteePayFinancial
// 保函信息
export function queryGuaranteePayFinancial(contractId) {
	return request({
		url: `/project/project/xmContractPenalty/queryGuaranteePayFinancial`,
		method: 'get',
		data: {
			contractId,
			pageIndex: 1,
			pageSize: 9999
		}
	})
}

// 合同支付
export function getByPage(contractId) {
	return request({
		url: `/project/project/xmContractPay/getByPage/${contractId}`,
		method: 'get',
		data: {
			pageIndex: 1,
			pageSize: 9999
		}
	})
}
