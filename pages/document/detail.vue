<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<view class="card">
					<view v-for="item in detailList" :key="item.label" class="detail-item">
						<text class="label">{{ item.label }}</text>
						<text class="value">{{ item.field }}</text>
					</view>
				</view>
				<view v-if="files.length" class="card">
					<view class="card-title">
						<view class="left"><text>附件</text></view>
					</view>
					<file-viewer :files="files" ></file-viewer>
				</view>
				<!-- 回复列表 -->
				<view class="card">
					<view class="card-title">
						<view class="left"><text>回复记录</text></view>
					</view>
					<ReplayList :flowList="replyList" :files="files" />
				</view>
				<!-- 回复 -->
				<view v-if="isHandle === '1'" class="card">
					<view class="card-title">
						<view class="left"><text>回复</text></view>
					</view>
					<view class="view1">
						<text>通知起草人({{ creator }})</text>
						<u-switch v-model="isNotice" size="36"></u-switch>
					</view>
					<view class="input-bg">
						<uni-easyinput type="textarea" autoHeight v-model="comment" placeholder="请输入回复内容" :inputBorder="false" />
					</view>
				</view>
			</scroll-view>
		</view>
		<view v-if="isHandle === '1'" class="app-page-footer">
			<button class="btn" @click="submit">提交</button>
		</view>
		<view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
	</view>
</template>

<script>
import FileViewer from '@/components/file-viewer.vue';
import ApprovalTimeLine from '@/components/approval-timeline.vue';
import detailMixin from '@/mixin/detail'
import renderMixin from '@/mixin/render'
import ReplayList from './components/reply-list.vue'

export default {
	components: {
		FileViewer,
		ApprovalTimeLine,
		ReplayList,
	},
	mixins: [detailMixin, renderMixin],
	data() {
		return {
			detailList: [], // 详情字段
			dataId: '', // 主键id
			files: [], // 图片附件
			comment: '', // 回复内容
			isHandle: '0', // 1=办理 0=仅查看
			isNotice: true, // 是否通知起草人
			creator: '', // 起草人
			replyList: [], // 回复列表
		};
	},
	onLoad({ dataId, isHandle }) {
		this.dataId = dataId
		this.isHandle = isHandle
	},
	onReady() {
		this.getDetail()
	},
	methods: {
		getDetail() {
			uni.showLoading({
				title: '加载中'
			});
			this.doGet('/circula/info_detail/', { item_id: this.dataId }).then(res => {
				this.detailList = res.data.info
				this.files = res.data.infofile || []
				this.replyList = res.data.fedds || []
				const item = this.detailList.find(val => val.label === '起草人')
				if (item) {
					this.creator = item.field
				}
			}).finally(() => {
				uni.hideLoading();
			})
		},
		submit() {
			if (!this.comment.trim()) {
				return this.$u.toast('请输入回复内容')
			}
			uni.showLoading({
				title: '正在提交',
			});
			this.renderParams = this.setPostData({
				id: this.dataId,
				ReplyContent: this.comment,
				IsNotice: this.isNotice ? 'true' : ''
			})
		},
	}
};
</script>
<script module="renderModule" lang="renderjs">
import axios from 'axios'
import { axiosRequest } from '@/util/post.js'
export default {
  methods: {
		change(renderParams) {
			if (renderParams !== null) {
				axiosRequest('/circula/todo_save', renderParams, axios).then(res => {
					this.$ownerInstance.callMethod('callback', {
						success: true,
					})
				}).catch(err => {
					this.$ownerInstance.callMethod('callback', {
						success: false,
						res: err
					})
				})
			}
		}
  },
}
</script>
<style scoped lang="scss">
@import '@/styles/detail.scss';

.card .card-title {
	margin-bottom: 15px;
}

.btn-wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.btn {
		flex: 1;
	}
}

.input-bg {
	background-color: #f7f7f7;
	padding: 0 6px;
	border-radius: 2px;
}

.view1 {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #f4f6f8;
	padding-bottom: 20rpx;
	margin-bottom: 20rpx;
}
</style>
