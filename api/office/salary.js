import {
 	request
 } from '../../util/http.js'

///payroll/getCompanyList
// 公司工资单查询
export function getCompanySalary(days, userId) {
  return request({
    url: `/oa/api/payroll/getCompanyList?days=${days}&userId=${userId}`,
    method: 'post',
  })
}

// /api/payroll/getWorkerList
// 工人工资单查询
export function getWorkerSalary(days, userId) {
  return request({
    url: `/oa/api/payroll/getWorkerList?days=${days}&userId=${userId}`,
    method: 'post',
  })
}

// /api/payroll/getById/{id}
// 工资单详情
export function setRead(id) {
  return request({
    url: `/oa/api/payroll/getById/${id}`,
    method: 'get',
  })
}