<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view class="card-wrap">
					<!-- 办公 -->
					<view class="home-card">
						<view class="card-title menu-title">
							<icon-font icon="icon-qiche" class="title-icon" color="#303133" style="margin-right: 4px;"></icon-font>
							<text>车辆管理</text>
						</view>
						<view class="row">
							<view class="col" v-for="item in carPermissionMenus" :key="item.name" @click="nav(item.url)">
								<view class="icon-bg" :style="{ background: item.color }">
									<icon-font :icon="item.icon" class="item-icon"></icon-font>
									<view v-if="item.count" class="badge">{{ item.count }}</view>
								</view>
								<view class="item-name">
									<text>{{ item.name }}</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 食堂 -->
					<view class="home-card">
						<view class="card-title menu-title">
							<icon-font icon="icon-shipin" class="title-icon" color="#303133" style="margin-right: 4px;"></icon-font>
							<text>食堂系统</text>
						</view>
						<view class="row">
							<view class="col" v-for="item in shiTangPermissionMenus" :key="item.name" @click="nav(item.url)">
								<view class="icon-bg" :style="{ background: item.color }">
									<icon-font :icon="item.icon" class="item-icon"></icon-font>
									<view v-if="item.count" class="badge">{{ item.count }}</view>
								</view>
								<view class="item-name">
									<text>{{ item.name }}</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 每周菜谱 -->
					<CaiPu />
				</view>
			</scroll-view>
		</view>
		<Tabbar text="更多" />
	</view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
import Tabbar from '../../components/Tabbar.vue';
import CaiPu from './components/CaiPu.vue';

export default {
	components: {
		IconFont,
		Tabbar,
		CaiPu,
	},
	data() {
		return {
			carPermissionMenus: [],
			carMenus: [
				{
					name: '车辆列表',
					icon: 'icon-cheliangjiance',
					url: '/pages/car/info/list',
					color: '#0188fd',
					permission: 'cars/car-list',
				},
				{
					name: '维修管理',
					icon: 'icon-cheliangweixiubaoyang',
					url: '/pages/car/weixiu/list',
					color: '#f9a202',
					permission: 'cars/weixiu',
				},
				{
					name: '加油管理',
					icon: 'icon-jiayou1',
					url: '/pages/car/jiayou/list',
					color: '#0188fd',
					permission: 'cars/jiayou-list',
				},
				{
					name: '还卡处理',
					icon: 'icon-card',
					url: '/pages/car/huanka/list',
					color: '#f9a202',
					permission: 'cars/huan-ka',
				},
				{
					name: '加油记录',
					icon: 'icon-jiayoujilu',
					url: '/pages/car/jiayou-jilu/list',
					color: '#fe8007',
					permission: 'cars/jiayou-jilu',
				},
			],
			shiTangPermissionMenus: [],
			shiTangMenus: [
				{
					name: '商品列表',
					icon: 'icon-shangpin',
					url: '/pages/shitang/good-manage',
					color: '#f25641',
					permission: 'canteen/splist'
				},
				{
					name: '食品',
					icon: 'icon-hanbao',
					url: '/pages/shitang/good?type=food',
					color: '#0188fd',
					permission: 'canteen/foodlist'
				},
				{
					name: '日用品',
					icon: 'icon-riyongbaihuo',
					url: '/pages/shitang/good?type=daily',
					color: '#14bd82',
					permission: 'canteen/dailylist'
				},
				{
					name: '食品台账',
					icon: 'icon-zichanguanli-zichantaizhang',
					url: '/pages/shitang/tai-zhang?type=food',
					color: '#0188fd',
					permission: 'canteen/tai-zhang/1',
				},
				{
					name: '日用品台账',
					icon: 'icon-zichanguanli-zichantaizhang',
					url: '/pages/shitang/tai-zhang?type=daily',
					color: '#14bd82',
					permission: 'canteen/tai-zhang/0',
				},
				{
					name: '我的订单',
					icon: 'icon-gouwucheman',
					url: '/pages/shitang/myorder',
					color: '#f9a202',
					permission: 'canteen/myorder'
				},
				{
					name: '公告信息',
					icon: 'icon-yuedugonggao',
					url: '/pages/shitang/notice',
					color: '#fe8007',
					permission: 'canteen/gong-gao',
				},
			],
		}
	},
	onLoad() {
		uni.hideTabBar();
		this.getPermission()
	},
	onShow() {
		uni.hideTabBar();
	},
	methods: {
		nav(url) {
			uni.navigateTo({
				url
			});
		},
		// 获取菜单入口权限
		getPermission() {
			uni.showLoading({
				title: '加载中'
			});
			Promise.all([
				this.doGet('/AppModule/GetModuleListByCategoryId', { categoryId: 6 }), // 车辆管理
				this.doGet('/AppModule/GetModuleListByCategoryId', { categoryId: 7 }), // 食堂系统
			]).then(([res1, res2]) => {
				const names = [...res1.data, ...res2.data].map(val => val.Name)
				this.carPermissionMenus = this.carMenus.filter(val => {
					return val.permission === undefined || names.includes(val.permission)
				})
				this.shiTangPermissionMenus = this.shiTangMenus.filter(val => {
					return val.permission === undefined || names.includes(val.permission)
				})
			}).finally(() => {
				uni.hideLoading();
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.card-wrap {
	padding: 8px;
}

.card-title {
	padding: 8px 12px 10px;
	font-size: 16px;
	border-bottom: 1px solid #eee;
	margin-bottom: 18px;

	&.notice {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	&.menu-title {
		margin-bottom: 0;
	}
}

.home-card {
	background-color: white;
	border-radius: 4px;
	margin-top: 12px;

	&:first-of-type {
		margin-top: 0;
	}
}

.row {
	display: flex;
	flex-wrap: wrap;
	padding-top: 18px;
}

.col {
	display: flex;
	flex-direction: column;
	width: 25%;
	justify-content: center;
	align-items: center;
	margin-bottom: 20px;
}

.icon-bg {
	width: 50px;
	height: 50px;
	border-radius: 25px;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;

	.badge {
		position: absolute;
		top: -3px;
		right: -3px;
		background-color: red;
		color: white;
		font-size: 13px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
	}
}

.item {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}

.item-name {
	font-size: 14px;
	color: #666;
	margin-top: 4px;
}

.item-icon {
	color: white;
	font-size: 25px;
}

.app-list-item {
	border-bottom: 1px solid #eee;
}

.notice-list {
	padding: 0 8px;
}

.indicator-wrap {
	display: flex;
	justify-content: center;
	padding-bottom: 18px;

	.indicator {
		height: 6px;
		width: 6px;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.1);
		margin: 0 4px;
		transition: all 0.1s;

		&.active {
			background-color: #3880ff;
		}
	}
}
</style>
