<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<view class="detail-item">
				<text class="label">项目名称</text>
				<text class="value">{{ detailData.projectName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">项目负责人</text>
				<text class="value">{{ detailData.userName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">公司名称</text>
				<text class="value">{{ detailData.invoicingTitle }}</text>
			</view>
			<view class="detail-item">
				<text class="label">纳税人识别号</text>
				<text class="value">{{ detailData.invoicingSn }}</text>
			</view>
			<view class="detail-item">
				<text class="label">地址电话</text>
				<text class="value">{{ detailData.invoicingAddressText }}</text>
			</view>
			<view class="detail-item">
				<text class="label">开户行及账号</text>
				<text class="value">{{ detailData.invoicingBankNameText }}</text>
			</view>
			<view class="detail-item">
				<text class="label">开票类型</text>
				<text class="value">{{ detailData.typeText }}</text>
			</view>
			<view class="detail-item">
				<text class="label">开票日期</text>
				<text class="value">{{ detailData.days }}</text>
			</view>
			<view class="detail-item">
				<text class="label">开票含税金额(元)</text>
				<text class="value">{{ detailData.hasTax }}</text>
			</view>
			<view class="detail-item">
				<text class="label">税点（%）</text>
				<text class="value">{{ detailData.point }}</text>
			</view>
			<view class="detail-item">
				<text class="label">开票不含税金额(元)</text>
				<text class="value">{{ detailData.tax }}</text>
			</view>
			<view class="detail-item">
				<text class="label">税金（元）</text>
				<text class="value">{{ detailData.price }}</text>
			</view>
			<!-- <view class="detail-item">
				<text class="label">收款日期</text>
				<text class="value">{{ detailData.returnDays }}</text>
			</view> -->
			<view class="detail-item">
				<text class="label">回款金额</text>
				<text class="value">{{ detailData.returnPrice }}</text>
			</view>
			<view class="detail-item">
				<text class="label">客户名称</text>
				<text class="value">{{ detailData.customer }}</text>
			</view>
			<view class="detail-item">
				<text class="label">客户纳税人识别号</text>
				<text class="value">{{ detailData.taxNumber }}</text>
			</view>
			<view class="detail-item">
				<text class="label">客户地址电话</text>
				<text class="value">{{ detailData.addressMobile }}</text>
			</view>
			<view class="detail-item">
				<text class="label">客户开户行及账号</text>
				<text class="value">{{ detailData.bankNameNumber }}</text>
			</view>
		</view>
		<view v-if="detailData.sysFileForms && detailData.sysFileForms.length" class="card">
			<view class="card-title">
				<view class="left"><text>票据</text></view>
			</view>
			<view><file-viewer platform="project" :files="detailData.sysFileForms || []"></file-viewer></view>
		</view>
	</view>
</template>

<script>
import FileViewer from '@/components/file-viewer.vue';
import { getInvoicing } from '@/api/project/invoice.js';

export default {
	components: {
		FileViewer
	},
	data() {
		return {
			detailData: {},
			pageParams: {} // 页面参数
		};
	},
	onLoad(params) {
		this.pageParams = params;
	},
	onReady() {
		const { approvalId } = this.pageParams;
		getInvoicing(approvalId).then(res => {
			res.invoicingAddressText = res.invoicingAddress + ' ' + res.invoicingMobile;
			res.invoicingBankNameText = res.invoicingBankName + ' ' + res.invoicingBankNumber;
			res.typeText = res.type === 1 ? '普票' : '专票';
			res.tax = (+res.tax).toFixed(2);
			res.hasTax = (+res.hasTax).toFixed(2);
			res.price = (+res.price).toFixed(2);
			res.returnPrice = (+res.returnPrice).toFixed(2)
			this.detailData = res;
		});
	},
	methods: {}
};
</script>

<style scoped lang="scss">
@import '@/styles/detail.scss';
.page {
	min-height: 100%;
	background-color: $-bg-color;
}

.card .card-title {
	margin-bottom: 15px;
}

.card-title {
	position: relative;
}

.detail-item {
	.label {
		padding-right: 10px;
	}
}
</style>
