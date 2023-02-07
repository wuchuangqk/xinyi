<template>
	<view class="page">
		<!-- app如果去掉原生导航栏，默认是全屏展示，会覆盖顶部状态栏，用一个空div作为占位来显示状态栏 -->
		<view class="status_bar"></view>
		<view class="decorate"></view>
		<view class="wrap">
			<view class="logo">
				<image mode="aspectFit" class="img" src="../../static/img/logo.png" alt="" />
			</view>
			<!-- <view class="app-name">扈阳铝材</view> -->
			<view class="login-container">
				<!-- <view class="tab-bar">
					<view class="tab-item" :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">登录</view>
					<view class="tab-item" :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'">注册</view>
					<view class="point-line" :class="activeTab === 'login' ? 'left' : 'right'"></view>
				</view> -->
				<view class="login-text">永景工务</view>
				<view v-show="activeTab === 'login'" class="form-container">
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
				<view v-show="activeTab === 'register'" class="form-container">
					<view class="form-item">
						<icon-font icon="icon-yonghu1"></icon-font>
						<input type="text" v-model="registerForm.userLogin" placeholder="请输入用户名" maxlength="50"
							style="font-size: 14px;" />
					</view>
					<view class="form-item">
						<icon-font icon="icon-yonghu"></icon-font>
						<input type="text" v-model="registerForm.userName" placeholder="请输入姓名" maxlength="10"
							style="font-size: 14px;" />
					</view>
					<view class="form-item">
						<icon-font icon="icon-mima1"></icon-font>
						<input type="password" v-model="registerForm.password" placeholder="请输入6-12位密码" maxlength="12"
							style="font-size: 14px;" />
					</view>
					<view class="form-item">
						<icon-font icon="icon-mima1"></icon-font>
						<input type="password" v-model="registerForm.rePwd" placeholder="请再次输入密码" maxlength="12"
							style="font-size: 14px;" />
					</view>
					<view class="form-item">
						<icon-font icon="icon-shouji"></icon-font>
						<input type="number" v-model="registerForm.mobile" placeholder="请输入手机号" maxlength="11"
							style="font-size: 14px;" />
					</view>
				</view>
				<button @click="submit" class="submit-btn" :loading="submitLoading">{{ activeTab === 'login' ? '登录' : '注册'
				}}</button>
			</view>
		</view>

		<view class="footer">
			<text>当前版本：{{ appVersion }}</text>
			<view style="margin-left: 20px;">
				技术支持：
				<text @click="handleClick">远颂科技</text>
			</view>
		</view>
		<neil-modal :show="showModel" title="CID" @confirm="showModel = false" @close="showModel = false">
			<view>
				<view style="text-align: center;">
					<text>{{ cid }}</text>
				</view>
				<view @click="copy" class="copy">复制</view>
			</view>
		</neil-modal>
	</view>
</template>

<script>
import { login, setToken, register, getByUserId, getById } from '../../api/user.js';
import { getMenuForUser } from '@/api/system/system.js';
import IconFont from '../../components/icon-font.vue';
import { isPhone, validPwd } from '@/util/validate.js';
import { savePermission } from '@/util/index.js';
import { uploadHost } from '@/util/http.js';
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
			registerForm: {
				userLogin: '',
				userName: '',
				password: '',
				rePwd: '',
				mobile: ''
			},
			activeTab: 'login',
			mode: 'login',
			submitLoading: false,
			appVersion: '',
			clickTime: 0,
			showModel: false,
			cid: null
		};
	},
	onLoad() {
	},
	methods: {
		// 登录
		async doLogin() {
			if (!this.checkLogin()) {
				this.submitLoading = false;
				return;
			}
			uni.removeStorageSync(this.$const.TOKEN);
			this.doGet('/users/login', {
				username: this.loginForm.userLogin,
				password: this.loginForm.password,
				os: 'android',
				packagename: 'com.bnp.yuansong',
				uuid: '1232333',
			}).then((res) => {
				uni.setStorageSync(this.$const.TOKEN, res.data.access_token)
				uni.setStorageSync(this.$const.USER_INFO, JSON.stringify(res.data))
				uni.setStorageSync(this.$const.USER_STATUS, 1); // 存储用户状态(2:审核中)
				uni.navigateTo({
					url: '/pages/index/index'
				});
			}).catch(err => {
				this.submitLoading = false;
				uni.showToast({
					title: err.message,
					icon: 'none'
				});
			});
		},
		// 注册
		doRegister() {
			if (!this.checkRegister()) {
				this.submitLoading = false;
				return;
			}
			register(this.registerForm)
				.then(res => {
					uni.setStorageSync(this.$const.TOKEN, res.accessToken);
					setToken({
						cid: uni.getStorageSync(this.$const.CID)
					}).then(() => {
						this.submitLoading = false;
						uni.showToast({
							title: '注册成功，请登录',
							icon: 'none'
						});
						this.loginForm.userLogin = this.registerForm.userLogin;
						this.activeTab = 'login';
						this.registerForm = {
							userLogin: '',
							userName: '',
							password: '',
							rePwd: '',
							mobile: ''
						};
					});
				})
				.catch(err => {
					this.submitLoading = false;
					this.registerForm.userLogin = '';
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				});
		},
		checkRegister() {
			if (this.registerForm.userLogin.trim().length === 0) {
				uni.showToast({
					title: '请输入用户名',
					icon: 'none'
				});
				return false;
			}
			if (!/^[a-zA-Z0-9]+$/.test(this.registerForm.userLogin)) {
				uni.showToast({
					title: '用户名只能使用数字和英文字母',
					icon: 'none'
				});
				return false;
			}
			if (this.registerForm.userName.trim().length === 0) {
				uni.showToast({
					title: '请输入姓名',
					icon: 'none'
				});
				return false;
			}
			if (this.registerForm.password.trim().length === 0) {
				uni.showToast({
					title: '请输入密码',
					icon: 'none'
				});
				return false;
			}
			if (!validPwd(this.registerForm.password)) {
				uni.showToast({
					title: '密码只能是6-12位数字、字母、下划线',
					icon: 'none'
				});
				return false;
			}
			if (this.registerForm.rePwd.trim().length === 0) {
				uni.showToast({
					title: '请再次输入密码',
					icon: 'none'
				});
				return false;
			}

			if (this.registerForm.password !== this.registerForm.rePwd) {
				uni.showToast({
					title: '两次密码输入不一致',
					icon: 'none'
				});
				return false;
			}
			if (!this.registerForm.mobile) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				return false;
			}
			if (!isPhone(this.registerForm.mobile)) {
				uni.showToast({
					title: '手机号格式有误',
					icon: 'none'
				});
				return false;
			}

			this.submitLoading = false;
			return true;
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
		submit() {
			if (this.submitLoading) {
				return;
			}
			this.submitLoading = true;
			if (this.activeTab === 'login') {
				this.doLogin();
			} else {
				this.doRegister();
			}
		},
		handleClick() {
			const temp = ++this.clickTime;
			if (temp > 6 && temp < 10) {
				uni.showToast({
					title: `还有${10 - temp}次`,
					icon: 'none'
				});
				return;
			}
			if (temp === 10) {
				this.showModel = true;
				this.clickTime = 0;
			}
		},
		copy() {
			uni.setClipboardData({
				//准备复制的数据
				data: this.cid,
				success: function (res) {
					uni.showToast({
						title: '已复制到剪贴板',
						icon: 'none'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.status_bar {
	// height: var(--status-bar-height);
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

/* .logo {
		height: 440rpx;
		width: 440rpx;
		border-radius: 50%;
		margin: 20rpx auto 0;
		.img {
			width: 100%;
			height: 100%;
		}
	} */

.app-name {
	color: white;
	font-size: 44rpx;
	font-weight: 600;
	letter-spacing: 7.2rpx;
	text-align: center;
	margin: 30rpx 0 50rpx;
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
