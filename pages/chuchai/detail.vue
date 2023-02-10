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
						<view class="left"><text>审批流程</text></view>
					</view>
					<approval-time-line :flowList="flowList"></approval-time-line>
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
	</view>
</template>

<script>
import FileViewer from '@/components/image-viewer.vue';
import ApprovalTimeLine from '@/components/approval-timeline.vue';

export default {
	components: {
		FileViewer,
		ApprovalTimeLine,
	},
	data() {
		return {
			detailList: [], // 详情字段
			dataId: '', // 主键id
			flowList: [], // 审批流程
			option: '', // 出差情况说明
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
			this.renderModule.post({ id: this.dataId, option: this.option })
		},
		callback(success, res) {
			uni.hideLoading();
			if (success) {
				uni.navigateBack();
			} else {
				uni.showToast({
					title: res.status === 500 ? '未知错误' : res.data.msg,
					icon: 'none'
				});
			}
		},
	}
};
</script>
<script module="renderModule" lang="renderjs">
import axios from 'axios'
export default {
  methods: {
    post(data) {
      this.doPost('/waichu/updateInfo', data, axios).then(res => {
				this.callback(true)
      }).catch(err => {
				this.callback(false, err.response)
      })
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
