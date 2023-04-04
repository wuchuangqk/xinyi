<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view style="height: 1px;"></view>
					<view class="card form-card">
						<u-form-item label="加油卡余额" prop="SuLiang" required>
							<u-input v-model="formData.SuLiang" type="number" placeholder="请输入加油卡余额" />
						</u-form-item>
						<u-form-item label="加油金额" prop="JinE" required>
							<u-input v-model="formData.JinE" type="number" placeholder="请输入加油金额" />
						</u-form-item>
						<u-form-item label="里程数" prop="LiCheng" required>
							<u-input v-model="formData.LiCheng" type="number" placeholder="请输入里程数" />
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
				id: '',
				SuLiang: '', // 加油卡余额
				JinE: '', // 加油金额
				LiCheng: '', // 里程数
			},
			rules: {
				SuLiang: [{ required: true, message: '请输入加油卡余额' }],
				JinE: [{ required: true, message: '请输入加油金额' }],
				LiCheng: [{ required: true, message: '请输入里程数' }],
			},
		};
	},
	onLoad({ dataId }) {
		this.formData.id = dataId
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
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
				axiosRequest('/jiayou/jiayoudansave', renderParams, axios).then(res => {
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
