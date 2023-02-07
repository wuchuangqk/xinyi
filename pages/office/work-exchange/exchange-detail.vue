<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<!-- <view class="card">
			<view class="detail-item">
				<text class="label">标题</text>
				<text class="value">{{detailData.infoTitle}}</text>
			</view>
			<view class="detail-item">
				<text class="label">文号</text>
				<text class="value">{{detailData.infoCode}}</text>
			</view>
			<view class="detail-item">
				<text class="label">用途</text>
				<text class="value">{{detailData.infoUse}}</text>
			</view>
			<view class="detail-item">
				<text class="label">分类</text>
				<text class="value">{{detailData.infoType}}</text>
			</view>
			<view class="detail-item">
				<text class="label">发布时间</text>
				<text class="value">{{detailData.created}}</text>
			</view>
			<view class="detail-item">
				<text class="label">创建者</text>
				<text class="value">{{detailData.creator}}</text>
			</view>
			<view class="detail-item">
				<text class="label">备注</text>
				<text class="value">{{detailData.remark}}</text>
			</view>
		</view> -->
		<view class="card">
			<view class="card-title">
				<view class="left">
					<text>内容</text>
				</view>
			</view>
			<view class="card-content rich-text" v-html="detailData.infoContent"></view>
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
		getInfoById
	} from '@/api/office/exchange.js'
	import {
		saveComments,
		getComments,
		deleteComents
	} from '@/api/office/cmments.js'
	import {
		getReadingList
	} from '@/api/office/other.js'
	import dayjs from 'dayjs'
	import {
		uploadHost
	} from '@/util/http.js'
	import NeilModal from '@/components/neil-modal/neil-modal.vue'

	export default {
		components: {
			NeilModal,
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
			getInfoById(infoId).then(res => {
				res.created = dayjs(res.created).format('YYYY-MM-DD HH:mm')
				this.detailData = res
				uni.$emit(this.$events.UPDATE_EXCHANGE_READ_STATE)
				uni.$emit(this.$events.UPDATE_TODO_STATE)
			})
			// 获取评论列表
			getComments(infoId, 3).then(res => {
				res.result = res.result || []
				res.result.forEach(v => {
					v.photo = v.photo === null ? null : uploadHost.core + v.photo
				})
				this.comments = res.result
			})

			getReadingList(infoId, 3).then(res => {
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
					url: `/pages/common/ReadRecords?type=3&id=` + this.detailData.infoId
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.page {
		min-height: 100%;
		background-color: $-bg-color;
		padding-bottom: 10px;
	}

	@import '@/styles/detail.scss'
</style>
