<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<view class="card">
					<view class="detail-item">
						<text class="label">车牌号</text>
						<text class="value">{{ detail.CarNumber }}</text>
					</view>
					<view class="detail-item">
						<text class="label">车型</text>
						<text class="value">{{ detail.CarModels }}</text>
					</view>
					<view class="detail-item">
						<text class="label">车辆状态</text>
						<text class="value">{{ detail.State }}</text>
					</view>
					<view class="detail-item">
						<text class="label">购置价格(元)</text>
						<text class="value">{{ detail.PurchasePrice }}</text>
					</view>
					<view class="detail-item">
						<text class="label">购置时间</text>
						<text class="value">{{ detail.PurchaseDate }}</text>
					</view>
					<view class="detail-item">
						<text class="label">保险到期时间</text>
						<text class="value">{{ detail.Insurance }}</text>
					</view>
					<view class="detail-item">
						<text class="label">里程(公里)</text>
						<text class="value">{{ detail.Mileage }}</text>
					</view>
					<view class="detail-item">
						<text class="label">驾驶员</text>
						<text class="value">{{ detail.Pilot }}</text>
					</view>
					<view class="detail-item">
						<text class="label">管理部门</text>
						<text class="value">{{ detail.Management }}</text>
					</view>
					<view class="detail-item">
						<text class="label">过夜停车地点</text>
						<text class="value">{{ detail.ParkingPlace }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import FileViewer from '@/components/image-viewer.vue';
import ApprovalTimeLine from '@/components/approval-timeline.vue';
import detailMixin from '@/mixin/detail'

export default {
	components: {
		FileViewer,
		ApprovalTimeLine,
	},
	mixins: [detailMixin],
	data() {
		return {
			detail: {}, // 详情字段
			url: '', // 查询详情的接口
			dataId: '', // 主键id
			flowList: [], // 审批流程
			files: [], // 图片附件
			currentStep: 0, // 当前步骤
			isStart: null, // 0=开始加班，1=结束加班
			files: [], // 加班照片
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
			this.doGet('/car/list/', { item_id: this.dataId }).then(res => {
				this.detail = res.data
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
</style>
