<template>
	<view class="tab-page">
		<scroll-view style="height: 100%;" scroll-y @scrolltolower="loadMore">
			<view v-for="tender in tenderList" class="info-card info-card-state" :class="'state-' + tender.approvalState" @click="showDetail(tender)">
				<text class="info-card-title">{{ tender.tenderName }}</text>
				<view class="info-card-footer">
					<view class="footer-item">
						<view class="footer-item-icon"><image class="img" src="/static/img/money5.png" mode="aspectFill" alt=""></view>
						<text>标底:{{ tender.tenderPrice || 0 }}万元</text>
					</view>
					<view class="footer-item">
						<view class="footer-item-icon"><image class="img" src="/static/img/investment.png" mode="aspectFill" alt=""></view>
						<text>中标价:{{ tender.inTenderPrice || 0 }}万元</text>
					</view>
				</view>
			</view>
			<uni-load-more :status="more" @clickLoadMore="loadMore"></uni-load-more>
		</scroll-view>

		<!-- <app-empty-data *ngIf="isEmpty" class="list-mode-empty"></app-empty-data> -->
		<detail-wrapa :show="isShowDetail">
			<view class="detail-mode">
				<view class="detail-mode-head">
					<text class="head-title">{{ tenderDetail.tenderName }}</text>
					<uni-icons type="arrowdown" class="close" @click="isShowDetail = false"></uni-icons>
				</view>
				<view class="detail-mode-content">
					<view class="detail-mode-content-item"><text class="label title">招标准备</text></view>
					<view class="detail-mode-content-item">
						<text class="label">招标码：</text>
						<text class="value">{{ tenderDetail.tenderCode }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">发包方式：</text>
						<text class="value">{{ contractType }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">办理类型：</text>
						<text class="value">{{ handleType }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">招标标底：</text>
						<text class="value">{{ tenderDetail.tenderPrice || 0 }} [万元]</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">发包(采购)人：</text>
						<text class="value">{{ tenderDetail.contractName }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">发布日期：</text>
						<text class="value">{{ tenderDetail.releaseTime }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">开标日期：</text>
						<text class="value">{{ tenderDetail.openTime }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">招标代理单位：</text>
						<text class="value">{{ tenderDetail.agencyName }}</text>
					</view>
					<view class="detail-mode-content-item file">
						<view class="label">招标文件审批稿：</view>
						<file-viewer :files="tenderDetail.approvalFile ? [tenderDetail.approvalFile] : []" platform="project"></file-viewer>
					</view>
					<view class="detail-mode-content-item"><text class="label title">开标后</text></view>
					<view class="detail-mode-content-item">
						<text class="label">中标价：</text>
						<text class="value">{{ tenderDetail.inTenderPrice || 0 }} [万元]</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">中标(承包)人：</text>
						<text class="value">{{ tenderDetail.inContractName }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">差额：</text>
						<text class="value">{{ tenderDetail.diff || 0 }} [万元]</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">备注：</text>
						<text class="value">{{ tenderDetail.remark }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">添加人：</text>
						<text class="value">{{ tenderDetail.creatorName }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">添加时间：</text>
						<text class="value">{{tenderDetail.createdTime}}</text>
					</view>
					<view class="detail-mode-content-item file">
						<view class="label">招标过程材料：</view>
						<file-viewer :files="tenderDetail.processFile || []" platform="project"></file-viewer>
					</view>
					<view class="detail-mode-content-item" v-if="tenderDetail.flowId">
				      <text class="label title">审批情况</text>
				    </view>
				    <view v-if="tenderDetail.flowId">
							<approval-time-line :flowId="tenderDetail.flowId"></approval-time-line>
				    </view>
				</view>
			</view>
		</detail-wrapa>
	</view>
</template>

<script>
import DetailWrapa from './detail-wrap.vue';
import { getPageList, getById, getContractType, getProjectBiddingTypeMap } from '@/api/project/projectTender.js';
import FileViewer from '@/components/file-viewer.vue';
import ApprovalTimeLine from '@/components/approval-timeline.vue'
export default {
	components: { DetailWrapa, FileViewer, ApprovalTimeLine },
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
			formatData: {
				contractType: [],
				handleType: []
			}
		};
	},
	created() {
		this.fetchData();
		getContractType().then(res => {
			this.formatData.contractType = res.records || [];
		});
		getProjectBiddingTypeMap().then(res => {
			this.formatData.handleType = res;
		});
	},
	computed: {
		// 发包方式
		contractType() {
			const temp = this.formatData.contractType.find(v => v.paramId === this.tenderDetail.contractType);
			return temp ? temp.pname : null;
		},
		// 办理类型
		handleType() {
			return this.formatData.handleType[this.tenderDetail.handleType];
		}
	},
	methods: {
		fetchData() {
			uni.showLoading({
				title: '加载中'
			});
			getPageList(this.projectId, this.pageIndex, this.pageSize).then(res => {
				res.records = res.records || [];
				res.records.forEach(v => {
					v.approvalState = v.approvalState === null ? 4 : v.approvalState;
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
		showDetail({tenderId, flowId}) {
			this.isShowDetail = true;
			getById(tenderId).then(res => {
				res.releaseTime = this.$dayjs(res.releaseTime).format('YYYY-MM-DD');
				res.openTime = this.$dayjs(res.openTime).format('YYYY-MM-DD');
				res.createdTime = this.$dayjs(res.createdTime).format('YYYY-MM-DD');
				res.diff = (res.tenderPrice || 0) - (res.inTenderPrice || 0);
				res.flowId = flowId
				this.tenderDetail = res;
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import '../style/common.scss';
</style>
