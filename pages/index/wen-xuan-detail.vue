<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<!-- <view class="card">
			<view class="detail-item">
				<text class="label">标题</text>
				<text class="value">{{detailData.infoTitle}}</text>
			</view>
			<view class="detail-item">
				<text class="label">发布时间</text>
				<text class="value">{{detailData.created}}</text>
			</view>
			<view class="detail-item">
				<text class="label">创建者</text>
				<text class="value">{{detailData.creatorName}}</text>
			</view>
		</view> -->
		<view class="card">
			<view class="card-title">
				<view class="left">
					<text>内容</text>
				</view>
			</view>
			<view class="card-content" v-html="detailData.infoContent"></view>
		</view>
		<view v-if="detailData.outputEntitys" class="card">
			<view class="card-title">
				<view class="left">
					<text>附件</text>
				</view>
			</view>
			<file-viewer platform="oa" :files="detailData.outputEntitys"></file-viewer>
		</view>
		<!-- <view v-if="comments.length !== 0" class="card">
			<view class="card-title">
				<view class="left">
					<text>回复</text>
					<text v-if="comments.length !== 0" style="margin-left: 5px;">{{comments.length}}</text>
				</view>
			</view>
			<view class="comment-list">
				<view v-for="(item,index) in comments" :key="item.cmtId" class="commit-item">
					<view class="top">
						<view class="top-left">
							<view class="img-wrap">
								<img :src="item.photo" alt="">
							</view>
							<view class="user">
								<text class="user-name">{{item.creatorName}}</text>
								<text class="time">{{item.timeDiff}}</text>
							</view>
						</view>
					</view>
					<view class="comment-content">
						<text>{{item.cmtConent}}</text>
					</view>
				</view>
			</view>
		</view> -->

	</view>
</template>

<script>
	import FileViewer from '@/components/file-viewer.vue'
	import {
		saveComments,
		getComments,
		deleteComents
	} from '@/api/office/cmments.js'
	import {
		getInfo
	} from '@/api/office/wenXuan.js'
	import dayjs from 'dayjs'
	import {
		uploadHost
	} from '@/util/http.js'

	export default {
		components: {
			FileViewer
		},
		data() {
			return {
				detailData: {},
				comments: [], // 评论
				readList: {
					hasRead: [],
					unRead: []
				},
			}
		},
		onLoad({
			infoId
		}) {
			getInfo(infoId).then(res => {
				res.created = dayjs(res.created).format('YYYY-MM-DD')
				this.detailData = res
				// 更新通知公告列表阅读状态
				uni.$emit(this.$events.UPDATE_WEN_XUAN_STATE)
				// 更新待处理事项列表
				uni.$emit(this.$events.UPDATE_TODO_STATE)
			})

			// 获取评论列表
			getComments(infoId, 1).then(res => {
				res.result = res.result || []
				res.result.forEach(v => {
					v.photo = v.photo === null ? null : uploadHost.core + v.photo
				})
				this.comments = res.result
			})
		},
		methods: {
			swiperChange(e) {
				this.activeTabIndex = e.detail.current
			},
			goReadRecords() {
				uni.navigateTo({
					url: `/pages/common/ReadRecords?type=2&id=` + this.detailData.noticeId
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.page {
		min-height: 100%;
		background-color: $-bg-color;
		padding-bottom: 45px;
	}

	@import '@/styles/detail.scss'
</style>
