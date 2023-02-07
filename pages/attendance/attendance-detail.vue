<template>
	<view class="page">
		<view class="search">
			<uni-search-bar
				v-if="permission"
				ref="search"
				placeholder="请输入姓名"
				:radius="100"
				clearButton="false"
				@confirm="searchName"
				@cancel="cancel"
			></uni-search-bar>
			<uni-datetime-picker style="width: 140px;" :border="false" type="date" v-model="searchParams.day" @change="search"></uni-datetime-picker>
		</view>
		<view class="list-item" v-for="(item, ind) in listData" :key="ind">
			<view class="user-name">
				<text>{{ item.userName }}</text>
			</view>
			<view class="time-line to-work">
				<view class="state" :class="{ active: item.toWorkTime !== null }"></view>
				<view class="content">
					<view class="time">
						<text class="time-label">上班打卡</text>
						<text v-if="item.toWorkTime">{{ item.toWorkTime }}</text>
						 <view v-if="item.isToLack" class="un-punch">缺卡</view>
					</view>
					<view v-if="item.toAddress" class="address">
						<text>{{ item.toAddress }}</text>
					</view>
				</view>
			</view>
			<view class="time-line">
				<view class="state" :class="{ active: item.offWorkTime !== null }"></view>
				<view class="content">
					<view class="time">
						<text class="time-label">下班打卡</text>
						<text v-if="item.offWorkTime">{{ item.offWorkTime }}</text>
						 <view v-if="item.isOffLack" class="un-punch">缺卡</view>
					</view>
					<view v-if="item.offAddress" class="address">
						<text>{{ item.offAddress }}</text>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="more" @clickLoadMore="handleReachBottom"></uni-load-more>
	</view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
import dayjs from 'dayjs';
import { getPageListForDay, getOne } from '@/api/system/attendance.js';
export default {
	components: {
		IconFont
	},
	data() {
		return {
			activeTabIndex: 0,
			listData: [],
			more: 'more',
			isLoadAll: false,
			loading: false,
			pulling: false, // 标记正在进行下拉刷新
			showSearch: false,
			searchParams: {
				day: '',
				userName: '',
				pageIndex: 1,
				pageSize: 10
			},
			today: null,
			attendanceSetting: null,
			status: null,
			permission: false, // 是否有查看所有的权限
			userId: null
		};
	},
	async onLoad() {
		this.today = this.searchParams.day = dayjs().format('YYYY-MM-DD');
		// 获取考勤设置
		await this.getAttendanceSetting();
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		this.permission = this.$hasPermission('xingzhengkaoqin', this.$const.OA_PERMISSION);
		this.fetchData();
	},
	onPullDownRefresh() {
		this.pulling = true;
		this.more = 'more';
		this.isLoadAll = false;
		this.searchParams.pageIndex = 1;
		this.listData.length = 0;
		this.fetchData();
	},
	onReachBottom() {
		this.handleReachBottom();
	},
	methods: {
		getTimeLineStatus() {
			// 是否在上班时间内
			if(this.isInRange(this.attendanceSetting.upTimeNumRange)) {
				return 1
			}else if(this.isInRange(this.attendanceSetting.downTimeNumRange)) {
				// 是否在下班时间内
				return 2
			}else {
				// 不在上班和下班时间内
				return 3
			}
		},
		isInRange(target) {
			const hour = new Date().getHours();
			const minute = new Date().getMinutes();
			const { start, end } = target;
			return (hour > start.hour || (hour === start.hour && minute >= start.minute))
			&& (hour < end.hour || (hour === end.hour && minute <= end.minute));
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
		async getAttendanceSetting() {
			const res = await getOne();
      if(res.offEndTime === '00:00:00') {
        res.offEndTime = '23:59:00'
      }
      // 将起止时间字符串转成数字类型
      res.upTimeNumRange = this.getHourAndMinute([res.toStartTime, res.toEndTime])
      res.downTimeNumRange = this.getHourAndMinute([res.offStartTime, res.offEndTime])
			this.attendanceSetting = res;
		},
		handleReachBottom() {
			if (this.loading || this.isLoadAll) {
				return;
			}
			this.loading = true;
			this.more = 'loading';
			this.searchParams.pageIndex++;
			this.fetchData();
		},
		fetchData() {
			if (this.searchParams.day === this.today) {
				this.status = this.getTimeLineStatus()
			}
			getPageListForDay(this.searchParams.day, this.searchParams.userName, this.searchParams.pageIndex, this.searchParams.pageSize).then(res => {
				if (!this.permission) {
					res.records = (res.records || []).filter(v => v.userId === this.userId);
				} else {
					res.records = res.records || [];
				}
				res.records.forEach(v => {
					v.toWorkTime = v.toWorkTime === null ? null : dayjs(v.toWorkTime).format('HH:mm:ss');
					v.offWorkTime = v.offWorkTime === null ? null : dayjs(v.offWorkTime).format('HH:mm:ss');
					 if (this.searchParams.day !== this.today) {
							v.isToLack = v.toWorkTime === null
							v.isOffLack = v.offWorkTime === null
						} else {
							v.isToLack = this.status !== 1 && v.toWorkTime === null
							v.isOffLack = this.status === 3 && v.offWorkTime === null
						}
				});
				this.isLoadAll = res.records.length === 0;
				this.more = this.isLoadAll ? 'noMore' : 'more';
				this.listData = this.listData.concat(res.records);
				if (this.pulling) {
					this.pulling = false;
					uni.stopPullDownRefresh();
				}
				this.loading = false;
			});
		},
		// 跳转到详情页面
		goDetail(item) {
			uni.navigateTo({
				url: `/pages/office/work-exchange/exchange-detail?infoId=${item.infoId}&isRead=${+item.readed}`
			});
		},
		search(e) {
			this.searchParams.day = e
			this.doSearch()
		},
		searchName(e) {
			this.searchParams.userName = e.value
			this.doSearch()
		},
		cancel(e) {
			this.searchParams.userName = ''
			this.doSearch()
		},
		clear(e) {
			this.searchParams.userName = ''
			this.doSearch()
		},
		doSearch() {
			this.searchParams.pageIndex = 1;
			this.listData.length = 0;
			this.fetchData();
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: calc(100% - 51px);
	background-color: $-bg-color;
	padding: 1px 0 50px 0;
}

.list-item {
	padding: 10px;
	background-color: white;
	margin: 10px;
	border-radius: 4px;

	.user-name {
		font-size: 15px;
		color: #333;
		margin-bottom: 20px;
	}
}

.search {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: white;
	padding: 0 10px 0 2px;

	.uni-searchbar {
		flex: 1;
		margin-right: 10px;
	}
}

.address {
	display: flex;

	.label {
		flex-shrink: 0;
	}
}

.time-line {
	padding-left: 20px;
	position: relative;
	margin-left: 10px;

	&.to-work {
		border-left: 1px solid #e4e4e4;
		padding-bottom: 15px;
	}

	.state {
		position: absolute;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background-color: #b1b1b1;
		left: -3.5px;
		top: -3.5px;

		&.active {
			background-color: #289cfe;
		}
	}

	.content {
		position: relative;
		top: -12px;
	}

	.time {
		font-size: 14px;
		color: #464646;
		margin-bottom: 5px;
		display: flex;
		// justify-content: space-between;
		.time-label {
			margin-right: 10px;
		}
	}

	.punch-time {
		font-weight: bold;
		margin-bottom: 10px;
	}

	.address {
		font-size: 14px;
		color: #9a9a9a;
	}
}

.un-punch {
	background: #f7e4c7;
	color: #f59a23;
	display: inline-block;
	font-size: 13px;
	width: 50px;
	height: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 10px;
}
</style>
