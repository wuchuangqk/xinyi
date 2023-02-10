<template>
	<view class="app-page">
		<u-tabs-swiper ref="uTabs" :list="list" :is-scroll="false" :current="current" :offset="[5, 80]" @change="tabsChange"></u-tabs-swiper>
		<swiper style="height: 100%;" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;">
					<view class="list-wrap">
						<view v-for="item in readList.hasRead" :key="item.username" class="app-list-item">
							<view class="app-flex-between">
								<text>{{ item.username }}</text>
								<text class="color-gray">{{ item.departname }}</text>
							</view>
							<view class="color-gray item-sub">
								<text>阅读时间：</text>
								<text>{{ item.readtime }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;">
					<view class="list-wrap">
						<view v-for="item in readList.hasRead" :key="item.username" class="app-list-item">
							<view class="app-flex-between">
								<text>{{ item.username }}</text>
								<text class="color-gray">{{ item.departname }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					name: '已读人员',
					count: 0
				},
				{
					name: '未读人员',
					count: 1
				},
			],
			current: 0,
			swiperCurrent: 0,
			readList: {
				hasRead: [],
				unRead: []
			},
		}
	},
	// type: 2=通知公告
	onLoad({ dataId }) {
		this.doGet('/notices/GetRead/' + dataId).then(res => {
			this.readList.hasRead = res.data.hasreader.map(val => {
				val.readtime = this.$dayjs(val.readtime).format('YYYY-MM-DD HH:mm:ss')
				return val
			})
			this.readList.unRead = res.data.noreader
			this.list[0].count = this.readList.hasRead.length
			this.list[1].count = this.readList.unRead.length
		})
	},
	methods: {
		tabsChange(index) {
			this.swiperCurrent = index;
		},
		transition(e) {
			let dx = e.detail.dx;
			this.$refs.uTabs.setDx(dx);
		},
		animationfinish(e) {
			let current = e.detail.current;
			this.$refs.uTabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
		},
	}
}
</script>

<style lang="scss" scoped>
.list-wrap {
	padding-top: 8px;
}
</style>
