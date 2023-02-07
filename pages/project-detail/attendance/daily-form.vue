<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view><uni-search-bar :radius="100" clearButton="none" placeholder="请输入姓名" @confirm="setValue" @cancel="setValue(null)"></uni-search-bar></view>
		<view class="card">
			<view class="detail-item">
				<text class="label">日期</text>
				<text class="value">{{ date }}</text>
			</view>
			<view class="detail-item">
				<text class="label">今日考勤人数</text>
				<text class="value">{{ attendanceCount }}</text>
			</view>
		</view>
		<view v-for="(item, index) in dailyList" v-show="item.isInSearch" :key="`${item.userId}-${item.key}`" class="card form">
			<view class="card-title">
				<view v-if="type === 'edit'" class="left">
					<text v-if="item.isAttendance">{{ item.name }}</text>
					<app-select
						v-if="unAttendanceUsers.length && !item.isAttendance"
						v-model="item.userId"
						:selectData="unAttendanceUsers"
						@select-change="e => updateKey(item)"
					></app-select>
				</view>
				<view v-else class="left">
					<text>{{ item.name }}</text>
				</view>
				<view v-if="type === 'edit'" class="right">
					<app-select v-if="workTypes.length && item.isAttendance" v-model="item.workType" :selectData="workTypes"></app-select>
					<uni-icons v-if="!item.isAttendance" @click="remove(item)" color="#ff5c5c" size="20" type="minus" />
				</view>
				<view v-else class="right">
					<text>{{ item.workTypeName }}</text>
				</view>
			</view>
			<view>
				<view v-if="item.isAttendance" class="detail-item" :class="{ 'edit-mode': type === 'edit' }">
					<text class="label">今日工作内容</text>
					<view v-if="type === 'edit'" class="value"><uni-easyinput type="text" v-model="item.contentToday" placeholder="请输入今日工作内容" :inputBorder="false" /></view>
					<view v-if="type === 'detail'" class="value">{{ item.contentToday }}</view>
				</view>
				<view class="detail-item" :class="{ 'edit-mode': type === 'edit' }">
					<text class="label">明日工作安排</text>
					<view v-if="type === 'edit'" class="value"><uni-easyinput type="text" v-model="item.contentTomorrow" placeholder="请输入明日工作安排" :inputBorder="false" /></view>
					<view v-if="type === 'detail'" class="value">{{ item.contentTomorrow }}</view>
				</view>
			</view>
		</view>

		<view v-if="type === 'edit'" style="height: 80px;"><view class="tip">注：提交后不可修改</view></view>
		<view v-if="type === 'edit'" class="button-wrap">
			<button class="btn" :loading="submitLoading" @click="submit(0)">保存</button>
			<button class="btn submit" :loading="submitLoading" @click="submit(1)">提交</button>
		</view>
		<view v-if="type === 'edit'" class="float-button" @click="addUnAttendanceUser"><uni-icons type="plusempty" size="22" color="#ffffff"></uni-icons></view>
		<neil-modal :show="showModel" title="提示" :content="content" align="center" :showCancel="false" @confirm="back" @close="back"></neil-modal>
	</view>
</template>

<script>
import AppSelect from '@/components/app-select.vue';
import { getUserList, getList as getAttendList } from '@/api/project/attendance.js';
import { getListByProjectId, listSave, getParams } from '@/api/project/workDaily.js';
export default {
	components: { AppSelect },
	data() {
		return {
			date: '2021-10-11',
			attendanceCount: 0, // 今日考勤人数
			submitLoading: false,
			dailyList: [], // 施工日志
			isEditState: false, // 是否是编辑状态
			workTypes: [],
			unAttendanceUsers: [], // 本日未考勤的工人
			type: 'detail', // edit/detail
			isManager: false,
			projectId: null,
			showModel: false,
			content: '',
		};
	},
	onLoad({ isManager, projectId, date }) {
		this.isManager = isManager;
		this.projectId = projectId;
		this.date = date;
		this.fetchData();
	},
	methods: {
		fetchData() {
			this.dailyList.length = 0;
			// 查参与考勤的人和考勤数据
			Promise.all([
				getUserList(this.projectId), // 获取项目下参与考勤的有哪些人
				getAttendList(this.projectId, this.$dayjs(this.date).format('YYYY-MM')), // 获取指定月份的考勤记录
				getListByProjectId({ projectId: this.projectId, time: this.date }),
				getParams(89)
			]).then(([userResponse, attendanceResponse, dailyRes, workTypeRes]) => {
				if (this.isManager === 'true' && (dailyRes.length === 0 || dailyRes[0].state === 0)) {
					this.type = 'edit';
				} else {
					this.type = 'detail';
				}
				this.workTypes = this.formatOption(workTypeRes.records);
				const users = userResponse.filter(v => {
					return !v.quitTime || this.$dayjs(this.date).isBefore(this.$dayjs(v.quitTime));
				});
				// 筛选出指定日期的考勤
				const records = attendanceResponse.filter(v => v.days === this.date).map(v => v.userId);
				// 有考勤记录的
				const hasAttendUser = users.filter(v => records.includes(v.userId));
				this.attendanceCount = hasAttendUser.length;
				if(this.attendanceCount === 0) {
					this.content = this.type === 'edit' ? '今日无考勤记录' : '今日无施工日志'
					this.showModel = true
					return
				}
				if (dailyRes.length === 0) {
					this.dailyList = hasAttendUser.map(v => {
						return {
							constructionId: null,
							userId: v.userId,
							name: v.userName,
							workType: this.workTypes.length ? this.workTypes[0].value : null,
							state: 0, // 0=保存，1=提交
							projectId: this.projectId,
							contentToday: '',
							contentTomorrow: '',
							constructionTime: this.date,
							isAttendance: true,
							isInSearch: true,
							key: new Date().getTime()
						};
					});
				} else {
					this.dailyList = dailyRes.map(v => {
						v.isAttendance = hasAttendUser.some(val => val.userId === v.userId)
						v.isInSearch = true;
						v.name = v.userName;
						v.key = new Date().getTime();
						if(v.workType === null && v.isAttendance) {
							v.workType = this.workTypes.length ? this.workTypes[0].value : null
						}
						return v;
					});
				}
				// 没有考勤记录的
				const noAttendUser = users.filter(v => !records.includes(v.userId));
				this.unAttendanceUsers = noAttendUser.map(v => {
					return {
						label: v.userName,
						value: v.userId,
						isAdd: false
					};
				});
			});
			// 在查日志，回显对应用户信息
		},
		formatOption(records) {
			const arr = [];
			for (let val of records) {
				arr.push({
					label: val.pname,
					value: val.paramId
				});
			}
			return arr;
		},
		setValue(e) {
			const searchUsername = e ? e.value : '';
			this.dailyList.forEach(v => {
				v.isInSearch = v.name.indexOf(searchUsername) !== -1;
			});
		},
		/**
		 * @param {Object} type 0=保存，1=提交
		 */
		submit(type) {
			if (!this.checkRepeat()) {
				return;
			}
			for (let i = 0; i < this.dailyList.length; i++) {
				this.dailyList[i].state = type;
				if (this.dailyList[i].isAttendance && !this.dailyList[i].workType) {
					uni.showToast({
						title: '请选择工种',
						icon: 'none'
					});
					return;
				}
			}
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			listSave(this.dailyList)
				.then(() => {
					uni.hideLoading();
					uni.navigateBack();
				})
				.catch(() => {
					uni.hideLoading();
				});
		},
		/**
		 * 添加没有考勤记录的用户
		 */
		addUnAttendanceUser() {
			if (this.unAttendanceUsers.filter(v => !v.isAdd).length === 0) {
				uni.showToast({
					title: '今日项目下的所有人已参与考勤',
					icon: 'none'
				});
				return;
			}
			const unAddUser = this.unAttendanceUsers.filter(v => !v.isAdd)[0];
			this.dailyList.push({
				userId: unAddUser.value,
				name: unAddUser.label,
				workType: null,
				state: 0, // 0=保存，1=提交
				projectId: this.projectId,
				contentToday: null,
				contentTomorrow: null,
				constructionTime: this.date,
				isAttendance: false,
				key: new Date().getTime(),
				isInSearch: true
			});
			this.setIsAdd();
		},
		setIsAdd() {
			const userIds = this.dailyList.map(v => v.userId);
			this.unAttendanceUsers.forEach(v => {
				v.isAdd = userIds.includes(v.value);
			});
		},
		remove(item) {
			const index = this.dailyList.findIndex(v => v.userId === item.userId && v.key === item.key);
			this.dailyList.splice(index, 1);
			this.setIsAdd();
		},
		checkRepeat() {
			// 检查用户id是否重复
			const arr = [];
			for (let i = 0; i < this.dailyList.length; i++) {
				if (!arr.includes(this.dailyList[i].userId)) {
					arr.push(this.dailyList[i].userId);
				} else {
					uni.showToast({
						title: '用户名单有重复',
						icon: 'none'
					});
					return false;
				}
			}
			return true;
		},
		updateKey(row) {
			row.key = new Date().getTime();
		},
		back() {
			uni.navigateBack()
		}
	}
};
</script>

<style lang="scss">
@import '@/styles/detail.scss';
.page {
	min-height: 100%;
	background-color: $-bg-color;
}
.button-wrap {
	position: fixed;
	bottom: 0px;
	left: 0px;
	right: 0px;
	background-color: white;
	border-top: 1px solid #e3e3e3;
	display: flex;
	padding: 10px;
	.btn {
		flex: 1;
		background-color: #67c23a;
		color: white;
		font-size: 14px;
		&.submit {
			background-color: #1989fa;
			margin-left: 10px;
		}
	}
}

.tip {
	text-align: center;
	font-size: 13px;
	color: #999;
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
	bottom: 10%;
}
/deep/ .uni-forms-item--border {
	padding: 5px 0;
}

.form {
	padding-bottom: 0;
	.card-title {
		margin-bottom: 0;
		align-items: center;
	}
	.detail-item {
		&.edit-mode {
			justify-content: flex-start;
			padding-bottom: 5px;
			padding-top: 5px;
			.label {
				padding: 7px 10px 0 0;
				line-height: 1.5;
			}
			.value {
				flex: 1;
			}
		}
		.value {
			padding-left: 10px;
		}
	}
}
</style>
