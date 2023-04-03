<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px"></view>
				<view class="card">
					<view class="detail-item">
						<text class="label">油卡编号</text>
						<text class="value">{{ detailData.BianHao }}</text>
					</view>
					<view class="detail-item">
						<text class="label">车辆</text>
						<text class="value">{{ detailData.docTitle }}</text>
					</view>
					<view class="detail-item">
						<text class="label">里程数</text>
						<text class="value">{{ detailData.licheng }}</text>
					</view>
					<view class="detail-item">
						<text class="label">油卡余额</text>
						<text class="value">{{ detailData.SuLiang }}</text>
					</view>
					<view class="detail-item">
						<text class="label">加油金额</text>
						<text class="value">{{ detailData.JinE }}</text>
					</view>
					<!-- <view class="detail-item">
						<text class="label">申请时间</text>
						<text class="value">{{ detailData.docDate }}</text>
					</view>
					<view class="detail-item">
						<text class="label">还卡时间</text>
						<text class="value">{{ detailData.endDate }}</text>
					</view> -->
					<view class="detail-item">
						<text class="label">申请人</text>
						<text class="value">{{ detailData.CreatorName }}</text>
					</view>
					<view class="detail-item">
						<text class="label">审批人</text>
						<text class="value">{{ detailData.auditor }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<view v-if="type === 'huanka'" class="app-page-footer">
			<button class="btn" @click="submit">还卡</button>
		</view>
		<view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
	</view>
</template>

<script>
import detailMixin from '@/mixin/detail'
import renderMixin from '@/mixin/render'
export default {
	mixins: [detailMixin, renderMixin],
	data() {
		return {
			detailData: {}, // 详情字段
			type: ''
		};
	},
	onLoad({ dataId, type }) {
		this.dataId = dataId
		this.type = type
	},
	onReady() {
		this.getDetail()
	},
	methods: {
		getDetail() {
			this.doGet('/jiayou/list/' + this.dataId).then(res => {
				this.detailData = res.data
			})
		},
		submit() {
			uni.showLoading({
				title: '正在提交',
			});
			this.renderParams = this.setPostData({ id: this.dataId })
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
				axiosRequest('/jiayou/huankasave', renderParams, axios).then(res => {
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
</style>
