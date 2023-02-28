<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view class="user-img">
					<view style="display: flex;justify-content: center;">
						<image class="img-wrap" :src="userInfo.avatar" mode="aspectFill" @error="imgErr"
							@click="previewImg(userInfo.avatar)"></image>
					</view>
					<view class="user-name">
						<text>{{ userInfo.name }}</text>
					</view>
				</view>
				<u-cell-group>
					<u-cell-item icon="grid" title="部门" :value="userInfo.depart" :arrow="false"></u-cell-item>
					<u-cell-item icon="account" title="职位" :value="userInfo.position" :arrow="false"></u-cell-item>
					<u-cell-item icon="thumb-up" title="绩效加分" @click="developing"></u-cell-item>
					<u-cell-item icon="thumb-down" title="绩效减分" @click="developing"></u-cell-item>
					<u-cell-item icon="lock" title="修改密码" @click="developing"></u-cell-item>
					<u-cell-item icon="setting" title="版本号" :value="appVersion" :arrow="false"></u-cell-item>
					<u-cell-item icon="info-circle" title="退出登录" @click="showConfirm = true"></u-cell-item>
				</u-cell-group>
				<view style="height: 10px"></view>
			</scroll-view>
		</view>
		<u-modal v-model="showConfirm" content="确认退出登录吗" show-cancel-button @confirm="exit"></u-modal>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {},
			showConfirm: false,
			appVersion: null
		};
	},
	onReady() {
		this.userInfo = uni.getStorageSync(this.$const.USER_INFO)
		if (!this.userInfo.avatar) {
			this.userInfo.avatar = '/static/img/default.jpg'
		}
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
			this.appVersion = widgetInfo.version;
		});
		// #endif
	},
	methods: {
		exit() {
			uni.showLoading({
				title: '正在退出',
				mask: true
			});
			this.doGet('/users/Logout')
			uni.removeStorageSync(this.$const.TOKEN);
			uni.removeStorageSync(this.$const.USER_INFO);
			uni.setStorageSync(this.$const.IS_LOGIN, 0);
			uni.hideLoading();
			uni.reLaunch({
				url: '/pages/login/login'
			});
		},
		imgErr() {
			this.userInfo.avatar = '/static/img/default.jpg';
		},
		/**图片预览
		 * @param {Object} imgSrc
		 */
		previewImg(imgSrc) {
			uni.previewImage({
				urls: [imgSrc],
				current: 0
			});
		},
		developing() {
			uni.showToast({ title: '正在开发中', icon: 'none' })
		}
	}
};
</script>

<style scoped lang="scss">
.user-img {
	padding: 40px 0 40px;
	background: url("/static/img/mg-card-bg.png") no-repeat;
	background-color: #3880ff;
	background-size: 100%;
	margin-bottom: 10px;
}

.img-wrap {
	width: 100px;
	height: 100px;
	margin: 0 auto;
	border-radius: 50%;
}

.user-name {
	font-size: 18px;
	text-align: center;
	color: white;
	margin-top: 15px;
}
</style>
