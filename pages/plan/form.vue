<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card form-card">
						<u-form-item label="日期" prop="NianYue" required>
							<date-picker v-model="formData.NianYue" :defaultTime="formData.NianYue" placeholder="请选择日期" mode="month" />
						</u-form-item>
						<u-form-item label="项目名称">
							<u-input v-model="formData.ProjectName" placeholder="请输入项目名称" />
						</u-form-item>
						<u-form-item label="">
							<view class="flex-1">
								<view>工作计划</view>
								<view class="input-bg">
									<uni-easyinput type="textarea" autoHeight v-model="formData.JiHua" placeholder="请输入工作计划"
										:inputBorder="false" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="">
							<view class="flex-1">
								<view>工作完成情况</view>
								<view class="input-bg">
									<uni-easyinput type="textarea" autoHeight v-model="formData.JiHuaCheck" placeholder="请输入工作完成情况"
										:inputBorder="false" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="">
							<view class="flex-1">
								<view>下月工作计划</view>
								<view class="input-bg">
									<uni-easyinput type="textarea" autoHeight v-model="formData.NextJiHua" placeholder="请输入下月工作计划"
										:inputBorder="false" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="">
							<view class="flex-1">
								<view>存在的问题及需领导解决的事项</view>
								<view class="input-bg">
									<uni-easyinput type="textarea" autoHeight v-model="formData.ProblemWork" placeholder="请输入存在的问题及需领导解决的事项"
										:inputBorder="false" />
								</view>
							</view>
						</u-form-item>
						<u-form-item label="责任人">
							<userPicker :selectedUsers="selectedUsers" url="/pages/zonghe/select-user" />
						</u-form-item>
					</view>
					<!-- 附件 -->
					<view class="card">
						<view class="card-title">
							<view class="left"><text>附件</text></view>
						</view>
						<file-viewer @change="upload"></file-viewer>
					</view>
				</u-form>
			</scroll-view>
		</view>
		<view class="app-page-footer">
			<button class="btn" @click="submit">提交</button>
		</view>
		<view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
	</view>
</template>

<script>
import renderMixin from '@/mixin/render'
import userPicker from '@/components/user-picker'
import FileViewer from '@/components/file-uploader.vue';

export default {
	components: { FileViewer, userPicker },
	mixins: [renderMixin],
	data() {
		return {
			formData: {
				// 年月
				NianYue: '',
				// 工作分类
				MonthType: '',
				// 项目名称
				ProjectName: '',
				// 工作计划
				JiHua: '',
				// 工作完成情况
				JiHuaCheck: '',
				// 下月工作计划
				NextJiHua: '',
				// 存在的问题及需领导解决的事项
				ProblemWork: '',
				// 责任人
				staff_ids: '',
			},
			rules: {
				NianYue: [{ required: true, message: '请选择日期' }],
			},
			files: [],
			selectedUsers: [],
		};
	},
	onShow() {
		// 读取选择的用户
		this.selectedUsers = this.$store.state.selectedUsers
	},
	onUnload() {
		this.$store.dispatch('selectedUsers', [])
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
		this.formData.NianYue = this.$dayjs().format('YYYY-MM-01')
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (!valid) return
				uni.showLoading({
					title: '正在提交',
					mask: true,
				});
				this.formData.staff_ids = this.selectedUsers.map(val => val.id).join(',')
				if (this.files.length) {
					this.uploadFile('/month/add', this.formData, this.files).then(() => [
						uni.navigateBack()
					])
				} else {
					this.renderParams = this.setPostData(this.formData)
				}
			})
		},
		// 上传附件
		upload(files) {
			this.files = files;
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
				axiosRequest('/month/add', renderParams, axios).then(res => {
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
.time-line {
	border-left: 1px solid #e4e4e4;
	padding-left: 20px;
	padding-bottom: 20px;
	position: relative;
	margin-left: 10px;

	&:last-of-type {
		border-left: none;
		padding-bottom: 0;
	}

	.state {
		position: absolute;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		left: -5.5px;
		top: -4.5px;
		border: 2px solid #289cfe;
		background-color: white;
	}

	.content {
		position: relative;
		top: -18px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
	}
}

.input-bg {
	background-color: #f7f7f7;
	padding: 0 6px;
	border-radius: 2px;
}
</style>
