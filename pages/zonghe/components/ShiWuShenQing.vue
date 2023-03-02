<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card-space">
						<view class="card form-card">
							<u-form-item label="申请类型" prop="qjtype" required>
								<option-picker v-model="formData.qjtype" :list="qjtypeOptions" placeholder="请选择申请类型" />
							</u-form-item>
							<u-form-item label="开始时间" prop="qjstime" required>
								<date-picker v-model="formData.qjstime" :defaultTime="formData.qjstime" placeholder="请选择开始时间" />
							</u-form-item>
							<u-form-item label="结束时间" prop="qjetime" required>
								<date-picker v-model="formData.qjetime" :defaultTime="formData.qjetime" placeholder="请选择结束时间" />
							</u-form-item>
							<u-form-item label="申请原因" prop="qjyy" required>
								<u-input v-model="formData.qjyy" placeholder="请输入申请原因" />
							</u-form-item>
						</view>
						<!-- 附件 -->
						<view class="card">
							<view class="card-title">
								<view class="left"><text>附件</text></view>
							</view>
							<file-viewer @change="upload"></file-viewer>
						</view>
						<!-- 审批人 -->
						<view class="card">
							<view class="card-title" style="margin-bottom: 0;">
								<view class="left"><text>审批人</text></view>
							</view>
							<u-form-item label="审批人" prop="staff_ids" required>
								<userPicker :selectedUsers="selectedUsers" url="/pages/zonghe/select-user" />
							</u-form-item>
						</view>
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
import FileViewer from '@/components/file-uploader.vue';
import renderMixin from '@/mixin/render'
import userPicker from '@/components/user-picker'

export default {
	components: { FileViewer, userPicker },
	mixins: [renderMixin],
	props: ['selectedUsers', 'fromPage'],
	data() {
		return {
			formData: {
				qjstime: '', // 用印日期
				sl: 1, // 用印份数
				fwdw: '', // 发往单位
				qjetime: '', // 结束时间
				qjyy: '', // 材料名称用印事由
				qjtype: '', // 申请类别
				zbyj: '', // 经办人意见
				beizhu: '', // 备注
				sign1: '',
				sign2: '',
				sign3: '',
				sign4: '',
				staff_ids: '', // 审批人
			},
			qjtypeOptions: [],
			files: [], // 请假附件
			rules: {
				qjstime: [{ required: true, message: '请选择开始时间' }],
				qjetime: [
					{ required: true, message: '请选择结束时间' },
					{
						validator: () => {
							if (this.formData.qjstime) {
								return new Date(this.formData.qjetime) > new Date(this.formData.qjstime)
							} else {
								return true
							}
						}, message: '结束时间必须大于开始时间'
					}
				],
				qjyy: [{ required: true, message: '请输入申请原因' }],
				staff_ids: [
					{
						validator: () => {
							this.formData.staff_ids = this.selectedUsers.map(val => val.id).join(',')
							return this.formData.staff_ids.length !== 0
						}, message: '请选择审批人'
					}
				],
			},
			listPath: '/pages/zonghe/list',
			from: this.fromPage,
		};
	},
	mounted() {
		this.formData.qjstime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
		this.formData.qjetime = this.$dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
		this.doGet('/zhsp/qjtype').then(res => {
			this.qjtypeOptions = (res.data || []).map(val => {
				return { label: val.name, value: val.name }
			})
			if (this.qjtypeOptions.length) {
				this.formData.qjtype = this.qjtypeOptions[0].value
			}
		})
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

				if (this.files.length) {
					this.doPost('/zhsp/zhspadd', this.formData, this.files).then(() => {
						this.back()
					})
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
import { doPost } from '@/util/post.js'
export default {
  methods: {
		change(renderParams) {
			if (renderParams !== null) {
				doPost('/zhsp/zhspadd', renderParams, axios).then(res => {
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
.card-space {
	padding: 10px 8px 0;
}

.card {
	margin: 0;
	margin-bottom: 10px;
}
</style>
