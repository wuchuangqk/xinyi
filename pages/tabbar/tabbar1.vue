<template>
	<view class="container">
		<button type="primary" @click="nav('/pages/leave/list')">请假列表</button>
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
