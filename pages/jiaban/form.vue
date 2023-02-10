<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card form-card">
						<u-form-item label="申请人" prop="userid" required>
							<userPicker :selectedUsers="selectedUsers" :disabled="isLeader" />
						</u-form-item>
						<u-form-item label="开始时间" prop="qjstime" required>
							<date-picker v-model="formData.qjstime" :defaultTime="formData.qjstime" placeholder="请选择开始时间" />
						</u-form-item>
						<u-form-item label="结束时间" prop="qjetime" required>
							<date-picker v-model="formData.qjetime" :defaultTime="formData.qjetime" placeholder="请选择结束时间" />
						</u-form-item>
						<u-form-item label="加班时段" prop="qjtype" required>
							<option-picker v-model="formData.qjtype" :list="qjtypeOptions" placeholder="请选择加班时段" />
						</u-form-item>
						<u-form-item label="加班事由" prop="qjyy" required>
							<u-input v-model="formData.qjyy" placeholder="请输入加班事由" />
						</u-form-item>
						<u-form-item label="加班工作内容">
							<u-input v-model="formData.content" placeholder="请输入加班工作内容" />
						</u-form-item>
					</view>
					<!-- 审批人 -->
					<view class="card">
						<view class="card-title" style="margin-bottom: 0;">
							<view class="left"><text>审批人</text></view>
						</view>
						<u-form-item v-if="isShowFenGuan" label="分管领导审批" prop="signCreator2" required label-width="200">
							<option-picker v-model="formData.signCreator2" :list="signCreator2Options" placeholder="请选择" />
						</u-form-item>
						<u-form-item v-if="isShowZongJL" label="总经理审批" prop="signCreator3" required label-width="200">
							<option-picker v-model="formData.signCreator3" :list="signCreator3Options" placeholder="请选择" />
						</u-form-item>
						<u-form-item label="监察室" prop="signCreator4" required label-width="200">
							<option-picker v-model="formData.signCreator4" :list="signCreator4Options" placeholder="请选择" />
						</u-form-item>
					</view>
				</u-form>
			</scroll-view>
		</view>
		<view class="app-page-footer">
			<button class="btn" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
import userPicker from '@/components/user-picker'
export default {
	components: { userPicker },
	data() {
		return {
			formData: {
				qjtype: '', // 加班时段
				signCreator2: '', // 分管领导审批
				signCreator3: '', // 总经理审批
				signCreator4: '', // 监察室
				qjstime: '', // 加班开始时间
				qjetime: '', // 加班结束时间
				qjyy: '', // 加班事由
				userid: '', // 申请人
				content: '', // 加班工作内容
			},
			qjtypeOptions: [],
			signCreator2Options: [],
			signCreator3Options: [],
			signCreator4Options: [],
			rules: {
				userid: [{ required: true, message: '请选择申请人' }],
				qjstime: [{ required: true, message: '请选择加班开始时间' }],
				qjetime: [
					{ required: true, message: '请选择加班结束时间' },
					{
						validator: () => {
							if (this.formData.qjstime) {
								return new Date(this.formData.qjetime) > new Date(this.formData.qjstime)
							} else {
								return true
							}
						}, message: '加班结束时间必须大于加班开始时间'
					}
				],
				qjtype: [{ required: true, message: '请选择加班时段' }],
				qjyy: [{ required: true, message: '请输入加班事由' }],
			},
			selectedUsers: [],
			isShowFenGuan: false, // 分管领导
			isShowZongJL: false, // 总经理
			isLeader: false, // 是否是领导(职位是董事长、总经理、副总经理)
		};
	},
	onShow() {
		// 读取选择的用户
		this.selectedUsers = this.$store.state.selectedUsers
		this.formData.userid = this.selectedUsers.map(val => val.userid).join(',')
	},
	onUnload() {
		this.$store.dispatch('selectedUsers', [])
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
		const userInfo = uni.getStorageSync(this.$const.USER_INFO)
		const fmtOptions = (arr) => {
			return (arr || []).map(val => {
				return {
					label: val.displayname,
					value: val.userid,
				}
			})
		}
		// 加班时段
		this.doGet('/jiaban/qjtype').then(res => {
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
		// 分管领导
		this.doGet("/jiaban/signFunuser", { userid: userInfo.id }).then((res) => {
			this.signCreator2Options = fmtOptions(res.data)
			if (this.signCreator2Options.length > 0) {
				this.formData.signCreator2 = this.signCreator2Options[0].value;
			}
		});
		// 总经理
		this.doGet("/jiaban/signPostuser").then((res) => {
			this.signCreator3Options = fmtOptions(res.data)
			if (this.signCreator3Options.length > 0) {
				this.formData.signCreator3 = this.signCreator3Options[0].value;
			}
		});
		// 监察室
		this.doGet("/jiaban/signJianuser").then((res) => {
			this.signCreator4Options = fmtOptions(res.data);
			if (this.signCreator4Options.length > 0) {
				this.formData.signCreator4 = this.signCreator4Options[0].value;
			}
		});
		this.formData.qjstime = this.$dayjs().format('YYYY-MM-DD HH:mm:00')
		this.formData.qjetime = this.$dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:00')
		// 领导人默认选自己
		this.isLeader = ['董事长', '总经理', '副总经理'].includes(userInfo.position)
		if (this.isLeader) {
			this.selectedUsers = [{
				userid: userInfo.id,
				displayname: userInfo.name
			}]
			this.formData.userid = userInfo.id
		}
		// 职位不是'董事长','总经理','副总经理'的有分管领导选项
		this.isShowFenGuan = !this.isLeader
		// 职位是副总经理的有总经理选项
		this.isShowZongJL = userInfo.position === '副总经理';
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (!valid) return
				uni.showLoading({
					title: '正在提交',
					mask: true,
				});
				if (!this.isShowFenGuan) delete this.formData.signCreator2
				if (!this.isShowZongJL) delete this.formData.signCreator3
				this.renderModule.post(this.formData)
			})
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
		selectUser() {
			uni.navigateTo({
				url: '/pages/jiaban/select-user'
			});
		}
	}
};
</script>
<script module="renderModule" lang="renderjs">
import axios from 'axios'
export default {
  methods: {
    post(data) {
      this.doPost('/jiaban/jiaban_add', data, axios).then(res => {
				this.callback(true)
      }).catch(err => {
				this.callback(false, err.response)
      })
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
</style>
