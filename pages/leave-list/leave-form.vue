<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<uni-forms ref="form" :modelValue="formData" :rules="rules" :labelWidth="70" :border="true" class="form">
			<view class="card">
				<uni-forms-item style="border-top: none;" label="请假类型" name="leaveType">
					<app-select v-if="leaveTypeList.length" v-model="formData.leaveType" :selectData="leaveTypeList" @select-change="leaveTypeChange"></app-select>
				</uni-forms-item>
				<uni-forms-item style="border-top: 1px #eee solid;" label="开始时间" name="approvalSTime">
					<uni-datetime-picker
						v-if="refresh"
						type="datetime"
						:value="formData.approvalSTime"
						:border="false"
						:showClear="false"
						:start="startTime.start"
						:end="startTime.end"
						@change="e => setDateValue(e, 1)"
					></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item label="结束时间" name="approvalETime">
					<uni-datetime-picker
						v-if="refresh"
						type="datetime"
						:value="formData.approvalETime"
						:border="false"
						:showClear="false"
						:start="endTime.start"
						:end="endTime.end"
						@change="e => setDateValue(e, 2)"
					></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item label="请假天数" name="leaveDays" :required="true">
					<uni-number-box :value="formData.leaveDays" :min="1" :step="1" @change="leaveDaysChange"></uni-number-box>
				</uni-forms-item>
				<uni-forms-item label="请假原因" name="approvalContent" :required="true">
					<uni-easyinput type="textarea" autoHeight v-model="formData.approvalContent" placeholder="请输入请假原因" :inputBorder="false" />
				</uni-forms-item>
			</view>

			<view class="card">
				<view class="card-title">
					<view class="left"><text>附件</text></view>
				</view>
				<file-viewer mode="upload" :files="[]" :limit="10" platform="oa" fileType="Comprehensive" @file-change="upload"></file-viewer>
			</view>

			<view class="card">
				<view class="card-title" style="margin-bottom: 20px;">
					<view class="left"><text>审批人</text></view>
				</view>

				<!--临时工流程-->
				<template v-if="isTempUser">
					<view v-for="(item, index) in flowConfig.filter(v => v.isShow)" class="time-line">
						<view class="state"></view>
						<view class="content">
							<text class="label">{{ item.liableName }}</text>
							<app-select v-model="item.selectedUser" :selectData="item.userIdList"></app-select>
						</view>
					</view>
				</template>

				<!--正式工流程-->
				<template v-else>
					<view v-for="(item, index) in flowConfig.filter(v => v.isShow)" class="time-line">
						<view class="state"></view>
						<view class="content">
							<text class="label">{{ item.liableName }}</text>
							<app-select v-model="item.selectedUser" :selectData="item.userIdList"></app-select>
						</view>
					</view>
				</template>
			</view>
		</uni-forms>

		<view><button class="btn" :loading="submitLoading" @click="submit">提交</button></view>
		<view style="height: 8px;"></view>
	</view>
</template>

<script>
import { getProcessConfigure, getLeaveType, save } from '@/api/office/leave.js';
import AppSelect from '@/components/app-select.vue';
import FileViewer from '@/components/file-viewer.vue';

export default {
	components: { AppSelect, FileViewer },
	data() {
		return {
			formData: {
				approvalId: null,
				userId: null, // 申请人
				approvalSTime: '', // 开始时间
				approvalETime: '', // 结束时间
				approvalContent: null, // 请假原因
				auditor: null, // 审核人
				deptId: null, // 部门
				approvalType: 1, //类别(1请假，2加班，3出差,5报销)
				leaveType: 0, // 请假类型
				auditorIdList: [],
				leaveDays: 1 // 请假天数
			},
			show: false,
			leaveFiles: [], // 请假附件
			rules: {
				approvalSTime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择开始时间'
						},
						{
							validateFunction: (rule, value, data, callback) => {
								if (this.formData.approvalSTime && this.formData.approvalETime && new Date(this.formData.approvalSTime) > new Date(this.formData.approvalETime)) {
									callback('开始时间不能大于结束时间');
								} else {
									return true;
								}
							}
						}
					]
				},
				approvalETime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择结束时间'
						},
						{
							validateFunction: (rule, value, data, callback) => {
								if (this.formData.approvalSTime && this.formData.approvalETime && new Date(this.formData.approvalSTime) > new Date(this.formData.approvalETime)) {
									callback('结束时间不能小于开始时间');
								} else {
									return true;
								}
							}
						}
					]
				},
				approvalContent: {
					rules: [
						{
							required: true,
							errorMessage: '请输入请假原因'
						}
					]
				}
			},
			submitLoading: false,
			items: [],
			deptList: [], // 所有部门
			userList: [],
			userIdsTemp: [],
			userNames: [],
			userId: null,
			flowConfig: [], // 流程步骤配置
			leaveTypeList: [], // 请假类型
			isTempUser: false, // 是否是班组长和临时工
			startTimeSuffix: null, // 上班时间
			endTimeSuffix: null, // 下班时间
			posId: null,
			startTime: {
				start: 'null',
				end: 'null'
			},
			endTime: {
				start: 'null',
				end: 'null'
			},
			refresh: true
		};
	},
	computed: {
		dateArr: {
			set(newVal) {
				if (newVal) {
					this.formData.approvalSTime = newVal[0];
					this.formData.approvalETime = newVal[1];
				} else {
					this.formData.approvalSTime = '';
					this.formData.approvalETime = '';
				}
			},
			get() {
				return [this.formData.approvalSTime, this.formData.approvalETime];
			}
		}
	},
	onLoad() {
		const { userId, departId, userType, posId } = uni.getStorageSync(this.$const.USER_INFO);
		this.formData.userId = userId;
		this.formData.deptId = departId;
		this.posId = posId;

		// 获取审批步骤设置
		// 身份是班组长(userType=2)和临时工(userType=3)，参数传2，其他身份传1
		let paramType = null;
		if (+userType === 2 || +userType === 3) {
			this.isTempUser = true;
			paramType = 2;
		} else {
			paramType = 1;
		}
		if (this.isTempUser) {
			this.startTimeSuffix = ' 07:00:00';
			this.endTimeSuffix = ' 17:00:00';
		} else {
			this.startTimeSuffix = ' 08:30:00';
			this.endTimeSuffix = ' 17:00:00';
		}
		// 默认选择事假
		this.formData.leaveType = 3;
		getProcessConfigure(paramType).then(res => {
			res.forEach((v, index) => {
				v.isShow = true; // 根据请假时长来决定是否显示
				v.userIdList = v.userIdList.map(val => {
					val.label = val.displayName;
					val.value = val.userId;
					return val;
				});
				v.selectedUser = null;
				if (v.userIdList && v.userIdList.length) {
					v.selectedUser = v.userIdList[0].userId;
				}
				// 正式工可以清除步骤（默认选择步骤下第一个人，但是也可以清空）
				if (!this.isTempUser) {
					// 最后一步（人事部）不可以清空
					if (index !== res.length - 1) {
						v.userIdList.unshift({
							label: '请选择',
							value: null
						});
					}
				}
			});
			this.flowConfig = res;
			this.leaveTypeChange();
		});

		// 获取请假类型
		getLeaveType().then(res => {
			this.leaveTypeList = res.map((v, index) => {
				return {
					label: v.pname,
					value: v.pid
				};
			});
			// this.formData.leaveType = this.leaveTypeList[0].value;
		});
	},
	methods: {
		leaveTypeChange() {
			let now = null;
			// 补假，当天之后的日期不能选
			if (this.formData.leaveType === 24) {
				now = this.$dayjs().format('YYYY-MM-DD');
				// 设置开始时间为当日
				this.startTime.start = 'null';
				this.startTime.end = now;
				// 设置结束时间为当日
				this.endTime.start = 'null';
				this.endTime.end = now;
			} else {
				// 其他类型的请假默认是当前日期的后一天
				now = this.$dayjs()
					.add(1, 'day')
					.format('YYYY-MM-DD');
				// 设置开始时间从次日开始
				this.startTime.start = now;
				this.startTime.end = 'null';
				// 设置结束时间从次日开始
				this.endTime.start = now;
				this.endTime.end = 'null';
			}
			this.formData.approvalSTime = now + this.startTimeSuffix;
			this.formData.approvalETime = now + this.endTimeSuffix;
			this.calcDateDiff();
			this.refresh = false;
			this.$nextTick(() => {
				this.refresh = true;
			});
		},
		transToArray(target, arr) {
			target.forEach(v => {
				arr.push({
					text: v.departName,
					value: v.departId,
					type: 'dept',
					children: []
				});
				if (v.childs) {
					this.transToArray(v.childs, arr);
				}
			});
		},
		submit() {
			if (this.submitLoading) {
				return;
			}
			this.$refs.form.validate().then(res => {
				// this.submitLoading = true;
				const params = {
					approval: this.formData,
					files: this.leaveFiles,
					sign: []
				};
				const flowType = this.flowConfig.filter(v => v.isShow);
				flowType.forEach(item => {
					if (item.selectedUser) {
						params.sign.push({
							userId: item.selectedUser,
							sortIndex: item.sortIndex,
							configureId: item.configureId
						});
					}
				});
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
				save(params)
					.then(() => {
						this.submitLoading = false;
						uni.hideLoading();
						uni.$emit(this.$events.UPDATE_LEAVE_STATE);
						uni.navigateBack();
					})
					.catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						});
						this.submitLoading = false;
						uni.hideLoading();
					});
			});
		},
		// 上传附件
		upload(files) {
			this.leaveFiles = files;
		},
		/**
		 * 班组长和临时工身份的要根据请求时长来动态展示审批步骤
		 */
		calcDateDiff() {
			// 如果时间选择有误，不进行任何操作
			if (new Date(this.formData.approvalETime) < new Date(this.formData.approvalSTime)) {
				return;
			}
			const millisecondDiff =
				new Date(this.$dayjs(this.formData.approvalETime).format('YYYY-MM-DD')).getTime() - new Date(this.$dayjs(this.formData.approvalSTime).format('YYYY-MM-DD')).getTime();
			const dateDiff = millisecondDiff / 1000 / 60 / 60 / 24 + 1;
			this.formData.leaveDays = dateDiff;
			if (this.isTempUser) {
				// 临时工请假天数在3天及以上的，要选总经理步骤
				this.flowConfig[1].isShow = dateDiff >= 3;
			} else {
				// 申请人职位是经理(posId:4)，或者队长(posId:5)，或者组长(posId:14)或请假天数大于等于3天，显示总经理步骤
				this.flowConfig[1].isShow = this.posId === 4 || this.posId === 5 || this.posId === 14 || dateDiff >= 3;
				// 申请人不是经理、队长且部门不是人事部，显示部门主管步骤
				this.flowConfig[0].isShow = this.posId !== 4 && this.posId !== 5 && this.formData.deptId !== 4;
			}
		},
		setDateValue(e, type) {
			if (type === 1) {
				this.formData.approvalSTime = e;
			} else {
				this.formData.approvalETime = e;
			}
			this.calcDateDiff();
		},
		/**
		 * 根据请假天数，计算请假结束时间
		 */
		leaveDaysChange(e) {
			this.formData.leaveDays = e;
			// 非补假
			if (this.formData.leaveType !== 24) {
				this.formData.approvalETime =
					this.$dayjs(this.formData.approvalSTime)
						.add(this.formData.leaveDays - 1, 'day')
						.format('YYYY-MM-DD') + this.endTimeSuffix;
			} else {
				this.formData.approvalSTime =
					this.$dayjs(this.formData.approvalETime)
						.subtract(this.formData.leaveDays - 1, 'day')
						.format('YYYY-MM-DD') + this.startTimeSuffix;
			}
			if (this.flowConfig.length) {
				this.calcDateDiff();
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

/* .form {
	padding: 15px;
	background-color: white;
	margin-top: $-space-height;
} */

.btn {
	background-color: #1989fa;
	color: white;
	margin: 20px 10px 10px;
	font-size: 14px;
}

/deep/ .input-value-border {
	border: none;
}

.user-select {
	line-height: 36px;
	display: flex;
	justify-content: space-between;

	.placeholder {
		color: #7c7c7c;
	}
}

.time-line {
	border-left: 1px solid #e4e4e4;
	padding-left: 20px;
	padding-bottom: 20px;
	position: relative;
	margin-left: 10px;

	&:last-of-type {
		border-left: none;
		padding-bottom: 0;
	}

	.state {
		position: absolute;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		left: -5.5px;
		top: -4.5px;
		border: 2px solid #289cfe;
		background-color: white;
	}

	.content {
		position: relative;
		top: -18px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
	}
}
</style>
