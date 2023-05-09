<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view class="card-wrap">
					<!-- 办公 -->
					<view class="home-card">
						<view class="card-title menu-title">
							<u-icon name="grid" style="margin-right: 4px;" />
							<text>办公</text>
						</view>
						<view class="row">
							<view class="col" v-for="item in permissionOfficeMenus" :key="item.name" @click="nav(item.url)">
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
					<!-- 通知公告 -->
					<view class="home-card">
						<view class="card-title notice">
							<view>
								<u-icon name="bell" style="margin-right: 4px;" />
								<text>通知公告</text>
							</view>
							<text @click="nav('/pages/notice/notice')">更多</text>
						</view>
						<view class="notice-list">
							<view v-for="item in noticeList" :key="item.id" class="app-list-item" @click="navToDetail(item.id)">
								<view class="item-title">
									<text :class="{ primary: item.read === '0' }" class="state">
										[{{ item.read === '0' ? '未读' : '已读' }}]
									</text>
									<text>{{ item.title }}</text>
								</view>
								<view class="app-flex-between color-gray">
									<view>
										<text class="label">发布人：</text>
										<text class="value">{{ item.creator }}</text>
									</view>
									<view>
										<text class="label">发布日期：</text>
										<text class="value">{{ item.date }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<Tabbar text="首页" />
		<float-button @click="show = true" />
		<u-popup v-model="show" mode="bottom" border-radius="30">
			<view>
				<view class="popup-title">快速新建</view>
				<view class="row shortcut">
					<view class="col" v-for="item in shortcutMenus" :key="item.name" @click="shortcutNav(item.url)">
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
		</u-popup>
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
			permissionOfficeMenus: [],
			officeMenus: [
				{
					name: '通知公告',
					icon: 'icon-gonggao',
					url: '/pages/notice/notice',
					color: '#fe8007',
					count: 0,
				},
				{
					name: '待办事项',
					icon: 'icon-daibanshixiang',
					url: '/pages/todo/todo',
					color: '#f9a202',
					count: 0,
				},
				{
					name: '请假管理',
					icon: 'icon-qingjia',
					url: '/pages/qingjia/list',
					color: '#0188fd',
					permission: 'leave',
				},
				{
					name: '加班管理',
					icon: 'icon-jiaban',
					url: '/pages/jiaban/list',
					color: '#f9a202',
					permission: 'overtime-work',
				},
				{
					name: '出差管理',
					icon: 'icon-chucha',
					url: '/pages/chuchai/list',
					color: '#14bd82',
					permission: 'go-out',
				},
				{
					name: '综合审批',
					icon: 'icon-zongheguanli',
					url: '/pages/zonghe/list',
					color: '#0382fb',
					permission: 'synthesize',
				},
				{
					name: '资产购置',
					icon: 'icon-wuzicaigou',
					url: '/pages/zichan/list',
					color: '#f25641',
					permission: 'property',
				},
				{
					name: '接待申请',
					icon: 'icon-jiedai',
					url: '/pages/jiedai/list',
					color: '#14bd82',
					permission: 'deng-ji-jie-dai',
				},
				{
					name: '用章申请',
					icon: 'icon-yinzhangkezhi',
					url: '/pages/yongzhang/list',
					color: '#fe8007',
					permission: 'yong-zhang-shen-qing',
				},
				{
					name: '外出管理',
					icon: 'icon-waiqin1',
					url: '/pages/waichu/list',
					color: '#f25641',
					permission: 'wai-chu',
				},
				{
					name: '派车管理',
					icon: 'icon--cheliang',
					url: '/pages/car/paiche/list',
					color: '#14bd82',
					permission: 'pai-che',
				},
				{
					name: '工作计划',
					icon: 'icon-gongzuojihua',
					url: '/pages/plan/list',
					color: '#f9a202',
					permission: 'ge-ren-ban-gong/month-plan/index',
				},
			],
			noticeList: [], // 通知公告
			show: false,
			shortcutMenus: [
				{
					name: '请假申请',
					icon: 'icon-qingjia',
					url: '/pages/qingjia/form',
					color: '#0188fd',
				},
				{
					name: '加班申请',
					icon: 'icon-jiaban',
					url: '/pages/jiaban/form',
					color: '#f9a202',
				},
				{
					name: '出差申请',
					icon: 'icon-chucha',
					url: '/pages/chuchai/form',
					color: '#14bd82',
				},
				{
					name: '综合申请',
					icon: 'icon-zongheguanli',
					url: '/pages/zonghe/form',
					color: '#0382fb',
				},
				{
					name: '购置申请',
					icon: 'icon-wuzicaigou',
					url: '/pages/zichan/form',
					color: '#f25641',
				},
				{
					name: '接待申请',
					icon: 'icon-jiedai',
					url: '/pages/jiedai/form',
					color: '#14bd82',
				},
				{
					name: '用章申请',
					icon: 'icon-yinzhangkezhi',
					url: '/pages/yongzhang/form',
					color: '#fe8007',
				},
				{
					name: '外出申请',
					icon: 'icon-waiqin1',
					url: '/pages/waichu/form?type=add',
					color: '#f25641',
				},
			],
		}
	},
	onInit() {
		// 检查是否登录
		if (uni.getStorageSync(this.$const.IS_LOGIN) !== 1) {
			uni.reLaunch({
				url: '/pages/login/login'
			});
		}
	},
	onLoad() {
		uni.hideTabBar();
		this.getPermission()
	},
	onShow() {
		uni.hideTabBar();
		this.getNoticeList()
	},
	methods: {
		shortcutNav(url) {
			this.show = false
			const query = url.indexOf('?') === -1 ? '?from=shortcut' : '&from=shortcut'
			uni.navigateTo({
				url: url + query
			});
		},
		nav(url) {
			uni.navigateTo({
				url
			});
		},
		// 前5条通知公告
		getNoticeList() {
			this.doGet('/notices/list').then(res => {
				this.noticeList = (res.data || []).slice(0, 5)
			})
		},
		navToDetail(id) {
			uni.navigateTo({
				url: `/pages/notice/detail?dataId=${id}`,
			});
		},
		// 获取菜单入口权限
		async getPermission() {
			uni.showLoading({
				title: '加载中'
			});

			// 设置角标
			const badge = await this.doGet('/home/homecont')
			const { todocount, noticecount } = badge.data
			this.officeMenus.find(val => val.name === '待办事项').count = todocount
			this.officeMenus.find(val => val.name === '通知公告').count = noticecount

			Promise.all([
				this.doGet('/AppModule/GetModuleListByCategoryId', { categoryId: 1 }), // 办公
				this.doGet('/AppModule/GetModuleListByCategoryId', { categoryId: 2 }), // 审批
				this.doGet('/AppModule/GetModuleListByCategoryId', { categoryId: 6 }), // 车辆管理
			]).then(([res1, res2, res3]) => {
				const names = [...res1.data, ...res2.data, ...res3.data].map(val => val.Name)
				this.permissionOfficeMenus = this.officeMenus.filter(val => {
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

	&.shortcut {
		padding: 0 8px 20px;
	}
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

.popup-title {
	text-align: center;
	padding: 15px 0 30px;
	font-size: 18px;
}
</style>
