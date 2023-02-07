<template>
	<view style="height: 100%;padding-bottom: 50px;box-sizing: border-box;">
		<home v-show="activeTabKey === 'home'"></home>
		<office v-show="activeTabKey === 'office'" v-if="isLoaded.office"></office>
		<my-project v-if="activeTabKey === 'project'" @load-done="handlePullEnd" ref="project"></my-project>
		<user-info v-show="activeTabKey === 'user'" v-if="isLoaded.user"></user-info>
		<view class="tab">
			<view class="tab-item" v-for="(item, index) in tabItems" :key="index" :class="{ active: index === activeTabIndex }" @click="switchTab(index)">
				<image :src="activeTabIndex === index ? item.selectedIconPath : item.iconPath" mode="aspectFill" style="width: 24px;height: 24px;"></image>
				<text class="tab-name">{{ item.name }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import Home from '@/pages/index/index';
import Office from '@/pages/office/office';
import MyProject from '@/pages/office/my-project/my-project';
import UserInfo from '@/pages/user-info/user-info';
export default {
	components: { Home, Office, MyProject, UserInfo },
	data() {
		return {
			tabItems: [
				{
					name: '首页',
					permission: false,
					iconPath: '/static/img/tabBarIco/home.png',
					selectedIconPath: '/static/img/tabBarIco/home_.png',
					key: 'home'
				},
				{
					name: '办公',
					permission: false,
					iconPath: '/static/img/tabBarIco/office.png',
					selectedIconPath: '/static/img/tabBarIco/office_.png',
					key: 'office'
				},
				{
					name: '我的项目',
					permission: true,
					iconPath: '/static/img/tabBarIco/project.png',
					selectedIconPath: '/static/img/tabBarIco/project_.png',
					key: 'project'
				},
				{
					name: '我的',
					permission: false,
					iconPath: '/static/img/tabBarIco/user.png',
					selectedIconPath: '/static/img/tabBarIco/user_.png',
					key: 'user'
				}
			],
			activeTabIndex: 0,
			activeTabKey: 'home',
			isLoaded: {
				user: false,
				office: false
			}
		};
	},
	onLoad() {
		const userType = uni.getStorageSync(this.$const.USER_INFO).userType;
		// 施工人员和临时工隐藏行政考勤
		if (+userType === 3 || +userType === 2) {
			this.tabItems = this.tabItems.filter(v => !v.permission);
		}
	},
	onShow() {
		uni.$emit(this.$events.UPDATE_HOME_DATA)
	},
	onPullDownRefresh() {
		// 首页、办公和我的页面无需下拉刷新
		if (this.activeTabKey === 'office' || this.activeTabKey === 'user' || this.activeTabKey === 'home') {
			uni.stopPullDownRefresh();
		} else {
			this.$refs['project'].refresh();
		}
	},
	methods: {
		switchTab(tabIndex) {
			uni.setNavigationBarTitle({
				title: this.tabItems[tabIndex].name
			});
			this.activeTabIndex = tabIndex;
			this.activeTabKey = this.tabItems[this.activeTabIndex].key;
			if(this.isLoaded[this.activeTabKey] !== undefined) {
				this.isLoaded[this.activeTabKey] = true
			}
		},
		handlePullEnd() {
			uni.stopPullDownRefresh();
		}
	}
};
</script>

<style lang="scss" scoped>
.tab {
	position: fixed;
	display: flex;
	left: 0;
	right: 0;
	bottom: 0;
	height: 50px;
	background-color: white;
	z-index: 99;

	&::before {
		content: '';
		position: absolute;
		height: 1px;
		background-color: #dadada;
		top: -1px;
		left: 0;
		right: 0;
	}

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
		font-size: 12px;
		margin-top: 3px;
	}
}
</style>
