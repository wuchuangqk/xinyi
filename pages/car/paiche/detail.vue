<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<view class="card">
					<view v-for="item in detailList" :key="item.label" class="detail-item">
						<text class="label">{{ item.label }}</text>
						<view v-if="isFileUrl(item.label) && item.field">
							<file-viewer :files="getRelativePath(item.field)" size="small"></file-viewer>
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
				<view v-if="type === '2'" class="card">
					<view class="card-title">
						<view class="left"><text>审批</text></view>
					</view>
					<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
						<u-form-item label="指派车辆" required prop="Vehicle">
							<option-picker v-model="formData.Vehicle" :list="carList" placeholder="请选择指派车辆"
								@update:modelValue="vehicleChange" />
						</u-form-item>
						<u-form-item label="指派驾驶员" required prop="JiaShiYuan">
							<option-picker v-model="formData.JiaShiYuan" :list="jiaShiYuanList" placeholder="请选择指派驾驶员" />
						</u-form-item>
					</u-form>
				</view>
			</scroll-view>
		</view>
		<view class="app-page-footer">
			<button class="btn" @click="submit">{{ btnText }}</button>
		</view>
		<view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
	</view>
</template>

<script>
import FileViewer from '@/components/image-viewer.vue';
import ApprovalTimeLine from '@/components/approval-timeline.vue';
import detailMixin from '@/mixin/detail'
import renderMixin from '@/mixin/render'

export default {
	components: {
		FileViewer,
		ApprovalTimeLine,
	},
	mixins: [detailMixin, renderMixin],
	data() {
		return {
			detailList: [], // 详情字段
			url: '', // 查询详情的接口
			dataId: '', // 主键id
			flowList: [], // 审批流程
			currentStep: 0, // 当前步骤
			type: null,
			carList: [], // 车辆列表
			jiaShiYuanList: [], // 驾驶员列表
			formData: {
				id: '',
				Vehicle: '', // 直排车辆
				JiaShiYuan: '', // 驾驶员
			},
			rules: {
				Vehicle: [{ required: true, message: '请选择指派车辆' }],
				JiaShiYuan: [{ required: true, message: '请选择指派驾驶员' }],
			},
		};
	},
	onLoad({ dataId, type }) {
		this.dataId = dataId
		this.type = type
		this.formData.id = dataId
	},
	onReady() {
		this.getDetail()
		if (this.type === '2') {
			this.$refs.uForm.setRules(this.rules);
		}
	},
	computed: {
		btnText() {
			// 审核1 审批2 还车3
			switch (this.type) {
				case '1':
					return '同意'
				case '2':
					return '提交'
				case '3':
					return '还车'
			}
			return ''
		}
	},
	methods: {
		getDetail() {
			this.doGet('/CarMileages/detail/' + this.dataId).then(res => {
				this.detailList = res.data.info
				this.flowList = res.data.sign
				this.currentStep = res.data.currentStep - 1
			})
			this.doGet('/CarMileages/GetCheLiangAndVehicle').then(res => {
				this.carList = (res.data.carList || []).map(val => {
					return { label: val.label, value: val.Pilot, _value: val.value }
				})
				this.jiaShiYuanList = (res.data.jiaShiYuanList || []).map(val => {
					return { label: val.label, value: val.Id }
				})
				if (this.carList.length) {
					this.formData.Vehicle = this.carList[0].value
					this.vehicleChange(this.formData.Vehicle)
				}
			})
		},
		submit() {
			uni.showLoading({
				title: '正在提交',
			});
			switch (this.type) {
				// 审核
				case '1':
					this.renderParams = { url: '/CarMileages/DoShenHe', data: this.setPostData({ id: this.dataId }) }
					break
				// 审批
				case '2':
					this.$refs.uForm.validate(valid => {
						if (!valid) {
							uni.hideLoading();
							return
						}
						this.renderParams = {
							url: '/CarMileages/DoShenPi', data: this.setPostData({
								id: this.formData.id,
								Vehicle: this.carList.find(v => v.value == this.formData.Vehicle)._value,
								JiaShiYuan: this.formData.JiaShiYuan
							})
						}
					})
					break
				// 还车
				case '3':
					this.renderParams = { url: '/CarMileages/DoHuanChe', data: this.setPostData({ docId: this.dataId }) }
					break
			}
		},
		vehicleChange(val) {
			this.formData.JiaShiYuan = val
		},
		setFiledContent({ label, field }) {
      if (label === '派车时间') {
        return field ? this.$dayjs(field).format('YYYY-MM-DD') : field
      } else {
        return field
      }
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

.btn-wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.btn {
		flex: 1;
	}
}
</style>
