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
						<u-form-item label="维修车辆" required prop="Vehicle">
							<option-picker v-model="formData.Vehicle" :list="VehicleOptions" placeholder="请选择维修车辆" />
						</u-form-item>
						<u-form-item label="维修时间" required>
							<date-picker v-model="formData.docDate" :defaultTime="formData.docDate" placeholder="请选择维修时间" />
						</u-form-item>
						<u-form-item label="修理厂" required prop="XiuLiChang">
							<u-input v-model="formData.XiuLiChang" placeholder="请输入修理厂" />
						</u-form-item>
						<u-form-item label="申请维修项目及预算费用" required prop="comments">
							<u-input v-model="formData.comments" placeholder="请输入申请维修项目及预算费用" type="textarea" auto-height />
						</u-form-item>
						<u-form-item label="维修流程模板" required  prop="templateid">
							<option-picker v-model="formData.templateid" :list="templateidOptions" placeholder="请选择维修流程模板" />
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
				Vehicle: '', // 修理车辆
				XiuLiChang: '', // 修理厂
				docDate: '', // 车辆维修时间
				comments: '', // 申请维修及预算费用
				templateid: '', // 维修流程模板
			},
			VehicleOptions: [],
			templateidOptions: [],
			rules: {
				Vehicle: [{ required: true, message: '请选择维修车辆' }],
				XiuLiChang: [{ required: true, message: '请输入修理厂' }],
				comments: [{ required: true, message: '请输入申请维修及预算费用' }],
				templateid: [{ required: true, message: '请选择维修流程模板' }],
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
					label: val.name,
					value: val.id,
				}
			})
		}
		this.doGet("/car/carlist").then((res) => {
			this.VehicleOptions = fmtOptions(res.data)
			if (this.VehicleOptions.length > 0) {
				this.formData.Vehicle = this.VehicleOptions[0].value;
			}
		});
		this.doGet("/car/templatelist").then((res) => {
			this.templateidOptions = fmtOptions(res.data)
			if (this.templateidOptions.length > 0) {
				this.formData.templateid = this.templateidOptions[0].value;
			}
		});
		this.formData.docDate = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
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
				axiosRequest('/car/add', renderParams, axios).then(res => {
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
