<template>
	<view class="page">
		<view v-for="(module, index) in modules" v-show="activeTabIndex === index" :key="index" class="module">
			<view class="list-item" v-for="(item, ind) in module.dataList" :key="ind" @click="goDetail(item)">
				<view class="row top">
					<text class="item-title">{{ item.infoTitle }}</text>
				</view>
			</view>
			<uni-load-more :status="module.more" @clickLoadMore="handleReachBottom"></uni-load-more>
			<the-search v-show="module.showSearch" @search="search" :moduleIndex="index"></the-search>
		</view>

	</view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
import TheSearch from './the-search.vue';
import dayjs from 'dayjs';
import { all, geRen, keShi, siRen, getAllInfo } from '@/api/office/exchange.js';
export default {
	components: {
		IconFont,
		TheSearch
	},
	data() {
		return {
			tabItems: [],
			activeTabIndex: 0,
			listData: [],
			more: 'more',
			loading: false,
			pulling: false, // 标记正在进行下拉刷新
			showSearch: false,
			modules: [] // 所有模块的数据集合
		};
	},
	onLoad({type}) {
		uni.setNavigationBarTitle({
			title: type
		})
		// 设置权限及初始化变量
		// this.tabItems = this.tabItems.filter(v => this.$hasPermission(v.permissionKey, this.$const.OA_PERMISSION))
		const isQueryAll = this.$hasPermission('exchange_all_permission', this.$const.OA_PERMISSION) ? 1 : 0;
		this.modules.push({
			dataList: [], // 数据列表
			isLoadAll: false, // 是否已加载全部数据
			more: 'more', // laodmore状态
			isLoadingMore: false, // 是否正在请求下一页数据
			showSearch: false,
			searchParams: {
				infoTitle: '',
				readed: '',
				beforDate: '',
				afterDate: '',
				pageIndex: 1,
				pageSize: 10,
				isQueryAll: isQueryAll,
				infoType: type
			}, // 搜索条件
			queryMethod: getAllInfo
		});
		this.fetchData();
		// 监听阅读状态更新事件
		uni.$on(this.$events.UPDATE_EXCHANGE_READ_STATE, () => {
			const module = this.modules[this.activeTabIndex];
			// 更新列表数据时，要保证和之前的数据个数一致
			module.searchParams.pageSize *= module.searchParams.pageIndex;
			module.searchParams.pageIndex = 1
			module.isLoadAll = false;
			module.dataList.length = 0;
			this.fetchData();
			module.searchParams.pageSize = 10;
		});
	},
	onPullDownRefresh() {
		this.pulling = true;
		// 刷新当前选项卡页的数据
		const module = this.modules[this.activeTabIndex];
		module.isLoadAll = false;
		module.more = 'more';
		module.isLoadingMore = false;
		module.dataList.length = 0;
		module.searchParams.pageIndex = 1;
		module.searchParams.infoTitle = '';
		module.searchParams.readed = '';
		module.searchParams.beforDate = '';
		module.searchParams.afterDate = '';
		this.fetchData();
	},
	onReachBottom() {
		this.handleReachBottom();
	},
	onNavigationBarButtonTap(e) {
		const module = this.modules[this.activeTabIndex];
		module.showSearch = !module.showSearch
	},
	methods: {
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
			this.fetchData();
		},
		fetchData() {
			let { queryMethod, searchParams } = this.modules[this.activeTabIndex];
			const module = this.modules[this.activeTabIndex];
			queryMethod(searchParams).then(res => {
				res.records = res.records || [];
				res.records.forEach(v => (v.created = dayjs(v.created).format('YYYY-MM-DD')));
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
		search({ params, moduleIndex }) {
			const module = this.modules[moduleIndex];
			const searchParams = module.searchParams;
			searchParams.infoTitle = params.infoTitle;
			searchParams.readed = params.readed;
			searchParams.beforDate = params.beforDate;
			searchParams.afterDate = params.afterDate;
			searchParams.pageIndex = 1;
			module.showSearch = false;
			module.dataList.length = 0;
			this.fetchData();
		},
		// 切换底部选项卡
		switchTab(tabIndex) {
			this.activeTabIndex = tabIndex;
			const module = this.modules[tabIndex];
			// 判断该页是否调用过接口
			if (!module.dataList.length && !module.isLoadAll) {
				this.fetchData();
			}
		},
		// 跳转到详情页面
		goDetail(item) {
			uni.navigateTo({
				url: `/pages/office/work-exchange/exchange-detail?infoId=${item.infoId}&isRead=${+item.readed}`
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import '@/styles/tabbar.scss';
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
