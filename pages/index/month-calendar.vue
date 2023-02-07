<template>
	<view class="card" style="margin-top: 0;margin-bottom: 0;">
		<view class="card-title">
			<view class="left">
				<text>{{yearMonth}}</text>
			</view>
			<view class="right"><navigator url="/pages/index/all-calendar" style="color:#1989fa;" hover-class="none">更多</navigator></view>
		</view>
			<attend-calendar type="month" @update-count="updateCount" @load-done="handlePullEnd" ref="attend-calendar"></attend-calendar>
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs';
import AttendCalendar from '@/components/attend-calendar.vue'
export default {
	components:{AttendCalendar},
	data() {
		return {
			yearMonth: ''
		};
	},
	created() {
		this.yearMonth = this.$dayjs().format('YYYY年M月')
	},
	methods: {
		handlePullEnd() {
			this.$emit('load-done', {type: 'attend'});
		},
		updateCount({index, count}) {
			this.$emit('update-count', {
				index: index,
				count: count
			})
		},
		getSchedule() {
			this.$refs['attend-calendar'].getSchedule();
		},
		reload() {
			this.getSchedule()
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
			background-color: #70b603;
		}
		&.red {
			background-color: #f59a23;
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
	&.un-confirm {
		border-left-color: #f59a23;
		.state {
			background-color: #f59a23;
		}
	}
	&.has-confirm {
		border-left-color: #70b603;
		.state {
			background-color: #70b603;
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
		position: absolute;
		right: 10px;
		top: 30%;
		padding: 3px 7px;
		border-radius: 13px;
	}
}
</style>
