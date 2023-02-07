<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				{{ formData }}
				{{ files }}
				<uni-forms ref="form" :modelValue="formData" :rules="rules" :labelWidth="70" :border="true" class="form">
					<view class="card">
						<uni-forms-item style="border-top: none;" label="请假类型" name="leaveType">
							<app-select v-if="qjtypeOptions.length" v-model="formData.leaveType" :selectData="qjtypeOptions" />
						</uni-forms-item>
						<uni-forms-item style="border-top: 1px #eee solid;" label="开始时间" name="qjstime">
							<uni-datetime-picker type="datetime" v-model="formData.qjstime" :border="false"
								:showClear="false"></uni-datetime-picker>
						</uni-forms-item>
						<uni-forms-item label="结束时间" name="qjetime">
							<uni-datetime-picker type="datetime" v-model="formData.qjetime" :border="false"
								:showClear="false"></uni-datetime-picker>
						</uni-forms-item>
						<uni-forms-item label="请假原因" name="qjyy" :required="true">
							<uni-easyinput type="textarea" autoHeight v-model="formData.qjyy" placeholder="请输入请假原因"
								:inputBorder="false" />
						</uni-forms-item>
					</view>
					<view class="card">
						<view class="card-title">
							<view class="left"><text>附件</text></view>
						</view>
						<file-viewer @change="upload"></file-viewer>
					</view>
					<view class="card">
						<view class="card-title" style="margin-bottom: 20px;">
							<view class="left"><text>审批人</text></view>
						</view>
						<view class="time-line">
							<view class="state"></view>
							<view class="content">
								<text class="label">部门领导审批：</text>
								<app-select v-if="signCreator1Options.length" v-model="formData.signCreator1"
									:selectData="signCreator1Options"></app-select>
							</view>
						</view>
						<view class="time-line">
							<view class="state"></view>
							<view class="content">
								<text class="label">分管领导审批：</text>
								<app-select v-if="signCreator2Options.length" v-model="formData.signCreator2"
									:selectData="signCreator2Options"></app-select>
							</view>
						</view>
						<view class="time-line">
							<view class="state"></view>
							<view class="content">
								<text class="label">总经理审批：</text>
								<app-select v-if="signCreator3Options.length" v-model="formData.signCreator3"
									:selectData="signCreator3Options"></app-select>
							</view>
						</view>
						<view class="time-line">
							<view class="state"></view>
							<view class="content">
								<text class="label">人事部意见：</text>
								<app-select v-if="signCreator4Options.length" v-model="formData.signCreator4"
									:selectData="signCreator4Options"></app-select>
							</view>
						</view>
					</view>
				</uni-forms>
			</scroll-view>
		</view>
		<view class="page-footer">
			<button class="btn" :loading="submitLoading" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
import AppSelect from '@/components/app-select.vue';
import FileViewer from '@/components/file-viewer.vue';

export default {
	components: { AppSelect, FileViewer },
	data() {
		return {
			formData: {
				qjtype: '', // 请假类型
				signCreator1: '', // 部门领导审批
				signCreator2: '', // 分管领导审批
				signCreator3: '', // 总经理审批
				signCreator4: '', // 人事部意见
				qjstime: '', // 请假开始时间
				qjetime: '', // 请假结束时间
				qjyy: '', // 请假事由
			},
			qjtypeOptions: [],
			signCreator1Options: [],
			signCreator2Options: [],
			signCreator3Options: [],
			signCreator4Options: [],
			files: [], // 请假附件
			rules: {
				approvalSTime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择开始时间'
						},
						{
							validateFunction: (rule, value, data, callback) => {
								if (this.formData.approvalSTime && this.formData.approvalETime && new Date(this.formData.approvalSTime) > new Date(this.formData.approvalETime)) {
									callback('开始时间不能大于结束时间');
								} else {
									return true;
								}
							}
						}
					]
				},
				approvalETime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择结束时间'
						},
						{
							validateFunction: (rule, value, data, callback) => {
								if (this.formData.approvalSTime && this.formData.approvalETime && new Date(this.formData.approvalSTime) > new Date(this.formData.approvalETime)) {
									callback('结束时间不能小于开始时间');
								} else {
									return true;
								}
							}
						}
					]
				},
				approvalContent: {
					rules: [
						{
							required: true,
							errorMessage: '请输入请假原因'
						}
					]
				}
			},
			submitLoading: false,
		};
	},
	computed: {
		dateArr: {
			set(newVal) {
				if (newVal) {
					this.formData.approvalSTime = newVal[0];
					this.formData.approvalETime = newVal[1];
				} else {
					this.formData.approvalSTime = '';
					this.formData.approvalETime = '';
				}
			},
			get() {
				return [this.formData.approvalSTime, this.formData.approvalETime];
			}
		}
	},
	onReady() {
		const fmtOptions = (arr) => {
			return (arr || []).map(val => {
				return {
					label: val.DisplayName,
					value: val.UserID,
				}
			})
		}
		this.doGet('/qingjia/qjtype').then(res => {
			this.qjtypeOptions = res.data.map(val => {
				return {
					label: val.name,
					value: val.name,
				}
			})
			if (this.qjtypeOptions.length) {
				this.formData.qjtype = this.qjtypeOptions[0].value
			}
		})
		this.doGet("/qingjia/signCreator1").then((res) => {
			this.signCreator1Options = fmtOptions(res.data)
			if (this.signCreator1Options.length > 0) {
				this.formData.signCreator1 = this.signCreator1Options[0].value;
			}
		});
		this.doGet("/qingjia/signCreator2").then((res) => {
			this.signCreator2Options = fmtOptions(res.data)
			if (this.signCreator2Options.length > 0) {
				this.formData.signCreator2 = this.signCreator2Options[0].value;
			}
		});
		this.doGet("/qingjia/signCreator3").then((res) => {
			this.signCreator3Options = fmtOptions(res.data)
			if (this.signCreator3Options.length > 0) {
				this.formData.signCreator3 = this.signCreator3Options[0].value;
			}
		});
		this.doGet("/qingjia/signCreator4").then((res) => {
			this.signCreator4Options = fmtOptions(res.data);
			if (this.signCreator4Options.length > 0) {
				this.formData.signCreator4 = this.signCreator4Options[0].value;
			}
		});
		this.formData.qjstime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
		this.formData.qjetime = this.$dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
	},
	methods: {
		submit() {
			if (this.submitLoading) {
				return;
			}
			this.$refs.form.validate().then(res => {
				uni.showLoading({
					title: '正在提交',
				});
				delete this.formData.signCreator1
				delete this.formData.signCreator3
				this.renderModule.post(this.formData, this.files)
			});
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
		// 上传附件
		upload(files) {
			this.files = files;
		},
	}
};
</script>
<script module="renderModule" lang="renderjs">
import axios from 'axios'
export default {
  methods: {
    post(data, files) {
      this.doPost('/qingjia/qingjia_add', data, axios, files).then(res => {
				this.callback(true)
      }).catch(err => {
				this.callback(false, err.response)
      })
    }
  },
}
</script>

<style scoped lang="scss">
.page-footer {
	padding: 10rpx;

	.btn {
		background-color: #3880ff;
		color: white;
		font-size: 28rpx;
	}
}

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
</style>
