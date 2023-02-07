<template>
	<view class="page">
		<!-- <view style="height: 1px;"></view> -->
		<view class="top">
			<uni-search-bar
				class="search-bar"
				ref="search"
				v-model="queryContent"
				clearButton="none"
				:radius="100"
				@confirm="search"
				@cancel="handleCancel"
				placeholder="搜索负责人、项目名称、项目码"
			></uni-search-bar>
			<view class="tab">
				<view v-for="(item, index) in tabItems" class="tab-item" :class="{ active: activeTabIndex === index }" @click="activeTabIndex = index">
					<text>{{ item }}</text>
					<view class="line"></view>
					<template v-if="modules[index]">
						<view class="mark" v-if="modules[index].dataList.length !== 0">
							<text class="mark-count">{{ modules[index].dataList.length }}</text>
						</view>
					</template>
				</view>
			</view>
		</view>

		<swiper :current="activeTabIndex" @change="swiperChange" style="flex: 1">
			<swiper-item v-for="item in modules">
				<scroll-view scroll-y="true">
					<view v-for="(itemData, index) in item.dataList" class="info-card" @click="toDetail(itemData)">
						<view class="info-card-title">{{ itemData.projectName }}</view>
						<view class="info-card-footer">
							<view class="footer-item">
								<view class="footer-item-icon"><image class="img" src="/static/img/menu.png" mode="aspectFill" alt=""></view>
								<text>{{ itemData.projectTypeName }}</text>
							</view>
							<view class="footer-item">
								<view class="footer-item-icon"><image class="img" src="/static/img/user.png" mode="aspectFill" alt=""></view>
								<text>负责人:{{ itemData.headUserName }}</text>
							</view>
							<view class="footer-item">
								<view class="footer-item-icon"><image class="img" src="/static/img/investment.png" mode="aspectFill" alt=""></view>
								<text>总投资:{{ itemData.allInvest || 0 }} [万元]</text>
							</view>
						</view>
					</view>
					<uni-load-more :status="item.more" @clickLoadMore="handleReachBottom"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import { getManagerPageList, getJumpRights } from '@/api/project/projectManage.js';
export default {
	data() {
		return {
			activeTabIndex: 0,
			tabItems: ['预备', '前期', '在建', '竣工', '决算'],
			modules: [],
			queryContent: '',
			userId: null
		};
	},
	async onLoad() {
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId
		for (let i = 0; i < this.tabItems.length; i++) {
			this.modules.push({
				dataList: [], // 数据列表
				isLoadAll: false, // 是否已加载全部数据
				more: 'more', // laodmore状态
				isLoadingMore: false, // 是否正在请求下一页数据
				searchParams: {
					params: '', // 项目名称、项目码
					buildStageType: i,
					pageIndex: 1,
					pageSize: 10
				} // 搜索条件
			});
		}
		this.fetchData();
	},
	onReady() {},

	methods: {
		fetchData() {
			for (let i = 0; i < this.tabItems.length; i++) {
				this.loadData(i);
			}
		},
		loadData(index) {
			let module = null;
			if (index !== undefined) {
				module = this.modules[index];
			} else {
				module = this.modules[this.activeTabIndex];
			}
			module.searchParams.params = this.queryContent === '' ? '' : this.queryContent.value;
			getManagerPageList(module.searchParams).then(res => {
				res.records = res.records || [];
				res.records.forEach(v => {
					v.projectTypeName = v.projectTypeName.replace(/类/, '');
					v.projectName = `(${v.projectCode}) ${v.projectName}`;
				});
				module.isLoadAll = res.records.length === 0;
				module.more = module.isLoadAll ? 'noMore' : 'more';
				module.dataList = module.dataList.concat(res.records);
				// 判断是否在下拉刷新中，如果是则结束下拉刷新
				if (this.pulling) {
					this.pulling = false;
					uni.stopPullDownRefresh();
				}
				module.isLoadingMore = false;
			});
		},
		swiperChange(e) {
			this.activeTabIndex = e.detail.current;
			const module = this.modules[this.activeTabIndex];
			// 判断该页是否调用过接口
			if (!module.dataList.length && !module.isLoadAll) {
				this.fetchData();
			}
		},
		// 跳转详情页
		async toDetail({ projectId, projectName }) {
			// 检查是否有查看详情的权限
			const isHasPermission = await getJumpRights(projectId, this.userId)
			if(isHasPermission) {
				uni.navigateTo({
					url: `/pages/project-detail/project-detail?projectId=${projectId}&projectName=${projectName}`
				});
			}else {
				uni.showToast({
					title:'你没有查看该项目的权限',
					icon:'none'
				})
			}
			
		},
		search() {
			for (let i = 0; i < this.tabItems.length; i++) {
				const module = this.modules[i];
				module.isLoadAll = false;
				module.more = 'more';
				module.isLoadingMore = false;
				module.dataList.length = 0;
				module.searchParams.pageIndex = 1;
			}
			this.fetchData();
		},
		handleCancel() {
			this.queryContent = '';
			this.search();
		},
		handleReachBottom() {
			// 拿到正在获取的页面
			const module = this.modules[this.activeTabIndex];
			// 如果此页正在请求下一页数据或已经加载完全部的数据，就不在执行
			if (module.isLoadingMore || module.isLoadAll) {
				return;
			}
			module.isLoadingMore = true;
			module.more = 'loading';
			module.searchParams.pageIndex++;
			this.loadData();
		}
	}
};
</script>

<style scoped lang="scss">
@import '@/pages/project-detail/style/common.scss';
/deep/ .uni-searchbar__cancel {
	color: white;
}
.page {
	height: 100%;
	background-color: $-bg-color;
	display: flex;
	flex-direction: column;
}
.top {
	background-color: white;
	display: flex;
	flex-direction: column;
	// margin-top: $-space-height;
	margin-bottom: 10px;
	background-color: #3c88f2;
}
.search-bar {
	margin: 10px;
	background-color: transparent;
	padding: 0;
}

.info-card {
	margin-left: 10px;
	margin-right: 10px;
}
.tab {
	display: flex;
	justify-content: space-evenly;
	margin: 10px 0 8px 0;

	.tab-item {
		flex: 1;
		position: relative;
		// color: #8c8c8c;
		color: white;
		text-align: center;
		font-size: 16px;

		&.active {
			// color: #1989fa;
			color: #ffffcc;
			.line {
				display: block;
			}
		}
	}

	.line {
		display: none;
		position: absolute;
		// background-color: #1989fa;
		background-color: #ffffcc;
		left: 50%;
		transform: translateX(-50%);
		width: 25%;
		height: 3px;
		border-radius: 2px;
		bottom: -7px;
	}
}

.mark {
	position: absolute;
	top: -5px;
	right: 6px;
	width: 16px;
	height: 16px;
	border-radius: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #ff2727;
	color: white;
	font-size: 11px;
	font-weight: bold;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: white;
	padding: 0 10px 0 2px;

	.uni-searchbar {
		flex: 1;
		margin-right: 10px;
	}

	.more {
		color: #1989fa;
	}
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

.bottom {
	color: #adadad;
	font-size: 13px;
	margin-top: 10px;
	display: flex;
	justify-content: space-between;
}

.picker-view-wrap {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 300px;
	font-size: 15px;

	.picker-item {
		line-height: 30px;
		background-color: white;
		text-align: center;
		font-size: 16px;
		color: #333333;
	}

	.picker-header {
		display: flex;
		justify-content: space-between;
		padding: 10px;
		color: #666666;
		background-color: white;
		font-size: 16px;

		.complete {
			color: #007aff;
		}

		border-bottom: 1px solid #e5e5e5;
	}
}

.picker-view {
	height: 100%;
	background-color: white;
}
.header {
	margin: 20rpx 20rpx;
	border-radius: 20rpx;
}
.pro-info {
	margin: 20rpx 10rpx;
}
.tip {
	margin: 20rpx 10rpx;
}
.tip text {
	margin-left: 35%;
	font-size: 30rpx;
}
.title {
	font-size: 30rpx;
	// font-weight: bold;
	margin-bottom: 10rpx;
}
.info {
	font-size: 28rpx;
	color: #888;
}
.info text {
	margin-right: 10rpx;
}
</style>
