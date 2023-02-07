<template>
	<view class="page" :class="{ 'no-permission': isNoPermission }">
		<view v-if="isNoPermission" style="margin-bottom: 120px;">您没有查看部门人员信息的权限</view>
		<tempate v-if="!isNoPermission">
			<view class="header">
				<app-select v-if="deptList.length && permission" style="margin-right: 30px;" v-model="departId" :selectData="deptList" @select-change="deptChange"></app-select>
				<uni-search-bar :radius="100" @confirm="userSearch" cancelButton="false" placeholder="姓名"></uni-search-bar>
			</view>
			<view class="text">
				<view class="line"></view>
				<text style="margin: 0 10px;">
					共计
					<text style="margin: 0 5px;font-weight: bold;">{{ deptUserCount }}</text>
					人
				</text>
				<view class="line"></view>
			</view>
			<view class="list-item" v-for="(item, ind) in dataList" :key="ind" @click="showDetail(item)">
				<view class="row top">
					<text class="item-title">{{ item.displayName }}</text>
					<view class="state">{{ item.departName }}</view>
				</view>
				<view class="row bottom">
					<text>职位：{{ item.posName }}</text>
					<text>联系电话：<text style="color: #1989fa;" @click.stop="callPhone(item.mobilePhone)">{{ item.mobilePhone }}</text></text>
				</view>
			</view>
			<uni-load-more :status="more" @clickLoadMore="handleReachBottom"></uni-load-more>
		</tempate>
	</view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
import dayjs from 'dayjs';
import { getUsersByDept } from '@/api/user.js';
import { getDept } from '@/api/system/dept.js';
import AppSelect from '@/components/app-select.vue';
export default {
	components: { IconFont, AppSelect },
	data() {
		return {
			dataList: [],
			more: 'more',
			loading: false,
			pulling: false, // 标记正在进行下拉刷新
			userId: null,
			userType: null,
			pageIndex: 1,
			pageSize: 10,
			userName: '',
			departId: -1,
			isLoadingMore: false,
			deptList: [],
			isLoadAll: false,
			deptUserCount: 0,
			permission: false, // 是否有查看所有部门的权限
			isNoPermission: true // 是否无任何权限
		};
	},
	onLoad() {
		const { departId, userId, userType } = uni.getStorageSync(this.$const.USER_INFO);
		this.departId = departId; // 默认查看自己所在部门的信息
		this.userId = userId;
		this.userType = userType;
		// 查看所有部门的权限
		this.permission = this.$hasPermission('suoyoubumenchakan', this.$const.OA_PERMISSION);
		// 如果有查看所有部门的权限，则默认查询所有
		if (this.permission) {
			this.departId = null;
		}
		// 如果没有，再看有没有查看自己所在部门的权限
		if (!this.permission && !this.$hasPermission('zijisuozaibumen', this.$const.OA_PERMISSION)) {
			return;
		}
		this.isNoPermission = false;
		// 获取部门
		getDept().then(res => {
			this.deptList.push({
				label: '请选择',
				value: null
			});
			this.convert(res, this.deptList);
		});
		// 获取部门下的人数
		getUsersByDept(this.departId, null, this.pageIndex, 9999).then(res => {
			this.deptUserCount = (res.records || []).length;
		});
		this.fetchData();
	},
	onReachBottom() {
		this.handleReachBottom();
	},
	methods: {
		convert(target, result) {
			target.forEach(v => {
				result.push({
					label: v.departName,
					value: v.departId
				});
				if (v.childs) {
					this.convert(v.childs, result);
				}
			});
		},
		handleReachBottom() {
			if (this.isLoadingMore || this.isLoadAll) {
				return;
			}
			this.isLoadingMore = true;
			this.more = 'loading';
			this.pageIndex++;
			this.fetchData();
		},
		fetchData() {
			getUsersByDept(this.departId, this.userName, this.pageIndex, this.pageSize).then(res => {
				res.records = res.records || [];
				this.isLoadAll = res.records.length === 0;
				this.more = this.isLoadAll ? 'noMore' : 'more';
				this.dataList = this.dataList.concat(res.records);
				this.isLoadingMore = false;
			});
		},
		search() {
			this.pageIndex = 1;
			this.dataList.length = 0;
			this.fetchData();
		},
		userSearch(e) {
			this.userName = e.value;
			this.search();
		},
		deptChange() {
			getUsersByDept(this.departId, null, this.pageIndex, 9999).then(res => {
				this.deptUserCount = (res.records || []).length;
			});
			this.search();
		},
		workCancel() {},
		showDetail(item) {
			uni.navigateTo({
				url: `/pages/user-info/user-profile?userType=${item.userType}&userId=${item.userId}&permission=${this.permission}`
			});
		},
		// 拨打电话
		callPhone(phoneNumber) {
			uni.makePhoneCall({
				// 手机号
				phoneNumber,
				// 成功回调
				success: res => {
					// console.log('调用成功!');
				},
				// 失败回调
				fail: res => {
					// console.log('调用失败!');
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: 100%;
	background-color: $-bg-color;
	padding: 1px 0 50px 0;
}
.no-permission {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.header {
	display: flex;
	align-items: center;
	padding: 10px;
	background-color: white;
	.uni-searchbar {
		padding: 0;
		background-color: initial;
		flex: 1;
	}
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
.swipe-item {
	margin: 10px;
	.list-item {
		margin: 0;
	}
}
.text {
	text-align: center;
	font-size: 15px;
	margin-top: 10px;
	display: flex;
	align-items: center;
	padding: 0 10px;
	.line {
		flex: 1;
		height: 1px;
		background-color: #dadada;
	}
}
</style>
