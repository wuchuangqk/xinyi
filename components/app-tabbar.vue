<template>
	<view class="tab">
		<view class="tab-item" v-for="(item,index) in tabItems" :key="index"
			:class="{active: index === activeTabIndex}" @click="switchTab(index)">
			<!-- <icon-font :icon="item.icon" class="tab-icon"></icon-font> -->
			<image src="" mode=""></image>
			<text class="tab-name">{{item.name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"app-tabbar",
		data() {
			return {
				tabItems: [{
						name: '首页',
						icon: 'icon-waiqin',
						permission: false,
						iconPath: "/static/img/tabBarIco/project.png",
						selectedIconPath: "/static/img/tabBarIco/project_.png"
					},
					{
						name: '办公',
						icon: 'icon-waiqin1',
						permissionKey: 'no-permission',
					},
					{
						name: '我的项目',
						icon: 'icon-huizong',
						permissionKey: 'no-permission',
						isLink: true,
						linkUrl: '/pages/attendance/attendance-detail'
					},
					{
						name: '我的',
						icon: 'icon-huizong',
						permissionKey: 'no-permission',
						isLink: true,
						linkUrl: '/pages/attendance/attendance-detail'
					},
				],
			};
		}
	}
</script>

<style lang="scss" scoped>

</style>
