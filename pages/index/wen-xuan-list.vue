<template>
	<view class="page">
		<view class="list-item" v-for="(item, index) in listData" :key="item.noticeId" @click="toDetail(item.infoId)">
			<view class="row top">
				<text class="item-title">{{ item.infoTitle }}</text>
				<!-- <view class="state" :class="+item.isReads === 0 ? 'un-read' : 'has-read'">{{ +item.isReads ? '已读' : '未读' }}</view> -->
			</view>
			<!-- <view class="row bottom">
				<text>{{ item.created }}</text>
				<text>{{ item.creatorName }}</text>
			</view> -->
		</view>
		<uni-load-more :status="more" @clickLoadMore="handleReachBottom"></uni-load-more>
		<!-- <notice-search v-show="showSearch" @search="search"></notice-search> -->
	</view>
</template>

<script>
import dayjs from 'dayjs';
import IconFont from '@/components/icon-font.vue';
import { getWenXuan } from '@/api/office/wenXuan.js';
// import NoticeSearch from './components/notice-search.vue';
export default {
	components: {
		IconFont
	},
	data() {
		return {
			listData: [],
			total: 0,
			isLoadAll: false, // 是否已加载全部数据
			more: 'more', // laodmore状态
			isLoadingMore: false, // 是否正在请求下一页数据
			pulling: false,
			showSearch: false,
			searchParams: {
				noticeTitle: null, //通知标题
				isRead: null, //是否已读
				startTime: '', //开始时间
				endTime: '', //结束时间
				pageIndex: 1,
				pageSize: 10
			}
		};
	},
	onLoad() {
		this.fetchData();
		uni.$on(this.$events.UPDATE_WEN_XUAN_STATE, () => {
			this.searchParams.pageSize *= this.searchParams.pageIndex;
			this.isLoadAll = false;
			this.listData.length = 0;
			this.fetchData();
			this.searchParams.pageSize = 10;
		});
	},
	onPullDownRefresh() {
		this.pulling = true;
		this.isLoadAll = false;
		this.more = 'more';
		this.isLoadingMore = false;
		this.listData.length = 0;
		this.searchParams.noticeTitle = null; //通知标题
		this.searchParams.isRead = null; //是否已读
		this.searchParams.startTime = ''; //开始时间
		this.searchParams.endTime = ''; //结束时间
		this.searchParams.pageIndex = 1;
		this.fetchData();
	},
	onReachBottom() {
		this.handleReachBottom();
	},
	onNavigationBarButtonTap(e) {
		this.showSearch = !this.showSearch;
	},
	methods: {
		toDetail(infoId) {
			uni.navigateTo({
				url: '/pages/index/wen-xuan-detail?infoId=' + infoId
			});
		},
		search({ params }) {
			this.searchParams.noticeTitle = params.noticeTitle;
			this.searchParams.isRead = params.isRead;
			this.searchParams.startTime = params.startTime;
			this.searchParams.endTime = params.endTime;
			this.searchParams.pageIndex = 1;
			this.showSearch = false;
			this.listData.length = 0;
			this.fetchData();
		},
		fetchData() {
			const { noticeTitle, isRead, startTime, endTime, pageIndex, pageSize } = this.searchParams;
			getWenXuan(pageIndex, pageSize).then(res => {
				res.records = res.records || [];
				res.records.forEach(v => (v.created = v.created ? dayjs(v.created).format('YYYY-MM-DD') : null));
				this.listData = this.listData.concat(res.records);
				this.isLoadAll = res.records.length === 0;
				this.more = this.isLoadAll ? 'noMore' : 'more';
				if (this.pulling) {
					this.pulling = false;
					uni.stopPullDownRefresh();
				}
				this.isLoadingMore = false;
			});
		},
		handleReachBottom() {
			// 如果此页正在请求下一页数据或已经加载完全部的数据，就不在执行
			if (this.isLoadingMore || this.isLoadAll) {
				return;
			}
			this.isLoadingMore = true;
			this.more = 'loading';
			this.searchParams.pageIndex++;
			this.fetchData();
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: calc(100% - 51px);
	background-color: $-bg-color;
	padding: 1px 0 50px 0;
}

.top {
		display: flex;
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
		padding: 10px;
		background-color: white;
		margin: 10px;
		border-radius: 4px;
	
		.item-title {
			color: #333333;
			// margin-bottom: 10px;
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
		justify-content: space-between;
	}

.search {
	width: 90%;
	margin: 30rpx 5%;
	// background-color: #2C405A;
}

.searchInput {
	margin: 10rpx 0;
	width: 80%;
	float: left;
}

.searchButton {
	margin: 10rpx 0;
}

.noticeContext {
	width: 100%;
	// background-color: #F9F9F9;
	padding-top: 40rpx;
	padding-bottom: 0rpx;
}

.noticeInfo {
	width: 90%;
	margin-left: 5%;
	padding: 30rpx 0;
	background-color: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0px 0px 5px 4px #e5e5e5;
	margin-bottom: 40rpx;
}

.noticeTitle {
	margin-left: 5%;
	margin-bottom: 20rpx;
}

.noticeTime {
	margin-left: 5%;
	margin-bottom: 10rpx;
}

.title {
	color: #999999;
	font-weight: bold;
	font-size: 26rpx;
}

.red {
	color: red;
	float: right;
	margin-right: 8%;
	font-size: 24rpx;
}

.green {
	color: green;
	float: right;
	margin-right: 8%;
	font-size: 24rpx;
}

.putTime {
	color: #999999;
	font-size: 26rpx;
}

.putPeople {
	float: right;
	margin-right: 8%;
	font-size: 24rpx;
	color: #999999;
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
</style>
