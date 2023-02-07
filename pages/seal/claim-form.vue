<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<uni-forms ref="form" :modelValue="formData" :labelWidth="110" :border="true" class="form">
			<view class="card">
				<uni-forms-item style="border-top: none;" label="用印时间" name="approvalSTime">
					<uni-datetime-picker
						v-if="refresh"
						type="date"
						:value="formData.approvalSTime"
						:border="false"
						:showClear="false"
						@change="value => (formData.approvalSTime = value)"
					></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item label="用印单位" name="approvalName" :required="true">
					<view class="list">
						<checkbox-group @change="({ detail }) => (formData.approvalName = detail.value)">
							<view class="list-item">
								<label>
									<checkbox value="1" />
									宁波扈阳建筑劳务有限公司
								</label>
							</view>
							<view class="list-item">
								<label>
									<checkbox value="2" />
									宁波永景金属科技有限公司
								</label>
							</view>
						</checkbox-group>
					</view>
				</uni-forms-item>
				<uni-forms-item label="用印种类" name="purpose" :required="true">
					<view class="list">
						<checkbox-group @change="({ detail }) => (formData.purpose = detail.value)">
							<view class="list-item">
								<label>
									<checkbox value="1" />
									公司公章
								</label>
							</view>
							<view class="list-item">
								<label>
									<checkbox value="2" />
									公司合同章
								</label>
							</view>
							<view class="list-item">
								<label>
									<checkbox value="3" />
									其他
								</label>
							</view>
						</checkbox-group>
					</view>
				</uni-forms-item>
				<uni-forms-item v-show="isShowOther" label="其他" name="approvalTitle" :required="true">
					<uni-easyinput v-model="formData.approvalTitle" :inputBorder="false" placeholder="请输入其他用印种类" />
				</uni-forms-item>
				<uni-forms-item label="项目名称" name="address" :required="true">
					<uni-easyinput v-model="formData.address" :inputBorder="false" placeholder="请输入项目名称" />
				</uni-forms-item>
				<uni-forms-item label="用印份数" name="number" :required="true"><uni-number-box :value="formData.number" :min="1" :max="99999999"></uni-number-box></uni-forms-item>
				<uni-forms-item label="用印事由" name="approvalContent" :required="true">
					<uni-easyinput type="textarea" autoHeight v-model="formData.approvalContent" placeholder="请输入用印事由" :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item label="备注" name="remarks">
					<uni-easyinput type="textarea" autoHeight v-model="formData.remarks" placeholder="请输入备注" :inputBorder="false" />
				</uni-forms-item>
			</view>

			<view class="card">
				<view class="card-title">
					<view class="left"><text>相关附件</text></view>
				</view>
				<file-viewer mode="upload" :files="[]" :limit="10" platform="oa" fileType="certificatesAndSeals" @file-change="upload"></file-viewer>
			</view>

			<view class="card">
				<view class="card-title" style="margin-bottom: 20px;">
					<view class="left"><text>审批人</text></view>
				</view>
				<template>
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
import { save, getProcessConfigure } from '@/api/office/seal.js';
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
				approvalSTime: '', // 用印时间
				approvalContent: '', // 用印事由
				approvalName: [], // 用印单位
				purpose: [], // 用印类型
				signs: [],
				remarks: '', // 备注
				approvalType: 8, // 8=用印，9=用印
				files: [], // 附件
				approvalTitle: '', // 用于记录选择其他时填写的内容
				number: 1, // 用印数量
				address: null // 项目名称
			},
			show: false,
			rules: {
				approvalSTime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择用印时间'
						}
					]
				},
				approvalName: {
					rules: [
						{
							required: true,
							errorMessage: '请选择用印单位'
						}
					]
				},
				purpose: {
					rules: [
						{
							required: true,
							errorMessage: '请选择用印种类'
						}
					]
				},
				address: {
					rules: [
						{
							required: true,
							errorMessage: '请输入项目名称'
						}
					]
				},
				number: {
					rules: [
						{
							required: true,
							errorMessage: '请输入用印份数'
						}
					]
				},
				approvalContent: {
					rules: [
						{
							required: true,
							errorMessage: '请输入用印事由'
						}
					]
				}
			},
			submitLoading: false,
			flowConfig: [], // 流程步骤配置
			refresh: true
		};
	},
	computed: {
		isShowOther() {
			return this.formData.purpose.includes('3');
		}
	},
	// 项目详情里的用印会传projectId
	onLoad() {
		const { userId, departId, userType } = uni.getStorageSync(this.$const.USER_INFO);
		this.formData.userId = userId;
		this.formData.deptId = departId;
		this.formData.approvalSTime = this.$dayjs().format('YYYY-MM-DD');
		getProcessConfigure(9).then(res => {
			res.forEach((v, index) => {
				v.userIdList = v.userIdList.map(val => {
					val.label = val.displayName;
					val.value = val.userId;
					return val;
				});
				v.isShow = true;
				v.selectedUser = null;
				if (v.userIdList && v.userIdList.length) {
					v.selectedUser = v.userIdList[0].userId;
				}
				if (v.userIdList !== null && index !== 1) {
					v.userIdList.unshift({
						label: '请选择',
						value: null
					});
				}
			});
			this.flowConfig = res;
		});
	},
	onReady() {
		this.$refs.form.setRules(this.rules);
	},
	methods: {
		submit() {
			if (this.submitLoading) {
				return;
			}
			this.$refs.form.validate().then(res => {
				if (this.isShowOther && !this.formData.approvalTitle) {
					uni.showToast({
						title: '请输入其他用印种类',
						icon: 'none'
					});
					return;
				}
				// 附件必填
				if (this.formData.files.length === 0) {
					uni.showToast({
						title: '请上传相关附件',
						icon: 'none'
					});
					return;
				}
				const flowType = this.flowConfig.filter(v => v.isShow);
				if (flowType.every(v => !v.selectedUser)) {
					uni.showToast({
						title: '请至少选择一个步骤',
						icon: 'none'
					});
					return;
				}
				this.formData.approvalSTime = this.$dayjs(this.formData.approvalSTime).format('YYYY-MM-DD HH:mm:ss');
				this.formData.approvalName = this.formData.approvalName.join(',')
				this.formData.purpose = this.formData.purpose.join(',')
				this.formData.signs = [];
				flowType.forEach(item => {
					if (item.selectedUser) {
						this.formData.signs.push({
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
				save(this.formData)
					.then(() => {
						this.submitLoading = false;
						uni.hideLoading();
						uni.$emit(this.$events.UPDATE_SEAL_STATE);
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
			this.formData.files = files;
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: 100%;
	background-color: $-bg-color;
}

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

.list {
	.list-item {
		margin-bottom: 10px;
		&:last-of-type {
			margin-bottom: 0;
		}
	}
}
</style>
