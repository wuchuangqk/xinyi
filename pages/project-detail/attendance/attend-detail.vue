<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<view class="detail-item">
				<text class="label">项目名称</text>
				<text class="value">{{ detailData.projectId }}</text>
			</view>
			<view class="detail-item">
				<text class="label">添加人</text>
				<text class="value">{{ detailData.creatorId }}</text>
			</view>
			<view class="detail-item">
				<text class="label">责任人</text>
				<text class="value">{{ detailData.userId }}</text>
			</view>
			<view class="detail-item">
				<text class="label">考勤日期</text>
				<text class="value">{{ detailData.days }}</text>
			</view>
			<view class="detail-item">
				<text class="label">工日</text>
				<text class="value">{{ detailData.times }}工日</text>
			</view>
			<view class="detail-item">
				<text class="label">加班时长</text>
				<text class="value">{{ detailData.hours }}小时</text>
			</view>
			<view class="detail-item" style="align-items: center;">
				<view class="label">状态</view>
				<view class="state" :class="state.class">{{ state.text }}</view>
			</view>
		</view>
		<view v-if="isShowBtns" class="footer"><view class="primary btn" @click="submit(1)">确认考勤</view></view>
	</view>
</template>

<script>
import { getById, abnormal, confirm } from '@/api/project/attendance.js';
import { getById as getUser } from '@/api/user.js';
import { getById as getProject } from '@/api/project/basicInfo.js';
import dayjs from 'dayjs';
export default {
	data() {
		return {
			detailData: {},
			stateMap: new Map([[0, { text: '待确认', class: 'un-confirm' }], [1, { text: '已确认', class: 'has-confirm' }], [2, { text: '待审核', class: 'auditing' }]]),
			showModel: false,
			isShowBtns: false,
			userId: null
		};
	},
	computed: {
		state() {
			if (this.detailData.state === undefined) {
				return { class: '', text: '' };
			}
			return this.stateMap.get(this.detailData.state);
		}
	},
	onLoad({ id }) {
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		getById(id).then(res => {
			this.detailData = res;
			this.isShowBtns = res.state === 0 && res.userId === this.userId;
			getUser(res.userId).then(res => {
				this.detailData.userId = res.displayName;
			});
			getUser(res.creatorId).then(res => {
				this.detailData.creatorId = res.displayName;
			});
			getProject(res.projectId).then(res => {
				this.detailData.projectId = res.projectName;
			});
		});
	},
	methods: {
		submit(type) {
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			const promise = type === 1 ? confirm(this.detailData.id) : abnormal(this.detailData.id);
			promise
				.then(() => {
					uni.showToast({
						title: '提交成功',
						icon: 'none'
					});
					uni.hideLoading();
					uni.$emit(this.$events.UPDATE_PROJECT_ATTEND);
					uni.navigateBack();
				})
				.catch(() => {
					uni.showToast({
						title: '提交失败',
						icon: 'none'
					});
					uni.hideLoading();
				});
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
	color: white;
	font-size: 11px;
	padding: 3px 7px;
	border-radius: 13px;
	height: 22px;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	&.has-confirm {
		background: green;
	}
	&.un-confirm {
		background: red;
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
		width: 100%;
		background-color: #1989fa;
	}
}
.tip {
	font-size: 13px;
	margin: 0 20px;
	color: #979797;
}
</style>
