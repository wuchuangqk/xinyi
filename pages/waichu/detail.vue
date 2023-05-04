<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<view class="card">
					<view v-for="item in fields" :key="item.label" class="detail-item">
						<text class="label">{{ item.label }}</text>
						<text class="value">{{ detailData[item.field] }}</text>
					</view>
				</view>
				<view v-if="type === 'backtime'" class="card">
					<view class="card-title">
						<view class="left"><text>返回时间</text></view>
					</view>
					<view class="input-bg">
						<date-picker v-model="EndDate" :defaultTime="EndDate" placeholder="请选择返回时间" />
					</view>
				</view>
			</scroll-view>
		</view>
		<view v-if="type === 'detail'" class="page-footer">
			<button class="btn" @click="edit">修改外出申请</button>
			<button class="btn danger" @click="showConfirm = true">删除</button>
		</view>
		<view v-if="type === 'backtime'" class="page-footer">
			<button class="btn" @click="submitBackTime">提交</button>
		</view>
		<view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
		<u-modal v-model="showConfirm" content="确认删除吗？" show-cancel-button @confirm="remove"></u-modal>
	</view>
</template>

<script>
import FileViewer from '@/components/file-viewer.vue'
import renderMixin from '@/mixin/render'

export default {
	components: {
		FileViewer
	},
	mixins: [renderMixin],
	data() {
		return {
			detailData: {},
			dataId: null,
			fields: [
				{ label: '部门', field: 'departmentName' },
				{ label: '姓名', field: 'userName' },
				{ label: '外出时间', field: 'StartDate' },
				{ label: '外出事由', field: 'Situation' },
				{ label: '返回时间', field: 'EndDate' },
				{ label: '拍照时间', field: 'UploadFileTime' },
				{ label: '备注', field: 'Beizhu' }
			],
			type: '',
			EndDate: '', // 返回时间
			showConfirm: false,
		}
	},
	onLoad({ dataId, type }) {
		this.dataId = dataId
		this.type = type
	},
	onShow() {
		this.doGet('/beout/info/', { id: this.dataId }).then(res => {
			this.detailData = res.data
		})
	},
	onReady() {
		uni.setNavigationBarTitle({
			title: this.type === 'detail' ? '外出详情' : '填写返回时间'
		})
		this.EndDate = this.$dayjs().format('YYYY-MM-DD HH:mm:00')
	},
	methods: {
		// 修改外出申请
		edit() {
			uni.navigateTo({
				url: `/pages/waichu/form?dataId=${this.dataId}&type=edit`
			});
		},
		// 删除
		remove() {
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			this.renderParams = {
				url: '/beout/delete',
				data: this.setPostData({ id: this.dataId })
			}
		},
		// 填写返回时间
		submitBackTime() {
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			this.renderParams = {
				url: '/beout/updatebacktime',
				data: this.setPostData({ id: this.dataId, EndDate: this.EndDate })
			}
		}
	}
}
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
			margin-left: 10px;
		}
	}
}
</style>
