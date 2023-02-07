<template>
	<view class="page">
		<uni-nav-bar left-icon="back" :fixed="true" @clickLeft="back" :statusBar="true">
			<view class="tab">
				<view class="tab-item" :class="{ active: activeTabIndex === 0 }" @click="activeTabIndex = 0">
					<text>审批待办</text>
					<view class="line"></view>
					<view class="mark" v-show="work.source.length">{{ work.source.length }}</view>
				</view>
				<view class="tab-item" :class="{ active: activeTabIndex === 1 }" @click="activeTabIndex = 1">
					<text>待阅事项</text>
					<view class="line"></view>
					<view class="mark" v-show="read.source.length">{{ read.source.length }}</view>
				</view>
			</view>
		</uni-nav-bar>
		<swiper :current="activeTabIndex" @change="swiperChange" style="flex:1">
			<swiper-item>
				<scroll-view scroll-y="true" style="height: 100%;">
					<view class="header">
						<uni-search-bar :radius="100" @confirm="workSearch" @cancel="workCancel" clearButton="none"></uni-search-bar>
					</view>
					<view class="card" v-for="(item, index) in work.data" :key="index" @click="handleTodo(item)">
						<view class="row top">
							<text class="item-title">{{ item.title }}</text>
						</view>
						<view class="row bottom">
							<text>{{ item.createTime }}</text>
							<text>{{ item.type }}</text>
						</view>
					</view>
					<view style="height: 10px;"></view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y="true" style="height: 100%;">
					<view class="header">
						<uni-search-bar :radius="100" @confirm="readSearch" @cancel="readCancel" clearButton="none"></uni-search-bar>
					</view>
					<view class="card" v-for="(item, index) in read.data" :key="index" @click="handleRead(item)">
						<view class="row top">
							<text class="item-title">{{ item.title }}</text>
						</view>
						<view class="row bottom">
							<text>{{ item.createTime }}</text>
							<text>{{ item.type }}</text>
						</view>
					</view>
					<view style="height: 10px;"></view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="picker-view-wrap" ref="picker">
				<view class="picker-header">
					<text @click="closePopup">取消</text>
					<text class="complete" @click="completeSelect">完成</text>
				</view>
				<picker-view :indicator-style="indicatorStyle" :value="value" @change="pickerChange" class="picker-view">
					<picker-view-column v-show="activeTabIndex === 0">
						<view class="picker-item" v-for="(item, index) in work.modules" :key="index">{{ item.text }}</view>
					</picker-view-column>
					<picker-view-column v-show="activeTabIndex === 1">
						<view class="picker-item" v-for="(item, index) in read.modules" :key="index">{{ item.text }}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
		<neil-modal :show="showModel" title="提示" content="此功能正在开发中" :show-cancel="false" align="center" @confirm="showModel = false" @close="showModel = false"></neil-modal>
	</view>
</template>

<script>
import AppSelect from '@/components/app-select.vue';
import { getTodoWork, getTodoRead } from '@/api/core/notification.js';
import todo from '@/mixin/todo.js'
export default {
	mixins:[todo],
	components: {
		AppSelect
	},
	data() {
		return {
			activeTabIndex: 0,
			work: {
				searchTitle: '',
				searchModule: null,
				modules: [
					{
						text: '全部',
						value: null
					},
					{
						text: '请假',
						value: '请假'
					},
					{
						text: '加班',
						value: '加班'
					},
					{
						text: '外出',
						value: '外出'
					},
					{
						text: '报销',
						value: '报销'
					}
				],
				data: [],
				source: []
			},
			read: {
				searchTitle: '',
				searchModule: null,
				modules: [
					{
						text: '全部',
						value: null
					},
					{
						text: '生日祝福',
						value: '生日祝福'
					},
					{
						text: '通知公告',
						value: '通知公告'
					}
				],
				data: [],
				source: []
			},
			visible: false,
			indicatorStyle: `height: 34px;`,
			value: [0, 0],
			pulling: false,
			userId: null,
			showModel: false,
			excludeTypes: ['进场交底'], // app上不处理的待办或待阅类型
		};
	},
	onLoad({ tab }) {
		if (tab) {
			this.activeTabIndex = tab === 'work' ? 0 : 1;
		}
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		this.fetchData();
		uni.$on(this.$events.UPDATE_TODO_STATE, () => {
			this.fetchData();
		});
	},
	onReady() {},
	onPullDownRefresh() {
		this.pulling = true;
		this.fetchData();
	},
	methods: {
		fetchData() {
			Promise.all([getTodoWork(this.userId), getTodoRead(this.userId)]).then(([workData, readData]) => {
				this.work.source = this.work.data = (workData || [])
				this.read.source = this.read.data = (readData || [])
				if (this.pulling) {
					uni.stopPullDownRefresh();
				}
			});
		},
		open() {
			this.$refs.popup.open('top');
		},
		closePopup() {
			this.$refs.popup.close();
		},
		completeSelect() {
			this.closePopup();
			this.search();
		},
		workSearch(e) {
			this.work.searchTitle = e.value
			this.search()
		},
		workCancel() {
			this.work.searchTitle = ''
			this.search()
		},
		readSearch(e) {
			this.read.searchTitle = e.value
			this.search()
		},
		readCancel() {
			this.read.searchTitle = ''
			this.search()
		},
		search() {
			if (this.activeTabIndex === 0) {
				const title = this.work.searchTitle
				const module = this.work.searchModule;
				this.work.data = this.work.source.filter(v => {
					const condition1 = title === '' ? true : v.title.indexOf(title) !== -1;
					const condition2 = module === null ? true : v.type === module;
					return condition1 && condition2;
				});
			} else {
				const title = this.read.searchTitle
				const module = this.read.searchModule;
				this.read.data = this.read.source.filter(v => {
					const condition1 = title === '' ? true : v.title.indexOf(title) !== -1;
					const condition2 = module === null ? true : v.type === module;
					return condition1 && condition2;
				});
			}
		},
		back() {
			uni.navigateBack();
		},
		swiperChange(e) {
			this.activeTabIndex = e.detail.current;
		},
		pickerChange(e) {
			this.value = e.detail.value;
			this.work.searchModule = this.work.modules[this.value[0]].value;
			this.read.searchModule = this.read.modules[this.value[1]].value;
		},
	}
};
</script>

<style scoped lang="scss">
.page {
	height: 100%;
	background-color: $-bg-color;
	display: flex;
	flex-direction: column;
}

.tab {
	display: flex;
	width: 100%;
	justify-content: space-evenly;

	.tab-item {
		flex: 1;
		position: relative;
		color: #8c8c8c;
		text-align: center;

		&.active {
			color: #1989fa;

			.line {
				display: block;
			}
		}
	}

	.line {
		display: none;
		position: absolute;
		background-color: #1989fa;
		left: 50%;
		transform: translateX(-50%);
		width: 25%;
		height: 3px;
		border-radius: 2px;
		bottom: 5px;
	}

	.mark {
		position: absolute;
		top: 6px;
		right: 5px;
		width: 18px;
		height: 18px;
		border-radius: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #ff2727;
		color: white;
		font-size: 11px;
		font-weight: bold;
	}
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
</style>
