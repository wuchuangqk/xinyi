<template>
	<view class="tab-page">
		<scroll-view style="height: 100%;" scroll-y @scrolltolower="loadMore">
			<view v-for="tender in tenderList" class="info-card info-card-state" @click="showDetail(tender)">
				<text class="info-card-title">{{ tender.remark }}</text>
				<view class="info-card-footer">
					<view class="footer-item">
						<view class="footer-item-icon"><image class="img" src="/static/img/status.png" mode="aspectFill" alt=""></view>
						<text>信息来源:{{ tender.sourceType }}</text>
					</view>
					<view class="footer-item">
						<view class="footer-item-icon"><image class="img" src="/static/img/date3.png" mode="aspectFill" alt=""></view>
						<text>发生时间:{{ tender.happenTime }}</text>
					</view>
				</view>
			</view>
			<uni-load-more :status="more" @clickLoadMore="loadMore"></uni-load-more>
		</scroll-view>

		<!-- <app-empty-data *ngIf="isEmpty" class="list-mode-empty"></app-empty-data> -->
		<detail-wrapa :show="isShowDetail">
			<view class="detail-mode">
				<view class="detail-mode-head">
					<text class="head-title">{{ tenderDetail.remark }}</text>
					<uni-icons type="arrowdown" class="close" @click="isShowDetail = false"></uni-icons>
				</view>
				<view class="detail-mode-content">
					<view class="detail-mode-content-item">
						<text class="label">合同码：</text>
						<text class="value">{{ contractCode }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">发生时间：</text>
						<text class="value">{{ tenderDetail.happenTime }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">信息来源：</text>
						<text class="value">{{ tenderDetail.sourceType }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">是否处理：</text>
						<text class="value">{{ tenderDetail.isHandle }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">处理时间：</text>
						<text class="value">{{ tenderDetail.handleTime }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">责任单位：</text>
						<text class="value">{{ tenderDetail.handleDepa }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">处理结果：</text>
						<text class="value">{{ tenderDetail.handleResult }}</text>
					</view>
					<view class="detail-mode-content-item file">
						<view class="label">相关附件：</view>
						<file-viewer :files="tenderDetail.sysFileForms || []" platform="project"></file-viewer>
					</view>
				</view>
			</view>
		</detail-wrapa>
	</view>
</template>

<script>
import DetailWrapa from './detail-wrap.vue';
import { getPageList, getById, getXmSecurityTypeMap } from '@/api/project/qualitySafe.js';
import { getByContract } from '@/api/project/projectChange.js';
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
			isLoadingMore: false, // 是否正在请求下一页数据
			contractCode: null,
			sourceType: [] // 信息来源
		};
	},
	async created() {
		this.sourceType = await getXmSecurityTypeMap();
		this.fetchData();
	},
	methods: {
		fetchData() {
			uni.showLoading({
				title: '加载中'
			});
			getPageList(this.projectId, this.pageIndex, this.pageSize).then(res => {
				res.records = res.records || [];
				res.records.forEach(v => {
					v.isHandle = v.isHandle === 1 ? '已处理' : '未处理';
					v.sourceType = this.sourceType.find(val => {
						return val.value === v.sourceType;
					}).label;
					v.happenTime = v.happenTime ? this.$dayjs(v.happenTime).format('YYYY-MM-DD') : null
				});
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
		showDetail({ securityId }) {
			this.isShowDetail = true;
			getById(securityId).then(res => {
				res.isHandle = res.isHandle === 1 ? '已处理' : '未处理';
				res.sourceType = this.sourceType.find(v => v.value === res.sourceType).label;
				res.happenTime = res.happenTime ? this.$dayjs(res.happenTime).format('YYYY-MM-DD') : null
				res.handleTime = res.handleTime ? this.$dayjs(res.handleTime).format('YYYY-MM-DD') : null
				this.tenderDetail = res;
				getByContract(res.contractId).then(res=> {
					this.contractCode = res.contractCode
				})
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import '../style/common.scss';
</style>
