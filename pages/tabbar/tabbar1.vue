<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view class="card-wrap">
					<!-- 办公 -->
					<view class="home-card">
						<view class="card-title">
							<u-icon name="grid" style="margin-right: 4px;" />
							<text>办公</text>
						</view>
						<view class="row">
							<view class="col" v-for="item in officeMenus" :key="item.name" @click="nav(item.url)">
								<view class="icon-bg" :style="{ background: item.color }">
									<icon-font :icon="item.icon" class="item-icon"></icon-font>
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
							<text>更多</text>
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
	</view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
export default {
	components: {
		IconFont
	},
	data() {
		return {
			/* #fe8007 #14bd82 #0382fb #f25641 #ff4727 */
			officeMenus: [
				{
					name: '请假管理',
					icon: 'icon-qingjia',
					url: '/pages/leave-list/list',
					color: '#0188fd',
				},
				{
					name: '加班管理',
					icon: 'icon-lizhi',
					url: '/pages/jiaban/list',
					color: '#f9a202',
				},
				{
					name: '通知公告',
					icon: 'icon-liucheng',
					url: '/pages/notice/notice',
					color: '#fe8007',
				},
			],
			noticeList: [], // 通知公告
		}
	},
	onLoad() {
		// 检查是否登录
		if (uni.getStorageSync(this.$const.IS_LOGIN) !== 1) {
			uni.reLaunch({
				url: '/pages/login/login'
			});
		}
	},
	onShow() {
		this.getNoticeList()
	},
	methods: {
		nav(url) {
			uni.navigateTo({
				url
			});
		},
		getNoticeList() {
			this.doGet('/notices/list').then(res => {
				this.noticeList = (res.data || []).slice(0, 5)
			})
		},
		navToDetail(id) {
			uni.navigateTo({
				url: `/pages/noticeDetail/noticeDetail?dataId=${id}`,
			});
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
</style>
