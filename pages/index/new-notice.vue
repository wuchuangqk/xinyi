<template>
	<view class="card" style="margin-top: 0;margin-bottom: 0;">
		<view class="card-title">
			<view class="left">
				<text>通知公告</text>
			</view>
			<view class="right">
				<navigator url="/pages/notice/notice" style="color:#1989fa;" hover-class="none">更多</navigator>
			</view>
			<!-- <button type="default" @click="getSchedule()">更多</button> -->
		</view>
		<view class="list-item" v-for="(item,index) in listData" :key="index" @click="goDetail(item.noticeId)">
			<view class="row top">
				<text class="item-title">{{item.noticeTitle}}</text>
				<!-- <view class="state" :class="item.isRead === 0 ? 'un-read' : 'has-read'">{{item.isRead === 0 ? '未读' : '已读'}}</view> -->
			</view>
			<!-- <view class="row bottom">
				<text>{{item.created}}</text>
				<text>{{item.creatorName}}</text>
			</view> -->
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import {
		getUnreadNotice
	} from '@/api/office/notice.js'
	export default {
		data() {
			return {
				listData: [],
			}
		},
		created() {
			this.fetchData()
			uni.$on(this.$events.UPDATE_NOTICE_READ_STATE, () => {
				this.listData.length = 0
				this.fetchData()
			})
		},
		methods: {
			fetchData() {
				getUnreadNotice(
					this.$hasPermission('notice_all_permission', this.$const.OA_PERMISSION) ? 1 : 0).then(res => {
					res.records = res.records || []
					res.records.forEach(v => v.created = v.created ? dayjs(v.created).format('YYYY-MM-DD') : null)
					this.listData = res.records
					/* const badge = uni.getStorageSync(this.$const.BADGE_COUNT)
					badge.notice = this.listData.length
					uni.setStorageSync(this.$const.BADGE_COUNT, badge) */
					this.$emit('update-count', {
						index: 1,
						count: this.listData.filter(v => v.isRead === 0).length
					})
					this.$emit('load-done', {type: 'notice'})
				})

			},
			loadMore() {
				if (this.isLoadingMore || this.isLoadAll) {
					return
				}
				this.pageIndex++
				this.more = 'loading'
				this.fetchData()
			},
			reload() {
				this.pageIndex = 1
				this.listData.length = 0
				this.fetchData()
			},
			goDetail(noticeId) {
				uni.navigateTo({
					url: "/pages/noticeDetail/noticeDetail?noticeId=" + noticeId

				})
			}
		},
	}
</script>

<style scoped lang="scss">
	@import '@/styles/list.scss'
</style>
