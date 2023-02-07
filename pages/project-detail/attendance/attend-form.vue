<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<uni-forms ref="form" :modelValue="formData" :labelWidth="100" :border="true" class="form">
			<view class="card">
				<view>
					<uni-forms-item label="项目名称" name="title">
						<view style="line-height: 36px;">{{ projectName }}</view>
					</uni-forms-item>
					<uni-forms-item label="添加人" name="days">
						<text style="line-height: 36px;">{{ userName }}</text>
					</uni-forms-item>
					<uni-forms-item label="考勤日期" name="days">
						<text style="line-height: 36px;">{{ date }}</text>
					</uni-forms-item>
				</view>
			</view>
			<view v-for="(user, index) in userRecords" :key="user.userId" class="card">
				<view class="card-title">
					<view class="left">
						<text>{{ user.userName }}</text>
					</view>
					<view v-if="!isEdit" class="right"><uni-icons @click="userRecords.splice(index, 1)" color="#ff5c5c" size="20" type="minus" /></view>
				</view>
				<view>
					<uni-forms-item label="正常出勤(天)" name="hours">
						<uni-easyinput type="number" v-model="user.times" placeholder="请输入正常出勤" :inputBorder="false" :clearable="false" @input="e => (user.duration = e)" />
					</uni-forms-item>
					<uni-forms-item label="加班时长(小时)" name="hours">
						<uni-easyinput type="number" v-model="user.hours" placeholder="请输入加班时长" :inputBorder="false" :clearable="false" />
					</uni-forms-item>
					<uni-forms-item v-if="user.userType === 2" label="岗位津贴" name="hours">
						<uni-easyinput type="number" v-model="user.duration" placeholder="请输入岗位津贴" :inputBorder="false" :clearable="false" />
					</uni-forms-item>
				</view>
			</view>
		</uni-forms>
		<view style="height: 60px;"></view>
		<view class="button-wrap"><button class="btn" :loading="submitLoading" @click="submit">保存</button></view>
	</view>
</template>

<script>
import { batchSave, getUserList, getById, getInfo } from '@/api/project/attendance.js';
import { getById as getProjectInfo } from '@/api/project/basicInfo.js';
import { getById as getUser } from '@/api/user.js';
import AppSelect from '@/components/app-select.vue';
import dayjs from 'dayjs';
export default {
	components: { AppSelect },
	data() {
		return {
			formData: {
				days: '', // 日期
				hours: '', // 工时
				id: null, // 主键
				projectId: null, // 项目
				state: 0, // 状态
				userId: '' // 用户
			},
			date: null,
			submitLoading: false,
			userIds: [], // 指定日期下，没有添加过考勤记录的人员集合
			projectName: '',
			userName: '', // 责任人名称，修改的时候用到
			formMode: 'add', // add=添加模式，edit=修改模式
			isAdded: false, // 是否已经添加过考勤记录
			userRecords: [],
			isEdit: false,
		};
	},
	onLoad({ projectId, date, name, id }) {
		this.formData.projectId = projectId;
		this.date = date || ''
		this.userName = uni.getStorageSync(this.$const.USER_INFO).userName;
		// 编辑
		if(id) {
			this.isEdit = true
			getById(id).then(res=> {
				res.userName = name
				this.date = res.days
				this.userRecords = [res]
			})
		} else {
			// 添加
			const temp = uni.getStorageSync(this.$const.TEMP)
			this.userRecords = temp.map(v => {
				return {
					userId: v.userId,
					userName: v.userName,
					state: 0,
					projectId: projectId,
					days: date,
					hours: null, // 加班时长
					times: null, // 工日
					duration: null, // 岗位津贴
					userType: v.userType // 身份类型
				};
			});
			uni.removeStorageSync(this.$const.TEMP)
		}
		getProjectInfo(projectId).then(res => {
			this.projectName = res.projectName;
		});
	},
	methods: {
		submit() {
			if (this.submitLoading) {
				return;
			}
			this.submitLoading = true;
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			// 工日和加班时长必填一项，或者身份是2然后填了岗位津贴
			const result = this.userRecords.filter(v => {
				return v.times !== null || v.hours !== null
				|| (v.userType === 2 && v.duration !== null)
			})
			result.forEach(v => {
				v.times = v.times || 0
				v.hours = v.hours || 0
				v.duration = v.duration || 0
				// 对于身份是临时工的，岗位津贴字段清零
				if (v.userType !== 2 && v.userType !== 0) {
					v.duration = 0
				}
			})
			batchSave(result)
				.then(() => {
					uni.hideLoading();
					uni.$emit(this.$events.UPDATE_PROJECT_ATTEND);
					uni.navigateBack();
				})
				.catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					});
					this.submitLoading = false;
					uni.hideLoading();
				});
		},
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: 100%;
	background-color: $-bg-color;
}

/deep/ .uni-forms-item--border {
	padding: 5px 0;
}

.card {
	padding-bottom: 0;
}

.button-wrap {
	position: fixed;
	bottom: 0px;
	left: 0px;
	right: 0px;
	background-color: white;
	border-top: 1px solid #e3e3e3;
	.btn {
		margin: 10px;
		background-color: #1989fa;
		color: white;
		font-size: 14px;
	}
}

.tip {
	font-size: 14px;
	margin: 10px 20px;
	color: #f93636;
	text-align: center;
}
.text {
	line-height: 36px;
	padding-left: 10px;
}

.list-move {
	transition: transform 0.5s;
}
.list-enter-active,
.list-leave-active {
	transition: all 0.5s;
	position: absolute;
}
.list-enter,
.list-leave-to {
	opacity: 0;
}
</style>
