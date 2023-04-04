<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<div style="height: 1px;"></div>
				<view class="card">
					<view class="detail-item">
						<text class="label">申请维修项目及预算费用</text>
						<text class="value">{{ detail.comments }}</text>
					</view>
					<view class="detail-item">
						<text class="label">修理厂</text>
						<text class="value">{{ detail.XiuLiChang }}</text>
					</view>
					<view class="detail-item">
						<text class="label">维修时间</text>
						<text class="value">{{ detail.docDate }}</text>
					</view>
					<view class="detail-item">
						<text class="label">流转状态</text>
						<text class="value">{{ detail.docState }}</text>
					</view>
					<view class="detail-item">
						<text class="label">车型</text>
						<text class="value">{{ detail.cx }}</text>
					</view>
					<view class="detail-item">
						<text class="label">车号</text>
						<text class="value">{{ detail.ch }}</text>
					</view>
					<view class="detail-item">
						<text class="label">驾驶员</text>
						<text class="value">{{ detail.jsy }}</text>
					</view>
					<view class="detail-item">
						<text class="label">申请人</text>
						<text class="value">{{ detail.creator }}</text>
					</view>
				</view>
				<!-- 审批意见 -->
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view v-if="isApprove === '1'" class="card">
						<view class="card-title">
							<view class="left"><text>审批</text></view>
						</view>
						<u-form-item label="意见快捷模板">
							<option-picker v-model="template" :list="templateOptions" placeholder="请选择"
								@update:modelValue="templateChange" />
						</u-form-item>
						<u-form-item label="审批意见" prop="option" required>
							<u-input v-model="formData.option" placeholder="请输入审批意见" type="textarea" autoHeight></u-input>
						</u-form-item>
						<u-form-item label="申请人">
							<userPicker :selectedUsers="selectedUsers" url="/pages/zonghe/select-user" />
						</u-form-item>
					</view>
				</u-form>
			</scroll-view>
		</view>
		<view v-if="isApprove === '1'" class="page-footer">
			<button class="btn danger" @click="showConfirm = true">驳回</button>
			<button class="btn" @click="pass">同意</button>
		</view>
		<u-modal v-model="showConfirm" content="确认驳回吗" show-cancel-button @confirm="reject"></u-modal>
		<view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
	</view>
</template>

<script>
import userPicker from '@/components/user-picker'
import renderMixin from '@/mixin/render'

export default {
	components: { userPicker },
	mixins: [renderMixin],
	data() {
		return {
			detail: {}, // 详情字段
			formData: {
				option: '', // 审批意见
				id: '',
				Pass: 1, // 1同意0驳回
				staff_ids: '', // 下级审批人
			},
			templateOptions: [], // 审批意见快捷模板
			template: '',
			rules: {
				option: [{ required: true, message: '请输入审批意见' }],
			},
			selectedUsers: [],
			showConfirm: false, // 驳回确认
			isApprove: '',
		};
	},
	onLoad({ dataId, isApprove }) {
		this.formData.id = dataId
		this.isApprove = isApprove
	},
	onReady() {
		this.getDetail()
		this.$refs.uForm.setRules(this.rules);
	},
	onShow() {
		// 读取选择的用户
		this.selectedUsers = this.$store.state.selectedUsers
	},
	onUnload() {
		this.$store.dispatch('selectedUsers', [])
	},
	methods: {
		getDetail() {
			const fmtOptions = (arr) => {
				return (arr || []).map(val => {
					return {
						label: val.name,
						value: val.id,
					}
				})
			}
			this.doGet('/car/weixiulist', { item_id: this.formData.id }).then(res => {
				this.detail = res.data
			})
			this.doGet('/car/commentStore').then(res => {
				this.templateOptions = fmtOptions(res.data)
			})
		},
		templateChange(val) {
			const item = this.templateOptions.find(v => v.value === val)
			if (item) {
				this.formData.option = item.label
			}
		},
		submit() {
			this.$refs.uForm.validate(valid => {
				if (!valid) return
				uni.showLoading({
					title: '正在提交',
					mask: true,
				});
				this.formData.staff_ids = this.selectedUsers.map(val => val.userid).join(',')
				this.renderParams = this.setPostData(this.formData)
			})
		},
		pass() {
			this.formData.Pass = 1
			this.submit()
		},
		reject() {
			this.formData.Pass = 0
			this.submit()
		}
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
				axiosRequest('/car/save', renderParams, axios).then(res => {
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
@import '@/styles/detail.scss';

.card .card-title {
	margin-bottom: 15px;
}

.page-footer {
	padding: 10rpx;
	display: flex;

	.btn {
		background-color: #3880ff;
		color: white;
		font-size: 28rpx;
		flex: 1;

		&.danger {
			background-color: #fa3534;
			margin-right: 10px;
		}
	}
}
</style>
