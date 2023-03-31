<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view class="card">
					<view v-for="item in detailList" :key="item.label" class="detail-item">
						<text class="label">{{ item.label }}</text>
						<view v-if="isFileUrl(item.label) && item.field">
							<file-viewer :files="getRelativePath(item.field)" size="small"></file-viewer>
						</view>
						<text v-else class="value" v-html="setFiledContent(item)"></text>
					</view>
				</view>
				<view class="card">
					<view class="card-title">
						<view class="left"><text>审批流程</text></view>
					</view>
					<approval-time-line :flowList="flowList" :currentStep="currentStep"></approval-time-line>
				</view>
			</scroll-view>
		</view>
		<view class="app-page-footer">
			<button class="btn" @click="submit">{{ btnText }}</button>
		</view>
		<view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
	</view>
</template>

<script>
import FileViewer from '@/components/image-viewer.vue';
import ApprovalTimeLine from '@/components/approval-timeline.vue';
import detailMixin from '@/mixin/detail'
import renderMixin from '@/mixin/render'

export default {
	components: {
		FileViewer,
		ApprovalTimeLine,
	},
	mixins: [detailMixin, renderMixin],
	data() {
		return {
			detailList: [], // 详情字段
			url: '', // 查询详情的接口
			dataId: '', // 主键id
			flowList: [], // 审批流程
			currentStep: 0, // 当前步骤
			type: null,
		};
	},
	onLoad({ dataId, type }) {
		this.dataId = dataId
		this.type = type
	},
	onReady() {
		this.getDetail()
	},
	computed: {
		btnText() {
			// 审核1 审批2 还车3
			switch (this.type) {
				case '1':
					return '同意'
				case '2':
					return '提交'
				case '3':
					return '还车'
			}
			return ''
		}
	},
	methods: {
		getDetail() {
			this.doGet('/CarMileages/detail/' + this.dataId).then(res => {
				this.detailList = res.data.info
				this.flowList = res.data.sign
				this.currentStep = res.data.currentStep - 1
			})
		},
		submit() {
			uni.showLoading({
				title: '正在提交',
			});
			switch (this.type) {
				// 审核
				case '1':
					this.renderParams = { url: '/CarMileages/DoShenHe', data: this.setPostData({ id: this.dataId }) }
					break
				// 审批
				case '2':

					break
				// 还车
				case '3':
					this.renderParams = { url: '/CarMileages/DoHuanChe', data: this.setPostData({ docId: this.dataId }) }
					// this.renderParams = {
					// 	url: '/CarMileages/DoShenPi', data: this.setPostData({
					// 		id: this.dataId,
					// 		Vehicle: this.cars.find(v => v.Pilot == this.Vehicle).value,
					// 		JiaShiYuan: this.JiaShiYuan
					// 	})
					// }
					break
			}
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
				axiosRequest(renderParams.url, renderParams.data, axios).then(res => {
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

.btn-wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.btn {
		flex: 1;
	}
}
</style>
