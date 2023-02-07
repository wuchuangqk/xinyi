<template>
	<view class="page">
		<uni-notice-bar showIcon="true" single="true" text="审核通过后，会给您的应用发送通知，请留意通知栏消息"></uni-notice-bar>
		<view class="content">
			<icon-font icon="icon-shijian" class="icon"></icon-font>
			<text>您的账号正在审核中</text>
			
		</view>

		<navigator url="/pages/login/login" class="foot-text">
			<text>去登录页面</text>
		</navigator>
	</view>
</template>

<script>
	import {
		getById
	} from '@/api/user.js'
	import IconFont from '@/components/icon-font.vue'

	export default {
		components: {
			IconFont
		},
		data() {
			return {}
		},
		onLoad() {
			// 查看用户状态
			return
			const {
				userId
			} = uni.getStorageSync(this.$const.USER_INFO)
			getById(userId).then(res => {
				// userState=1表示已通过审核
				if (res.userState === 1) {
					uni.showModal({
						title: '审核通过',
						content: '您注册的账号已通过审核，请重新登录',
						success: (result) => {
							if (result.confirm) {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							}
						}
					})
				}
			})
		},
		methods: {

		}
	}
</script>

<style scoped lang="scss">
	.page {
		min-height: 100%;
		background-color: $-bg-color;
		display: flex;
		flex-direction: column;
		// justify-content: center;
		// align-items: center;
		color: #00ad66;
		.content {
			flex:1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding-bottom: 60%;
		}
	}

	.icon {
		font-size: 86px;
		color: #00ad66;
		margin-bottom: 10px;
	}

	.foot-text {
		position: fixed;
		bottom: 5%;
		left: 0;
		right: 0;
		text-align: center;
		color: #1989fa;
	}
	
	.tip {
		font-size: 13px;
		color: gray;
	}
</style>
