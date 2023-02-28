<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view class="card">
					<view v-for="item in detailList" :key="item.label" class="detail-item">
						<text class="label">{{ item.label }}</text>
						<text class="value" v-html="item.field"></text>
					</view>
				</view>
				<view class="card">
					<view class="card-title">
						<view class="left"><text>出差地点</text></view>
					</view>
					<view v-html="context"></view>
				</view>
				<view class="card">
					<view class="card-title">
						<view class="left"><text>审批流程</text></view>
					</view>
					<approval-time-line :flowList="flowList" :currentStep="currentStep"></approval-time-line>
				</view>
				<view class="card">
					<view class="card-title">
						<view class="left"><text>出差情况说明</text></view>
					</view>
					<view class="input-bg">
						<uni-easyinput type="textarea" autoHeight v-model="option" placeholder="请输入出差情况说明" :inputBorder="false" />
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="app-page-footer">
			<button class="btn" @click="submit">提交</button>
		</view>
		<view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
	</view>
</template>

<script>
import FileViewer from '@/components/image-viewer.vue';
import ApprovalTimeLine from '@/components/approval-timeline.vue';
import renderMixin from '@/mixin/render'

export default {
	components: {
		FileViewer,
		ApprovalTimeLine,
	},
	mixins: [renderMixin],
	data() {
		return {
			detailList: [], // 详情字段
			dataId: '', // 主键id
			flowList: [], // 审批流程
			option: '', // 出差情况说明
			currentStep: 0,
			context: '', // 出差地点
		};
	},
	onLoad({ dataId, }) {
		this.dataId = dataId
	},
	onReady() {
		this.getDetail()
	},
	methods: {
		getDetail() {
			this.doGet('/waichu/shenpi_detail/' + this.dataId).then(res => {
				this.detailList = res.data.info
				this.flowList = res.data.sign
				this.currentStep = res.data.currentStep
				this.context = res.data.context
			})
		},
		submit() {
			if (this.option.trim().length === 0) {
				uni.showToast({
					title: '请输入出差情况说明',
					icon: 'none'
				});
				return
			}
			uni.showLoading({
				title: '正在提交',
				mask: true,
			});
			this.renderParams = this.setPostData({ id: this.dataId, option: this.option })
		},
	}
};
</script>
<script module="renderModule" lang="renderjs">
import axios from 'axios'
import { doPost } from '@/util/post.js'
export default {
  methods: {
		change(renderParams) {
			if (renderParams !== null) {
				doPost('/waichu/updateInfo', renderParams, axios).then(res => {
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

.input-bg {
	background-color: #f7f7f7;
	padding: 0 6px;
	border-radius: 2px;
}
</style>
