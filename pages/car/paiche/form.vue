<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card form-card">
						<u-form-item label="申请人">
							<text>{{ userInfo.name }}</text>
						</u-form-item>
						<u-form-item label="部室">
							<text>{{ userInfo.depart }}</text>
						</u-form-item>
						<u-form-item label="派车时间" required>
							<date-picker v-model="formData.DocDate" :defaultTime="formData.DocDate" mode="date" placeholder="请选择开始时间" />
						</u-form-item>
						<u-form-item label="是否带驾驶员" required>
							<option-picker v-model="formData.zijia" :list="zijiaOptions" placeholder="请选择是否带驾驶员" />
						</u-form-item>
						<u-form-item label="派车事由" prop="comments" required>
							<u-input v-model="formData.comments" placeholder="请输入派车事由" />
						</u-form-item>
						<u-form-item label="随行人">
							<u-input v-model="formData.SuiXing" placeholder="请输入随行人" />
						</u-form-item>
					</view>
					<view class="card">
						<view class="card-title" style="margin-bottom: 0;">
							<view class="left"><text>起止地点</text></view>
						</view>
						<view class="addr-wrap">
							<u-input v-model="formData.DiDianCurr" :border="true" placeholder="请输入" />
							<text class="text">至</text>
							<u-input v-model="formData.DiDianCurrEnd" :border="true" placeholder="请输入" />
						</view>
					</view>
					<!-- 审批人 -->
					<view class="card">
						<view class="card-title" style="margin-bottom: 0;">
							<view class="left"><text>审批人</text></view>
						</view>
						<u-form-item label="部门审核人" prop="auditor" required label-width="200">
							<option-picker v-model="formData.auditor" :list="auditorOptions" placeholder="请选择" />
						</u-form-item>
						<u-form-item label="综合部审批人" prop="zonghebu" required label-width="200">
							<option-picker v-model="formData.zonghebu" :list="zonghebuOptions" placeholder="请选择" />
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
export default {
	mixins: [renderMixin],
	data() {
		return {
			formData: {
				SuiXing: '', // 随行人
				zijia: '0', // 是否带驾驶员（默认不带）
				DiDianCurr: '', // 起止地点-起
				DiDianCurrEnd: '', // 起止地点-止
				comments: '', // 派车事由
				DocDate: '', // 派车时间
				auditor: '', // 部门审核人
				zonghebu: '', // 综合部审批人
			},
			zijiaOptions: [
				{ label: '是', value: '1' },
				{ label: '否', value: '0' }
			],
			auditorOptions: [],
			zonghebuOptions: [],
			rules: {
				comments: [{ required: true, message: '请输入派车事由' }],
				auditor: [{ required: true, message: '请选择部门审核人' }],
				zonghebu: [{ required: true, message: '请选择综合部审批人' }],
			},
			// listPath: '/pages/chuchai/list',
			userInfo: {}, // 用户信息
		};
	},
	onLoad({ from }) {
		this.from = from
	},
	onReady() {
		const fmtOptions = (arr) => {
			return (arr || []).map(val => {
				return {
					label: val.DisplayName,
					value: val.UserID,
				}
			})
		}
		this.doGet("/CarMileages/getShenHeRen").then((res) => {
			this.auditorOptions = fmtOptions(res.data.buMenShenHeList)
			this.zonghebuOptions = fmtOptions(res.data.zongHeBulist)
			if (this.auditorOptions.length > 0) {
				this.formData.auditor = this.auditorOptions[0].value;
			}
			if (this.zonghebuOptions.length > 0) {
				this.formData.zonghebu = this.zonghebuOptions[0].value;
			}
		});
		this.formData.DocDate = this.$dayjs().format('YYYY-MM-DD')
		this.$refs.uForm.setRules(this.rules);
		this.userInfo = uni.getStorageSync(this.$const.USER_INFO)
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (!valid) return
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
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
				axiosRequest('/CarMileages/add', renderParams, axios).then(res => {
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
.addr-wrap {
	margin-top: 10px;
	display: flex;
	align-items: center;

	.text {
		margin: 0 8px;
	}
}
</style>
