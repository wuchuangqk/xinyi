<template>
	<view class="tab-page">
		<scroll-view style="height: 100%;" scroll-y @scrolltolower="loadMore">
			<view v-for="data in dataList" class="info-card info-card-state" :class="'state-' + data.approvalState" @click="showDetail(data)">
				<text class="info-card-title">{{ data.contractName }}</text>
				<view class="info-card-footer">
					<view class="footer-item">
						<view class="footer-item-icon"><image class="img" src="/static/img/money4.png" mode="aspectFill" alt=""></view>
						<text>合同额:{{ data.contractPrice || 0 }}万元</text>
					</view>
					<view class="footer-item">
						<view class="footer-item-icon"><image class="img" src="/static/img/investment.png" mode="aspectFill" alt=""></view>
						<text>已支付:{{ data.paymentAmount || 0 }}万元</text>
					</view>
				</view>
			</view>
			<uni-load-more :status="more" @clickLoadMore="loadMore"></uni-load-more>
		</scroll-view>

		<!-- <app-empty-data *ngIf="isEmpty" class="list-mode-empty"></app-empty-data> -->
		<detail-wrapa :show="isShowDetail">
			<view class="detail-mode" style="background-color: initial;">
				<view class="detail-mode-head">
					<text class="head-title">合同详情</text>
					<uni-icons type="arrowdown" class="close" @click="isShowDetail = false"></uni-icons>
				</view>

				<view class="detail-mode-content">
					<uni-collapse accordion="true">
						<uni-collapse-item :showAnimation="true" title="基本信息" class="title-color-type1">
							<view class="expanded-content">
								<view>
									<text class="label">项目名称：</text>
									<text class="value">{{ dataDetail.projectName }}</text>
								</view>
								<view>
									<text class="label">项目码：</text>
									<text class="value">{{ dataDetail.projectCode }}</text>
								</view>
								<view>
									<text class="label">合同名称：</text>
									<text class="value">{{ dataDetail.contractName }}</text>
								</view>
								<view>
									<text class="label">合同码：</text>
									<text class="value">{{ dataDetail.contractCode }}</text>
								</view>
								<view>
									<text class="label">发包人(甲方)：</text>
									<text class="value">{{ dataDetail.employer }}</text>
								</view>
								<view>
									<text class="label">承包人(乙方)：</text>
									<text class="value">{{ dataDetail.contractor }}</text>
								</view>
								<view>
									<text class="label">承包人资质：</text>
									<text class="value">{{ dataDetail.contractorQualification }}</text>
								</view>
								<view>
									<text class="label">拟派项目经理：</text>
									<text class="value">{{ dataDetail.manager }}</text>
								</view>
								<view>
									<text class="label">项目经理资质：</text>
									<text class="value">{{ dataDetail.managerQualification }}</text>
								</view>
								<view>
									<text class="label">合同价格：</text>
									<text class="value">{{ dataDetail.contractPrice || 0 }} [万元]</text>
								</view>
								<view>
									<text class="label">工程变更审核价：</text>
									<text class="value">{{ dataDetail.auditPrice || 0 }} [万元]</text>
								</view>
								<view>
									<text class="label">合同决算：</text>
									<text class="value">{{ dataDetail.settlementAmount || 0 }} [万元]</text>
								</view>
								<view>
									<text class="label">合同支付金额：</text>
									<text class="value">{{ dataDetail.paymentAmount || 0 }} [万元]</text>
								</view>
								<view class="file">
									<view class="label">合同审批稿：</view>
									<file-viewer :files="dataDetail.contractWordFileURL ? [dataDetail.contractWordFileURL] : []" platform="project"></file-viewer>
								</view>
								<view class="file">
									<view class="label">合同正式稿：</view>
									<file-viewer :files="dataDetail.contractPdfFileURL ? [dataDetail.contractPdfFileURL] : []" platform="project"></file-viewer>
								</view>
								<view>
									<text class="label">合同内容：</text>
									<text class="value">{{ dataDetail.contractContent }}</text>
								</view>
								<view>
									<text class="label">合同签订日期：</text>
									<text class="value">{{ dataDetail.signingDate }}</text>
								</view>
								<view>
									<text class="label">合同履行迄止日期：</text>
									<text class="value">{{ dataDetail.contractStartEnd }}</text>
								</view>
								<view>
									<text class="label">添加人：</text>
									<text class="value">{{ dataDetail.creatorId }}</text>
								</view>
								<view>
									<text class="label">添加时间：</text>
									<text class="value">{{ dataDetail.createTime }}</text>
								</view>
								<view>
									<text class="label">备注：</text>
									<text class="value">{{ dataDetail.remarks }}</text>
								</view>
								<view class="file">
									<view class="label">合同过程附件列表：</view>
									<file-viewer :files="dataDetail.contractFilesURL || []" platform="project"></file-viewer>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item v-if="contractPay.length" :showAnimation="true" title="合同支付" class="title-color-type2">
							<view class="expanded-content">
								<template v-for="pay in contractPay">
									<view>
										<text class="label">支付金额：</text>
										<text class="value">{{ pay.payPrice || 0 }} [万元]</text>
									</view>
									<view>
										<text class="label">支付日期：</text>
										<text class="value">{{ pay.payTime }}</text>
									</view>
									<view>
										<text class="label">支付人：</text>
										<text class="value">{{ pay.payerName }}</text>
									</view>
									<view>
										<text class="label">添加日期：</text>
										<text class="value">{{ pay.createTime }}</text>
									</view>
									<view>
										<text class="label">添加人：</text>
										<text class="value">{{ pay.createrName }}</text>
									</view>
								</template>
							</view>
						</uni-collapse-item>
						<uni-collapse-item v-if="bondPayList.length" :showAnimation="true" title="保证金" class="title-color-type3">
							<view class="expanded-content">
								<template v-for="pay in bondPayList">
									<view>
										<text class="label">单位名称：</text>
										<text class="value">{{ pay.companyName }}</text>
									</view>
									<view>
										<text class="label">应缴金额：</text>
										<text class="value">{{ pay.penaltyPrice || 0 }} [万元]</text>
									</view>
									<view>
										<text class="label">实缴金额：</text>
										<text class="value">{{ pay.breachPrice || 0 }} [万元]</text>
									</view>
									<view>
										<text class="label">退还金额：</text>
										<text class="value">{{ pay.actualReturnPlanPrice || 0 }} [万元]</text>
									</view>
									<view>
										<text class="label">缴纳时间：</text>
										<text class="value">{{ pay.penaltyEndTime }}</text>
									</view>
									<view>
										<text class="label">实际退还时间：</text>
										<text class="value">{{ pay.actualReturnPlanTime }}</text>
									</view>
								</template>
							</view>
						</uni-collapse-item>
						<uni-collapse-item v-if="guaranteePay.length" :showAnimation="true" title="保函" class="title-color-type4">
							<view class="expanded-content">
								<template v-for="pay in guaranteePay">
									<view>
										<text class="label">单位名称：</text>
										<text class="value">{{ pay.companyName }}</text>
									</view>
									<view>
										<text class="label">保函履约金额：</text>
										<text class="value">{{ pay.breachPrice || 0 }} [万元]</text>
									</view>
									<view>
										<text class="label">合同签订：</text>
										<text class="value">{{ pay.planReturnPlanTime }}</text>
									</view>
									<view>
										<text class="label">到期日期：</text>
										<text class="value">{{ pay.actualReturnPlanTime }}</text>
									</view>
									<view>
										<text class="label">实缴日期：</text>
										<text class="value">{{ pay.penaltyEndTime }}</text>
									</view>
									<view>
										<text class="label">退还日期：</text>
										<text class="value">{{ pay.penaltyStartTime }}</text>
									</view>
									<view>
										<text class="label">状态：</text>
										<text class="value">{{ pay.state }}</text>
									</view>
								</template>
							</view>
						</uni-collapse-item>
						<uni-collapse-item v-if="contractSpeed.length" :showAnimation="true" title="合同进度" class="title-color-type5">
							<view class="expanded-content">
								<template v-for="pay of contractSpeed">
									<view>
										<text class="label">年月：</text>
										<text class="value">{{ pay.yearMonth }}</text>
									</view>
									<view>
										<text class="label">计划形象进度：</text>
										<text class="value">{{ pay.planProgress }}</text>
									</view>
									<view>
										<text class="label">实际形象进度：</text>
										<text class="value">{{ pay.summaryProgress }}</text>
									</view>
									<view>
										<text class="label">计划投资：</text>
										<text class="value">{{ pay.planInvestment || 0 }} [万元]</text>
									</view>
									<view>
										<text class="label">实际投资：</text>
										<text class="value">{{ pay.summaryInvestment || 0 }} [万元]</text>
									</view>
									<view>
										<text class="label">实际投资比例：</text>
										<text class="value">{{ pay.proportion }}</text>
									</view>
								</template>
							</view>
						</uni-collapse-item>
						<uni-collapse-item v-if="projectChange.length" :showAnimation="true" title="工程变更" class="title-color-type6">
							<view class="expanded-content">
								<template v-for="pay in projectChange">
									<view>
										<text class="label">工程变更码：</text>
										<text class="value">{{ pay.changeCode }}</text>
									</view>
									<view>
										<text class="label">变更内容：</text>
										<text class="value">{{ pay.changeContent }}</text>
									</view>
									<view>
										<text class="label">变更估价：</text>
										<text class="value">{{ pay.estimatePrice || 0 }} [万元]</text>
									</view>
									<view>
										<text class="label">申请审批批准时间：</text>
										<text class="value">{{ pay.applyTime }}</text>
									</view>
									<view>
										<text class="label">变更内容完成时间：</text>
										<text class="value">{{ pay.completeTime }}</text>
									</view>
									<view>
										<text class="label">施工单位上报时间：</text>
										<text class="value">{{ pay.reportTime }}</text>
									</view>
									<view>
										<text class="label">审核价：</text>
										<text class="value">{{ pay.examinePrice || 0 }} [万元]</text>
									</view>
								</template>
							</view>
						</uni-collapse-item>
						<uni-collapse-item v-if="dataDetail.flowId" :showAnimation="true" title="审批流程" class="title-color-type7">
							<view v-if="dataDetail.flowId"><approval-time-line :flowId="dataDetail.flowId"></approval-time-line></view>
						</uni-collapse-item>
					</uni-collapse>
				</view>
			</view>

			<!-- <view class="detail-mode">
				<view class="detail-mode-head">
					<text class="head-title">{{ dataDetail.tenderName }}</text>
					<uni-icons type="arrowdown" class="close" @click="isShowDetail = false"></uni-icons>
				</view>
				</view>
			</view> -->
		</detail-wrapa>
	</view>
</template>

<script>
import DetailWrapa from './detail-wrap.vue';
import {
	list as getPageList,
	getById,
	getContractCodeMap,
	getTenderCodeMap,
	getSysProjectPayTypeMap,
	getContractPay,
	getProjectChange,
	getContractSpeedMap,
	queryContractListByContractId,
	querySpeedListByContractId,
	queryBondPayFinancial,
	queryGuaranteePayFinancial
} from '@/api/project/projectContract.js';
import FileViewer from '@/components/file-viewer.vue';
import ApprovalTimeLine from '@/components/approval-timeline.vue';
import { getById as getUser } from '@/api/user.js';
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
			dataDetail: {},
			dataList: [],
			isShowDetail: false,
			pageIndex: 1,
			pageSize: 10,
			isLoadAll: false, // 是否已加载全部数据
			more: 'more', // laodmore状态
			isLoadingMore: false, // 是否正在请求下一页数据
			contractPay: [], // 合同支付
			projectChange: [], // 工程变更
			contractSpeed: [], // 合同进度
			bondPayList: [], // 保证金
			guaranteePay: [] // 保函
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
					// v.approvalState = v.approvalState === null ? 4 : v.approvalState;
				});
				this.dataList = this.dataList.concat(res.records);
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
		formatTime(val) {
			return this.$dayjs(val).format('YYYY-MM-DD');
		},
		showDetail({ contractId, flowId }) {
			this.isShowDetail = true;
			// 合同基本信息
			getById(contractId).then(res => {
				const { performanceStartDate, performanceEndDate } = res;
				if (performanceStartDate && performanceEndDate) {
					res.contractStartEnd = this.$dayjs(performanceStartDate).format('YYYY-MM-DD') + '至' + this.$dayjs(performanceEndDate).format('YYYY-MM-DD');
				} else {
					res.contractStartEnd = null;
				}
				res.createTime = this.formatTime(res.createTime);
				res.signingDate = this.formatTime(res.signingDate);
				res.flowId = flowId;
				this.dataDetail = res;
				// 查用户id
				getUser(res.creatorId).then(user => {
					this.dataDetail.creatorId = user.displayName;
				});
				this.dataDetail = res;
			});

			// 合同进度
			querySpeedListByContractId(contractId).then(res => {
				this.contractSpeed = (res.records || []).map(val => {
					const { planInvestment, summaryInvestment } = val;
					if (planInvestment && summaryInvestment) {
						val.proportion = ((summaryInvestment / planInvestment) * 100).toFixed(2) + '%';
					} else {
						val.proportion = null;
					}
					val.yearMonth = val.yearMonth ? this.$dayjs(val.yearMonth).format('YYYY-MM') : '';
					return val;
				});
			});

			// 合同支付
			getContractPay(contractId).then(res => {
				this.contractPay = (res.records || []).map(v => {
					v.payTime = v.payTime ? this.formatTime(v.payTime) : '';
					v.createTime = v.createTime ? this.formatTime(v.createTime) : '';
					return v;
				});
			});

			// 保证金
			queryBondPayFinancial(contractId).then(res => {
				this.bondPayList = (res.records || []).map(v => {
					v.penaltyEndTime = v.penaltyEndTime ? this.formatTime(v.penaltyEndTime) : '';
					v.actualReturnPlanTime = v.actualReturnPlanTime ? this.formatTime(v.actualReturnPlanTime) : '';
					return v;
				});
			});

			// 保函
			queryGuaranteePayFinancial(contractId).then(res => {
				this.guaranteePay = (res.records || []).map(v => {
					v.state = new Date() > new Date(v.penaltyEndTime) ? '已过期' : '未过期';
					v.planReturnPlanTime = v.planReturnPlanTime ? this.formatTime(v.planReturnPlanTime) : '';
					v.actualReturnPlanTime = v.actualReturnPlanTime ? this.formatTime(v.actualReturnPlanTime) : '';
					v.penaltyEndTime = v.penaltyEndTime ? this.formatTime(v.penaltyEndTime) : '';
					v.penaltyStartTime = v.penaltyStartTime ? this.formatTime(v.penaltyStartTime) : '';

					return v;
				});
			});

			// 工程变更
			getProjectChange(this.projectId, contractId).then(res => {
				this.projectChange = (res.records || []).map(v => {
					v.applyTime = v.applyTime ? this.formatTime(v.applyTime) : '';
					v.completeTime = v.completeTime ? this.formatTime(v.completeTime) : '';
					v.reportTime = v.reportTime ? this.formatTime(v.reportTime) : '';
					return v;
				});
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import '../style/common.scss';
.file {
}
</style>
