<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<view class="detail-item">
				<text class="label">事项</text>
				<text class="value">{{ detailData.title }}</text>
			</view>
			<view class="detail-item">
				<text class="label">添加人</text>
				<text class="value">{{ detailData.creatorName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">责任人</text>
				<text class="value">{{ detailData.userName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">开始时间</text>
				<text class="value">{{ detailData.startTime }}</text>
			</view>
			<view class="detail-item">
				<text class="label">结束时间</text>
				<text class="value">{{ detailData.endTime }}</text>
			</view>
			<view class="detail-item">
				<text class="label">备注</text>
				<text class="value">{{ detailData.remark }}</text>
			</view>
		</view>
		<view v-if="detailData.state === 2" class="card">
			<view class="card-title">
				<view class="left"><text>办理情况</text></view>
			</view>
			<view>{{ detailData.situation }}</view>
		</view>
		<view v-if="detailData.state === 2" class="card">
			<view class="card-title">
				<view class="left"><text>附件</text></view>
			</view>
			<file-viewer platform="core" :files="detailData.fileList"></file-viewer>
		</view>
		<uni-forms v-if="isComplete" ref="form" :modelValue="formData" :rules="rules" :labelWidth="70" :border="true" class="form">
			<view class="card">
				<uni-forms-item label="办理情况" name="situation" :required="true">
					<uni-easyinput type="textarea" autoHeight v-model="formData.situation" placeholder="请输入办理情况" :inputBorder="false" maxlength="150" />
				</uni-forms-item>
			</view>
			<view class="card">
				<view class="card-title">
					<view class="left"><text>附件</text></view>
				</view>
				<file-viewer mode="upload" :files="[]" :limit="10" platform="core" fileType="resumeFile" @file-change="upload"></file-viewer>
			</view>
		</uni-forms>
		<view style="height: 50px;"></view>
		<view v-if="isComplete || isConfirm" class="footer">
			<view class="primary btn" @click="submit">{{ btnText }}</view>
		</view>
	</view>
</template>

<script>
// import { getById, complete, confirm } from '@/api/core/schedule.js';
import FileViewer from '@/components/file-viewer.vue';
import { getFileInfo } from '@/api/system/file.js';
export default {
	components: { FileViewer },
	data() {
		return {
			detailData: {},
			stateMap: {
				0: {
					text: '待接收',
					class: 's1'
				},
				1: {
					text: '已接收',
					class: 's2'
				},
				2: {
					text: '已完成',
					class: 's3'
				}
			},
			userId: null,
			isComplete: false, // 完成
			isConfirm: false, // 确认
			btnText: '',
			formData: {
				situation: null, // 办理情况
				fileCodes: null, // 附件
				id: null
			},
			rules: {
				situation: {
					rules: [
						{
							required: true,
							errorMessage: '请输入办理情况'
						}
					]
				}
			}
		};
	},
	onLoad({ scheduleId }) {
		getById(scheduleId).then(res => {
			res.startTime = this.$dayjs(res.startTime).format('YYYY-MM-DD HH:mm');
			res.endTime = this.$dayjs(res.endTime).format('YYYY-MM-DD HH:mm');
			res.fileList = [];
			this.detailData = res;
			const { userId } = uni.getStorageSync(this.$const.USER_INFO);
			this.isComplete = res.state === 1 && res.userId === userId;
			this.isConfirm = res.state === 0 && res.userId === userId;
			if (this.isComplete) {
				this.btnText = '确认完成';
			} else if (this.isConfirm) {
				this.btnText = '确认接收';
			}
			this.formData.id = scheduleId;
			if (this.detailData.fileCodes) {
				this.batchQuery(this.detailData.fileCodes, this.detailData.fileList);
			}
		});
	},
	computed: {
		state() {
			if (this.detailData.state === undefined) {
				return {
					text: '待完成',
					class: 's1'
				};
			} else {
				return this.stateMap[this.detailData.state];
			}
		}
	},
	methods: {
		batchQuery(fileIds, arr) {
			fileIds.split(',').forEach(val => {
				getFileInfo(val).then(res => {
					arr.push(res);
				});
			});
		},
		submit() {
			if (this.isComplete) {
				this.doComplete();
				return;
			}
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			confirm(this.detailData.scheduleId).then(() => {
				uni.$emit(this.$events.UPDATE_SCHEDULE);
				uni.hideLoading();
				uni.navigateBack();
			});
		},
		doComplete() {
			this.$refs.form.validate().then(() => {
				console.log(this.formData)
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
				complete(this.formData).then(() => {
					uni.$emit(this.$events.UPDATE_SCHEDULE);
					uni.hideLoading();
					uni.navigateBack();
				}).then(()=> {
					this.uni.showToast({
						title: '提交失败',
						icon:'none'
					});
					uni.hideLoading();
				})
			});
		},
		// 上传附件
		upload(files) {
			this.formData.fileCodes = (files || []).map(v => v.fileId).join(',');
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
.state {
	color: white;
	font-size: 11px;
	padding: 3px 7px;
	border-radius: 13px;
	height: 22px;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	&.s1 {
		background-color: #70b603;
	}
	&.s2 {
		background-color: #f59a23;
	}
	&.s3 {
		background-color: #1989fa;
	}
}
</style>
