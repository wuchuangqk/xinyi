<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<uni-forms ref="form" :modelValue="formData" :rules="rules" :labelWidth="70" :border="true" class="form">
			<uni-forms-item label="事项" name="title">
				<uni-easyinput type="text" v-model="formData.title" placeholder="请输入待办事项" :inputBorder="false" maxlength="50" />
			</uni-forms-item>
			<uni-forms-item label="开始时间" name="startTime"><uni-datetime-picker type="datetime" v-model="formData.startTime" :border="false"></uni-datetime-picker></uni-forms-item>
			<uni-forms-item label="结束时间" name="endTime"><uni-datetime-picker type="datetime" v-model="formData.endTime" :border="false"></uni-datetime-picker></uni-forms-item>
			<uni-forms-item v-if="formData.scheduleId === null" label="责任人" name="userIds">
				<view class="user-select">
					<text>{{ selectedUsers.map(v => v.label).join('、') }}</text>
					<text class="icon-wrap" @click="navToUserSelector"><uni-icons type="personadd" size="18" color="#1989fa"></uni-icons></text>
				</view>
			</uni-forms-item>
			<!--编辑时不允许修改责任人-->
			<uni-forms-item v-if="formData.scheduleId !== null" label="责任人" name="userIds">
				<view class="user-select">
					<text class="placeholder">{{ formData.userName }}</text>
				</view>
			</uni-forms-item>
			<uni-forms-item label="备注" name="remark">
				<uni-easyinput type="textarea" autoHeight v-model="formData.remark" placeholder="请输入备注" :inputBorder="false" />
			</uni-forms-item>
		</uni-forms>
		<view><button class="btn" :loading="submitLoading" @click="submit">保存</button></view>
	</view>
</template>

<script>
// import { save, update, getById } from '@/api/core/schedule.js';
import { getDept } from '@/api/system/dept.js';
import { getUserList } from '@/api/user.js';
import dayjs from 'dayjs';
import multipleSelect from '@/components/momo-multipleSelect/momo-multipleSelect';
export default {
	components: { multipleSelect },
	data() {
		return {
			formData: {
				endTime: '',
				remark: '',
				scheduleId: null,
				startTime: '',
				title: '',
				userIds: []
			},
			show: false,
			rules: {
				// 对name字段进行必填验证
				title: {
					rules: [
						{
							required: true,
							errorMessage: '请输入待办事项'
						}
					]
				},
				startTime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择开始时间'
						},
						{
							validateFunction: (rule, value, data, callback) => {
								if (this.formData.startTime && this.formData.endTime && new Date(this.formData.startTime) > new Date(this.formData.endTime)) {
									callback('开始时间不能大于结束时间');
								} else {
									return true;
								}
							}
						}
					]
				},
				endTime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择结束时间'
						},
						{
							validateFunction: (rule, value, data, callback) => {
								if (this.formData.startTime && this.formData.endTime && new Date(this.formData.startTime) > new Date(this.formData.endTime)) {
									callback('结束时间不能小于开始时间');
								} else {
									return true;
								}
							}
						}
					]
				},
				userIds: {
					rules: [
						{
							validateFunction: (rule, value, data, callback) => {
								if (this.formData.userIds.length === 0) {
									callback('请选择责任人');
								}
								return true;
							}
						}
					]
				}
			},
			submitLoading: false,
			items: [],
			userNames: [],
			userId: null,
			selectedUsers: [] // 所选择的责任人
		};
	},
	computed: {
		dateArr: {
			set(newVal) {
				if (newVal) {
					this.formData.startTime = newVal[0];
					this.formData.endTime = newVal[1];
				} else {
					this.formData.startTime = '';
					this.formData.endTime = '';
				}
			},
			get() {
				return [this.formData.startTime, this.formData.endTime];
			}
		}
	},
	onLoad({ scheduleId, date }) {
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		const { userId, userName } = uni.getStorageSync(this.$const.USER_INFO);
		this.selectedUsers.push({
			label: userName,
			value: userId
		});
		if (scheduleId) {
			uni.setNavigationBarTitle({
				title: '编辑事项'
			});
			getById(scheduleId).then(res => {
				this.formData = res;
			});
		} else {
			date = date || new Date();
			this.formData.startTime = this.$dayjs(date).format('YYYY-MM-DD') + ' 00:00:00';
			this.formData.endTime = this.$dayjs(date).format('YYYY-MM-DD') + ' 23:59:00';
			this.formData.userIds = [this.userId];
		}
		// 监听选择用户
		uni.$on(this.$events.UPDATE_COPY_USERS, users => {
			this.selectedUsers = users;
			this.formData.userIds = users.map(v => v.value);
		});
	},
	methods: {
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
				this.submitLoading = true;
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
				this.formData.userIds = this.selectedUsers.map(v => v.value);
				const promise = this.formData.scheduleId ? update(this.formData) : save(this.formData);
				promise
					.then(() => {
						this.submitLoading = false;
						uni.hideLoading();
						uni.$emit(this.$events.UPDATE_SCHEDULE);
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
		/**
		 * 跳转到用户选择器页面
		 */
		navToUserSelector() {
			uni.setStorageSync(this.$const.COPY_USER, this.selectedUsers);
			uni.navigateTo({
				url: `/pages/common/carbon-copy/carbon-copy`
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

.form {
	padding: 15px;
	background-color: white;
	margin-top: $-space-height;
}

.btn {
	background-color: #1989fa;
	color: white;
	margin: 20px 10px;
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
	.icon-wrap {
		padding: 0 10px;
	}
}
</style>
