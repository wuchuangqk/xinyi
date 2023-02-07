<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view v-for="(module, index) in modules" v-show="activeTabIndex === index" :key="index" class="module">
			<view class="search">
				<uni-search-bar
					class="search-bar"
					ref="search"
					clearButton="none"
					:radius="100"
					@confirm="(e) => handleSearch(e, module)"
					@cancel="(e) => handleCancel(module)"
					placeholder="姓名"
				></uni-search-bar>
				<app-select v-model="module.searchParams.state" :selectData="stateOption" @select-change="search"></app-select>
			</view>
			<view class="list-wrap">
				<view class="list-item" v-for="(item, ind) in module.list" :key="ind" @click="goDetail(item)">
					<view class="left">
						<view class="photo">
							<text>{{ item.userNameBak }}</text>
						</view>
					</view>
					<view class="right">
						<view class="content">
							<text>{{ item.userName }}</text>
							<text class="state" :class="item.stateClass">{{ item.stateText }}</text>
						</view>
						<view class="info">
							<view class="info-left">
								<text>{{ item.projectName }}</text>
							</view>
							<view class="info-right">
								{{ item.toTime }}
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="module.more" @clickLoadMore="handleReachBottom"></uni-load-more>
		</view>

		<view style="height: 50px;"></view>
		<view class="app-tab-bar">
			<view class="tab-item" v-for="(item, index) in tabItems" :key="index" :class="{ active: index === activeTabIndex }" @click="switchTab(index)">
				<icon-font :icon="item.icon" class="tab-icon"></icon-font>
				<text class="tab-name">{{ item.name }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
import dayjs from 'dayjs';
import { getInPageList, getOutPageList } from '@/api/project/peopleManage.js';
import AppSelect from '@/components/app-select.vue';
import {storageKeys} from '@/util/constants.js'
export default {
	components: { IconFont, AppSelect },
	data() {
		return {
			tabItems: [
				{
					name: '调入记录',
					icon: 'icon-tiaorudan'
				},
				{
					name: '调出记录',
					icon: 'icon-8637092d'
				}
			],
			activeTabIndex: 0,
			showSearch: false,
			stateOption: [
				{label: '请选择调拨状态', value: ''},
				{label: '待确认', value: 0},
				{label: '调拨完成', value: 1},
				{label: '已取消', value: 2},
			],
			stateMap: new Map([
				[
					0,
					{
						text: '待确认',
						stateClass: 'info'
					}
				],
				[
					1,
					{
						text: '调拨完成',
						stateClass: 'success'
					}
				],
				[
					2,
					{
						text: '已取消',
						stateClass: 'danger'
					}
				]
			]),
			modules: [
				{
					searchParams: {
						userName: '', // 申请人
						state: '', // 请假类型
						projectId: '',
						pageIndex: 1,
						pageSize: 10
					},
					list: [],
					isLoadAll: false,
					more: 'noMore',
					isLoadingMore: false
				},
				{
					searchParams: {
						userName: '', // 申请人
						state: '', // 请假类型
						projectId: '',
						pageIndex: 1,
						pageSize: 10
					},
					list: [],
					isLoadAll: false,
					more: 'noMore',
					isLoadingMore: false
				}
			],
			projectId: null,
		};
	},
	onLoad({ projectId }) {
		this.projectId = projectId
		this.modules.forEach(v => {
			v.searchParams.projectId = projectId;
		});
		this.fetchData();
		uni.$on(this.$events.UPDATE_ALLOT_STATE, () => {
			const module = this.modules[this.activeTabIndex];
			// 更新列表数据时，要保证和之前的数据个数一致
			module.searchParams.pageSize *= module.searchParams.pageIndex;
			module.searchParams.pageIndex = 1;
			module.isLoadAll = false;
			module.list.length = 0;
			this.fetchData();
			module.searchParams.pageSize = 10;
		});
	},
	methods: {
		fetchData() {
			const method = this.activeTabIndex === 0 ? getInPageList : getOutPageList;
			const module = this.modules[this.activeTabIndex];
			method(module.searchParams).then(res => {
				res.records = res.records || [];
				res.records.forEach(v => {
					v.type = this.activeTabIndex
					v.userNameBak = v.userName.substr(0, 2);
					v.projectName = this.activeTabIndex === 0 ? v.fromProjectName : v.toProjectName
					v.stateText = v.state
					v.stateClass = 'info'
					const item = this.stateMap.get(v.state)
					if (item) {
						v.stateText = item.text
						v.stateClass = item.stateClass
					}
				});
				module.list = module.list.concat(res.records);
				module.isLoadAll = res.records.length === 0;
				module.more = module.isLoadAll ? 'noMore' : 'more';
				module.isLoadingMore = false;
			});
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
			this.fetchData();
		},
		// 切换底部选项卡
		switchTab(tabIndex) {
			this.activeTabIndex = tabIndex;
			const module = this.modules[tabIndex];
			// 判断该页是否调用过接口
			if (!module.list.length && !module.isLoadAll) {
				this.fetchData();
			}
		},
		// 跳转到详情页面
		goDetail(item) {
			uni.setStorageSync(storageKeys.TEMP, item)
			uni.navigateTo({
				url: `/pages/people-manage/people-detail?projectId=${this.projectId}`
			});
		},
		handleSearch(e, module) {
			module.searchParams.userName = e.value;
			this.search();
		},
		handleCancel(module) {
			module.searchParams.userName = '';
			this.search();
		},
		search() {
			const module = this.modules[this.activeTabIndex];
			module.isLoadAll = false;
			module.more = 'more';
			module.isLoadingMore = false;
			module.list.length = 0;
			module.searchParams.pageIndex = 1;
			this.fetchData();
		},
	}
};
</script>

<style scoped lang="scss">
@import '../../styles/status.scss';
.page {
	min-height: 100%;
	background-color: $-bg-color;
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
