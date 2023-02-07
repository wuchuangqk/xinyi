<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<view class="detail-item">
				<text class="label">项目名称</text>
				<text class="value">{{ detailData.projectName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">创建时间</text>
				<text class="value">{{ detailData.createdTime }}</text>
			</view>
			<view class="detail-item">
				<text class="label">负责人</text>
				<text class="value">{{ detailData.oldChargeName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">接收人</text>
				<text class="value">{{ detailData.newChargeName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">状态</text>
				<text class="value">{{ detailData.state }}</text>
			</view>
			<view class="detail-item">
				<text class="label">备注</text>
				<text class="value">{{ detailData.remark }}</text>
			</view>
		</view>
		<view v-if="isShowHandoverBtn" class="footer">
			<view class="secondary btn" @click="handleShowModel(0)">拒绝交接</view>
			<view class="primary btn" @click="handleShowModel(1)">确认交接</view>
		</view>
		<neil-modal :show="showModel" title="提示" :content="modelContent" align="center" @confirm="submit" @close="showModel = false"></neil-modal>
	</view>
</template>

<script>
import { getById, refuseHandoverById, confirmHandoverById } from '@/api/project/projectHandover.js';
import dayjs from 'dayjs';
export default {
	data() {
		return {
			detailData: {},
			showModel: false,
			isShowHandoverBtn: false,
			userId: null,
			type: 0,
			modelContent: ''
		};
	},
	onLoad({ handoverId }) {
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		getById(handoverId).then(res => {
			const { newChargeId, state } = res;
			this.isShowHandoverBtn = newChargeId === this.userId && state === 0;
			if (res.state === 0) {
				res.state = '未交接';
			} else if (res.state === 1) {
				res.state = '已交接';
			} else {
				res.state = '拒绝交接';
			}
			res.createdTime = res.createdTime ? this.$dayjs(res.createdTime).format('YYYY-MM-DD') : null;
			this.detailData = res;
		});
	},
	methods: {
		submit() {
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			const promise = this.type === 1 ? confirmHandoverById(this.detailData.handoverId) : refuseHandoverById(this.detailData.handoverId);
			promise
				.then(() => {
					uni.showToast({
						title: '提交成功',
						icon: 'none'
					});
					uni.hideLoading();
					uni.$emit(this.$events.UPDATE_HANDOVER_STATE);
					uni.navigateBack();
				})
				.catch(() => {
					uni.showToast({
						title: '提交失败',
						icon: 'none'
					});
					uni.hideLoading();
				});
		},
		handleShowModel(type) {
			this.modelContent = type === 0 ? '确定拒绝交接吗？' : '确定交接吗？';
			this.type = type;
			this.showModel = true;
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: 100%;
	background-color: $-bg-color;
}
.detail-item {
	padding: 10px 0;
	font-size: 14px;
	color: #333333;
	display: flex;
	line-height: 36px;
	.label {
		width: 90px;
		flex-shrink: 0;
	}
	.value {
		flex: 1;
	}
}
.state {
	font-size: 13px;
	display: flex;
	align-items: center;
	.icon {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		margin-right: 5px;
	}
	&.has-confirm {
		color: #02a7f0;
		.icon {
			background: #02a7f0;
		}
	}
	&.un-confirm {
		color: #70b603;
		.icon {
			background: #70b603;
		}
	}
	&.auditing {
		color: #f59a23;
		.icon {
			background: #f59a23;
		}
	}
}
.footer {
	display: flex;
	font-size: 13px;
	padding: 0 10px 10px;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	.btn {
		text-align: center;
		padding: 8px 0;
		color: white;
		border-radius: 17px;
	}
	.secondary {
		width: 40%;
		background-color: #dd524d;
		margin-right: 10px;
	}
	.primary {
		width: 60%;
		background-color: #1989fa;
	}
}
.tip {
	font-size: 13px;
	margin: 0 20px;
	color: #979797;
}
</style>
