<template>
	<view>
		<view>
			<text>用户名：</text>
			<input type="text" v-model="formData.userLogin">
		</view>
		<view>
			<text>密码：</text>
			<input type="password" v-model="formData.password">
		</view>
		<view>
			<button @click="doLogin">登录</button>
			<button @click="test">测试本地推送</button>
		</view>
		<view>用户信息：{{userInfo}}</view>
		<view class="punch-card">
			<text class="title">上班打卡</text>
			<text class="sub-title">{{curTime}}</text>
		</view>
		<view>
			<text>{{userCurLocation}}</text>
		</view>
		<view>
			<text>是否在打卡范围内：{{isInRange}}</text>
		</view>
	</view>
</template>

<script>
	import {
		login,
		setToken
	} from '../../api/user.js'
	import {
		getOne
	} from '../../api/system/attendance.js'
	import moment from 'moment'
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				formData: {
					userLogin: '',
					password: ''
				},
				curTime: null,
				attendSetting: null, // 考勤设置
				isInRange: false, // 是否在打卡范围内
				userCurLocation: null, // 用户当前地理位置
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo;
			}
		},
		async created() {
			this.getCurTime()
			await this.getCurLocation()
			this.getAttendSetting()
		},
		methods: {
			// 获取当前时间
			getCurTime() {
				// console.log(dayjs)
				this.curTime = dayjs().format('HH:mm:ss')
				setTimeout(() => {
					this.getCurTime()
				}, 1000)
			},
			// 登录
			doLogin() {
				login(this.formData).then(res => {
					console.log('登录成功')
					this.$store.dispatch('setUserInfo', res.data)
					setToken({
						cid: this.$store.state.cid
					}).then(() => {
						console.log('绑定CID成功')
					})
				})
			},
			async test() {
				await this.getCurLocation()
				this.getAttendSetting()
			},
			// 获取考勤地理位置设置
			getAttendSetting() {
				getOne().then(res => {
					this.attendSetting = res
					this.getLocationDistance(this.userCurLocation, this.attendSetting)
				})
			},
			// 获取用户当前地理位置
			getCurLocation() {
				return new Promise((resolve) => {
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: (res) => {
							this.userCurLocation = res
							resolve()
						},
						fail: (err) => {
							console.log(err)
						}
					})
				})

			},
			// 获取两个坐标之间的距离
			getLocationDistance(location1, location2) {
				var Lo1 = location1.longitude * Math.PI / 180.0;
				var Lo2 = location2.longitude * Math.PI / 180.0;
				var La1 = location1.latitude * Math.PI / 180.0;
				var La2 = location2.latitude * Math.PI / 180.0;
				var La3 = La1 - La2;
				var Lb3 = Lo1 - Lo2;
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(
					Math.sin(Lb3 / 2), 2)));
				s = s * 6378.137; //地球半径  
				s = Math.round(s * 10000) / 10000;
				console.log(`考勤设置坐标：经度${location2.longitude} 纬度${location2.latitude}`)
				console.log(`用户实时坐标：经度${location1.longitude} 纬度${location1.latitude}`)
				console.log(`坐标差值${s * 1000}米，考勤范围半径${this.attendSetting.maxRange * 20}米`)
				// s 单位千米
				// maxRange 覆盖物半径，地图层级19，比例尺20 半径 maxRange * 20
				this.isInRange = s * 1000 <= this.attendSetting.maxRange * 20
			}
		}
	}
</script>

<style lang="scss">
	.punch-card {
		width: 220rpx;
		height: 220rpx;
		border-radius: 50%;
		background-color: #2DB630;
		color: #efefef;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		margin: 0 auto;
		padding: 50rpx 0;
		box-sizing: border-box;
		box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);

		.title {
			font-size: 40rpx;
		}

		.sub-title {
			font-size: 35rpx;
		}
	}
</style>
