<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view v-for="(module, index) in modules" v-show="activeTabIndex === index" :key="index" class="module">
			<!-- 我的申请右滑可以删除 -->
			<template v-if="module.moduleKey === 'FlowManagerList'">
				<view class="list-wrap">
					<uni-swipe-action>
						<uni-swipe-action-item v-for="(item, ind) in module.dataList" :key="ind" :right-options="options" @click="e => onClick(e, item)" class="swipe-item">
							<view class="list-item" @click="goDetail(item, module)">
								<view class="left">
									<view class="photo">
										<text>{{ item.qingJiaRenNameBak }}</text>
									</view>
								</view>
								<view class="right">
									<view class="content">
										<text>{{ item.approvalContent }}</text>
										<text class="state" :class="stateMap.get(item.stateName)">{{ item.stateName }}</text>
									</view>
									<view class="info">
										<view class="info-left">
											<text style="margin-right: 5px;">[{{ item.leaveType }}]</text>
											<text style="margin-right: 10px;">{{ item.qingJiaRenName }}</text>
											<text>{{ item.created }}</text>
										</view>
										<view class="info-right"></view>
									</view>
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</template>
			<template v-else>
				<!-- 流程监控有查询 -->
				<view v-if="module.moduleKey === 'FlowManagerMonitoring'" class="search">
					<uni-search-bar
						class="search-bar"
						ref="search"
						clearButton="none"
						:radius="100"
						@confirm="(e) => handleSearch(e, module)"
						@cancel="(e) => handleCancel(module)"
						placeholder="申请人"
					></uni-search-bar>
					<app-select v-if="leaveTypeList.length" v-model="module.searchParams.qjleaveType" :selectData="leaveTypeList" @select-change="search"></app-select>
				</view>
				<view class="list-wrap">
					<view class="list-item" v-for="(item, ind) in module.dataList" :key="ind" @click="goDetail(item, module)">
						<view class="left">
							<view class="photo">
								<text>{{ item.qingJiaRenNameBak }}</text>
							</view>
						</view>
						<view class="right">
							<view class="content">
								<text>{{ item.approvalContent }}</text>
								<text class="state" :class="stateMap.get(item.stateName)">{{ item.stateName }}</text>
							</view>
							<view class="info">
								<view class="info-left">
									<text style="margin-right: 5px;">[{{ item.leaveType }}]</text>
									<text style="margin-right: 10px;">{{ item.qingJiaRenName }}</text>
									<text>{{ item.created }}</text>
								</view>
								<view class="info-right"></view>
							</view>
						</view>
					</view>
				</view>
			</template>

			<uni-load-more :status="module.more" @clickLoadMore="handleReachBottom"></uni-load-more>
			<!-- <the-search v-show="module.showSearch" @search="search" :moduleIndex="index"></the-search> -->
		</view>
		<view style="height: 50px;"></view>
		<view class="app-tab-bar">
			<view class="tab-item" v-for="(item, index) in tabItems" :key="index" :class="{ active: index === activeTabIndex }" @click="switchTab(index)">
				<icon-font :icon="item.icon" class="tab-icon"></icon-font>
				<text class="tab-name">{{ item.name }}</text>
			</view>
		</view>
		<view class="float-button" @click="gotoForm"><uni-icons type="plusempty" size="22" color="#ffffff"></uni-icons></view>
		<neil-modal :show="showModel" title="提示" content="确定删除吗" confirmColor="#dd524d" align="center" @confirm="delSchedule" @close="showModel = false"></neil-modal>
	</view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
import dayjs from 'dayjs';
import { getMyLeavePageList, getMyEndPageList, getFlowMonitorPageList, getMyWaitPageList, del, getLeaveType } from '@/api/office/leave.js';
import AppSelect from '@/components/app-select.vue';
export default {
	components: { IconFont, AppSelect },
	data() {
		return {
			tabItems: [
				{
					name: '申请',
					icon: 'icon-shenqing1',
					permissionKey: 'FlowManagerList',
					queryMethod: getMyLeavePageList
				},
				{
					name: '待办',
					icon: 'icon-daiban',
					permissionKey: 'FlowManagerApprove',
					queryMethod: getMyWaitPageList,
					markCount: 0
				},
				{
					name: '已办',
					icon: 'icon-yibanrenwu',
					permissionKey: 'FlowManagerYiBan',
					queryMethod: getMyEndPageList
				},
				{
					name: '流程监控',
					icon: 'icon-liucheng1',
					permissionKey: 'FlowManagerMonitoring',
					queryMethod: getFlowMonitorPageList
				}
			],
			activeTabIndex: 0,
			more: 'more',
			loading: false,
			pulling: false, // 标记正在进行下拉刷新
			showSearch: false,
			modules: [], // 所有模块的数据集合
			typeMap: {
				'FlowManagerList': 0, // 仅查看
				'FlowManagerApprove': 1, // 审批
				'FlowManagerYiBan': 2, // 修改审批意见
				'FlowManagerMonitoring': 0
			},
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
			stateMap: new Map([['已审批', 'success'], ['审批中', 'primary'], ['退回', 'danger']]),
			leaveTypeList: [], // 请假类型
			searchParams: {
				creatorName: '', // 申请人
				qjleaveType: '', // 请假类型
			}
		};
	},
	onLoad() {
		const userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		// 设置菜单权限
		this.tabItems = this.tabItems.filter(v => this.$hasPermission(v.permissionKey, this.$const.OA_PERMISSION));
		for (let i = 0; i < this.tabItems.length; i++) {
			const item = {
				dataList: [], // 数据列表
				isLoadAll: false, // 是否已加载全部数据
				more: 'more', // laodmore状态
				isLoadingMore: false, // 是否正在请求下一页数据
				showSearch: false,
				searchParams: {
					pageIndex: 1,
					pageSize: 10,
					userId,
					qjleaveType: '', // 请假类型
					creatorName: '', // 申请人
				}, // 搜索条件
				queryMethod: this.tabItems[i].queryMethod,
				moduleKey: this.tabItems[i].permissionKey
			};
			if (this.tabItems[i].permissionKey === 'FlowManagerMonitoring') {
				item.searchParams.userId = this.$hasPermission('qing_jia_monitor_permission', this.$const.OA_PERMISSION) ? null : userId;
			}
			this.modules.push(item);
		}
		this.fetchData();
		// 监听阅读状态更新事件
		uni.$on(this.$events.UPDATE_LEAVE_STATE, () => {
			const module = this.modules[this.activeTabIndex];
			// 更新列表数据时，要保证和之前的数据个数一致
			module.searchParams.pageSize *= module.searchParams.pageIndex;
			module.searchParams.pageIndex = 1;
			module.isLoadAll = false;
			module.dataList.length = 0;
			this.fetchData();
			module.searchParams.pageSize = 10;
		});
		// 获取请假类型
		getLeaveType().then(res => {
			this.leaveTypeList = res.map((v, index) => {
				return {
					label: v.pname,
					value: v.pid
				};
			});
			this.leaveTypeList.unshift({
				label: '请选择',
				value: ''
			})
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
		this.fetchData();
	},
	onReachBottom() {
		this.handleReachBottom();
	},
	onNavigationBarButtonTap(e) {
		const module = this.modules[this.activeTabIndex];
		module.showSearch = true;
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
			queryMethod(searchParams.pageIndex, searchParams.pageSize, searchParams.userId, searchParams.creatorName, searchParams.qjleaveType).then(res => {
				res.records = res.records || [];
				res.records.forEach(v => {
					v.created = dayjs(v.created).format('YYYY-MM-DD');
					v.qingJiaRenNameBak = v.qingJiaRenName.substr(0, 2);
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
				/* if(module.moduleKey === 'FlowManagerApprove') {
						this.tabItems.find(v => v.permissionKey === 'FlowManagerApprove').markCount = module.dataList.length
					} */
			});
		},
		search() {
			const module = this.modules[this.activeTabIndex];
			module.isLoadAll = false;
			module.more = 'more';
			module.isLoadingMore = false;
			module.dataList.length = 0;
			module.searchParams.pageIndex = 1;
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
		goDetail(item, { moduleKey }) {
			const type = this.typeMap[moduleKey];
			uni.navigateTo({
				url: `/pages/leave-list/leave-detail?approvalId=${item.approvalId}&signIndex=${item.signIndex}&type=${type}`
			});
		},
		gotoForm() {
			uni.navigateTo({
				url: '/pages/leave-list/leave-form'
			});
		},
		onClick(e, item) {
			this.showModel = true;
			this.delApprovalId = item.approvalId;
		},
		delSchedule() {
			uni.showLoading({
				title: '正在删除',
				mask: true
			});
			del(this.delApprovalId)
				.then(() => {
					uni.hideLoading();
					uni.$emit(this.$events.UPDATE_LEAVE_STATE);
				})
				.catch(() => {
					uni.hideLoading();
				});
			this.delApprovalId = null;
		},
		handleSearch(e, module) {
			module.searchParams.creatorName = e.value;
			this.search();
		},
		handleCancel(module) {
			module.searchParams.creatorName = '';
			this.search();
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
</style>
