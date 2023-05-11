<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<view class="card">
					<view v-for="item in detailList" :key="item.label" class="detail-item">
						<text class="label">{{ item.label }}</text>
						<text v-if="item.label !== '拍照证明'" class="value" v-html="setFiledContent(item)"></text>
						<view v-else>
							<file-viewer :files="getRelativePath(item.field)" size="small"></file-viewer>
						</view>
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
				<!-- 出差情况说明 -->
				<view v-if="type === 'supplementary'" class="card">
					<view class="card-title">
						<view class="left"><text>出差情况说明</text></view>
					</view>
					<view class="input-bg">
						<uni-easyinput type="textarea" autoHeight v-model="option" placeholder="请输入出差情况说明" :inputBorder="false" />
					</view>
				</view>
				<!-- 拍照证明 -->
				<view v-if="type === 'photo'" class="card">
					<view class="card-title">
						<view class="left"><text>拍照证明</text></view>
					</view>
					<file-uploader :album="false" :limit="1" @change="upload"></file-uploader>
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
import detailMixin from '@/mixin/detail'
import { BASE_URL } from '@/util/constants'

export default {
	components: {
		FileViewer,
		ApprovalTimeLine,
	},
	mixins: [renderMixin, detailMixin],
	data() {
		return {
			detailList: [], // 详情字段
			dataId: '', // 主键id
			flowList: [], // 审批流程
			option: '', // 出差情况说明
			currentStep: 0,
			context: '', // 出差地点
			type: '',
			files: [],
		};
	},
	onLoad({ dataId, type }) {
		this.dataId = dataId
		this.type = type
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
			if (this.type === 'photo') {
				this.submitPhoto()
			} else {
				this.submitOption()
			}
		},
		submitOption() {
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
		submitPhoto() {
			if (this.files.length === 0) {
				uni.showToast({
					title: '请上传照片',
					icon: 'none'
				});
				return
			}
			uni.showLoading({
				title: '正在提交',
			});
			this.uploadFile('/waichu/updateImg', { id: this.dataId }, this.files).then(() => {
				uni.navigateBack();
			})
		},
		upload(files) {
			this.files = files
		},
		getRelativePath(url) {
			const match = url.match(/\/upload\/.+\.\w{2,4}/)
			if (!match) {
				return [{ fileurl: '' }]
			}
			const path = match[0]
			return [{ fileurl: BASE_URL + path }]
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
				axiosRequest('/waichu/updateInfo', renderParams, axios).then(res => {
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
