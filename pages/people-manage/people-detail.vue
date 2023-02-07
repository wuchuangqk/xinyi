<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<view class="detail-item">
				<text class="label">姓名</text>
				<text class="value">{{ peopleInfo.userName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">报到日期</text>
				<text class="value">
					<!-- 调入，待确认可以编辑 -->
					<uni-datetime-picker
						v-if="peopleInfo.type === 0 && peopleInfo.state === 0"
						type="date"
						:value="peopleInfo.toTime"
						:border="false"
						:showClear="false"
						@change="setDateValue"
						style="width: 104px;"
					></uni-datetime-picker>
					<text v-else>{{ peopleInfo.toTime }}</text>
				</text>
			</view>
			<view class="detail-item">
				<text class="label">调入项目</text>
				<text class="value">{{ peopleInfo.toProjectName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">调出项目</text>
				<text class="value">{{ peopleInfo.fromProjectName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">状态</text>
				<text class="value">{{ peopleInfo.stateText }}</text>
			</view>
			<view class="detail-item">
				<text class="label">调拨说明</text>
				<!-- 调入，待确认可以编辑 -->
				<uni-easyinput
					v-if="peopleInfo.type === 0 && peopleInfo.state === 0"
					type="textarea"
					autoHeight
					v-model="peopleInfo.remark"
					placeholder="请输入调拨说明"
					:inputBorder="false"
					style="margin-left: 40px;"
				/>
				<text v-else class="value">{{ peopleInfo.remark }}</text>
			</view>
		</view>

		<view class="btn-wrap">
			<!-- 调出，状态是待确认 -->
			<view v-if="peopleInfo.type === 1 && peopleInfo.state === 0 && isDutyer" class="primary btn" @click="doConfirm(1)">确认调出</view>
			<!-- 调入，状态是待确认 -->
			<view v-if="peopleInfo.type === 0 && peopleInfo.state === 0 && isDutyer" class="secondary btn" @click="doConfirm(2)">取消调拨</view>
			<!-- 调入，状态是待确认 -->
			<view v-if="peopleInfo.type === 0 && peopleInfo.state === 0 && isDutyer" class="primary btn" @click="submit">提交更改</view>
		</view>
	</view>
</template>

<script>
import { storageKeys } from '@/util/constants.js';
import { updateAllot, getCoordinateUsers } from '@/api/project/peopleManage.js';
import { getById as getProject } from '@/api/project/basicInfo.js';

export default {
	data() {
		return {
			peopleInfo: {},
			isDutyer: false // 是否是项目负责人(副职)
		};
	},
	onLoad({ projectId }) {
		const userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		getProject(projectId).then(res => {
			if (res.xmProjectCoordinateForms.length) {
				getCoordinateUsers(res.xmProjectCoordinateForms[1].proCoorId).then(res => {
					const curGroupUserList = res;
					// 判断当前用户是否在项目负责人里
					// 查出项目负责人的id
					// 只有一个人时，直接取id，有两个人时，取职位是副职的id（isDeputy=1）
					const userIds = curGroupUserList.length === 1 ? [curGroupUserList[0].userId] : curGroupUserList.filter(v => v.isDeputy === 1).map(v => v.userId);
					this.isDutyer = userIds.includes(userId);
				});
			}
		});
	},
	onReady() {
		this.peopleInfo = uni.getStorageSync(storageKeys.TEMP);
	},
	methods: {
		// 通过
		submit() {
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			updateAllot(this.peopleInfo).then(() => {
				uni.$emit(this.$events.UPDATE_ALLOT_STATE);
				uni.hideLoading();
				uni.navigateBack();
			});
		},
		setDateValue(value) {
			this.peopleInfo.toTime = value;
		},
		// 更新调拨状态
		doConfirm(state) {
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			this.peopleInfo.state = state;
			updateAllot(this.peopleInfo).then(() => {
				uni.$emit(this.$events.UPDATE_ALLOT_STATE);
				uni.hideLoading();
				uni.navigateBack();
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import '@/styles/detail.scss';
.page {
	min-height: 100%;
	background-color: $-bg-color;
}

.btn {
	text-align: center;
	padding: 8px 0;
	color: white;
	border-radius: 17px;
}
.secondary {
	width: 100%;
	background-color: #dd524d;
	margin-right: 10px;
}
.primary {
	width: 100%;
	background-color: #1989fa;
}
.default {
	border: 1px solid #1890ff;
	width: 100%;
	color: #1890ff;
}
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

.card-title {
	position: relative;
}
.arr-btn {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
}

.footer-btn-wrap {
}

/deep/ .uni-easyinput__content-textarea {
	padding-top: 0;
}
/deep/ .uni-date__input {
	height: auto;
	padding-right: 0;
}
/deep/ .uni-date-x {
	padding: 0;
}
</style>
