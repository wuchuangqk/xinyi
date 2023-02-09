<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<view class="calendar-header">
				<view class="left arrow" @click="switchDate(false)"><uni-icons type="arrowleft" size="16" color="#ffffff"></uni-icons></view>
				<view class="center">
					<text>{{ curYear }}年{{ curMonth }}月</text>
				</view>
				<view class="right arrow" @click="switchDate(true)"><uni-icons type="arrowright" size="16" color="#ffffff"></uni-icons></view>
			</view>
			<view class="calendar-body">
				<view class="row">
					<view class="col" v-for="week in weeks">{{ week }}</view>
				</view>
				<view class="row" v-for="row in dateArr">
					<view class="col" v-for="date in row">
						<view
							class="date"
							:class="{
								today: date.value === todayStr,
								active: date.value === selectedDate,
								'not-in-cur-month': !date.inCurMonth
							}"
							@click="selectDate(date)"
						>
							{{ date.date }}
							<!-- <view class="dot" :class="scheduleMap.get(date.value) ? scheduleMap.get(date.value).allComplete ? 'blue' : 'green' : ''" v-show="!!scheduleMap.get(date.value)"></view>
						 -->
							<view class="mark" v-if="getUnFinishCount(date.value)">
								<view class="mark-count">{{ getUnFinishCount(date.value) }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 日程列表 -->
		<view v-show="todaySchedulePlan.length !== 0" class="card">
			<view class="schedule-list">
				<uni-swipe-action>
					<uni-swipe-action-item
						v-for="(item, index) in todaySchedulePlan"
						:right-options="getOption(item)"
						@click="e => onClick(e, item)"
						class="schedule-item"
						:class="stateMap[item.state].class"
					>
						<view class="inner" @click.stop="showDetail(item)">
							<view class="schedule-time">{{ item.startTimeFmt }} - {{ item.endTimeFmt }}</view>
							<view class="schedule-title">{{ item.title }}</view>
							<view class="state" :class="stateMap[item.state].class">{{ stateMap[item.state].text }}</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</view>

		<view class="float-button" @click="gotoForm"><uni-icons type="plusempty" size="22" color="#ffffff"></uni-icons></view>
		<neil-modal :show="showModel" title="提示" content="确定删除吗" confirmColor="#dd524d" align="center" @confirm="delSchedule" @close="showModel = false"></neil-modal>
	</view>
</template>

<script>
import ScheduleWeek from '@/pages/index/schedule-week.vue';
import NeilModal from '@/components/neil-modal/neil-modal.vue';
import dayjs from 'dayjs';
// import { getListByMonth, deleteMethod } from '@/api/core/schedule.js';
export default {
	components: {
		ScheduleWeek,
		NeilModal
	},
	data() {
		return {
			weeks: ['一', '二', '三', '四', '五', '六', '日'],
			curMonthDateArr: [],
			curYear: null,
			curMonth: null,
			dateArr: [],
			currentDate: '',
			today: new Date(), // 今天
			todayStr: dayjs().format('YYYY-MM-DD'),
			todaySchedulePlan: [],
			scheduleMap: new Map(),
			selectedDate: '', // 用户点击的日期
			monthLastDate: null, // 本月最后一天是几号
			curYearMonth: null,
			options: [
				{
					text: '编辑',
					style: {
						backgroundColor: '#007aff'
					}
				},
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			noEditOptions: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			showModel: false,
			delScheduleId: null,
			stateMap: {
				0: {
					text: '待接收',
					class: 's1'
				},
				1: {
					text: '已接收',
					class: 's2'
				},
				2: {
					text: '已完成',
					class: 's3'
				}
			},
			userId: null
		};
	},
	onLoad() {
		uni.$on(this.$events.UPDATE_SCHEDULE, () => {
			this.getSchedule();
		});
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		this.selectedDate = this.todayStr;
		const date = new Date();
		this.curYear = date.getFullYear();
		this.curMonth = date.getMonth() + 1;
		this.curYearMonth = this.curYear + '-' + this.curMonth;

		this.initMonth();
		// 获取日程
		this.getSchedule();
	},
	computed: {
		yearMonth() {
			return dayjs(this.curYear + '-' + this.curMonth).format('YYYY-MM');
		},
		yearMonthDay() {
			return dayjs(this.curYear + '-' + this.curMonth + '-1').format('YYYY-MM-DD');
		}
	},
	methods: {
		initMonth() {
			this.monthLastDate = dayjs(this.yearMonthDay)
				.endOf('month')
				.date();
			// 获取本月一号是周几
			let week = new Date(this.yearMonthDay).getDay();
			// 0是周日
			week = week === 0 ? 7 : week;
			let beforeDate = [];
			let afterDate = [];
			beforeDate = this.fillBeforeDate(this.yearMonthDay, week);
			afterDate = this.fillOther(this.yearMonthDay, week);
			afterDate[0] = beforeDate.concat(afterDate[0].filter(v => v));
			this.dateArr = afterDate;
		},
		// 往前填充
		fillBeforeDate(date, week) {
			const arr = [];
			for (let i = week; i > 1; i--) {
				arr.push({
					inCurMonth: false,
					value: dayjs(date)
						.subtract(i - 1, 'day')
						.format('YYYY-MM-DD'),
					date: dayjs(date)
						.subtract(i - 1, 'day')
						.date()
				});
			}
			return arr;
		},
		// 补足下个月的
		fillNextMonth(monthLastDate, appendLength) {
			const result = [];
			let nextMonth = null;
			if (this.curMonth + 1 > 12) {
				// 下年一月一号
				nextMonth = this.curYear + 1 + '-' + '1-1';
			} else {
				// 本月下月一号
				nextMonth = this.curYear + '-' + (this.curMonth + 1) + '-1';
			}
			let point = dayjs(nextMonth);
			for (let i = 0; i < appendLength; i++) {
				result.push({
					inCurMonth: false,
					value: point.add(i, 'day').format('YYYY-MM-DD'),
					date: point.add(i, 'day').date()
				});
			}
			return result;
		},
		// 从周一往后填充
		fillOther(date, week) {
			const arr = [];
			// 第一行的数组长度
			let row = new Array(week - 1);
			arr.push(row);
			// 当月第一天
			let point = dayjs(date);
			// 判断此日期是否在本月份内
			let inCurMonthRange = true;
			while (inCurMonthRange) {
				if (point.date() === this.monthLastDate) {
					inCurMonthRange = false;
				}
				// 填充已有数据行
				if (row.length !== 7) {
					row.push({
						inCurMonth: true,
						value: point.format('YYYY-MM-DD'),
						date: point.date()
					});
					// 日期递增一天
					point = this.getNextDate(point);
				} else {
					// 添加新的数据行
					row = [];
					arr.push(row);
					row.push({
						inCurMonth: true,
						value: point.format('YYYY-MM-DD'),
						date: point.date()
					});
					point = this.getNextDate(point);
				}
			}
			// 补足6行
			// 先计算剩余还需多少个
			const totalRow = 6; // 一共展示六行
			const weekDays = 7; // 每行展示7天
			// 不足六行的7天，加上还剩几天够7天
			const needCount = (totalRow - arr.length) * weekDays + (weekDays - arr[arr.length - 1].length);
			const nextArr = this.fillNextMonth(
				dayjs()
					.add(1, 'month')
					.set('date', 1),
				needCount
			);
			for (let i = 0; i < nextArr.length; i++) {
				if (row.length !== 7) {
					row.push(nextArr[i]);
				} else {
					row = [];
					arr.push(row);
					row.push(nextArr[i]);
				}
			}

			return arr;
		},
		getNextDate(date) {
			return date.add(1, 'day');
		},
		// 根据月份获取日程计划
		getSchedule() {
			getListByMonth(this.yearMonth).then(res => {
				this.scheduleMap = new Map();
				res.forEach(val => {
					val.startTimeBak = val.startTime;
					val.endTimeBak = val.endTime;
					val.startTimeFmt = dayjs(val.startTime).format('HH:mm');
					val.endTimeFmt = dayjs(val.endTime).format('HH:mm');
					val.startTime = dayjs(val.startTime).format('YYYY-MM-DD');
					val.endTime = dayjs(val.endTime).format('YYYY-MM-DD');
					const dayDiff = Math.floor((new Date(val.endTime).getTime() - new Date(val.startTime).getTime()) / 1000 / 60 / 60 / 24);
					for (let i = 0; i <= dayDiff; i++) {
						// 开始日期作为key
						const key = dayjs(val.startTime)
							.add(i, 'day')
							.format('YYYY-MM-DD');
						const schedule = this.scheduleMap.get(key);
						if (schedule) {
							// 将相同开始日期的数据汇总到数组里
							schedule.arr.push(val);
						} else {
							this.scheduleMap.set(key, {
								arr: [val],
								allComplete: false
							});
						}
					}
				});

				// 设置完成状态
				this.scheduleMap.forEach((value, key) => {
					// value.allComplete = value.arr.every(v => v.state === 2)
					value.unFinishCount = value.arr.filter(v => v.state !== 2).length;
				});

				this.updatePlanList();
			});
		},
		selectDate(date) {
			this.selectedDate = date.value;
			this.updatePlanList();
		},
		updatePlanList() {
			// 更新今日的日程数量
			this.todaySchedulePlan = this.scheduleMap.get(this.selectedDate) ? this.scheduleMap.get(this.selectedDate).arr : [];
		},
		fabClick() {},
		switchDate(isNext) {
			if (isNext) {
				if (++this.curMonth > 12) {
					this.curYear++;
					this.curMonth = 1;
				}
			} else {
				if (--this.curMonth === 0) {
					this.curYear--;
					this.curMonth = 12;
				}
			}
			if (this.yearMonth !== this.curYearMonth) {
				this.selectedDate = this.yearMonthDay;
				console.log('this.selectedDate', this.selectedDate);
			} else {
				this.selectedDate = this.todayStr;
			}
			this.initMonth();
			this.getSchedule();
		},
		gotoForm() {
			uni.navigateTo({
				url: `/pages/office/schedule-form?date=${this.selectedDate}`,
			});
		},
		showDetail(item) {
			uni.navigateTo({
				url: '/pages/office/schedule-detail?scheduleId=' + item.scheduleId
			});
		},
		onClick(e, item) {
			if (e.content.text === '编辑') {
				uni.navigateTo({
					url: '/pages/office/schedule-form?scheduleId=' + item.scheduleId
				});
			} else {
				this.delScheduleId = item.scheduleId;
				this.showModel = true;
			}
		},
		delSchedule() {
			uni.showLoading({
				title: '正在删除',
				mask: true
			});
			deleteMethod(this.delScheduleId)
				.then(() => {
					uni.hideLoading();
					uni.$emit(this.$events.UPDATE_SCHEDULE);
					// this.getSchedule()
				})
				.catch(() => {
					uni.hideLoading();
				});
			this.delScheduleId = null;
		},
		getOption(item) {
			// 创建者是自己
			if (item.creatorId === this.userId) {
				if (item.state === 2) {
					return this.noEditOptions;
				} else {
					return this.options;
				}
			} else {
				return [];
			}
		},
		/**
		 * 获取未完成日程的数量
		 * @param date
		 * @returns {null}
		 */
		getUnFinishCount(date) {
			if (this.scheduleMap.has(date)) {
				return this.scheduleMap.get(date).unFinishCount;
			} else {
				return 0;
			}
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: 100%;
	background-color: $-bg-color;
}

.calendar-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px;

	.arrow {
		width: 30px;
		height: 25px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #1989fa;

		&.left {
			border-radius: 13px 0 0 13px;
		}

		&.right {
			border-radius: 0 13px 13px 0;
		}
	}

	.center {
		font-size: 17px;
	}
}

.calendar-body {
	margin: 20px 0 50px 0;
}

.row {
	display: flex;
	margin: 10px 0;
}

.col {
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
	font-size: 14px;
}

.date {
	width: 30px;
	height: 30px;
	text-align: center;
	line-height: 30px;
	border-radius: 50%;
	position: relative;
	color: #737373;
	transition: all 0.1s linear;

	&.today {
		background-color: #f2f8fe;
		color: #737373;
	}

	&.active {
		background-color: #1989fa;
		color: white;
	}

	&.not-in-cur-month {
		color: #cccccc;

		.dot {
			background-color: #9ecaf7;
		}
	}

	.dot {
		position: absolute;
		width: 5px;
		height: 5px;
		background-color: #1989fa;
		border-radius: 50%;
		bottom: -10px;
		left: 50%;
		transform: translateX(-50%);
		&.blue {
			background-color: #1989fa;
		}
		&.green {
			background-color: #70b603;
		}
	}
}

.schedule-item {
	background-color: #f7f7f7;
	border-left: 4px solid #1989fa;
	margin: 10px 0;
	border-radius: 4px;

	&.s1 {
		border-color: #70b603;
	}

	&.s2 {
		border-color: #f59a23;
	}

	&.s3 {
		border-color: #1989fa;
	}

	.schedule-title {
		font-size: 15px;
		margin-top: 2px;
	}

	.schedule-time {
		color: #adadad;
		font-size: 13px;
	}

	.inner {
		padding: 6px 10px;
		position: relative;
	}
}

.float-button {
	position: fixed;
	z-index: 9;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
	background-color: #1989fa;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	right: 5%;
	bottom: 15%;
}

.state {
	color: white;
	font-size: 11px;
	position: absolute;
	right: 10px;
	top: 30%;
	padding: 3px 7px;
	border-radius: 13px;
	&.s1 {
		background-color: #70b603;
	}
	&.s2 {
		background-color: #f59a23;
	}
	&.s3 {
		background-color: #1989fa;
	}
}

.mark {
	position: absolute;
	top: -8px;
	right: -7px;
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
</style>
