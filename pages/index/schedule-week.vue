<template>
	<view class="card" style="margin-top: 0;margin-bottom: 0;">
		<view class="card-title">
			<view class="left">
				<text>{{ selectedDate }}</text>
			</view>
			<view class="right"><navigator url="/pages/office/schedule" style="color:#1989fa;" hover-class="none">更多</navigator></view>
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
							active: date.value === selectedDate
						}"
						@click="selectDate(date)"
					>
						{{ date.date }}
						<!-- <view
							class="dot"
							:class="scheduleMap.get(date.value) ? (scheduleMap.get(date.value).allComplete ? 'blue' : 'green') : ''"
							v-show="!!scheduleMap.get(date.value)"
						></view> -->
						<view class="mark" v-if="getUnFinishCount(date.value)">
							<view class="mark-count">{{ getUnFinishCount(date.value) }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="schedule-list">
			<view class="schedule-item" :class="stateMap[item.state].class" v-for="(item, index) in todaySchedulePlan" @click="showDetail(item)">
				<view class="schedule-time">{{ item.startTimeFmt }} - {{ item.endTimeFmt }}</view>
				<view class="schedule-title">{{ item.title }}</view>
				<view class="state" :class="stateMap[item.state].class">{{ stateMap[item.state].text }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs';
// import { getListByMonth } from '@/api/core/schedule.js';
export default {
	props: {
		// 日历类型：周模式(week)和月模式(month)
		type: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			weeks: ['一', '二', '三', '四', '五', '六', '日'],
			curMonthDateArr: [],
			curYear: 0,
			curMonth: 2,
			dateArr: [],
			currentDate: '',
			today: new Date(), // 今天
			todayStr: dayjs().format('YYYY-MM-DD'),
			todaySchedulePlan: [],
			scheduleMap: new Map(),
			selectedDate: '', // 用户点击的日期
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
			}
		};
	},
	created() {
		this.selectedDate = this.todayStr;
		this.initWeek();
		uni.$on(this.$events.UPDATE_SCHEDULE, () => {
			this.getSchedule();
		});
	},
	mounted() {
		// 获取日程
		this.getSchedule();
	},
	methods: {
		initWeek() {
			// 获取今天是周几
			let weekNum = new Date().getDay();
			weekNum = weekNum === 0 ? 7 : weekNum;
			const beforeDate = [];
			const afterDate = [];
			for (let i = weekNum; i > 1; i--) {
				const temp = dayjs(this.today).subtract(i - 1, 'day');
				beforeDate.push({
					date: temp.date(),
					value: temp.format('YYYY-MM-DD')
				});
			}
			for (let i = 1; i <= 7 - weekNum; i++) {
				const temp = dayjs(this.today).add(i, 'day');
				afterDate.push({
					date: temp.date(),
					value: temp.format('YYYY-MM-DD')
				});
			}
			this.dateArr = [
				beforeDate
					.concat([
						{
							date: this.today.getDate(),
							value: this.todayStr
						}
					])
					.concat(afterDate)
			];
		},
		// 根据月份获取日程计划
		getSchedule() {
			getListByMonth(dayjs().format('YYYY-MM')).then(res => {
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

				// 本月总共未完成数量
				let totalUnFinish = 0
				// 设置完成状态
				this.scheduleMap.forEach((value, key) => {
					// value.allComplete = value.arr.every(v => v.state === 2);
					value.unFinishCount = value.arr.filter(v => v.state !== 2).length;
					totalUnFinish += value.unFinishCount
				});
				this.selectedDate = this.todayStr;
				this.updatePlanList(this.todayStr);
				// const arr = this.scheduleMap.get(this.todayStr) ? this.scheduleMap.get(this.todayStr).arr : [];
				// const count = arr.filter(v => v.state !== 2).length;
				this.$emit('update-count', {
					index: 2,
					count: totalUnFinish
				});
				this.$emit('load-done', { type: 'schedule' });
			});
		},
		selectDate(date) {
			this.selectedDate = date.value;
			this.updatePlanList(this.selectedDate);
		},
		updatePlanList(date) {
			// 更新今日的日程数量
			this.todaySchedulePlan = this.scheduleMap.get(date) ? this.scheduleMap.get(date).arr : [];
			// if (date === this.todayStr) {
			// 	const badge = uni.getStorageSync(this.$const.BADGE_COUNT);
			// 	badge.schedule = this.todaySchedulePlan ? this.todaySchedulePlan.length : 0;
			// 	uni.setStorageSync(this.$const.BADGE_COUNT, badge);
			// }
		},
		showDetail(item) {
			uni.navigateTo({
				url: '/pages/office/schedule-detail?scheduleId=' + item.scheduleId
			});
		},
		reload() {
			this.getSchedule();
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

	.dot {
		position: absolute;
		width: 5px;
		height: 5px;

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
	padding: 6px 10px;
	border-left: 4px solid #1989fa;
	margin: 10px 0;
	border-radius: 4px;
	position: relative;

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
