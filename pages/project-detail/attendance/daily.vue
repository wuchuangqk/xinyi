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
						</view>
					</view>
				</view>
			</view>
		</view>
		<view  class="card">
			<!-- 项目考勤下新增施工日志 -->
			<view class="daily-wrap">
				<view class="link" @click="goDetail">
					<text>{{ dailyTitle }}</text>
					<uni-icons type="arrowright" size="22" color="#999"></uni-icons>
				</view>
				<!-- 当没有施工日志的时候，考勤管理员可以添加 -->
				<!-- <view v-if="!dailyRecord.includes(selectedDate) && isManager" class="add">
					<uni-icons type="plusempty" size="22" color="#1989fa"></uni-icons>
					<text @click="addDaily">添加施工日志</text>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs';
import { getListForUserId, getList } from '@/api/project/attendance.js';
import { getById as getProjectInfo } from '@/api/project/basicInfo.js';
export default {
	name: 'attend-calendar',
	data() {
		return {
			weeks: ['一', '二', '三', '四', '五', '六', '日'],
			curMonthDateArr: [],
			curYear: new Date().getFullYear(),
			curMonth: new Date().getMonth() + 1,
			dateArr: [],
			currentDate: '',
			today: new Date(), // 今天
			todayStr: dayjs().format('YYYY-MM-DD'),
			todaySchedulePlan: [],
			scheduleMap: new Map(),
			selectedDate: '', // 用户点击的日期
			monthLastDate: null, // 本月最后一天是几号
			curYearMonth: null,
			userId: null,
			userType: null,
			attendDetail: {},
			dailyRecord: [],
			dailyTitle: null,
			isAttendManager: false,
		};
	},
	async onLoad({ projectId }) {
		this.selectedDate = this.todayStr;
		this.dailyTitle = this.$dayjs(this.selectedDate).format('MM月DD日施工日志')
		this.curYearMonth = this.$dayjs().format('YYYY-MM');
		this.initMonth();
		this.projectId = projectId;
		const projectInfo = await getProjectInfo(this.projectId);
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		const attendUsers = projectInfo.xmProjectCoordinateForms.find(v => v.coordinateCode === 'KQGLY' || v.coordinateCode === 'XMFZR').userIds.split(',');
		this.isAttendManager = attendUsers.includes('' + this.userId);
	},
	created() {
		uni.$on(this.$events.UPDATE_PROJECT_ATTEND, () => {
			// this.getSchedule();
		});
	},
	mounted() {
		// 获取日程
		// this.getSchedule();
	},
	computed: {
		yearMonth() {
			return dayjs(this.curYear + '-' + this.curMonth).format('YYYY-MM');
		},
		yearMonthDay() {
			return dayjs(this.curYear + '-' + this.curMonth + '-1').format('YYYY-MM-DD');
		},
		// 是考勤管理员
		isManager() {
			return this.isAttendManager || [1, 75].includes(this.userId)
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
		fillBeforeDate(date, week) {
			const arr = [];
			for (let i = week; i > 1; i--) {
				const item = {
					inCurMonth: false,
					value: dayjs(date)
						.subtract(i - 1, 'day')
						.format('YYYY-MM-DD'),
					date: dayjs(date)
						.subtract(i - 1, 'day')
						.date()
				};
				arr.push(item);
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
					const item = {
						inCurMonth: true,
						value: point.format('YYYY-MM-DD'),
						date: point.date()
					};
					row.push(item);
					// 日期递增一天
					point = this.getNextDate(point);
				} else {
					// 添加新的数据行
					row = [];
					arr.push(row);
					const item = {
						inCurMonth: true,
						value: point.format('YYYY-MM-DD'),
						date: point.date()
					};
					row.push(item);
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
		// 根据月份获取本月考勤记录
		getSchedule() {
			this.scheduleMap = new Map();
			let promise = null;
			if (this.type === 'all' || this.type === 'month') {
				promise = getListForUserId(this.userId, this.curYearMonth);
			} else if (this.type === 'all-person') {
				promise = getList(this.projectId, this.curYearMonth);
				getProjectInfo(this.projectId).then(res => {
					const userId = uni.getStorageSync(this.$const.USER_INFO).userId;
					const attendUsers = res.xmProjectCoordinateForms.find(v => v.coordinateCode === 'KQGLY' || v.coordinateCode === 'XMFZR').userIds.split(',');
					this.isAttendManager = attendUsers.includes('' + userId);
				});
			}
			promise.then(res => {
				this.attendDetail = res;
				const records = res.attendances || res || [];
				records.forEach(v => {
					// 查看日期是否重复，如果重复则汇聚到日期为key的数组里
					const record = this.scheduleMap.get(v.days);
					if (record) {
						record.arr.push(v);
					} else {
						this.scheduleMap.set(v.days, {
							arr: [v],
							totalTimes: 0, // 总工日
							totalHours: 0, // 总加班时间
							unconfirmed: false // 是否有未确认的工时
						});
					}
				});
				// 计算总工日和总加班时长
				this.scheduleMap.forEach((val, key) => {
					val.arr.forEach(obj => {
						// val.totalTimes += obj.times;
						// val.totalHours += obj.hours;
						val.totalTimes = (obj.times * 100 + val.totalTimes * 100) / 100;
						val.totalHours = (obj.hours * 100 + val.totalHours * 100) / 100;
						if (obj.state === 0) {
							val.unconfirmed = true;
						}
					});
				});
				// 刷新视图
				this.dateArr = [...this.dateArr];
				this.$emit('update-count', {
					index: 0,
					count: res.notCount
				});
				this.$emit('load-done');
			});
		},
		selectDate(date) {
			this.selectedDate = date.value;
			this.dailyTitle = this.$dayjs(this.selectedDate).format('MM月DD日施工日志')
		},
		addDaily() {
			this.dailyRecord.push(this.selectedDate);
			this.dailyTitle = this.$dayjs().format('MM月DD日施工日志')
		},
		goDetail() {
			uni.navigateTo({
				url: `/pages/project-detail/attendance/daily-form?isManager=${this.isManager}&projectId=${this.projectId}&date=${this.selectedDate}`
			});
		},
		updatePlanList(date) {
			// 更新今日的日程数量
			this.todaySchedulePlan = this.scheduleMap.get(date);
			this.$emit('update-count', {
				index: 0,
				count: this.todaySchedulePlan ? this.todaySchedulePlan.length : 0
			});
			if (date === this.todayStr) {
				const badge = uni.getStorageSync(this.$const.BADGE_COUNT);
				badge.schedule = this.todaySchedulePlan ? this.todaySchedulePlan.length : 0;
				uni.setStorageSync(this.$const.BADGE_COUNT, badge);
			}
		},
		showDetail(item) {
			uni.navigateTo({
				url: '/pages/project-detail/attendance/attend-detail?id=' + item.id
				// url: '/pages/project-detail/attendance/attend-detail?id='
			});
		},
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
			} else {
				this.selectedDate = this.todayStr;
			}
			this.dailyTitle = this.$dayjs(this.selectedDate).format('MM月DD日施工日志')
			this.curYearMonth = this.curYear + '-' + (this.curMonth > 9 ? this.curMonth : '0' + this.curMonth);
			this.initMonth();
			this.getSchedule();
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	min-height: 100%;
	background-color: $-bg-color;
}
.calendar-body {
	margin: 20px 0 20px 0;
}

.row {
	display: flex;
	margin: 30px 0;
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
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%);
		&.green {
			background-color: green;
		}
		&.red {
			background-color: red;
		}
	}

	.text {
		position: absolute;
		font-size: 11px;
		bottom: -25px;
		color: #aeaeae;
		left: 0;
		right: 0;
		text-align: center;
	}
}

.schedule-item {
	background-color: #f7f7f7;
	padding: 6px 10px;
	border-left: 4px solid #1989fa;
	margin: 10px 0;
	border-radius: 4px;
	position: relative;
	display: flex;
	justify-content: space-between;
	.right {
		text-align: right;
	}
	&.un-confirm {
		border-left-color: red;
		.state {
			background-color: red;
		}
	}
	&.has-confirm {
		border-left-color: green;
		.state {
			background-color: green;
		}
	}

	.schedule-title {
		font-size: 15px;
		margin-top: 2px;
	}

	.schedule-time {
		color: #adadad;
		font-size: 13px;
	}
	.state {
		color: white;
		font-size: 11px;
		// position: absolute;
		// right: 10px;
		// top: 30%;
		padding: 3px 7px;
		border-radius: 13px;
		display: inline-block;
		margin-right: 0;
	}
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
.temp-text {
	font-size: 14px;
	color: #666;
	text-align: left;
	border-top: 1px solid #cdcdcd;
	padding-top: 10px;
}

.daily-wrap {
	background-color: #ecf8ff;
	padding: 6px 10px;
	border-left: 4px solid #1989fa;
	margin: 10px 0;
	border-radius: 4px;
	position: relative;
	display: flex;
	justify-content: space-between;
	.add {
		display: flex;
		align-items: center;
		color: #1989fa;
	}
	.link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
}
</style>
