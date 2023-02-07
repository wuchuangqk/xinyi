<template>
	<view class="page">
		<view style="padding-top:1px;"></view>
		<!-- 办公 -->
		<view class="menu-list">
			<text class="menu-title">项目管理</text>
			<view class="row">
				<view class="col" v-for="(item,index) in officeMenus" :key="index" @click="goToPage(item)">
					<view class="item">
						<view class="icon-bg">
							<icon-font :icon="item.icon" class="item-icon"></icon-font>
						</view>
						<view class="item-name">
							<text>{{item.name}}</text>
						</view>
						<view class="mark" v-if="item.markCount !== 0">
							<text class="mark-count">{{item.markCount}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import IconFont from '@/components/icon-font.vue'
	export default {
		components: {
			IconFont
		},
		data() {
			return {
				officeMenus: [{
						name: '我的项目',
						icon: 'icon-wodexiangmu',
						url: '/pages/office/my-project/my-project',
						menuKey: 'todo',
						markCount: 0,
						needPermission: false,
					},
					{
						name: '项目管理',
						icon: 'icon-xiangmu2',
						url: '/pages/office/project-manager/project-manager',
						menuKey: 'notice',
						markCount: 0,
						needPermission: true,
					},
					{
						name: '项目交接',
						icon: 'icon-jiaojieban',
						url: '/pages/office/project-join/project-join',
						menuKey: 'schedule',
						markCount: 0,
						needPermission: true,
					},
				],
			}
		},
		onLoad() {
			const userType = uni.getStorageSync(this.$const.USER_INFO).userType
			// 施工人员和临时工隐藏行政考勤
			if (+userType === 3 || +userType === 2) {
				this.officeMenus = this.officeMenus.filter(v => !v.needPermission)
			}
		},
		methods: {
			goToPage(menu) {
				if (menu.url) {
					uni.navigateTo({
						url: menu.url
					})
				}

			}
		}
	}
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
		flex-wrap: wrap;
		margin-top: 20px;
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
		border-radius: 50%;
		background: #0188fd;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.item-name {
		margin-top: 6px;
		font-size: 14px;
		color: #292929;
		text-align: center;
	}

	.mark {
		position: absolute;
		top: -8px;
		right: -3px;
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
