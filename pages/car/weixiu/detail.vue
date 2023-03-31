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
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail: {}, // 详情字段
			dataId: '', // 主键id
		};
	},
	onLoad({ dataId }) {
		this.dataId = dataId
	},
	onReady() {
		this.getDetail()
	},
	methods: {
		getDetail() {
			this.doGet('/car/weixiulist', { item_id: this.dataId }).then(res => {
				this.detail = res.data
			})
		},
	}
};
</script>
<style scoped lang="scss">
@import '@/styles/detail.scss';

.card .card-title {
	margin-bottom: 15px;
}
</style>
