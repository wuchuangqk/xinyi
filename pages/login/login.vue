<template>
	<view class="page">
		<!-- app如果去掉原生导航栏，默认是全屏展示，会覆盖顶部状态栏，用一个空div作为占位来显示状态栏 -->
		<view class="status_bar"></view>
		<view class="decorate"></view>
		<view class="wrap">
			<view class="logo">
				<image mode="aspectFit" class="img" src="/static/img/company.png" alt="" />
			</view>
			<view class="login-container">
				<view class="login-text">新沂城投内部办公平台</view>
				<view class="form-container">
					<view class="form-item">
						<icon-font icon="icon-yonghu1"></icon-font>
						<input type="text" v-model="loginForm.userLogin" placeholder="请输入用户名" maxlength="50"
							style="font-size: 14px;" />
					</view>
					<view class="form-item">
						<icon-font icon="icon-mima1"></icon-font>
						<input type="password" v-model="loginForm.password" placeholder="请输入密码" maxlength="12"
							style="font-size: 14px;" />
					</view>
				</view>
				<button @click="doLogin" class="submit-btn">登录</button>
			</view>
		</view>

		<view class="footer">
			<text>当前版本：{{ appVersion }}</text>
			<view style="margin-left: 20px;">
				技术支持：
				<text>远颂科技</text>
			</view>
		</view>
	</view>
</template>

<script>
import IconFont from '../../components/icon-font.vue';
import { validPwd } from '@/util/validate.js';
export default {
	components: {
		IconFont
	},
	data() {
		return {
			loginForm: {
				userLogin: '',
				password: ''
			},
			appVersion: '',
		};
	},
	onLoad() {
	},
	onReady() {
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
			this.appVersion = widgetInfo.version;
		});
		// #endif
	},
	methods: {
		// 登录
		async doLogin() {
			if (!this.checkLogin()) {
				this.submitLoading = false;
				return;
			}
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			uni.removeStorageSync(this.$const.TOKEN);
			this.doGet('/users/login', {
				username: this.loginForm.userLogin,
				password: this.loginForm.password,
				os: 'android',
				packagename: 'com.bnp.yuansong',
				uuid: '1232333',
			}).then((res) => {
				uni.hideLoading();
				uni.setStorageSync(this.$const.TOKEN, res.data.access_token)
				uni.setStorageSync(this.$const.USER_INFO, res.data)
				uni.setStorageSync(this.$const.IS_LOGIN, 1); // 标识已登录
				uni.switchTab({
					url: '/pages/tabbar/tabbar1'
				});
			}).catch(err => {
				uni.hideLoading();
			});
		},
		checkLogin() {
			if (this.loginForm.userLogin.trim().length === 0) {
				uni.showToast({
					title: '请输入用户名',
					icon: 'none'
				});
				return false;
			}
			if (this.loginForm.password.trim().length === 0) {
				uni.showToast({
					title: '请输入密码',
					icon: 'none'
				});
				return false;
			}
			if (!validPwd(this.loginForm.password)) {
				uni.showToast({
					title: '密码只能是6-12位数字、字母、下划线',
					icon: 'none'
				});
				return false;
			}
			return true;
		},
	}
};
</script>

<style lang="scss">
.status_bar {
	width: 100%;
}

.page {
	height: 100%;
	position: relative;

	.decorate {
		position: fixed;
		top: -10%;
		left: 50%;
		transform: translateX(-50%);
		background-image: linear-gradient(to right, #4788ff, #54c7f3);
		height: 60%;
		width: 150%;
		border-radius: 50%;
	}
}

.wrap {
	height: 100%;
	z-index: 1;
	position: relative;
	overflow: hidden;
}

.login-container {
	border-radius: 30rpx;
	box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
	padding: 60rpx 40rpx 80rpx;
	width: 80%;
	margin: 0 auto;
	background-color: white;

	.tab-bar {
		display: flex;
		border-bottom: 4rpx solid #e4e4e4;
		position: relative;
		line-height: 80rpx;

		.tab-item {
			flex: 1;
			text-align: center;
			color: gray;

			&.active {
				color: #5194f7;
			}
		}

		.point-line {
			height: 6rpx;
			background-color: #5194f7;
			position: absolute;
			bottom: -4rpx;
			border-radius: 6rpx 6rpx 0 0;
			transition: all 0.2s;

			&.left {
				left: 0;
				right: 50%;
			}

			&.right {
				left: 50%;
				right: 0;
			}
		}
	}

	.form-container {
		margin-top: 60rpx;

		.form-item {
			border-bottom: 4rpx solid #f7f7f7;
			padding: 10rpx;
			margin-top: 30rpx;
			display: flex;
			align-items: center;

			.iconfont {
				margin-right: 20rpx;
				color: gray;
			}
		}

		.uni-input-input {
			color: #333;
		}

		.input-placeholder {
			color: gray;
		}
	}

	.submit-btn {
		display: block;
		background-image: linear-gradient(to right, #4788ff, #54c7f3);
		color: white;
		font-size: 28rpx;
		border-radius: 40rpx;
		margin-top: 40rpx;
	}
}

.img {
	margin: 0 auto;
	display: block;
	width: 30%;
}

.footer {
	position: fixed;
	z-index: 2;
	bottom: 0;
	left: 0;
	right: 0;
	text-align: center;
	display: flex;
	justify-content: center;
	font-size: 14px;
	color: gray;
	padding-bottom: 20px;
}

.copy {
	text-align: right;
	color: #1989fa;
	margin: 10px;
}

.login-text {
	font-size: 18px;
	text-align: center;
}
</style>
