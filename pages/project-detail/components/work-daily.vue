<template>
	<view class="tab-page" id="work-daily">
		<view class="card">
			<view class="detail-item">
				<text class="label">日期</text>
				<view class="value"><uni-datetime-picker style="width: 130px;" type="date" :value="journalTime" @change="handleChange" :border="false" /></view>
			</view>
			<view class="detail-item">
				<text class="label">今日考勤人数</text>
				<text class="value">{{ detailData.attendanceCount }}</text>
			</view>
			<view class="detail-item">
				<text class="label">是否有材料到场</text>
				<text class="value">{{ detailData.materialDescribe }}</text>
			</view>
		</view>
		<scroll-view scroll-x="true" v-for="item in detailData.xmJournalInfoList">
			<view class="scroll-cell">
				<view class="cell">
					<view class="inner">
						<view class="card-title"><text class="left">施工区域</text></view>
						<view class="content">{{ item.journalArea }}</view>
					</view>
				</view>
				<view class="cell">
					<view class="inner">
						<view class="card-title"><text class="left">施工内容(具体到每个人)</text></view>
						<view class="content">{{ item.journalContent }}</view>
					</view>
				</view>
				<view class="cell">
					<view class="inner">
						<view class="card-title"><text class="left">施工人员</text></view>
						<text v-for="username in item.journalUserNamesTemp || []" class="username">{{ username }}</text>
					</view>
				</view>
				<view class="cell">
					<view class="inner">
						<view class="card-title"><text class="left">完成情况</text></view>
						<view class="content">{{ item.journalSituation }}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="card">
			<view class="card-title"><text class="left">生产存在问题</text></view>
			<view class="problem" v-for="item in detailData.xmJournalErrors">
				<view class="problem-icon"></view>
				<text>{{ item.errorContent }}</text>
			</view>
		</view>
		<view v-if="managePermission" class="card" style="margin-top: 10px;">
			<view class="card-title"><text class="left">抄送对象</text></view>
			<text class="username" v-for="username in detailData.ccUserNames || []">{{ username }}</text>
		</view>
	</view>
</template>

<script>
import { getInfoByTime, getInfoById } from '@/api/project/workDaily.js';
import { getById as getUserById } from '@/api/user.js';
export default {
	props: {
		projectId: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			journalTime: '2021-07-01',
			detailData: {
				xmJournalInfoList: [],
				xmJournalErrors: []
			},
			userId: null,
			managePermission: false
		};
	},
	created() {
		this.userId = '' + uni.getStorageSync(this.$const.USER_INFO).userId;
		this.managePermission = this.$hasPermission('shigongrizhi', this.$const.PROJECT_PERMISSION);
		this.journalTime = this.$dayjs().format('YYYY-MM-DD')
		this.fetchData();
	},
	methods: {
		fetchData() {
			const tempData = uni.getStorageSync(this.$const.TEMP)
			const promise = tempData === '' ? getInfoByTime(this.projectId, this.journalTime, 0) : getInfoById(tempData)
			uni.removeStorageSync(this.$const.TEMP)
			uni.$emit(this.$events.UPDATE_TODO_STATE)
			promise.then(res => {
				(res.ccUserIdsTemp = res.ccUserIds ? res.ccUserIds.split(',') : []), (res.ccUserNames = []);
				res.ccUserIdsTemp.forEach(userId => {
					getUserById(userId).then(user => {
						res.ccUserNames.push(user.displayName);
					});
				});
				res.xmJournalInfoList = res.xmJournalInfoList || []
				res.xmJournalErrors = res.xmJournalErrors || []
				res.xmJournalInfoList.forEach(val => {
					val.journalUserIdsTemp = val.journalUserIds ? val.journalUserIds.split(',') : []
					val.journalUserNamesTemp = val.journalUserNames ? val.journalUserNames.split(',') : [];
				});
				// 如果当前用户没有管理权限，且不在抄送人数组里，则对列表进行过滤，只显示施工人员数组里包含该用户的数据
				if (!this.managePermission && !res.ccUserIdsTemp.includes(this.userId)) {
					res.xmJournalInfoList = res.xmJournalInfoList.filter(v => v.journalUserIdsTemp.includes(this.userId));
				}
				this.detailData = res;
			});
		},
		handleChange(e) {
			this.journalTime = e;
			this.fetchData();
		}
	}
};
</script>

<style lang="scss"></style>
<style scoped lang="scss">
@import '../style/common.scss';
@import '@/styles/detail.scss';

/deep/ .uni-date__input {
	height: initial;
	width: initial;
	padding-right: 0;
}
/deep/ .uni-date-x {
	padding-right: 0;
}
.card {
	margin: 5px 0;
	font-size: 14px;
	.card-title {
		margin-bottom: 10px;
	}
}
.scroll-cell {
	width: 1300px;
	display: flex;
	margin: 5px 0;
	border-radius: 8px;
	background-color: white;

	.cell {
		width: 70%;
		padding: 10px;
		font-size: 14px;
		.card-title {
			color: #b1b1b1;
			margin-bottom: 10px;
		}
		.inner {
			border-right: 1px solid #e7e7e7;
		}

		&:last-of-type {
			.inner {
				border-right: none;
			}
		}
	}
}
.problem {
	display: flex;
	align-items: center;
	margin-bottom: 6px;
	.problem-icon {
		flex-shrink: 0;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: white;
		border: 2px solid #fa1919;
		margin-right: 5px;
	}
}
.username {
	font-size: 13px;
	display: inline-block;
	padding: 4px 6px;
	background-color: #f4f4f5;
	border: 1px solid #e9e9eb;
	border-radius: 5px;
	margin: 0 6px 6px 0;
	color: #909399;
	line-height: 1;
}
</style>
