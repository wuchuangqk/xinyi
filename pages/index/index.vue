<template>
	<view class="page">
		<view class="top">
			<uni-notice-bar v-if="scrollText" :scrollable="scrollable" single="true" :speed="30" :text="scrollText"></uni-notice-bar>
			<view class="tab">
				<view v-for="(item, index) in tabItems" :key="index" class="tab-item" :class="{ active: index === curTabIndex }" @click="curTabIndex = index">
					<text class="tab-name">{{ item.name }}</text>
					<view v-show="index === curTabIndex" class="line"></view>
					<view class="mark" v-if="item.markCount !== 0">
						<text class="mark-count">{{ item.markCount }}</text>
					</view>
				</view>
			</view>
		</view>

		<swiper :current="curTabIndex" :duration="300" @change="onswiperchange" class="swiper">
			<!-- 我的考勤 -->
			<swiper-item class="swiper-item">
				<mescroll-uni @init="e => init(e, 'attend')" @down="pullDown('attend')" :up="upOption" :down="downOption">
					<view class="wrap"><attend-calendar @update-count="updateCount" @load-done="handlePullEnd" ref="attend-calendar"></attend-calendar></view>
				</mescroll-uni>
			</swiper-item>
			<!-- 通知公告 -->
			<swiper-item class="swiper-item">
				<mescroll-uni @init="e => init(e, 'notice')" @down="pullDown('notice')" :up="upOption" :down="downOption">
					<view class="wrap"><new-notice @update-count="updateCount" @load-done="handlePullEnd" ref="new-notice"></new-notice></view>
				</mescroll-uni>
			</swiper-item>
			<!-- 待办事项 -->
			<swiper-item class="swiper-item">
				<mescroll-uni @init="e => init(e, 'schedule')" @down="pullDown('schedule')" :up="upOption" :down="downOption">
					<view class="wrap"><schedule-week type="week" @update-count="updateCount" @load-done="handlePullEnd" ref="schedule-week"></schedule-week></view>
				</mescroll-uni>
				<scroll-view scroll-y="true"></scroll-view>
			</swiper-item>
			<!-- 今日永景 -->
			<swiper-item class="swiper-item">
				<mescroll-uni @init="e => init(e, 'wen-xuan')" @down="pullDown('wen-xuan')" :up="upOption" :down="downOption">
					<view class="wrap"><wen-xuan @update-count="updateCount" @load-done="handlePullEnd" ref="wen-xuan"></wen-xuan></view>
				</mescroll-uni>
			</swiper-item>
		</swiper>
		<neil-modal
			:show="showModel"
			:autoClose="false"
			title="提示"
			content="检测到APP有新的版本,是否立即更新"
			align="center"
			@confirm="downloadApp"
			@close="showModel = false"
		></neil-modal>
	</view>
</template>

<script>
import ScheduleWeek from './schedule-week.vue';
import NewNotice from './new-notice.vue';
import ToDoRead from './to-do-read.vue';
import ToDoWork from './to-do-work.vue';
import NeilModal from '@/components/neil-modal/neil-modal.vue';
import { getReminder } from '@/api/office/other.js';
import { uploadHost } from '@/util/http.js';
import AttendCalendar from './month-calendar.vue';
import WenXuan from './wen-xuan.vue';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';

// #ifdef APP-PLUS
import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
// #endif
export default {
	components: {
		ScheduleWeek,
		NewNotice,
		ToDoRead,
		ToDoWork,
		NeilModal,
		AttendCalendar,
		WenXuan
	},
	mixins: [MescrollMixin],
	data() {
		return {
			unEnableGPSText: '天气数据需要获取您的地理位置，请开启GPS定位服务。', // 用户未开启定位的提示文字
			isEnableGPS: true,
			districtName: '', // 某某市的某某区
			weather: {
				type: '', // 晴天、阴天、多云等
				temperature: '' // 温度
			},
			today: '',
			weekMap: {
				0: '星期日',
				1: '星期一',
				2: '星期二',
				3: '星期三',
				4: '星期四',
				5: '星期五',
				6: '星期六'
			},
			tabItems: [
				{
					name: '我的考勤',
					markCount: 0
				},
				{
					name: '通知公告',
					markCount: 0
				},
				{
					name: '待办事项',
					markCount: 0
				},
				{
					name: '今日永景',
					markCount: 0
				}
			],
			curTabIndex: 0,
			loadingCount: 4, // 下拉刷新结束的条件个数(1.日程，2.未读通知，3.待办，4.待阅，5.天气)
			download_url: null, // app下载地址
			showModel: false,
			scrollText: '', // 顶部滚动文字
			pullState: {
				attend: {
					controller: null,
					pulling: false
				},
				notice: {
					controller: null,
					pulling: false
				},
				schedule: {
					controller: null,
					pulling: false
				},
				'wen-xuan': {
					controller: null,
					pulling: false
				}
			},
			freshing: false,
			triggered: false,
			mescroll: null,
			upOption: {
				use: false
			},
			downOption: {
				inOffsetRate: 0.5
			},
			username: null,
			scrollable: true
		};
	},
	computed: {
		pushMessage() {
			return this.$store.state.pushMessage;
		}
	},
	created() {
		uni.$on(this.$events.UPDATE_HOME_DATA,()=> {
			// 更新温馨提示
			this.getReminderText()
		})
		this.today = this.$dayjs().format('M月D日') + '  ' + this.weekMap[new Date().getDay()];
		this.username = uni.getStorageSync(this.$const.USER_INFO).userName;
		// 检测app升级
		// #ifdef APP-PLUS
		const isLogin = uni.getStorageSync(this.$const.IS_LOGIN);
		if (isLogin) {
			APPUpdate();
		}
		// #endif
		this.getReminderText()
	},
	methods: {
		// 温馨提示
		getReminderText() {
			getReminder(uni.getStorageSync(this.$const.USER_INFO).userId).then(res => {
				if (res) {
					this.scrollText = res.remark;
					this.scrollable = true;
				} else {
					this.scrollable = false;
					const hour = new Date().getHours();
					if (hour >= 4 && hour < 9) {
						this.scrollText = '早上好，' + this.username;
					} else if (hour >= 9 && hour < 12) {
						this.scrollText = '上午好，' + this.username;
					} else if (hour >= 12 && hour < 14) {
						this.scrollText = '中午好，' + this.username;
					} else if (hour >= 14 && hour < 18) {
						this.scrollText = '下午好，' + this.username;
					} else {
						this.scrollText = '晚上好，' + this.username;
					}
				}
			});
		},
		gotoPage(type) {
			if (type === 0) {
				uni.navigateTo({
					url: '/pages/leave-list/leave'
				});
			} else if (type === 1) {
				uni.navigateTo({
					url: '/pages/leave-list/leave-detail'
				});
			} else if (type === 2) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
		},
		// 更新角标数量
		updateCount({ index, count }) {
			this.tabItems[index].markCount = count;
		},
		refresh() {
			this.$refs['attend-calendar'].getSchedule();
			this.$refs['wen-xuan'].fetchData();
		},
		downloadApp() {
			uni.showLoading({
				title: '正在下载更新文件',
				mask: true
			});
			const downloadTask = uni.downloadFile({
				url: uploadHost.oa + this.download_url,
				success: downloadResult => {
					if (downloadResult.statusCode === 200) {
						plus.runtime.install(
							downloadResult.tempFilePath,
							{
								force: false
							},
							function() {
								console.log('install success...');
								plus.runtime.restart();
							},
							function(e) {
								console.error('install fail...');
								uni.showToast({
									title: '下载更新文件失败',
									icon: 'none'
								});
							}
						);
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			});
			downloadTask.onProgressUpdate(res => {
				console.log('下载进度' + res.progress);
			});
		},
		init(e, type) {
			this.pullState[type].controller = e;
		},
		onswiperchange(e) {
			this.curTabIndex = e.target.current;
		},
		pullDown(type) {
			if (!this.pullState[type].pulling) {
				this.pullState[type].pulling = true;
			}
			switch (type) {
				case 'attend':
					this.$refs['attend-calendar'].reload();
					break;
				case 'notice':
					this.$refs['new-notice'].reload();
					break;
				case 'schedule':
					this.$refs['schedule-week'].reload();
					break;
				case 'wen-xuan':
					this.$refs['wen-xuan'].reload();
					break;
			}
		},
		handlePullEnd({ type }) {
			if (this.pullState[type].pulling) {
				this.pullState[type].pulling = false;
				this.pullState[type].controller.endSuccess();
			}
			// this.mescroll.endSuccess();
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	height: 100%;
	background-color: $-bg-color;
	display: flex;
	flex-direction: column;
	.top {
		padding-top: 1px;
		flex-shrink: 0;
	}
	.swiper {
		flex: 1;
	}
}

/* .swiper-item {
	overflow: auto;
} */

.weather {
	font-size: 16px;
	background-color: white;
	padding: 10px 15px 20px 15px;
	margin-top: $-space-height;

	.weather-info {
		display: flex;
		justify-content: space-between;
	}
}

.tab {
	display: flex;
	background-color: white;
	padding: 10px;

	.tab-item {
		flex: 1;
		position: relative;
		color: #8c8c8c;
		text-align: center;

		&.active {
			color: #171717;
			font-weight: bold;
		}
	}

	.line {
		position: absolute;
		background-color: #1989fa;
		left: 50%;
		transform: translateX(-50%);
		width: 25%;
		height: 3px;
		border-radius: 2px;
		bottom: -6px;
	}

	.mark {
		position: absolute;
		top: -8px;
		right: -3px;
		width: 18px;
		height: 18px;
		border-radius: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #ff2727;
		color: white;
		font-size: 11px;
		font-weight: bold;
	}
}

.tab-content {
	padding-bottom: 10px;
}
/deep/ uni-scroll-view {
	height: 100%;
}
.wrap {
	padding: 8px 0;
}
</style>
