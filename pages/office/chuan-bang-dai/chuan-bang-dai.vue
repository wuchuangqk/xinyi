<template>
	<view class="page">
		<view class="tab">
			<scroll-view ref="tabbar" class="tab-bar" :scroll="false" :scroll-x="true" :show-scrollbar="false">
				<view style="display: flex;flex-direction: column;">
					<!-- tabitem集合 -->
					<view class="tab-item-wrap">
						<view class="tab-item" v-for="(item, index) in tabItems" :key="index" :class="{ active: index === activeTabIndex }" @click="changeTab(index)">
							<text>{{ item.label }}</text>
							<view class="mark" v-if="item.count !== 0">{{ item.count }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<swiper class="swiper" :current="activeTabIndex" :duration="300" @change="onSwiperChange">
			<swiper-item class="swiper-item">
				<mescroll-uni @init="init" @down="pullDown" :up="upOption" :down="downOption">
					<view>
						<view class="search">
							<uni-search-bar
								class="search-bar"
								ref="search"
								clearButton="none"
								:radius="100"
								@confirm="handleSearch"
								@cancel="handleCancel"
								placeholder="搜索师父和徒弟姓名"
							></uni-search-bar>
							<app-select v-model="searchParams.deptId" :selectData="teams" @select-change="search"></app-select>
							<app-select v-model="searchParams.state" :selectData="graduationState" @select-change="search"></app-select>
						</view>
						<view class="list-item" v-for="(item, index) in listData" :key="item.id">
							<view class="row top">
								<view style="width: 45%;">
									<text>{{ item.teacherName }}</text>
									<text class="state danger">{{ item.teacherDays }}天</text>
								</view>
								<view class="center" style="width: 5%;"><icon-font style="color: #1989fa;" icon="icon-jiaojiegeiwodesiji" class="item-icon"></icon-font></view>
								<view style="width: 45%;text-align: right;">
									<text>{{ item.pupilName }}</text>
									<text class="state primary">{{ item.pupilDays }}天</text>
								</view>
							</view>
							<view class="row bottom" style="display: flex;justify-content: space-between;">
								<text>成立时间：{{ item.establishTime }}</text>
								<text :class="item.graduationStyle">{{ item.isGraduationText }}</text>
							</view>
							<view v-if="item.remark" class="row bottom">
								<text>备注：{{ item.remark }}</text>
							</view>
						</view>
						<uni-load-more :status="more" @clickLoadMore="handleReachBottom"></uni-load-more>
					</view>
				</mescroll-uni>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view :scroll-y="true">
					<div class="search">
						<uni-search-bar
							class="search-bar"
							clearButton="none"
							:radius="100"
							@confirm="e => setSearchKeyWord(e, 0)"
							@cancel="setSearchKeyWord(null, 0)"
							placeholder="输入姓名搜索"
						></uni-search-bar>
						<app-select v-model="teacherDept" :selectData="teams" @select-change="searchTeachAndStu(0)"></app-select>
					</div>
					<view class="list-item-1" v-for="(item, index) in teacherList" :key="item.userId" v-show="item.isInSearch">
						<view class="left">
							<view class="photo">
								<text>{{ item.userNameBak }}</text>
							</view>
						</view>
						<view class="right">
							<view class="content">
								<text>{{ item.userName }}</text>
								<text class="state danger">{{ item.days }}天</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view :scroll-y="true">
					<div class="search">
						<uni-search-bar
							class="search-bar"
							clearButton="none"
							:radius="100"
							@confirm="e => setSearchKeyWord(e, 1)"
							@cancel="setSearchKeyWord(null, 1)"
							placeholder="输入姓名搜索"
						></uni-search-bar>
						<app-select v-model="studentDept" :selectData="teams" @select-change="searchTeachAndStu(1)"></app-select>
					</div>
					<view class="list-item-1" v-for="(item, index) in studentList" :key="item.userId" v-show="item.isInSearch">
						<view class="left">
							<view class="photo">
								<text>{{ item.userNameBak }}</text>
							</view>
						</view>
						<view class="right">
							<view class="content">
								<text>{{ item.userName }}</text>
								<text class="state primary">{{ item.days }}天</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import { getPageList, getUserGroup } from '@/api/core/chuanBangDai.js';
import IconFont from '@/components/icon-font.vue';
import AppSelect from '@/components/app-select.vue';
export default {
	components: { IconFont, AppSelect },
	data() {
		return {
			listData: [],
			isLoadAll: false, // 是否已加载全部数据
			more: 'more', // laodmore状态
			isLoadingMore: false, // 是否正在请求下一页数据
			pulling: false,
			searchParams: {
				userName: '',
				deptId: '', // 部门
				state: '', // 状态
				pageIndex: 1,
				pageSize: 10
			},
			tabItems: [{ label: '已分配', value: 0, count: 0 }, { label: '未分配师父', value: 1, count: 0 }, { label: '未分配徒弟', value: 2, count: 0 }],
			activeTabIndex: 0,
			pulling: false, // 标记正在进行下拉刷新
			modules: [], // 所有模块的数据集合
			mescroll: null,
			upOption: {
				use: false,
				auto: false
			},
			downOption: {
				inOffsetRate: 0.5,
				auto: false
			},
			teacherList: [], // 未分配师父
			studentList: [], // 未分配徒弟
			controller: null,
			teams: [
				{ label: '所有部门', value: '' },
				{ label: '工程一队', value: 11 },
				{ label: '工程二队', value: 12 },
				{ label: '工程三队', value: 13 },
				{ label: '工程四队', value: 15 }
			],
			teacherDept: '',
			studentDept: '',
			teacherKeyWord: '',
			studentKeyWord: '',
			graduationState: [
				{ label: '所有状态', value: '' },
				{ label: '未出师', value: 0, styleClass: 'wei-chu-shi' },
				{ label: '已出师', value: 1, styleClass: 'yi-chu-shi' },
				{ label: '离职', value: 2, styleClass: 'li-zhi' },
			],
		};
	},
	onLoad() {
		this.fetchData();
		this.getTeacherAndStudent();
	},
	methods: {
		fetchData() {
			const { userName, deptId, state, pageIndex, pageSize } = this.searchParams;
			getPageList(userName, deptId, state, pageIndex, pageSize).then(res => {
				res.records = (res.records || []).map(v => {
					const temp = this.graduationState.find(val => val.value === v.isGraduation)
					v.isGraduationText = temp ? temp.label : v.isGraduation
					v.graduationStyle = temp ? temp.styleClass : ''
					return v;
				})
				this.listData = this.listData.concat(res.records);
				this.isLoadAll = res.records.length === 0;
				this.more = this.isLoadAll ? 'noMore' : 'more';
				if (this.pulling) {
					this.pulling = false;
					this.controller.endSuccess();
				}
				this.isLoadingMore = false;
			});
		},
		search() {
			this.isLoadAll = false;
			this.more = 'more';
			this.isLoadingMore = false;
			this.listData.length = 0;
			this.searchParams.pageIndex = 1;
			this.fetchData();
		},
		handleSearch(e) {
			this.searchParams.userName = e.value;
			this.search();
		},
		handleCancel() {
			this.searchParams.userName = '';
			this.search();
		},
		// 设置师父和徒弟的搜索关键字
		setSearchKeyWord(e, type) {
			if (e !== null) {
				if (type === 0) {
					this.teacherKeyWord = e.value;
				} else {
					this.studentKeyWord = e.value;
				}
			} else {
				if (type === 0) {
					this.teacherKeyWord = '';
				} else {
					this.studentKeyWord = '';
				}
			}
			this.searchTeachAndStu(type);
		},
		// 搜索未分配师父和徒弟
		searchTeachAndStu(type) {
			const arr = type === 0 ? this.teacherList : this.studentList;
			const deptId = type === 0 ? this.teacherDept : this.studentDept;
			const keyword = type === 0 ? this.teacherKeyWord : this.studentKeyWord;
			arr.forEach(v => {
				v.isInSearch = v.userName.indexOf(keyword) !== -1 
				&& (deptId === '' || v.deptId === deptId)
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
		},
		init(e) {
			this.controller = e;
		},
		pullDown() {
			this.pulling = true;
			this.isLoadAll = false;
			this.more = 'more';
			this.isLoadingMore = false;
			this.listData.length = 0;
			this.searchParams.userName = ''; //通知标题
			this.searchParams.pageIndex = 1;
			this.fetchData();
		},
		onSwiperChange(e) {
			this.activeTabIndex = e.target.current;
		},
		getTeacherAndStudent() {
			getUserGroup().then(res => {
				res.forEach(v => {
					v.isInSearch = true;
					v.userNameBak = v.userName.substr(0, 2);
				});
				this.teacherList = res.filter(v => v.type === 0);
				this.studentList = res.filter(v => v.type === 1);
				this.tabItems[1].count = this.teacherList.length;
				this.tabItems[2].count = this.studentList.length;
			});
		},
		// 当点击不同的tabitem时切换标签页
		changeTab(tabIndex) {
			this.activeTabIndex = tabIndex;
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/styles/status.scss';
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

	.center {
		color: #adadad;
		font-size: 13px;
	}
}

.list-item {
	padding: 10px;
	background-color: white;
	margin: 10px;

	.item-title {
		color: #333333;
		margin-bottom: 10px;
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

.page {
	height: 100%;
	background-color: $-bg-color;
	display: flex;
	flex-direction: column;
	.tab {
		padding-top: 1px;
		flex-shrink: 0;
	}
	.swiper {
		flex: 1;
		height: calc(100% - 44px);
	}
}

.tab-bar {
	height: 42px;
	line-height: 42px;
	width: 750rpx;
	background-color: white;
	border-bottom: 1px solid #eeeeee;
}

/* #ifndef APP-NVUE */
.tab-bar ::-webkit-scrollbar {
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
}

/* #endif */

.tab-item-wrap {
	display: flex;
	flex-wrap: nowrap;
	position: relative;
	padding: 0;
	justify-content: space-around;
}

.tab-item {
	color: #333;
	padding: 0 20rpx 0 20rpx;
	white-space: nowrap;
	position: relative;

	&.active {
		color: #1989fa;
	}
}

.underline-wrap {
	position: relative;
	height: 2px;
	background-color: transparent;
	margin-top: 6rpx;

	.underline {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 0;
		background-color: #ffffcc;
		transition-duration: 0.2s;
		transition-property: left;
	}
}

/deep/ uni-scroll-view {
	height: 100%;
}

/deep/ .mescroll-wxs-content {
	height: 100%;
}

.mark {
	position: absolute;
	top: 2px;
	right: -5px;
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

.list-item-1 {
	padding: 10px 10px 0;
	background-color: white;
	border-radius: 3px;
	display: flex;
}
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
	border-bottom: 1px solid #eeeeee;
	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 15px;
		margin-bottom: 10px;
		height: 36px;
	}
}
.search {
	display: flex;
	background-color: white;
	padding-right: 8px;
	.search-bar {
		flex: 1;
	}
}

.wei-chu-shi {
	color: #adadad;
}
.yi-chu-shi {
	color: #1989fa;
}
.li-zhi {
	color: #f56c6c;
}
</style>
