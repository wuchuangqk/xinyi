<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card form-card">
						<u-form-item label="申请人">
							<text>{{ userInfo.name }}</text>
						</u-form-item>
						<u-form-item label="申请时间" required>
							<date-picker v-model="formData.docDate" :defaultTime="formData.docDate" placeholder="请选择申请时间" />
						</u-form-item>
						<u-form-item label="申请车辆" required prop="Vehicle">
							<option-picker v-model="formData.Vehicle" :list="vehicleOptions" placeholder="请选择申请车辆" />
						</u-form-item>
					</view>
					<!-- 审批人 -->
					<view class="card">
						<view class="card-title" style="margin-bottom: 0;">
							<view class="left"><text>审批人</text></view>
						</view>
						<u-form-item label="综合部审批人" prop="zhbspid" required label-width="200">
							<option-picker v-model="formData.zhbspid" :list="zhbspidOptions" placeholder="请选择" />
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
				docDate: '', // 申请日期
				Vehicle: '', // 申请车辆
				zhbspid: '', // 综合部审批人
			},
			VehicleOptions: [
				{ label: '是', value: '1' },
				{ label: '否', value: '0' }
			],
			vehicleOptions: [],
			zhbspidOptions: [],
			rules: {
				Vehicle: [{ required: true, message: '请选择部申请车辆' }],
				zhbspid: [{ required: true, message: '请选择综合部审批人' }],
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
		const fmtOptions2 = (arr) => {
			return (arr || []).map(val => {
				return {
					label: val.name,
					value: val.id,
				}
			})
		}
		this.doGet("/car/carlist").then((res) => {
			this.vehicleOptions = fmtOptions2(res.data)
			if (this.vehicleOptions.length > 0) {
				this.formData.Vehicle = this.vehicleOptions[0].value;
			}
		});
		this.doGet("/jiayou/zhbsp").then((res) => {
			this.zhbspidOptions = fmtOptions(res.data)
			if (this.zhbspidOptions.length > 0) {
				this.formData.zhbspid = this.zhbspidOptions[0].value;
			}
		})
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
				axiosRequest('/jiayou/add', renderParams, axios).then(res => {
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
