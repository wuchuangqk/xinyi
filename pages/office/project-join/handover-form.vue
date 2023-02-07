<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<uni-forms ref="form" :modelValue="formData" :rules="rules" :labelWidth="70" :border="true" class="form">
			<uni-forms-item label="交接项目" name="projectId">
				<app-select v-if="projectIdData.length" v-model="formData.projectId" :selectData="projectIdData"></app-select>
			</uni-forms-item>
			<uni-forms-item label="接收人" name="newChargeId">
				<app-select v-if="newChargeIdData.length" v-model="formData.newChargeId" :selectData="newChargeIdData"></app-select>
			</uni-forms-item>
			<uni-forms-item label="备注" name="remark">
				<uni-easyinput type="textarea" autoHeight v-model="formData.remark" placeholder="请输入备注" :inputBorder="false" />
			</uni-forms-item>
		</uni-forms>
		<view v-if="projectIdData.length && newChargeIdData.length"><button class="btn" :loading="submitLoading" @click="submit">保存</button></view>
	</view>
</template>

<script>
import { save, getInfoListAll, getMyDutyProject } from '@/api/project/projectHandover.js';
import AppSelect from '@/components/app-select.vue';
export default {
	components: { AppSelect },
	data() {
		return {
			formData: {
				newChargeId: '',
				projectId: '',
				remark: ''
			},
			rules: {
				projectId: {
					rules: [
						{
							required: true,
							errorMessage: '请选择交接项目'
						}
					]
				},
				newChargeId: {
					rules: [
						{
							required: true,
							errorMessage: '请选择接收人'
						}
					]
				}
			},
			submitLoading: false,
			projectIdData: [],
			newChargeIdData: [],
			userId: null
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		// 获取当前用户拥有的项目
		getMyDutyProject().then(res => {
			this.projectIdData = res || []
			if(this.projectIdData.length) {
				this.formData.projectId = this.projectIdData[0].value
			}
		});
		// 获取交接人
		getInfoListAll().then(res => {
			let item = res.find(v => v.isSys === 0);
			this.newChargeIdData = item.coorUsers.filter(v => v.value !== this.userId);
			if(this.newChargeIdData.length) {
				this.formData.newChargeId = this.newChargeIdData[0].value
			}
		});
	},
	methods: {
		submit() {
			console.log(this.formData);
			if (this.submitLoading) {
				return;
			}
			this.$refs.form.validate().then(res => {
				return;
				this.submitLoading = true;
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
				saveOrUpdate(this.formData)
					.then(() => {
						this.submitLoading = false;
						uni.hideLoading();
						uni.$emit(this.$events.UPDATE_HANDOVER_STATE);
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
.tip {
	font-size: 14px;
	margin: 10px 20px;
	color: #f93636;
	text-align: center;
}
.text {
	line-height: 36px;
	padding-left: 10px;
}
</style>
