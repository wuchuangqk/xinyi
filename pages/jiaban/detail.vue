<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<view class="card">
					<view v-for="item in detailList" :key="item.label" class="detail-item">
						<text class="label">{{ item.label }}</text>
						<view v-if="isFileUrl(item.label) && item.field">
							<file-viewer :files="getRelativePath(item.field)"></file-viewer>
						</view>
						<text v-else class="value" v-html="setFiledContent(item)"></text>
					</view>
				</view>
				<view class="card">
					<view class="card-title">
						<view class="left"><text>审批流程</text></view>
					</view>
					<approval-time-line :flowList="flowList" :currentStep="currentStep"></approval-time-line>
				</view>
				<view class="card">
					<view class="card-title">
						<view class="left"><text>上传{{ isStart === '0' ? '开始' : '结束' }}加班照片</text></view>
					</view>
					<file-uploader :album="false" :limit="1" @change="upload"></file-uploader>
				</view>
			</scroll-view>
		</view>
		<view class="app-page-footer">
			<button class="btn" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
import FileViewer from '@/components/image-viewer.vue';
import ApprovalTimeLine from '@/components/approval-timeline.vue';
import FileUploader from '@/components/file-uploader.vue';
import detailMixin from '@/mixin/detail'

export default {
	components: {
		FileViewer,
		ApprovalTimeLine,
	},
	mixins: [detailMixin],
	data() {
		return {
			detailList: [], // 详情字段
			url: '', // 查询详情的接口
			dataId: '', // 主键id
			flowList: [], // 审批流程
			files: [], // 图片附件
			currentStep: 0, // 当前步骤
			isStart: null, // 0=开始加班，1=结束加班
			files: [], // 加班照片
		};
	},
	onLoad({ isStart, dataId, }) {
		this.isStart = isStart
		this.dataId = dataId
	},
	onReady() {
		this.getDetail()
	},
	methods: {
		getDetail() {
			this.doGet('/jiaban/shenpi_detail/' + this.dataId).then(res => {
				this.detailList = res.data.info
				this.flowList = res.data.sign
				this.currentStep = res.data.currentStep
			})
		},
		upload(files) {
			this.files = files
		},
		submit() {
			if (this.files.length === 0) {
				uni.showToast({
					title: '请上传照片',
					icon: 'none'
				});
				return
			}
			const url = this.isStart === '0' ? '/jiaban/jiaban_start' : '/jiaban/jiaban_end'
			uni.showLoading({
				title: '正在提交',
			});
			this.uploadFile(url, { id: this.dataId }, this.files).then(() => {
				uni.navigateBack();
			})
		},
	}
};
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
</style>
