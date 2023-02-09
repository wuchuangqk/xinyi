<template>
	<view class="container">
		<button type="primary" @click="nav('/pages/leave-list/list')">请假列表</button>
		<button type="primary" @click="nav('/pages/jiaban/list')">加班列表</button>
		<button type="primary" @click="nav('/pages/leave/form')">请假申请</button>
		<button type="primary" @click="nav('/pages/login/login')">登录</button>
		<button type="primary" @click="nav('/pages/leave-list/leave-detail')">详情</button>
		<view>
			<text>版本号：{{ appVersion }}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			appVersion: ''
		}
	},
	onLoad() {
		if (uni.getStorageSync(this.$const.USER_STATUS) !== 1) {
			uni.reLaunch({
				url: '/pages/login/login'
			});
		}
	},
	onReday() {
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
			this.appVersion = widgetInfo.version;
		});
		// #endif
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
