<template>
	<view class="page">
		<!-- 行政考勤 -->
		<office-worker
			v-show="activeTabIndex === 0"
			:userInfo="userInfo"
			:attendanceSetting="attendanceSetting"
			:realTime="realTime"
			:punchRecords="punchRecords"
			:todayStr="todayStr"
			:status="status"
			:timeLineStatus="timeLineStatus"
			:punchButtonText="punchButtonText"
      :is-show-punch="isShowPunch"
			@doPunch="doPunch(0)"
      @doSupple="doSupple(0)"
		></office-worker>
		<!-- 外勤打卡 -->
		<outworker
			v-show="activeTabIndex === 1"
			:userInfo="userInfo"
			:attendanceSetting="attendanceSetting"
			:realTime="realTime"
			:punchRecords="punchRecords"
			:todayStr="todayStr"
			:status="status"
			:timeLineStatus="timeLineStatus"
			:punchButtonText="punchButtonText"
      :is-show-punch="isShowPunch"
			@doPunch="doPunch(1)"
      @doSupple="doSupple(1)"
		></outworker>
		<view class="tab">
			<view class="tab-item" v-for="(item, index) in tabItems" :key="index" :class="{ active: index === activeTabIndex }" @click="switchTab(index)">
				<icon-font :icon="item.icon" class="tab-icon"></icon-font>
				<text class="tab-name">{{ item.name }}</text>
			</view>
		</view>
		<neil-modal :show="showModel" title="提示" :content="modalContent" :show-cancel="false" align="center" @confirm="showModel = false" @close="showModel = false"></neil-modal>
	</view>
</template>

<script>
import NeilModal from '@/components/neil-modal/neil-modal.vue';
import { getOne, clock, getClockForDay, reissueSupply } from '../../api/system/attendance.js';
import IconFont from '@/components/icon-font.vue';
import Outworker from './outworker.vue';
import OfficeWorker from './officeworker.vue';
import dayjs from 'dayjs';
export default {
	components: {
		NeilModal,
		Outworker,
		OfficeWorker,
		IconFont
	},
	data() {
		return {
			tabItems: [
				{
					name: '打卡',
					icon: 'icon-waiqin',
					permissionKey: 'no-permission'
				},
				{
					name: '外勤打卡',
					icon: 'icon-waiqin1',
					permissionKey: 'no-permission'
				},
				{
					name: '统计',
					icon: 'icon-huizong',
					permissionKey: 'no-permission',
					isLink: true,
					linkUrl: '/pages/attendance/attendance-detail'
				}
			],
			activeTabIndex: 0, // 0=行政打卡，1=外勤打卡
			userInfo: {}, // 用户信息
			isEnableGPS: false, // 是否开启GPS
			address: null, // 当前用户定位地址
			status: 0, // 0=未开启GPS,1=进入考勤范围,2=不在考勤范围
			showModel: false,
			locationData: {}, // 用户当前实时位置信息
			attendanceSetting: {}, // 考勤设置
			realTime: '', // 实时时间
			timer: null,
			pulling: false, // 标记正在下拉刷新中
			punchRecords: {
				// 用户当天的打卡记录
				id: null,
				offAddress: null, // 下班打卡位置
				offWorkTime: null, // 下班打卡时间
				toAddress: null, // 上班打卡位置
				toWorkTime: null, // 上班打卡时间
				type: null, // 0=新政打卡，1=外勤打卡
				userId: null
			},
			todayStr: '',
			modalContent: '请打开手机定位功能来使用打卡',
			curTime: new Date(), // 记录此刻的时间变量
			isClick: false,
      isShowPunch: false, // 补卡：前一天打了上班卡但没有打下班卡，在上班时间点前可以补昨天的下班卡
		  yesterdayPunchRecord: {}, // 昨天的打卡记录
    };
	},
	async onLoad() {
		// 显示实时时间
		this.getRealTime();
		this.todayStr = dayjs().format('YYYY-MM-DD');
		this.userInfo = uni.getStorageSync(this.$const.USER_INFO);
		if (this.userInfo.headPath === null) {
			this.userInfo.headPath = '/static/img/default.jpg';
		}
		// 获取用户当天的打卡记录
		this.getPunchRecords();
		// 获取考勤设置
		await this.getAttendanceSetting();
    // 获取用户前一天的考勤记录
    this.getYesterdayAttend()
		// #ifdef APP-PLUS
		// 检查是否开启了GPS
		this.isEnableGPS = this.checkOpenGPSServiceByAndroid();
		if (!this.isEnableGPS) {
			this.status = 0;
			this.modalContent = '请打开手机定位功能来使用打卡';
			this.showModel = true;
			return;
		}
		this.getLocation().then(() => {
			this.getIsInAddressRange(this.locationData, this.attendanceSetting);
		});
		// #endif
	},
	onPullDownRefresh() {
		this.curTime = new Date();
		// #ifdef APP-PLUS
		this.pulling = true;
		// 当刷新的时候，重新检查GPS开启情况
		this.isEnableGPS = this.checkOpenGPSServiceByAndroid();
		if (!this.isEnableGPS) {
			this.status = 0;
			uni.stopPullDownRefresh();
			return;
		}
		// 更新用户位置
		this.getLocation().then(() => {
			this.getIsInAddressRange(this.locationData, this.attendanceSetting);
		});
		// #endif
	},
	watch: {
		status() {
			switch (this.status) {
				case 0:
					this.modalContent = '请打开手机定位功能来使用打卡';
					break;
				case 2:
					this.modalContent = '当前不在考勤范围内';
					break;
				case 3:
					this.modalContent = '当前不在打卡时间内';
					break;
			}
		}
	},
	computed: {
		// 根据当前时间变量来计算时间线状态
		// 1=上班打卡时间段，2=下班打卡时间段，3=未打卡
		timeLineStatus() {
			// 依赖attendanceSetting.upTimeNumRange
			if (!this.attendanceSetting.upTimeNumRange) {
				return 1;
			}
			// 是否在上班时间内
			if(this.isInRange(this.attendanceSetting.upTimeNumRange)) {
        // 如果上班时间内已完成打卡，时间线前进到下班
        if(this.punchRecords.toWorkTime) {
          return 2
        }
				return 1
			}else if(this.isInRange(this.attendanceSetting.downTimeNumRange)) {
				// 是否在下班时间内
				return 2
			}else {
				// 不在上班和下班时间内
				return 3
			}
		},
		punchButtonText() {
			if (this.punchRecords.offWorkTime) {
				return '打卡完成';
			}
			if (this.timeLineStatus === 1) {
				return '上班打卡';
			}
			if (this.timeLineStatus === 2) {
				return '下班打卡';
			}
			// 超出上下班时间内，且没有打卡，提示今日缺卡
			if (this.timeLineStatus === 3) {
				if (!this.punchRecords.toWorkTime || !this.punchRecords.offWorkTime) {
					return '今日缺卡';
				}
			}
		}
	},
	methods: {
    /**
     * 昨天的考勤记录
     */
    getYesterdayAttend() {
      if(!this.compareTime(this.attendanceSetting.startTime)) {
        getClockForDay(dayjs().subtract(1, 'day').format('YYYY-MM-DD'), this.userInfo.userId).then(res => {
          if (res) {
            if(res.toWorkTime && !res.offWorkTime) {
              this.isShowPunch = true
              this.yesterdayPunchRecord = res
            }
          }
        });
      }
    },
		getHourAndMinute(arr) {
			return {
				start: {
					hour: +arr[0].substr(0, 2),
					minute: +arr[0].substr(3, 2)
				},
				end: {
					hour: +arr[1].substr(0, 2),
					minute: +arr[1].substr(3, 2)
				}
			};
		},
    /**
     * 比较时分秒部分(当前时间比目标大返回true)
     * @param target
     */
    compareTime(target) {
      const targetHour = +target.substr(0, 2)
      const targetMinute = +target.substr(3, 2)
      const now = new Date()
      const nowHour = now.getHours()
      const nowMinute = now.getMinutes()
      return nowHour > targetHour || (nowHour === targetHour && nowMinute > targetMinute)
    },
		// 获取考勤设置
		async getAttendanceSetting() {
			const res = await getOne();
			// 上下班时间截取时和分
			// 上班打卡时间起止
			res.toStartTime = this.formatTime(res.toStartTime);
			res.toEndTime = this.formatTime(res.toEndTime);
			// 下班打卡时间起止
			res.offStartTime = this.formatTime(res.offStartTime);
			res.offEndTime = this.formatTime(res.offEndTime);
			res.offEndTimeBak = res.offEndTime === '00:00' ? '23:59' : res.offEndTime

			// 将起止时间字符串转成数字类型
			res.upTimeNumRange = this.getHourAndMinute([res.toStartTime, res.toEndTime]);
			res.downTimeNumRange = this.getHourAndMinute([res.offStartTime, res.offEndTimeBak]);
			// 将pc端百度地图bg-09坐标系转换城gcj-02坐标系
			const { latitude, longitude } = this.translate(res.longitude, res.latitude);
			res.latitude = latitude;
			res.longitude = longitude;
			this.attendanceSetting = res;
		},
		// 切换底部选项卡
		switchTab(tabIndex) {
			const tabItem = this.tabItems[tabIndex];
			if (tabItem.isLink) {
				uni.navigateTo({
					url: tabItem.linkUrl
				});
				return;
			}
			this.activeTabIndex = tabIndex;
		},
		// 检查是否开启了GPS
		checkOpenGPSServiceByAndroid() {
			let system = uni.getSystemInfoSync(); // 获取系统信息
			var context = plus.android.importClass('android.content.Context');
			var locationManager = plus.android.importClass('android.location.LocationManager');
			var main = plus.android.runtimeMainActivity();
			var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
			return mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER);
		},
		// 获取用户实时位置
		getLocation() {
			return new Promise((resolved, rejected) => {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: data => {
						this.locationData = data;
						const { province, city, district, street, poiName } = data.address;
						this.address = (city || '') + (district || '') + (street || '') + (poiName || '');
						resolved();
					},
					fail: err => {
						uni.showToast({
							title: '获取位置信息失败',
							icon: 'none'
						});
						rejected();
					},
					complete: () => {
						if (this.pulling) {
							this.pulling = false;
							uni.stopPullDownRefresh();
						}
					}
				});
			});
		},
		// 从给定的时分秒字符中截取时和分
		formatTime(target) {
			return target.substring(0, 5);
		},
		getRealTime() {
			this.realTime = dayjs().format('HH:mm:ss');
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.getRealTime();
			}, 1000);
		},
		// 百度db-09坐标转换gcj02坐标
		translate(bdLon, bdLat) {
			const x_pi = (3.14159265358979324 * 3000.0) / 180.0;
			const x = bdLon - 0.0065;
			const y = bdLat - 0.006;
			var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
			var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
			var gcjLon = z * Math.cos(theta);
			var gcjLat = z * Math.sin(theta);
			return {
				latitude: gcjLat,
				longitude: gcjLon
			};
		},
		// 判断是否在考勤范围内
		getIsInAddressRange(location1, location2) {
			var Lo1 = (location1.longitude * Math.PI) / 180.0;
			var Lo2 = (location2.longitude * Math.PI) / 180.0;
			var La1 = (location1.latitude * Math.PI) / 180.0;
			var La2 = (location2.latitude * Math.PI) / 180.0;
			var La3 = La1 - La2;
			var Lb3 = Lo1 - Lo2;
			var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
			s = s * 6378.137; //地球半径
			s = Math.round(s * 10000) / 10000;
			// s 单位千米
			// maxRange 覆盖物半径，地图层级19，比例尺20 半径 maxRange * 20
			if (s * 1000 <= this.attendanceSetting.maxRange * 20) {
				// status:1 = 进入考勤范围
				this.status = 1;
				return true;
			} else {
				// status:1 = 不在考勤范围
				this.status = 2;
				this.modalContent = '当前不在考勤范围内';
				return false;
			}

			// 执行回调
			// callback && callback()
		},
		isInRange(target) {
			const hour = new Date().getHours();
			const minute = new Date().getMinutes();
			const { start, end } = target;
			return (hour > start.hour || (hour === start.hour && minute >= start.minute))
			&& (hour < end.hour || (hour === end.hour && minute <= end.minute));
		},
		// 点击打卡 type:0=行政，1=外勤
		async doPunch(type) {
			if (this.isClick) {
				this.modalContent = '请稍后再试';
				this.showModel = true;
				return;
			}
			this.isClick = true;
			if (!this.isEnableGPS) {
				this.status = 0;
				this.modalContent = '请打开手机定位功能来使用打卡';
				this.showModel = true;
				this.isClick = false;
				return;
			}

			// 在上班打卡时间范围内
			if (this.isInRange(this.attendanceSetting.upTimeNumRange)) {
				// 在上班打卡时间内如果打过卡，此时已经进入到下班打卡，提示不在打卡时间内
				if (this.punchRecords.toWorkTime) {
					this.modalContent = '当前不在打卡时间内';
					this.showModel = true;
          this.isClick = false;
					return;
				}
			} else if (this.isInRange(this.attendanceSetting.downTimeNumRange)) {
				// 在下班打卡时间范围内如果打过卡，则提示已完成打卡
				if (this.punchRecords.offWorkTime) {
					this.modalContent = '今日已完成打卡，请勿重复打卡';
					this.showModel = true;
          this.isClick = false;
					return;
				}
			} else {
				// 不在以上两种时间范围内
				this.modalContent = '当前不在打卡时间内';
				this.showModel = true;
        this.isClick = false;
				return;
			}

			// 在打卡时间范围内，且没有打过卡
			// 如果用户保持在当前页面，并移动到新的位置，则提交时位置是一开始的位置
			// 因为用户位置信息仅在进入此页面和下拉刷新的时候获取，所以要再次获取用户位置信息来做更新

			// 先判断GPS是否开启
			this.isEnableGPS = this.checkOpenGPSServiceByAndroid();
			if (!this.isEnableGPS) {
				this.status = 0;
				this.modalContent = '请打开手机定位功能来使用打卡';
				this.showModel = true;
				this.isClick = false;
				return;
			}

			// 更新用户位置信息
			await this.getLocation();

			// 是1外勤直接提交
			if (type === 1) {
				this.doRequest(type);
			} else {
				// 是0行政需要判断是否在考勤范围内
				if (this.getIsInAddressRange(this.locationData, this.attendanceSetting)) {
					this.doRequest(type);
				} else {
					this.showModel = true;
					this.isClick = false;
				}
			}
		},
    // 补卡 type:0=行政，1=外勤
    async doSupple(type) {
      if (this.compareTime(this.attendanceSetting.startTime)) {
        this.modalContent = '已超出补卡时间点，无法补卡';
        this.showModel = true;
        this.isShowPunch = false
        return;
      }
      if (this.isClick) {
        this.modalContent = '请稍后再试';
        this.showModel = true;
        return;
      }
      this.isClick = true;
      if (!this.isEnableGPS) {
        this.status = 0;
        this.modalContent = '请打开手机定位功能来使用打卡';
        this.showModel = true;
        this.isClick = false;
        return;
      }

      // 先判断GPS是否开启
      this.isEnableGPS = this.checkOpenGPSServiceByAndroid();
      if (!this.isEnableGPS) {
        this.status = 0;
        this.modalContent = '请打开手机定位功能来使用打卡';
        this.showModel = true;
        this.isClick = false;
        return;
      }

      // 更新用户位置信息
      await this.getLocation();

      // 外勤不用判断范围
      if(type === 1) {
        this.doSupplement(type)
      }else {
        // 是0行政需要判断是否在考勤范围内
        if (this.getIsInAddressRange(this.locationData, this.attendanceSetting)) {
          this.doSupplement(type);
        } else {
          this.showModel = true;
          this.isClick = false;
        }
      }
    },
		doRequest(type) {
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			// 行政考勤使用固定位置
			clock({
				address: type === 0 ? '宁波永景金属科技有限公司' : this.address,
				id: this.punchRecords.id,
				type,
				userId: this.userInfo.userId
			})
				.then(res => {
					uni.hideLoading();
					// 刷新数据
					this.getPunchRecords();
					this.isClick = false
				})
				.catch(err => {
					uni.hideLoading();
					this.isClick = false
				});
		},
    /**
     * 补卡
     * @param type
     */
    doSupplement(type) {
      uni.showLoading({
        title: '正在提交',
        mask: true
      });
      // 行政考勤使用固定位置
      reissueSupply({
        address: type === 0 ? '宁波永景金属科技有限公司' : this.address,
        id: this.yesterdayPunchRecord.id,
        type,
        userId: this.userInfo.userId
      })
          .then(() => {
            uni.hideLoading();
            uni.showToast({
              title: '补卡成功',
              icon: 'none'
            })
            this.isShowPunch = false
            this.isClick = false;
          })
          .catch(() => {
            uni.hideLoading();
            uni.showToast({
              title: '补卡失败',
              icon: 'none'
            })
            this.isClick = false;
          });
    },
		// 获取用户当天的考勤数据
		getPunchRecords() {
			getClockForDay(this.todayStr, this.userInfo.userId).then(res => {
				if (res) {
					res.toWorkTime = res.toWorkTime === null ? null : dayjs(res.toWorkTime).format('HH:mm:ss');
					res.offWorkTime = res.offWorkTime === null ? null : dayjs(res.offWorkTime).format('HH:mm:ss');
					this.punchRecords = res;
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	// min-height: calc(100% - 51px);
	// background-color: $-bg-color;
	// padding: 1px 0 50px 0;
}

.tab {
	position: fixed;
	display: flex;
	left: 0;
	right: 0;
	bottom: 0;
	border-top: 1px solid #dadada;
	height: 50px;
	background-color: white;
	z-index: 99;

	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #a5a5a7;

		&.active {
			.tab-name,
			.tab-icon {
				color: #1989fa;
			}
		}
	}

	.tab-icon {
		font-size: 24px;
	}

	.tab-name {
		color: rgb(153, 153, 153);
		font-size: 10px;
		margin-top: 3px;
	}
}
</style>
