<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<view class="card content-card">
					<view class="notice">
						<view class="title">{{ detailData.title }}</view>
						<view class="app-flex-between sub-title">
							<view>
								<text class="label">发布人：</text>
								<text class="value">{{ detailData.username }}</text>
							</view>
							<view>
								<text class="label">发布时间：</text>
								<text class="value">{{ detailData.time }}</text>
							</view>
						</view>
					</view>
					<view class="content" v-html="detailData.content"></view>
				</view>
				<view v-if="detailData.pdflist && detailData.pdflist.length" class="card">
					<view class="card-title">
						<view class="left">
							<text>附件</text>
						</view>
					</view>
					<FileViewer :files="detailData.pdflist" />
				</view>
			</scroll-view>
		</view>
		<view>
			<u-cell-group>
				<u-cell-item :title="`已读人数：${readList.hasRead.length}人，未读人数：${readList.unRead.length}人`"
					@click="goReadRecords"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
import FileViewer from '@/components/file-viewer.vue'

export default {
	components: {
		FileViewer
	},
	data() {
		return {
			detailData: {},
			readList: {
				hasRead: [],
				unRead: []
			},
			dataId: null,
		}
	},
	onLoad({ dataId }) {
		this.dataId = dataId
		this.doGet('/notices/list/' + dataId).then(res => {
			this.detailData = res.data
		})
		// 获取已读未读
		this.doGet('/notices/GetRead/' + dataId).then(res => {
			this.readList.hasRead = res.data.hasreader
			this.readList.unRead = res.data.noreader
		})
	},
	methods: {
		swiperChange(e) {
			this.activeTabIndex = e.detail.current
		},
		goReadRecords() {
			uni.navigateTo({
				url: `/pages/notice/read-records?dataId=` + this.dataId
			})
		}
	}
}
</script>

<style scoped lang="scss">
@import '@/styles/detail.scss';

.card .card-title {
	margin-bottom: 15px;
}

.notice {

	.title {
		font-size: 18px;
		text-align: left;
		font-weight: bold;
	}

	.sub-title {
		color: #999;
		margin-top: 10px;
		font-size: 13px;
	}
}

.content {
	text-indent: 2em;
	margin-top: 50px;
	line-height: 1.7;
}

.content-card {
	padding: 20px 15px 50px;
}

/deep/ .u-cell {
	padding: 6px 15px;
	color: #999;
}

/deep/ .u-cell-item-box {
	background-color: #f7f7f7;
}

/deep/ .u-cell__title {
	font-size: 13px;
}
</style>
