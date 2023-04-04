<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card form-card">
						<u-form-item label="加油卡编号" prop="BianHao" required>
							<u-input v-model="formData.BianHao" placeholder="请输入加油卡编号" />
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
				BianHao: '', // 加油卡编号
				id: '',
			},
			rules: {
				BianHao: [{ required: true, message: '请输入加油卡编号' }],
			},
			// listPath: '/pages/chuchai/list',
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
				axiosRequest('/jiayou/save', renderParams, axios).then(res => {
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
