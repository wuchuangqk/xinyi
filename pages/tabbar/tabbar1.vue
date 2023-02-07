<template>
	<view class="container">
		<button type="primary" @click="nav('/pages/leave-list/list')">请假列表</button>
		<button type="primary" @click="nav('/pages/jiaban/list')">加班列表</button>
		<button type="primary" @click="nav('/pages/leave/form')">请假申请</button>
		<button type="primary" @click="nav('/pages/login/login')">登录</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			href: 'https://uniapp.dcloud.io/component/README?id=uniui'
		}
	},
	onLoad() {
		if (uni.getStorageSync(this.$const.USER_STATUS) !== 1) {
			uni.reLaunch({
				 url: '/pages/login/login'
			});
		}
	},
	methods: {
		nav(url) {
			uni.navigateTo({
				url
			});
		}
	}
}
</script>

<style>
.container {
	padding: 20px;
	font-size: 14px;
	line-height: 24px;
}
</style>
