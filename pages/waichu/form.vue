<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card form-card">
						<u-form-item label="开始时间" prop="qjstime" required>
							<date-picker v-model="formData.qjstime" :defaultTime="formData.qjstime" placeholder="请选择开始时间" />
						</u-form-item>
						<u-form-item label="结束时间" prop="qjetime" required>
							<date-picker v-model="formData.qjetime" :defaultTime="formData.qjetime" placeholder="请选择结束时间" />
						</u-form-item>
						<u-form-item label="是否带车" prop="qjtype" required>
							<option-picker v-model="formData.qjtype" :list="qjtypeOptions" placeholder="请选择是否带车" />
						</u-form-item>
						<u-form-item label="出差事由" prop="qjyy" required>
							<u-input v-model="formData.qjyy" placeholder="请输入出差事由" />
						</u-form-item>
						<u-form-item label="费用支付单位" prop="zfdw" required>
							<u-input v-model="formData.zfdw" placeholder="请输入费用支付单位" />
						</u-form-item>
					</view>
					<view class="card">
						<view class="card-title" style="margin-bottom: 0;">
							<view class="left"><text>出差地点</text></view>
						</view>
						<view class="addr-wrap">
							<u-input v-model="formData.addr1" :border="true" placeholder="请输入" />
							<text class="text">至</text>
							<u-input v-model="formData.addr2" :border="true" placeholder="请输入" />
						</view>
						<view class="addr-wrap">
							<u-input v-model="formData.addr3" :border="true" placeholder="请输入" />
							<text class="text">至</text>
							<u-input v-model="formData.addr4" :border="true" placeholder="请输入" />
						</view>
						<view class="addr-wrap">
							<u-input v-model="formData.addr5" :border="true" placeholder="请输入" />
							<text class="text">至</text>
							<u-input v-model="formData.addr6" :border="true" placeholder="请输入" />
						</view>
						<view class="addr-wrap">
							<u-input v-model="formData.addr7" :border="true" placeholder="请输入" />
							<text class="text">至</text>
							<u-input v-model="formData.addr8" :border="true" placeholder="请输入" />
						</view>
					</view>
					<!-- 审批人 -->
					<view class="card">
						<view class="card-title" style="margin-bottom: 0;">
							<view class="left"><text>审批人</text></view>
						</view>
						<u-form-item label="部门领导审批" prop="signCreator1" required label-width="200">
							<option-picker v-model="formData.signCreator1" :list="signCreator1Options" placeholder="请选择" />
						</u-form-item>
						<u-form-item label="分管领导审批" prop="signCreator2" required label-width="200">
							<option-picker v-model="formData.signCreator2" :list="signCreator2Options" placeholder="请选择" />
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
import FileViewer from '@/components/file-uploader.vue';

export default {
	components: { FileViewer },
	data() {
		return {
			formData: {
				qjtype: '', // 请假类型
				signCreator1: '', // 部门领导审批
				signCreator2: '', // 分管领导审批
				qjstime: '', // 请假开始时间
				qjetime: '', // 请假结束时间
				qjyy: '', // 出差事由
				zfdw: '', // 费用支付单位
				//外出地点
				addr1: "",
				addr2: "",
				addr3: "",
				addr4: "",
				addr5: "",
				addr6: "",
				addr7: "",
				addr8: ""
			},
			qjtypeOptions: [
				{ label: '是', value: '是' },
				{ label: '否', value: '否' }
			],
			signCreator1Options: [],
			signCreator2Options: [],
			rules: {
				qjyy: [{ required: true, message: '请输入出差事由' }],
				qjtype: [{ required: true, message: '请选择请假类型' }],
				qjstime: [{ required: true, message: '请选择请假开始时间' }],
				qjetime: [
					{ required: true, message: '请选择请假结束时间' },
					{
						validator: () => {
							if (this.formData.qjstime) {
								return new Date(this.formData.qjetime) > new Date(this.formData.qjstime)
							} else {
								return true
							}
						}, message: '请假结束时间必须大于请假开始时间'
					}
				],
			},
		};
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
		this.doGet("/waichu/signCreator1").then((res) => {
			this.signCreator1Options = fmtOptions(res.data)
			if (this.signCreator1Options.length > 0) {
				this.formData.signCreator1 = this.signCreator1Options[0].value;
			}
		});
		this.doGet("/waichu/signCreator2").then((res) => {
			this.signCreator2Options = fmtOptions(res.data)
			if (this.signCreator2Options.length > 0) {
				this.formData.signCreator2 = this.signCreator2Options[0].value;
			}
		});
		this.formData.qjstime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
		this.formData.qjetime = this.$dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (!valid) return
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
				delete this.formData.signCreator1
				delete this.formData.signCreator3
				this.renderModule.post(this.formData, this.files)
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
	}
};
</script>
<script module="renderModule" lang="renderjs">
import axios from 'axios'
export default {
  methods: {
    post(data, files) {
      this.doPost('/waichu/waichu_add', data, axios, files).then(res => {
				this.callback(true)
      }).catch(err => {
				this.callback(false, err.response)
      })
    }
  },
}
</script>

<style scoped lang="scss">
.addr-wrap {
	margin-top: 10px;
	display: flex;
	align-items: center;

	.text {
		margin: 0 8px;
	}
}
</style>
