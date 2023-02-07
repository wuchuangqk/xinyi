<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<view class="detail-item" style="padding: 5px 0 5px 0;">
				<text class="label form-label">日期</text>
				<view class="value"><uni-datetime-picker style="width: 130px;" type="date" :value="formData.journalTime" :showClear="false" @change="handleChange" :border="false" /></view>
			</view>
			<view class="detail-item">
				<text class="label">今日考勤人数</text>
				<text class="value">{{ formData.attendanceCount }}</text>
			</view>
			<view class="detail-item" :style="{ 'padding-top': isEditState ? '0px' : '15px' }">
				<text class="label" :class="{ 'line-height': isEditState }">是否有材料到场</text>
				<view v-if="isEditState" class="value"><uni-easyinput type="text" v-model="formData.materialDescribe" placeholder="请输入详细描述" :inputBorder="false" /></view>
				<text v-else class="value">{{ formData.materialDescribe }}</text>
			</view>
		</view>
		<view v-for="(item, index) in formData.xmJournalInfoList" :key="item.key" class="card form">
			<view class="card-title">
				<view class="left" :style="{ 'margin-left': isEditState ? '-10px' : '0px' }">
					<app-select v-if="workTypes.length && isEditState" v-model="item.journalContent" :selectData="workTypes"></app-select>
					<text v-else>{{ item.journalContentText }}</text>
				</view>
				<view v-if="isEditState" class="right"><uni-icons @click="removeRecord(index)" color="#ff5c5c" size="20" type="minus" /></view>
			</view>
			<view>
				<view class="detail-item" :class="{ 'edit-mode': isEditState }">
					<text class="label">施工区域</text>
					<view v-if="isEditState" class="value"><uni-easyinput type="text" v-model="item.journalArea" placeholder="请输入施工区域" :inputBorder="false" /></view>
					<view v-else class="value">{{ item.journalArea }}</view>
				</view>
				<view class="detail-item" :class="{ 'edit-mode': isEditState }">
					<text class="label">施工人员</text>
					<view v-if="isEditState" class="value form-label" style="padding: 7px 10px 0 20px;">
						<app-multiple-picker :value="item.journalUsers.ids" :selectData="hasAttendUserOrder" @confirm="e => handleConfirm(e, item)">
							<text v-if="item.journalUsers.ids.length === 0">请选择</text>
							<text v-else>{{ item.journalUsers.names.join('，') }}</text>
						</app-multiple-picker>
					</view>
					<view v-else class="value">
						<text>{{ item.journalUsers.names.join('，') }}</text>
					</view>
				</view>
				<view class="detail-item" :class="{ 'edit-mode': isEditState }">
					<text class="label">完成情况</text>
					<view v-if="isEditState" class="value"><uni-easyinput type="text" v-model="item.journalSituation" placeholder="请输入施工区域" :inputBorder="false" /></view>
					<view v-else class="value">{{ item.journalSituation }}</view>
				</view>
			</view>
		</view>
		<view v-if="isEditState || formData.xmJournalErrors.length !== 0" class="card">
			<view class="card-title">
				<view class="left">生产存在问题</view>
				<view v-if="isEditState" class="right"><uni-icons @click="addError" color="#1989fa" size="20" type="plus" /></view>
			</view>
			<view class="error">
				<view v-for="(item, index) in formData.xmJournalErrors" class="item" :style="{ 'margin-left': isEditState ? '-10px' : '0px' }">
					<template v-if="isEditState">
						<uni-easyinput type="text" v-model="item.errorContent" placeholder="请输入生产存在问题" :inputBorder="false" />
						<view class="remove"><uni-icons @click="formData.xmJournalErrors.splice(index, 1)" style="line-height: 36px;" color="#ff5c5c" size="20" type="minus" /></view>
					</template>
					<template v-else>
						<view class="text">{{ item.errorContent }}</view>
					</template>
				</view>
			</view>
		</view>
<!-- 		<view v-if="isEditState" class="card">
			<view class="card-title"><view class="left">抄送人</view></view>
			<view>
				<view class="user-select">
					<text v-if="copyToUsers.length === 0">请选择用户</text>
					<text>{{ copyToUsers.map(v => v.label).join('、') }}</text>
					<text class="icon-wrap" @click="navToCopy"><uni-icons type="personadd" size="18" color="#1989fa"></uni-icons></text>
				</view>
			</view>
		</view> -->

		<view :style="{ height: isEditState ? '80px' : '10px' }"></view>
		<view v-if="isEditState" class="button-wrap"><button class="btn submit" :loading="submitLoading" @click="submit">提交</button></view>
		<view v-if="isEditState" class="float-button" @click="addRecord"><uni-icons type="plusempty" size="22" color="#ffffff"></uni-icons></view>
		<neil-modal :show="showModel" title="提示" :content="content" align="center" :showCancel="false" @confirm="back" @close="back"></neil-modal>
	</view>
</template>

<script>
import { getInfoByTime, getInfoById, saveOrUpdate } from '@/api/project/workDaily.js';
import { getById as getUserById } from '@/api/user.js';
import { getById as getProjectInfo } from '@/api/project/basicInfo.js';
import { getParams } from '@/api/project/workDaily.js';
import { getUserList, getList as getAttendList } from '@/api/project/attendance.js';
import AppSelect from '@/components/app-select.vue';
import AppMultiplePicker from '@/components/app-multiple-picker.vue';

export default {
	components: { AppSelect, AppMultiplePicker },
	data() {
		return {
			formData: {
				journalId: null, // 主键
				journalName: null, // 日志名称
				journalTime: '', // 日期
				journalType: 0,
				materialDescribe: '', // 是否有材料到场
				projectId: null,
				attendanceCount: 0, // 考勤人数
				ccUserIds: '', // 抄送对象
				ccUserIdsTemp: [], // 抄送对象
				xmJournalErrors: [],
				xmJournalInfoList: []
			},
			managePermission: false,
			isAttendManager: false, // 考勤管理员
			isSysManager: false, // 超级管理员
			isHasPermission: false, // 权限
			loginUserId: null,
			workTypes: [],
			hasAttendUserOrder: [], // 今日有考勤的人员名单
			isEditState: false,
			submitLoading: false,
			showModel: false,
			content: '',
			projectName: '',
			copyToUsers: [] // 选择抄送的人
		};
	},
	async onLoad({ projectId }) {
		this.formData.projectId = projectId;
		this.loginUserId = uni.getStorageSync(this.$const.USER_INFO).userId;
		// 超级管理员
		this.isSysManager = [1, 75].includes(this.loginUserId);
		// 是否是考勤管理员
		const projectInfo = await getProjectInfo(projectId);
		this.projectName = projectInfo.projectName;
		const attendUsers = projectInfo.xmProjectCoordinateForms.find(v => v.coordinateCode === 'KQGLY' || v.coordinateCode === 'XMFZR').userIds.split(',');
		this.isAttendManager = attendUsers.includes('' + this.loginUserId);
		// 【管理施工日志权限】
		this.isHasPermission = this.$hasPermission('shigongrizhi', this.$const.PROJECT_PERMISSION);
		this.formData.journalTime = this.$dayjs().format('YYYY-MM-DD');
		this.fetchData();
		// 监听选择用户
		uni.$on(this.$events.UPDATE_COPY_USERS, users => {
			this.copyToUsers = users;
		});
	},
	methods: {
		fetchData() {
			// mixin/todo.js 记录施工日志的数据id，当有id时查对应的数据，没有就查当天的数据
			const tempData = uni.getStorageSync(this.$const.TEMP);
			const promise = tempData === '' ? getInfoByTime(this.formData.projectId, this.formData.journalTime, 0) : getInfoById(tempData);
			uni.removeStorageSync(this.$const.TEMP);
			Promise.all([
				getUserList(this.formData.projectId), // 获取项目下参与考勤的有哪些人
				getAttendList(this.formData.projectId, this.$dayjs(this.formData.journalTime).format('YYYY-MM')), // 获取指定月份的考勤记录
				promise,
				getParams(89) // 工种(type=89)
			]).then(([userResponse, attendanceResponse, dailyData, workTypeRes]) => {
				this.workTypes = this.formatOption(workTypeRes.records);
				const res = dailyData;
				uni.$emit(this.$events.UPDATE_TODO_STATE); // 刷新待阅
				res.journalTime = res.journalTime ? res.journalTime : this.formData.journalTime;
				res.projectId = this.formData.projectId;
				res.ccUserIdsTemp = res.ccUserIds ? res.ccUserIds.split(',') : [];
				res.ccUserNames = [];
				this.copyToUsers.length = 0;
				res.ccUserIdsTemp.forEach(userId => {
					getUserById(userId).then(user => {
						this.copyToUsers.push({
							label: user.displayName,
							value: user.userId
						});
					});
				});
				res.xmJournalInfoList = res.xmJournalInfoList || [];
				res.xmJournalErrors = res.xmJournalErrors || [];
				res.journalType = 0;
				// 剔除离职的
				const users = userResponse.filter(v => {
					return !v.quitTime || this.$dayjs(this.formData.journalTime).isBefore(this.$dayjs(v.quitTime));
				});
				// 筛选出指定日期的考勤
				// const records = attendanceResponse.filter(v => v.days === this.formData.journalTime).map(v => v.userId)
				const records = attendanceResponse
					.filter(v => {
						return v.days === this.formData.journalTime;
					})
					.map(v => v.userId);
				// 有考勤记录的
				this.hasAttendUserOrder = users
					.filter(v => records.includes(v.userId))
					.map(v => {
						v.label = v.userName;
						v.value = v.userId;
						v.checked = false;
						return v;
					});
				res.xmJournalInfoList.forEach(val => {
					// 回显选择的用户姓名
					val.journalUsers = {
						names: [],
						ids: []
					};
					if (val.journalUserIds) {
						val.journalUsers.ids = val.journalUserIds.split(',').map(id => +id);
						val.journalUsers.names = this.formatName(val.journalUsers.ids, this.hasAttendUserOrder);
						this.hasAttendUserOrder.forEach(v => {
							if (val.journalUsers.ids.includes(v.value)) {
								v.checked = true;
							}
						});
					}
					val.journalContent = +val.journalContent;
					const temp = this.workTypes.find(v => v.value === +val.journalContent);
					val.journalContentText = temp ? temp.label : val.journalContent;
				});
				res.attendanceCount = res.attendanceCount || this.hasAttendUserOrder.length;
				const dailyCount = res.xmJournalInfoList.length;
				this.formData = res;
				if (res.attendanceCount === 0) {
					this.content = '今日无考勤记录';
					this.showModel = true;
					this.isEditState = false;
				} else {
					// 有数据的情况下，本日填写的数据可以修改(管理员随时都可以编辑)
					if (dailyCount !== 0) {
						this.isEditState = this.isSysManager || this.isCanModify();
					} else {
						// 在没有数据的情况下，考勤管理员和拥有【管理施工日志】权限的人可以修改
						this.isEditState = this.isSysManager || this.isAttendManager || this.isHasPermission;
						// 默认加一条数据
						if (this.isEditState) {
							this.addRecord();
							this.addError();
						}
					}
				}
			});
		},
		// 本日填写的数据可以修改（考勤管理员和有权限的人）
		isCanModify() {
			return (this.isAttendManager || this.isHasPermission) &&
			this.$dayjs().format('YYYY-MM-DD') === this.formData.journalTime
		},
		handleChange(e) {
			this.formData.journalTime = e;
			this.fetchData();
		},
		formatName(ids, datas) {
			const names = [];
			ids.forEach(id => {
				const temp = datas.find(v => v.value === id);
				names.push(temp ? temp.label : id);
			});
			return names;
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
		submit() {
			if (this.submitLoading || !this.checkData()) {
				return;
			}
			this.submitLoading = true;
			this.formData.journalName = this.projectName + '项目施工日志';
			// this.formData.ccUserIds = this.formData.ccUserIdsTemp.join(',')
			this.formData.ccUserIds = this.copyToUsers.map(v => v.value).join(',');
			this.formData.xmJournalInfoList.forEach(val => {
				val.journalUserIds = val.journalUsers.ids.join(',');
				const temp = this.workTypes.find(v => v.value === +val.journalContent);
				val.journalContentText = temp ? temp.label : val.journalContent;
			});
			// 过滤掉生成存在问题里的空文本
			this.formData.xmJournalErrors = this.formData.xmJournalErrors.filter(v => v.errorContent.trim().length !== 0);
			saveOrUpdate(this.formData).then(res => {
				// 提交后，本日填写的数据可以修改（管理员随时可以改）
				if (!this.isSysManager && !this.isCanModify()) {
					this.isEditState = false;
				}
				uni.showToast({
					title: '提交成功',
					icon: 'none'
				});
				this.submitLoading = false
			});
		},
		checkData() {
			// 要求至少加一条施工日志
			if (this.formData.xmJournalInfoList.length === 0) {
				uni.showToast({
					title: '请至少添加一条施工日志',
					icon: 'none'
				});
				return false;
			}
			for (let i = 0; i < this.formData.xmJournalInfoList.length; i++) {
				const { journalArea, journalContent, journalUsers, journalSituation } = this.formData.xmJournalInfoList[i];
				if (journalArea.trim().length === 0) {
					uni.showToast({
						title: '请填写施工区域',
						icon: 'none'
					});
					return false;
				}
				if (!journalContent) {
					uni.showToast({
						title: '请选择工种',
						icon: 'none'
					});
					return false;
				}
				if (journalUsers.ids.length === 0) {
					uni.showToast({
						title: '请选择施工人员',
						icon: 'none'
					});
					return false;
				}
				if (journalSituation.trim().length === 0) {
					uni.showToast({
						title: '请填写完成情况',
						icon: 'none'
					});
					return false;
				}
			}
			return true;
		},
		addRecord() {
			this.formData.xmJournalInfoList.push({
				id: null,
				journalId: null,
				journalContent: this.workTypes.length ? this.workTypes[0].value : null, // 施工内容
				journalArea: '', // 施工区域
				journalSituation: '', // 完成情况
				journalUserIds: '', // 施工人员
				journalUsers: {
					names: [],
					ids: []
				}
			});
		},
		removeRecord(index) {
			this.formData.xmJournalInfoList.splice(index, 1);
		},
		back() {
			this.showModel = false;
		},
		handleConfirm({ ids, names }, item) {
			item.journalUsers.ids = ids;
			item.journalUsers.names = names;
		},
		addError() {
			this.formData.xmJournalErrors.push({
				id: null,
				journalId: null,
				errorContent: '' // 问题描述
			});
		},
		/**
		 * 跳转到抄送页面
		 */
		navToCopy() {
			uni.setStorageSync(this.$const.COPY_USER, this.copyToUsers);
			uni.navigateTo({
				url: `/pages/common/carbon-copy/carbon-copy`
			});
		}
	}
};
</script>

<style lang="scss"></style>
<style scoped lang="scss">
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
			padding: 5px 0;
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
.detail-item {
	.form-label {
		padding: 7px 10px 0 0;
		line-height: 1.5;
	}
}

.error {
	.item {
		border-bottom: 1px solid #f7f7f7;
		display: flex;
	}
	.text {
		padding: 15px 0;
		font-size: 14px;
	}
}

.user-select {
	line-height: 36px;
	display: flex;
	justify-content: space-between;
	.placeholder {
		color: #7c7c7c;
	}
	.icon-wrap {
		padding: 0 10px;
	}
}
.line-height {
	line-height: 36px;
}
</style>
