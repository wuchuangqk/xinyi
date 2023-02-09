<template>
	<view class="page">
		<scroll-view>
			<view style="padding-top:1px;"></view>
			<view class="menu-list">
				<view class="row" v-for="(item, index) in officeMenus" :key="index" @click="goToPage(item)">
					<view class="icon-bg">
						<icon-font :icon="item.icon" class="item-icon"></icon-font>
						<view class="mark" v-if="item.markCount !== 0">
							<text class="mark-count">{{ item.markCount }}</text>
						</view>
						</view>
					<view class="item-name">
						<text>{{ item.name }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view style="height: 60px;"></view>
	</view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
// import { getTodoWork, getTodoRead } from '@/api/core/notification.js';
export default {
	components: {
		IconFont
	},
	data() {
		return {
			officeMenus: [
				{
					name: '待处理事项',
					icon: 'icon-m_todo',
					url: '/pages/office/to-do-work',
					menuKey: 'todo',
					markCount: 0,
					hideUserType: [2, 3]
				},
				{
					name: '请假调休',
					icon: 'icon-qingjia',
					url: '/pages/leave-list/leave-manage',
					menuKey: 'leave',
					markCount: 0,
					hideUserType: []
				},
        {
          name: '离职办理',
          icon: 'icon-lizhi',
          url: '/pages/leave-office/leave-office',
          menuKey: 'leave',
          markCount: 0,
          hideUserType: []
        },
				{
					name: '规章制度',
					icon: 'icon-gongwenzhidu',
					url: '/pages/office/work-exchange/index?type=规章制度',
					menuKey: 'guizhang',
					markCount: 0,
					hideUserType: []
				},
				{
					name: '传帮带查询',
					icon: 'icon-jiaojieban1',
					url: '/pages/office/chuan-bang-dai/chuan-bang-dai',
					menuKey: 'chuangbangdai',
					markCount: 0,
					hideUserType: [2, 3]
				},
				{
					name: '岗位责任说明书',
					icon: 'icon-gangwei',
					url: '/pages/office/work-exchange/index?type=岗位责任说明书',
					menuKey: 'zeren',
					markCount: 0,
					hideUserType: [3]
				},
				{
					name: '标准化流程',
					icon: 'icon-liucheng',
					url: '/pages/office/work-exchange/standard',
					menuKey: 'biaozhun',
					markCount: 0,
					hideUserType: [3]
				},
				{
					name: '行政考勤',
					icon: 'icon-daka',
					url: '/pages/attendance/administrative',
					menuKey: 'kaoqin',
					markCount: 0,
					hideUserType: [2, 3]
				},
				{
					name: '工资单',
					icon: 'icon-gongzidan',
					url: '/pages/office/salary',
					menuKey: 'salary',
					markCount: 0,
					hideUserType: []
				},
				{
					name: '通讯录',
					icon: 'icon-tongxunlu',
					url: '/pages/office/address-list',
					menuKey: 'address',
					markCount: 0,
					hideUserType: []
				},
				{
					name: '报销管理',
					icon: 'icon-baoxiaodan',
					url: '/pages/claim/claim-manage',
					menuKey: 'claim',
					markCount: 0,
					hideUserType: [2, 3]
				},
				{
					name: '用印管理',
					icon: 'icon-m_todo',
					url: '/pages/seal/claim-manage',
					menuKey: 'seal',
					markCount: 0,
					hideUserType: [2, 3]
				},
				{
					name: '证照管理',
					icon: 'icon-m_todo',
					url: '/pages/certificate/claim-manage',
					menuKey: 'certificate',
					markCount: 0,
					hideUserType: [2, 3]
				},
			],
			userId: null,
		};
	},
	created() {
		const userType = uni.getStorageSync(this.$const.USER_INFO).userType;
		// 隐藏对当前用户身份不可见的菜单
		this.officeMenus = this.officeMenus.filter(v => !v.hideUserType.includes(+userType));
		// 如果有待办
		uni.$on(this.$events.UPDATE_TODO_STATE, () => {
			this.getMarkCount();
		});
		uni.$on(this.$events.UPDATE_HOME_DATA,()=> {
			this.getMarkCount()
		})
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		this.getMarkCount()

	},
	methods: {
		goToPage(menu) {
			if (menu.url) {
				uni.navigateTo({
					url: menu.url
				});
			}
		},
		getMarkCount() {
			const todoMenu = this.officeMenus.find(v => v.menuKey === 'todo')
			if(todoMenu) {
				Promise.all([getTodoWork(this.userId), getTodoRead(this.userId)]).then(([workData, readData]) => {
					todoMenu.markCount = (workData || []).length + (readData || []).length
				});
			}
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: 100%;
	background-color: $-bg-color;
}

.menu-list {
	background-color: white;
	padding: 10px;
	margin: $-space-height;
	border-radius: 3px;

	.menu-title {
		margin-left: 10px;
	}
}

.row {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	/* flex-wrap: wrap;
		margin-top: 20px; */
}

.col {
	display: flex;
	width: 25%;
	justify-content: center;
	margin-bottom: 20px;
}

.icon-bg {
	width: 55px;
	height: 55px;
	border-radius: 5px;
	background: #0188fd;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 10px;
	position: relative;
}

.item {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}

.item-name {
	// margin-top: 6px;
	font-size: 16px;
	color: #333333;
	// text-align: center;
}

.mark {
	position: absolute;
	top: -8px;
	right: -8px;
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

.item-icon {
	color: white;
	font-size: 25px;
}
</style>
