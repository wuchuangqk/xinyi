<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<!-- <view class="detail-item">
				<text class="label">标题</text>
				<text class="value">{{detailData.noticeTitle}}</text>
			</view>
			<view class="detail-item">
				<text class="label">类型</text>
				<text class="value">{{detailData.noticeType === 1 ? '通知' : '公告'}}</text>
			</view> -->
			<view class="detail-item">
				<text class="label">发布时间</text>
				<text class="value">{{detailData.created}}</text>
			</view>
			<!-- <view class="detail-item">
				<text class="label">创建者</text>
				<text class="value">{{detailData.creatorName}}</text>
			</view> -->
		</view>
		<view class="card">
			<view class="card-title">
				<view class="left">
					<text>内容</text>
				</view>
			</view>
			<view class="card-content" v-html="detailData.noticeContent"></view>
		</view>
		<view v-if="detailData.fileList" class="card">
			<view class="card-title">
				<view class="left">
					<text>附件</text>
				</view>
			</view>
			<file-viewer platform="oa" :files="detailData.fileList"></file-viewer>
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
		<!-- <view class="footer">
			<view class="footer-inner" @click="goReadRecords">
				<text>已读人数：</text>
				<text class="has-read">{{readList.hasRead.length}}人</text>
				<text style="margin-left: 5px;">未读人数：</text>
				<text class="un-read">{{readList.unRead.length}}人</text>
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
		getReadingList
	} from '@/api/office/other.js'
	import {
		getById
	} from '@/api/office/notice.js'
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
			noticeId
		}) {
			getById(noticeId).then(res => {
				res.created = dayjs(res.created).format('YYYY-MM-DD HH:mm')
				this.detailData = res
				// 更新通知公告列表阅读状态
				uni.$emit(this.$events.UPDATE_NOTICE_READ_STATE)
				// 如果是从待阅列表进来的，更新待阅列表
				uni.$emit(this.$events.UPDATE_TODO_STATE)
			})

			// 获取评论列表
			getComments(noticeId, 2).then(res => {
				res.result = res.result || []
				res.result.forEach(v => {
					v.photo = v.photo === null ? null : uploadHost.core + v.photo
				})
				this.comments = res.result
			})

			getReadingList(noticeId, 2).then(res => {
				res.records = res.records || []
				res.records.forEach((val) => {
					val.readTime = val.readTime ? dayjs(val.readTime).format('YYYY-MM-DD HH:mm') : null
					if (+val.isReads === 0) {
						this.readList.unRead.push(val)
					} else {
						this.readList.hasRead.push(val)
					}
				});

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
