<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px"></view>
				<view class="card">
					<view class="detail-item">
						<text class="label">油卡编号</text>
						<text class="value">{{ detailData.bianhao }}</text>
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
						<text class="value">{{ detailData.suliang }}</text>
					</view>
					<view class="detail-item">
						<text class="label">加油金额</text>
						<text class="value">{{ detailData.jine }}</text>
					</view>
					<view class="detail-item">
						<text class="label">申请时间</text>
						<text class="value">{{ detailData.docDate }}</text>
					</view>
					<view class="detail-item">
						<text class="label">还卡时间</text>
						<text class="value">{{ detailData.endDate }}</text>
					</view>
					<view class="detail-item">
						<text class="label">申请人</text>
						<text class="value">{{ detailData.Creator }}</text>
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
			detailData: {} // 详情字段
		};
	},
	onReady() {
		const listDetail = this.$store.state.listDetail
		if (listDetail) {
			this.detailData = listDetail
		}
	},
};
</script>
<style scoped lang="scss">
@import '@/styles/detail.scss';

.card .card-title {
	margin-bottom: 15px;
}
</style>
