<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card form-card">
						<u-form-item label="日期" prop="NianYue" required>
							<date-picker v-model="formData.NianYue" :defaultTime="formData.NianYue" placeholder="请选择日期" mode="month" />
						</u-form-item>
						<u-form-item label="工作分类" prop="MonthType" required>
							<option-picker v-model="formData.MonthType" :list="MonthTypeOptions" placeholder="请选择工作分类" />
						</u-form-item>
						<u-form-item label="完成情况" prop="status" required>
							<option-picker v-model="formData.status" :list="statusOptions" placeholder="请选择完成情况" />
						</u-form-item>
						<u-form-item label="项目名称">
							<u-input v-model="formData.ProjectName" placeholder="请输入项目名称" />
						</u-form-item>
						<u-form-item label="">
							<view class="flex-1">
								<view>工作计划</view>
								<view class="input-bg">
									<uni-easyinput type="textarea" autoHeight v-model="formData.JiHua" placeholder="请输入工作计划"
										:inputBorder="false" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="">
							<view class="flex-1">
								<view>工作完成情况</view>
								<view class="input-bg">
									<uni-easyinput type="textarea" autoHeight v-model="formData.JiHuaCheck" placeholder="请输入工作完成情况"
										:inputBorder="false" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="">
							<view class="flex-1">
								<view>下月工作计划</view>
								<view class="input-bg">
									<uni-easyinput type="textarea" autoHeight v-model="formData.NextJiHua" placeholder="请输入下月工作计划"
										:inputBorder="false" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="">
							<view class="flex-1">
								<view>存在的问题及需领导解决的事项</view>
								<view class="input-bg">
									<uni-easyinput type="textarea" autoHeight v-model="formData.ProblemWork" placeholder="请输入存在的问题及需领导解决的事项"
										:inputBorder="false" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="责任人">
							<userPicker :selectedUsers="selectedUsers" url="/pages/zonghe/select-user" />
						</u-form-item>
					</view>
				</u-form>
			</scroll-view>
		</view>
		<view class="app-page-footer">
			<button class="btn" @click="submit">提交</button>
		</view>
		<view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
	</view>
</template>

<script>
import renderMixin from '@/mixin/render'
import userPicker from '@/components/user-picker'

export default {
	components: { userPicker },
	mixins: [renderMixin],
	data() {
		return {
			formData: {
				// 年月
				NianYue: '',
				// 项目名称
				ProjectName: '',
				// 工作计划
				JiHua: '',
				// 工作完成情况
				JiHuaCheck: '',
				// 下月工作计划
				NextJiHua: '',
				// 存在的问题及需领导解决的事项
				ProblemWork: '',
				// 责任人
				staff_ids: '',
				MonthType: '', // 工作分类
				status: '', // 完成情况
				id: '',
			},
			rules: {
				NianYue: [{ required: true, message: '请选择日期' }],
			},
			selectedUsers: [],
			dataId: '',
			MonthTypeOptions: [
				{ label: '重点工作', value: 0 },
				{ label: '日常工作', value: 1 },
			],
			statusOptions: [
				{ label: '跟进', value: 0 },
				{ label: '完成', value: 1 },
				{ label: '结束', value: 2 },
			],
		};
	},
	onLoad({ dataId, }) {
		this.dataId = dataId
	},
	onShow() {
		// 读取选择的用户
		this.selectedUsers = this.$store.state.selectedUsers
	},
	onUnload() {
		this.$store.dispatch('selectedUsers', [])
	},
	onReady() {
		this.getDetail()
		this.$refs.uForm.setRules(this.rules);
		this.formData.NianYue = this.$dayjs().format('YYYY-MM-01')
	},
	methods: {
		getDetail() {
			this.doGet('/month/list/' + this.dataId).then(res => {
				Object.keys(this.formData).forEach(key => {
					if (res.data[key] !== undefined) {
						this.formData[key] = res.data[key]
					}
				})
				this.selectedUsers = res.data.userList.map(val => {
					return {
						id: val.id,
						displayname: val.name,
						userid: val.id,
						name: val.name,
					}
				})
				this.$store.dispatch('selectedUsers', this.selectedUsers)
			})
		},
		submit() {
			this.$refs.uForm.validate(valid => {
				if (!valid) return
				uni.showLoading({
					title: '正在提交',
					mask: true,
				});
				this.formData.staff_ids = this.selectedUsers.map(val => val.id).join(',')
				this.renderParams = this.setPostData(this.formData)
			})
		},
	}
};
</script>
<script module="renderModule" lang="renderjs">
import axios from 'axios'
import { axiosRequest } from '@/util/post.js'
export default {
  methods: {
		change(renderParams) {
			if (renderParams !== null) {
				axiosRequest('/month/update', renderParams, axios).then(res => {
					this.$ownerInstance.callMethod('callback', {
						success: true,
					})
				}).catch(err => {
					this.$ownerInstance.callMethod('callback', {
						success: false,
						res: err
					})
				})
			}
		}
  },
}
</script>

<style scoped lang="scss">
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

.input-bg {
	background-color: #f7f7f7;
	padding: 0 6px;
	border-radius: 2px;
}
</style>
