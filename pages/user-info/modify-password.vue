<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<uni-forms ref="form" :modelValue="formData" :rules="rules" :labelWidth="90" :border="true" class="form">
			<uni-forms-item label="新密码" name="newPwd">
				<uni-easyinput type="password" v-model="formData.newPwd" placeholder="请输入新密码" :inputBorder="false" maxlength="12"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="重复新密码" name="rePwd">
				<uni-easyinput type="password" v-model="formData.rePwd" placeholder="请再次输入新密码" :inputBorder="false" maxlength="12"></uni-easyinput>
			</uni-forms-item>
		</uni-forms>
		<view><button class="btn" :loading="submitLoading" @click="submit">提交</button></view>
		<neil-modal :show="showModel" title="提示" content="密码修改成功" align="center" @confirm="back" :showCancel="false" @close="back"></neil-modal>
		
	</view>
</template>

<script>
import { updatePassword } from '@/api/user.js';
export default {
	data() {
		return {
			formData: {
				newPwd: '',
				rePwd: ''
				// oldPwd: ''
			},
			rules: {
				/* oldPwd: {
					rules: [
						{
							required: true,
							errorMessage: '请输入新密码'
						}
					]
				}, */
				newPwd: {
					rules: [
						{
							required: true,
							errorMessage: '请输入新密码'
						},
						{
							minLength: 6,
							maxLength: 12,
							errorMessage: '密码长度在6-12位'
						},
						{
							pattern: /^[0-9a-zA-Z]{6,12}$/,
							errorMessage: '密码只能由数字和字母组成'
						},
						{
							validateFunction: (rule, value, data, callback) => {
								if (this.formData.newPwd !== this.formData.rePwd) {
									callback('两次密码输入不一致');
								} else {
									return true;
								}
							}
						}
					]
				},
				rePwd: {
					rules: [
						{
							required: true,
							errorMessage: '请再次输入新密码'
						},
						{
							minLength: 6,
							maxLength: 12,
							errorMessage: '密码长度在6-12位'
						},
						{
							pattern: /^[0-9a-zA-Z]{6,12}$/,
							errorMessage: '密码只能由数字和字母组成'
						},
						{
							validateFunction: (rule, value, data, callback) => {
								if (this.formData.newPwd !== this.formData.rePwd) {
									callback('两次密码输入不一致');
								} else {
									return true;
								}
							}
						}
					]
				}
			},
			submitLoading: false,
			userId: null,
			showModel: false
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
	},
	methods: {
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
				updatePassword(this.formData.newPwd, this.userId)
					.then(() => {
						this.showModel = true
						uni.hideLoading();
					})
					.catch(() => {
						uni.showToast({
							title: '提交失败',
							icon: 'none'
						});
						uni.hideLoading();
					});
			});
		},
		back() {
			uni.navigateBack();
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
}
</style>
