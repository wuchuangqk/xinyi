<template>
	<view class="tab-page">
		<scroll-view style="height: 100%;" scroll-y @scrolltolower="loadMore">
			<view v-for="tender in tenderList" class="info-card info-card-state" @click="showDetail(tender)">
				<text class="info-card-title">{{ tender.contractName }}</text>
				<view class="info-card-footer">
					<view class="footer-item">
						<view class="footer-item-icon"><image class="img" src="/static/img/time.png" mode="aspectFill" alt=""></view>
						<text>年月:{{ tender.yearMonth }}</text>
					</view>
					<view class="footer-item">
						<view class="footer-item-icon"><image class="img" src="/static/img/investment.png" mode="aspectFill" alt=""></view>
						<text>实际投资:{{ tender.summaryInvestment || 0 }}万元</text>
					</view>
				</view>
			</view>
			<uni-load-more :status="more" @clickLoadMore="loadMore"></uni-load-more>
		</scroll-view>

		<!-- <app-empty-data *ngIf="isEmpty" class="list-mode-empty"></app-empty-data> -->
		<detail-wrapa :show="isShowDetail">
			<view class="detail-mode">
				<view class="detail-mode-head">
					<text class="head-title">{{ tenderDetail.contractName }}</text>
					<uni-icons type="arrowdown" class="close" @click="isShowDetail = false"></uni-icons>
				</view>
				<view class="detail-mode-content">
					<view class="detail-mode-content-item">
						<text class="label">合同码：</text>
						<text class="value">{{ tenderDetail.contractCode }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">年月：</text>
						<text class="value">{{ tenderDetail.yearMonth }}</text>
					</view>
					<view class="detail-mode-content-item"><text class="label title">计划</text></view>
					<view class="detail-mode-content-item">
						<text class="label">计划投资：</text>
						<text class="value">{{ tenderDetail.planInvestment || 0 }} [万元]</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">计划形象进度：</text>
						<text class="value">{{ tenderDetail.planProgress }}</text>
					</view>
					<view class="detail-mode-content-item file">
						<view class="label">附件：</view>
						<file-viewer :files="tenderDetail.planFileUrl || []" platform="project"></file-viewer>
					</view>
					<view class="detail-mode-content-item"><text class="label title">总结</text></view>
					<view class="detail-mode-content-item">
						<text class="label">总结完成投资：</text>
						<text class="value">{{ tenderDetail.summaryInvestment || 0 }} [万元]</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">总结形象进度：</text>
						<text class="value">{{ tenderDetail.summaryProgress }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">招标代理单位：</text>
						<text class="value">{{ tenderDetail.agencyName }}</text>
					</view>
					<view class="detail-mode-content-item file">
						<view class="label">附件：</view>
						<file-viewer :files="tenderDetail.summaryFileUrl || []" platform="project"></file-viewer>
					</view>
				</view>
			</view>
		</detail-wrapa>
	</view>
</template>

<script>
import DetailWrapa from './detail-wrap.vue';
import { getPageList, getById } from '@/api/project/contractProgress.js';
import FileViewer from '@/components/file-viewer.vue';
export default {
	components: { DetailWrapa, FileViewer },
	props: {
		projectId: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			tenderDetail: {},
			tenderList: [],
			isShowDetail: false,
			pageIndex: 1,
			pageSize: 10,
			isLoadAll: false, // 是否已加载全部数据
			more: 'more', // laodmore状态
			isLoadingMore: false // 是否正在请求下一页数据
		};
	},
	created() {
		this.fetchData();
	},
	methods: {
		fetchData() {
			uni.showLoading({
				title: '加载中'
			});
			getPageList(this.projectId, this.pageIndex, this.pageSize).then(res => {
				res.records = res.records || [];
				this.tenderList = this.tenderList.concat(res.records);
				this.isLoadAll = res.records.length === 0;
				this.more = this.isLoadAll ? 'noMore' : 'more';
				this.isLoadingMore = false;
				uni.hideLoading();
			});
		},
		loadMore() {
			if (this.isLoadingMore || this.isLoadAll) {
				return;
			}
			this.isLoadingMore = true;
			this.pageIndex++;
			this.fetchData();
		},
		showDetail({ speedId }) {
			this.isShowDetail = true;
			getById(speedId).then(res => {
				res.yearMonth = this.$dayjs(res.yearMonth).format('YYYY-MM');
				this.tenderDetail = res;
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import '../style/common.scss';
</style>
