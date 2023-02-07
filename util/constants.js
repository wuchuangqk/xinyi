
// 本地存储key的集合
export const storageKeys = {
	TOKEN: 'token', // 登录凭证
	USER_INFO: 'user_info', // 用户信息
	IS_LOGIN: 'is_login', // 登录状态标识,true=已登录，false=未登录
	USER_STATUS: 'user_status', // 临时工注册审核状态，值为空代表未注册，不为空代表已注册未审核
	CID: 'cid', // 客户端唯一标识，用于消息推送
	EMPLOYEE_INFO: 'employee_info',
	OA_PERMISSION: 'OA_PERMISSION', // oa平台的权限集合
	PROJECT_PERMISSION: 'PROJECT_PERMISSION', // 项目管理平台下的权限集合
	BADGE_COUNT: 'BADGE_COUNT', // 数字角标
	TEMP: 'TEMP',
	COPY_USER: 'COPY_USER', // 用于离职办理审批时选用户
	UNIT_CACHE: 'UNIT_CACHE', // 用于储存项目详情 => 资金申请 => 请款申请里用户录入过的收款单位信息
	CUSTOM_NAME_CACHE: 'CUSTOM_NAME_CACHE', // 用于储存项目详情 => 开票添加里用户录入过的客户名称信息
}

// 页面通信事件
export const events = {
	UPDATE_SCHEDULE:'UPDATE_SCHEDULE', // 更新首页日程和日程列表
	UPDATE_EXCHANGE_READ_STATE: 'UPDATE_EXCHANGE_READ_STATE', // 更新工作交流列表的阅读状态
	UPDATE_TODO_STATE: 'UPDATE_TODO_STATE', // 更新待处理事项
	UPDATE_NOTICE_READ_STATE: 'UPDATE_NOTICE_READ_STATE', // 更新首页通知公告和通知公告列表的阅读状态
	UPDATE_PROJECT_ATTEND: 'UPDATE_PROJECT_ATTEND', // 更新项目考勤列表页面
	UPDATE_HANDOVER_STATE: 'UPDATE_HANDOVER_STATE', // 更新项目交接列表状态
	UPDATE_WEN_XUAN_STATE: 'UPDATE_WEN_XUAN_STATE', // 更新今日永景列表阅读状态
	UPDATE_LEAVE_STATE: 'UPDATE_LEAVE_STATE', // 更新请假调休状态
	UPDATE_USER_INFO: 'UPDATE_USER_INFO', // 更新用户信息
	UPDATE_HOME_DATA: 'UPDATE_HOME_DATA', // 更新首页数据
	UPDATE_LEAVE_OFFICE_STATE: 'UPDATE_LEAVE_OFFICE_STATE', // 更新离职申请状态
	UPDATE_LEAVE_COPY: 'UPDATE_LEAVE_COPY', // 标识已执行请假抄送操作
	UPDATE_COPY_USERS: 'UPDATE_COPY_USERS', // 监听选择抄送用户页面返回的数据
	UPDATE_CLAIM_STATE: 'UPDATE_CLAIM_STATE', // 更新报销管理状态
	UPDATE_ALLOT_STATE: 'UPDATE_ALLOT_STATE', // 更新人员管理调拨状态
	UPDATE_MONEY_APPLY_STATE: 'UPDATE_MONEY_APPLY_STATE', // 更新请款管理状态
	UPDATE_INVOICE_STATE: 'UPDATE_INVOICE_STATE', // 更新开票添加状态
	UPDATE_SEAL_STATE: 'UPDATE_SEAL_STATE', // 更新用印管理状态
	UPDATE_CERTIFICATE_STATE: 'UPDATE_CERTIFICATE_STATE', // 更新证照管理状态
}

// 初始化数字角标对象
uni.setStorageSync(storageKeys.BADGE_COUNT,{
	notice: 0, // 通知公告
	todo_work: 0, // 待办事项
	todo_read: 0, // 待阅事项
	schedule: 0, // 日程
	exchange: 0 // 工作交流
})