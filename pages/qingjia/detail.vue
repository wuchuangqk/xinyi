<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<!-- 申请详情 -->
				<view v-if="detailList.length" class="card">
					<view v-for="item in detailList" :key="item.label" class="detail-item">
						<text class="label">{{ item.label }}</text>
						<view v-if="isFileUrl(item.label) && item.field">
							<file-viewer :files="getRelativePath(item.field)" size="small"></file-viewer>
						</view>
						<view v-else-if="item.label === '拍照证明'">
							<file-viewer :files="getRelativePath(item.field, item.label)" size="small"></file-viewer>
						</view>
						<text v-else class="value" v-html="setFiledContent(item)"></text>
					</view>
				</view>
				<view v-if="isChuchai" class="card">
					<view class="card-title">
						<view class="left"><text>出差地点</text></view>
					</view>
					<view v-html="context"></view>
				</view>
				<!-- 照片附件 -->
				<view v-if="files && files.length" class="card">
					<view class="card-title">
						<view class="left"><text>附件</text></view>
					</view>
					<file-viewer :files="files"></file-viewer>
				</view>
				<!-- 审批流程 -->
				<view v-if="flowList.length" class="card">
					<view class="card-title">
						<view class="left"><text>审批流程</text></view>
					</view>
					<approval-time-line :flowList="flowList" :currentStep="currentStep"></approval-time-line>
				</view>
				<!-- 审批意见 -->
				<view v-if="isApprove === '1'" class="card">
					<view class="card-title">
						<view class="left"><text>审批意见</text></view>
					</view>
					<view class="input-bg">
						<uni-easyinput type="textarea" autoHeight v-model="comment" placeholder="请输入审批意见" :inputBorder="false" />
					</view>
				</view>
			</scroll-view>
		</view>
		<view v-if="isApprove === '1'" class="page-footer">
			<button v-if="isReject === '1'" class="btn danger" @click="reject">驳回</button>
			<button class="btn" @click="submit(1)">同意</button>
		</view>
		<u-modal v-model="showConfirm" content="确认驳回吗" show-cancel-button @confirm="submit(0)"></u-modal>
		<view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
	</view>
</template>

<script>
import FileViewer from '@/components/image-viewer.vue';
import ApprovalTimeLine from '@/components/approval-timeline.vue';
import renderMixin from '@/mixin/render'
import detailMixin from '@/mixin/detail'

export default {
	components: {
		FileViewer,
		ApprovalTimeLine,
	},
	mixins: [renderMixin, detailMixin],
	data() {
		return {
			detailList: [], // 详情字段
			url: '', // 查询详情的接口
			dataId: '', // 主键id
			flowList: [], // 审批流程
			files: [], // 图片附件
			currentStep: 0, // 当前步骤
			hdts: '', // 加班核定天数
			hdxs: '', // 加班核定小时
			isApprove: '', // 是否有审批
			comment: '', // 审批意见
			isReject: '', // 是否有驳回
			showConfirm: false, // 驳回确认
			context: '', // 出差地点
		};
	},
	computed: {
		// 加班
		isJiaBan() {
			return this.url === '/jiaban/shenpi_detail' && this.currentStep === 2
		},
		// 出差
		isChuchai() {
			return this.url === '/waichu/shenpi_detail' && this.context
		}
	},
	onLoad({ url, dataId, isApprove, isReject, }) {
		this.url = url
		this.dataId = dataId
		this.isApprove = isApprove
		this.isReject = isReject
	},
	onReady() {
		this.getDetail()
	},
	methods: {
		getDetail() {
			uni.showLoading({
				title: '加载中'
			});
			this.doGet(this.url + '/' + this.dataId).then(res => {
				this.detailList = res.data.info
				this.flowList = res.data.sign
				this.files = res.data.pdflist
				this.currentStep = res.data.currentStep
				this.context = res.data.context
			}).finally(() => {
				uni.hideLoading();
			})
		},
		/**
		 * 
		 * @param {*} isPass 1=同意，0=驳回
		 */
		submit(isPass) {
			if (isPass === 1 && this.comment.trim() === '') {
				this.comment = '同意'
			}
			uni.showLoading({
				title: '正在提交',
			});
			let submitUrl
			switch (this.url) {
				// 请假
				case '/qingjia/shenpi_detail':
					submitUrl = '/qingjia/shenpi_save'
					break;
				// 加班
				case '/jiaban/shenpi_detail':
					submitUrl = '/jiaban/shenpi_save'
					break;
				// 出差
				case '/waichu/shenpi_detail':
					submitUrl = '/waichu/shenpi_save'
					break;
				// 综合审批
				case '/zhsp/zhsp_detail':
					submitUrl = '/zhsp/shenpi_save'
					break;
				// 资产购置
				case '/zhigou/zhigou_detail':
					submitUrl = '/zhigou/shenpi_save'
					break;
				// 接待申请
				case '/jiedai/detail':
					submitUrl = '/jiedai/shenpi_save'
					break;
				// 用章申请
				case '/ying/detail':
					submitUrl = '/ying/shenpi_save'
					break;
			}
			this.renderParams = {
				data: this.setPostData({
					option: this.comment,
					id: this.dataId,
					Pass: isPass,
					staff_ids: [],
				}),
				url: submitUrl
			}
		},
		reject() {
			if (this.comment.trim() === '') {
				uni.showToast({
					title: '请输入审批意见',
					icon: 'none'
				});
				return
			}
			this.showConfirm = true
		}
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
				axiosRequest(renderParams.url, renderParams.data, axios).then(res => {
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

.page-footer {
	padding: 10rpx;
	display: flex;

	.btn {
		background-color: #3880ff;
		color: white;
		font-size: 28rpx;
		flex: 1;

		&.danger {
			background-color: #fa3534;
			margin-right: 10px;
		}
	}
}

.input-bg {
	background-color: #f7f7f7;
	padding: 0 6px;
	border-radius: 2px;
}
</style>
