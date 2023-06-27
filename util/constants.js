
// 本地存储key的集合
export const storageKeys = {
	TOKEN: 'token', // 登录凭证
	USER_INFO: 'user_info', // 用户信息
	IS_LOGIN: 'is_login', // 登录状态标识,1=已登录，0=未登录
	CID: 'cid', // 客户端唯一标识，用于消息推送
}

// dev(https)
// export const BASE_URL = 'https://36q635g350.zicp.fun'
export const BASE_URL = 'https://32736d0b.r5.cpolar.top'

// prod(http)
// export const BASE_URL = 'http://58.218.148.154:8090'