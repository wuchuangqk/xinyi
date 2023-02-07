<template>
	<view class="tab-page">
		<scroll-view style="height: 100%;" scroll-y @scrolltolower="loadMore">
			<view v-for="tender in tenderList" class="info-card info-card-state" :class="'state-' + tender.approvalState" @click="showDetail(tender)">
				<text class="info-card-title">{{ tender.applyContent }}</text>
				<view class="info-card-footer">
					<view class="footer-item">
						<view class="footer-item-icon"><image class="img" src="/static/img/money5.png" mode="aspectFill" alt=""></view>
						<text>变更估价:{{ tender.estimatePrice || 0 }}万元</text>
					</view>
					<view class="footer-item">
						<view class="footer-item-icon"><image class="img" src="/static/img/status.png" mode="aspectFill" alt=""></view>
						<text>变更情况:{{ tender.type === 0 ? '增加' : '减少' }}</text>
					</view>
				</view>
			</view>
			<uni-load-more :status="more" @clickLoadMore="loadMore"></uni-load-more>
		</scroll-view>

		<!-- <app-empty-data *ngIf="isEmpty" class="list-mode-empty"></app-empty-data> -->
		<detail-wrapa :show="isShowDetail">
			<view class="detail-mode">
				<view class="detail-mode-head">
					<text class="head-title">{{ tenderDetail.applyContent }}</text>
					<uni-icons type="arrowdown" class="close" @click="isShowDetail = false"></uni-icons>
				</view>
				<view class="detail-mode-content">
					<view class="detail-mode-content-item"><text class="label title">办理工程变更申请审批</text></view>
					<view class="detail-mode-content-item">
						<text class="label">合同码：</text>
						<text class="value">{{ contractCode }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">变更情况：</text>
						<text class="value">{{ tenderDetail.type === 0 ? '增加' : '减少' }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">合同变更累计：</text>
						<text class="value">{{ changeData.contractCumulative || 0 }} [万元]</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">合同变更率：</text>
						<text class="value">{{ changeData.contractRate || 0 }}%</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">项目变更累计：</text>
						<text class="value">{{ changeData.projectCumulative || 0 }} [万元]</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">估价：</text>
						<text class="value">{{ tenderDetail.estimatePrice || 0 }} [万元]</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">申请审批批准时间：</text>
						<text class="value">{{ tenderDetail.applyTime }}</text>
					</view>
					<view class="detail-mode-content-item"><text class="label title">办理工程变更管理审批</text></view>
					<view class="detail-mode-content-item">
						<text class="label">变更内容完成时间：</text>
						<text class="value">{{ tenderDetail.completeTime }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">施工单位上报时间：</text>
						<text class="value">{{ tenderDetail.reportTime }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">变更内容及事由：</text>
						<text class="value">{{ tenderDetail.changeContent }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">审核价：</text>
						<text class="value">{{ tenderDetail.examinePrice || 0 }} [万元]</text>
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
						<text class="value">{{ tenderDetail.createdTime }}</text>
					</view>
					<view class="detail-mode-content-item file">
						<view class="label">变更相关附件：</view>
						<file-viewer :files="tenderDetail.fileForms || []" platform="project"></file-viewer>
					</view>

					<view class="detail-mode-content-item" v-if="tenderDetail.flowId"><text class="label title">审批情况</text></view>
					<view v-if="tenderDetail.flowId"><approval-time-line :flowId="tenderDetail.flowId"></approval-time-line></view>
				</view>
			</view>
		</detail-wrapa>
	</view>
</template>

<script>
import DetailWrapa from './detail-wrap.vue';
import { getPageList, getById, getByContract, getDatasByContractCode } from '@/api/project/projectChange.js';
import FileViewer from '@/components/file-viewer.vue';
import ApprovalTimeLine from '@/components/approval-timeline.vue';
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
			},
			contractCode: '',
			changeData: {}
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
		showDetail({ changeId, flowId }) {
			this.isShowDetail = true;
			getById(changeId).then(res => {
				res.completeTime = res.completeTime ? this.$dayjs(res.completeTime).format('YYYY-MM-DD') : null;
				res.reportTime = res.reportTime ? this.$dayjs(res.reportTime).format('YYYY-MM-DD') : null;
				res.createdTime = res.createdTime ? this.$dayjs(res.createdTime).format('YYYY-MM-DD') : null;
				res.applyTime = res.applyTime ? this.$dayjs(res.applyTime).format('YYYY-MM-DD') : null;
				res.flowId = flowId;
				this.tenderDetail = res;
				getByContract(res.contractId).then(res => {
					this.contractCode = res.contractCode;
					getDatasByContractCode(this.contractCode).then(res => {
						this.changeData = res || {};
					});
				});
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import '../style/common.scss';
</style>
