<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<uni-forms ref="form" :modelValue="formData" :rules="rules" :labelWidth="70" :border="true" class="form">
			<view class="card">
				<uni-forms-item style="border-top: none;" label="申请人" name="null">
					<view class="line-label">
						<text>{{ userName }}</text>
					</view>
				</uni-forms-item>
				<uni-forms-item style="border-top: none;" label="所属部门" name="null">
					<view class="line-label">
						<text>{{ deptName }}</text>
					</view>
				</uni-forms-item>
				<uni-forms-item style="border-top: 1px #eee solid;" label="离职时间" name="approvalSTime">
					<uni-datetime-picker type="datetime" v-model="formData.approvalSTime" :border="false" :showClear="false" :start="startTime.start"
						:end="startTime.end"></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item label="离职原因" name="approvalContent" :required="true">
					<uni-easyinput type="textarea" autoHeight v-model="formData.approvalContent" placeholder="请输入离职原因" :inputBorder="false" />
				</uni-forms-item>
			</view>

			<view class="card">
				<view class="card-title" style="margin-bottom: 20px;">
					<view class="left"><text>审批人</text></view>
				</view>
				<view v-for="(item, index) in flowConfig" class="time-line">
					<view class="state"></view>
					<view class="content">
						<text class="label">{{ item.liableName }}</text>
						<app-select v-model="item.selectedUser" :selectData="item.userIdList"></app-select>
					</view>
				</view>
			</view>
		</uni-forms>

		<view><button class="btn" :loading="submitLoading" @click="submit">提交</button></view>
		<view style="height: 8px;"></view>
	</view>
</template>

<script>
import { getProcessConfigure, getLeaveType, save } from '@/api/office/leave.js';
import dayjs from 'dayjs';
import AppSelect from '@/components/app-select.vue';
import FileViewer from '@/components/file-viewer.vue';

export default {
	components: { AppSelect, FileViewer },
	data() {
		return {
			formData: {
				approvalId: null,
				userId: null, // 申请人
				deptId: null, // 部门
				approvalSTime: '', // 开始时间
				approvalETime: '', // 结束时间
				approvalContent: '', // 事由
				auditor: null, // 审核人
				approvalType: 2, //类别(1请假，2加班，3出差,5报销)
				leaveType: '', // 请假类型
				auditorIdList: [],
				colleagues: ''
			},
			rules: {
				approvalSTime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择离职时间'
						}
					]
				},
				approvalContent: {
					rules: [
						{
							required: true,
							errorMessage: '请输入离职原因'
						}
					]
				}
			},
			submitLoading: false,
			flowConfig: [], // 流程步骤配置
			userName: null,
			deptName: null,
			startTime: {
				start: 'null',
				end: 'null'
			},
		};
	},
	onLoad() {
		const { userId, departId, userType, userName, departName, posId } = uni.getStorageSync(this.$const.USER_INFO);
		this.formData.userId = userId;
		this.formData.deptId = departId;
		this.userName = userName;
		this.deptName = departName;
		this.startTime.start = this.$dayjs().format('YYYY-MM-DD');
		// 离职固定传3
		getProcessConfigure(3).then(res => {
			res.forEach((v, index) => {
				v.selectedUser = null;
				v.userIdList = v.userIdList.map(val => {
					val.label = val.displayName;
					val.value = val.userId;
					return val;
				});
				// 除了最后一步人事部，前面的步骤可以不选
				if(index !== res.length - 1) {
					v.userIdList.unshift({
						label: '请选择',
						value: null
					})
				}
				if (v.userIdList && v.userIdList.length) {
					if(v.userIdList[0].value === null) {
						if(v.userIdList.length > 1) {
							v.selectedUser = v.userIdList[1].value;
						}
					}else {
						v.selectedUser = v.userIdList[0].value;
					}
				}
			});
			// 当职位是经理(posId:4),组长(posId:14),队长(posId:5)和部门是人事部(departmentId:4)时，没有第一个部门主管步骤
			if ([4, 5, 14].includes(posId) || departId === 4) {
				res.splice(0, 1);
			}
			this.flowConfig = res;
		});
	},
	methods: {
		submit() {
			if (this.submitLoading) {
				return;
			}
			this.$refs.form.validate().then(res => {
				this.submitLoading = true;
				this.formData.approvalETime = this.formData.approvalSTime = this.$dayjs(this.formData.approvalSTime).format('YYYY-MM-DD HH:mm:ss');
				const params = {
					approval: this.formData,
					files: [],
					sign: []
				};
				if (this.flowConfig.every(flow => flow.selectedUser === null)) {
					uni.showToast({
						title: '请至少选择一位审批负责人',
						icon: 'none'
					});
					this.submitLoading = false;
					return;
				}
				this.flowConfig.forEach(item => {
					if (item.selectedUser !== null) {
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
						uni.$emit(this.$events.UPDATE_LEAVE_OFFICE_STATE);
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

.line-label {
	line-height: 26px;
	height: 36px;
	box-sizing: border-box;
	padding: 5px 0 5px 10px;
}
</style>
