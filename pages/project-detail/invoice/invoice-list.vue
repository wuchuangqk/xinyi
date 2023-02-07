<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="module">
			<view class="search">
				<uni-search-bar
					class="search-bar"
					ref="search"
					clearButton="none"
					:radius="100"
					@confirm="handleSearch"
					@cancel="handleCancel"
					placeholder="客户名称"
				></uni-search-bar>
				<view style="display: flex;align-items: center;">
					<app-select v-if="claimTypes.length" v-model="searchParams.type" :selectData="claimTypes" @select-change="search"></app-select>
				</view>
			</view>
			<!-- 我的申请右滑可以删除 -->
			<view class="list-wrap">
				<uni-swipe-action>
					<uni-swipe-action-item v-for="(item, ind) in dataList" :key="ind" :right-options="options" @click="e => onClick(e, item)" class="swipe-item">
						<view class="list-item" @click="goDetail(item)">
							<view class="left">
								<view class="photo">
									<text>{{ item.customerBak }}</text>
								</view>
							</view>
							<view class="right">
								<view class="content">
									<text>{{ item.tax }}</text>
								</view>
								<view class="info">
									<view class="info-left">
										<text style="margin-right: 5px;">{{ item.typeText }}</text>
										<text style="margin-right: 10px;">{{ item.customer }}</text>
										<text>{{ item.days }}</text>
									</view>
									<view class="info-right"></view>
								</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
			<uni-load-more :status="more" @clickLoadMore="handleReachBottom"></uni-load-more>
		</view>
		<view style="height: 50px;"></view>
		<view class="float-button" @click="gotoForm"><uni-icons type="plusempty" size="22" color="#ffffff"></uni-icons></view>
		<neil-modal :show="showModel" title="提示" content="确定删除吗" confirmColor="#dd524d" align="center" @confirm="delSchedule" @close="showModel = false"></neil-modal>
	</view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
import dayjs from 'dayjs';
import { getInvoicingList, delInvoicing  } from '@/api/project/invoice.js';
import AppSelect from '@/components/app-select.vue';
export default {
	components: { IconFont, AppSelect },
	data() {
		return {
			more: 'more',
			loading: false,
			pulling: false, // 标记正在进行下拉刷新
			showSearch: false,
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			showModel: false,
			delApprovalId: null,
			claimTypes: [
				{ label: '请选择开票类型', value: '' },
				{ label: '专票', value: 0 },
        { label: '普票', value: 1 },], // 请假类型
			searchParams: {
				customer: '', // 申请人
				type: '' ,// 请假类型
				projectId: null,
				pageIndex: 1,
				pageSize: 10,
			},
			projectId: null,
			dataList: []
		};
	},
	async onLoad({ projectId }) {
		this.searchParams.projectId = projectId
		this.fetchData();
		uni.$on(this.$events.UPDATE_INVOICE_STATE, () => {
			this.search()
		});
	},
	methods: {
		handleReachBottom() {
			// 如果此页正在请求下一页数据或已经加载完全部的数据，就不在执行
			if (this.isLoadingMore || this.isLoadAll) {
				return;
			}
			this.isLoadingMore = true;
			this.more = 'loading';
			this.searchParams.pageIndex++;
			this.fetchData();
		},
		fetchData() {
			getInvoicingList(this.searchParams).then(res => {
				res.records = res.records || [];
				res.records.forEach(v => {
					v.customerBak = v.customer.substr(0, 2);
					v.tax = v.tax.toFixed(2);
					v.typeText = this.getClaimType(v);
				});
				this.isLoadAll = res.records.length === 0;
				this.more = this.isLoadAll ? 'noMore' : 'more';
				this.dataList = this.dataList.concat(res.records);
				this.isLoadingMore = false;
			});
		},
		getClaimType(row) {
			const temp = this.claimTypes.find(v => v.value === +row.type);
			return temp ? temp.label : row.type;
		},
		search() {
			this.isLoadAll = false;
			this.more = 'more';
			this.isLoadingMore = false;
			this.dataList.length = 0;
			this.searchParams.pageIndex = 1;
			this.fetchData();
		},
		// 跳转到详情页面
		goDetail(item) {
			uni.navigateTo({
				url: `/pages/project-detail/invoice/invoice-detail?approvalId=${item.id}`
			});
		},
		gotoForm() {
			uni.navigateTo({
				url: `/pages/project-detail/invoice/invoice-form?projectId=${this.searchParams.projectId}`
			});
		},
		onClick(e, item) {
			this.showModel = true;
			this.delApprovalId = item.id;
		},
		delSchedule() {
			uni.showLoading({
				title: '正在删除',
				mask: true
			});
			delInvoicing(this.delApprovalId)
				.then(() => {
					uni.hideLoading();
					this.search()
				})
				.catch(() => {
					uni.hideLoading();
				});
			this.delApprovalId = null;
		},
		handleSearch(e) {
			this.searchParams.customer = e.value;
			this.search();
		},
		handleCancel() {
			this.searchParams.customer = '';
			this.search();
		}
	}
};
</script>

<style scoped lang="scss">
@import '@/styles/status.scss';
.page {
	min-height: 100%;
	background-color: $-bg-color;
}

.module {
	// padding: 10px;
}

.top {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	font-size: 15px;

	.item-title {
		flex: 1;
	}

	.state {
		flex-shrink: 0;
	}
}

.list-item {
	padding: 18px 10px 0;
	background-color: white;
	border-radius: 3px;
	display: flex;
	.left {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background-color: #499aec;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10px;
		color: white;
		font-size: 13px;
	}
	.right {
		flex: 1;
		padding-bottom: 18px;
		border-bottom: 1px solid #eeeeee;
		.content {
			display: flex;
			justify-content: space-between;
			font-size: 15px;
			margin-bottom: 6px;
		}
	}
	.info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 13px;
		color: #999999;
	}
	.item-title {
		color: #333333;
		margin-bottom: 10px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.item-content {
		font-size: 13px;
		color: gray;
		display: flex;
		justify-content: space-between;
	}
}

.bottom {
	color: #adadad;
	font-size: 13px;
	margin-top: 10px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.un-read {
	position: relative;

	&::before {
		content: '';
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background-color: red;
		position: absolute;
		left: -9px;
		top: 50%;
		transform: translateY(-50%);
	}
}

.has-read {
	color: gray;
}

.app-tab-bar {
	position: fixed;
	display: flex;
	flex-direction: row;
	left: 0;
	right: 0;
	bottom: 0;
	border-top: 1px solid #dadada;
	height: 50px;
	background-color: white;
	z-index: 99;

	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #a5a5a7;

		&.active {
			.tab-name,
			.tab-icon {
				color: #1989fa;
			}
		}
	}

	.tab-icon {
		font-size: 24px;
	}

	.tab-name {
		color: rgb(153, 153, 153);
		font-size: 10px;
		margin-top: 3px;
	}
}
.float-button {
	position: fixed;
	z-index: 1000;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
	background-color: #1989fa;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	right: 5%;
	bottom: 15%;
}
.search {
	display: flex;
	background-color: white;
	padding-right: 8px;
	.search-bar {
		flex: 1;
	}
}
.list-wrap {
	padding: 10px;
}

/deep/ .input-value-border {
	border: none;
}
</style>
