<template>
	<view class="tab-page">
		<view class="report-detail">
			<view class="head">
				<view class="arrow" @click="changeYear(true)"><uni-icons type="arrowleft" size="13" color="#333"></uni-icons></view>
				<text class="year">{{ selectYear }}年</text>
				<view class="arrow" @click="changeYear(false)"><uni-icons type="arrowright" size="13" color="#333"></uni-icons></view>
			</view>
			<view class="month">
				<view class="row">
					<view class="month-item" v-for="month in monthTop" @click="changeMonth(month)" :class="{ active: isCurMonth(month) }">{{ month + '月' }}</view>
				</view>
				<view class="row">
					<view class="month-item" v-for="month in monthButtom" @click="changeMonth(month)" :class="{ active: isCurMonth(month) }">{{ month + '月' }}</view>
				</view>
			</view>
			<view class="expanded-content" v-if="reportData">
				<view>
					<text class="label">累计完成投资：</text>
					<text class="value">{{ reportData.cumulativeMoney || 0 }} [万元]</text>
				</view>
				<view>
					<text class="label">本年累计投资：</text>
					<text class="value">{{ reportData.cumulativeYearMoney || 0 }} [万元]</text>
				</view>
				<view><text class="label title">计划</text></view>
				<view>
					<text class="label">进度内容：</text>
					<text class="value">{{ reportData.nextReportContent }}</text>
				</view>
				<view>
					<text class="label">计划完成投资：</text>
					<text class="value">{{ reportData.nextReportMoney || 0 }} [万元]</text>
				</view>
				<view><text class="label title">总结</text></view>
				<view>
					<text class="label">进度内容：</text>
					<text class="value">{{ reportData.reportContent }}</text>
				</view>
				<view>
					<text class="label">存在问题：</text>
					<text class="value">{{ reportData.reportProblem }}</text>
				</view>
				<view>
					<text class="label">本月完成投资：</text>
					<text class="value">{{ reportData.reportMoney || 0 }} [万元]</text>
				</view>
				<view class="file">
					<view class="label">附件</view>
					<file-viewer :files="reportData.reportFiles || []" platform="project"></file-viewer>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import DetailWrapa from './detail-wrap.vue';
import { getPageList, getById } from '@/api/project/monthlyReport.js';
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
			selectYear: null, // 选择的年份
			selectMonth: null, // 选择的月份
			reportData: {},
			monthTop: [1, 2, 3, 4, 5, 6],
			monthButtom: [7, 8, 9, 10, 11, 12]
		};
	},
	created() {
		this.selectYear = new Date().getFullYear();
		const month = new Date().getMonth() + 1;
		this.selectMonth = month > 9 ? '' + month : '0' + month;
		this.fetchData();
	},
	methods: {
		fetchData() {
			uni.showLoading({
				title: '加载中'
			});
			getPageList(this.projectId, this.selectYear + '-' + this.selectMonth).then(res => {
				res.records = res.records || [];
				this.reportData = res.records[0] || null;
				uni.hideLoading();
			});
		},
		changeMonth(month) {
			this.selectMonth = month > 9 ? '' + month : '0' + month;
			this.fetchData();
		},
		changeYear(isPrev) {
			this.selectYear = isPrev ? this.selectYear - 1 : this.selectYear + 1;
			this.fetchData();
		},
		isCurMonth(month) {
			return (month > 9 ? '' + month : '0' + month) === this.selectMonth;
		}
	}
};
</script>

<style scoped lang="scss">
@import '../style/common.scss';
.report-detail {
	height: 100%;
	background-color: white;
	display: flex;
	flex-direction: column;
	border-radius: 5px;
	overflow: hidden;
	.head {
		flex-shrink: 0;
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fafafa;
		border-bottom: 1px solid #f0f0f0;
		.year {
			font-size: 15px;
			font-weight: bold;
		}
		.arrow {
			width: 25px;
			height: 25px;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #efefef;
			box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
		}
	}
	.month {
		flex-shrink: 0;
		background-color: white;
		.row {
			display: flex;
			justify-content: space-between;
			margin: 16px;
		}
		.month-item {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background-color: #efefef;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 13px;
			transition: all 0.1s;
			&.active {
				background-color: #0099ff;
				color: white;
			}
		}
	}
}
</style>
