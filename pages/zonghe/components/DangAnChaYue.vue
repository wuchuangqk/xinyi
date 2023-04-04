<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card-space">
						<view class="card form-card">
							<u-form-item label="申请类型">
								<text>{{ formData.qjtype }}</text>
							</u-form-item>
							<u-form-item :label="qjstimeLabel" prop="qjstime" required>
								<date-picker v-model="formData.qjstime" :defaultTime="formData.qjstime"
									:placeholder="'请选择' + qjstimeLabel" />
							</u-form-item>
							<u-form-item :label="qjyyLabel" prop="qjyy" required>
								<u-input v-model="formData.qjyy" :placeholder="'请输入' + qjyyLabel" />
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
							<u-form-item label="部门审批人" prop="auditor" required label-width="200">
								<option-picker v-model="formData.auditor" :list="auditorOptions" placeholder="请选择" />
							</u-form-item>
							<u-form-item label="综合部审批人" prop="zonghebu" required label-width="200">
								<option-picker v-model="formData.zonghebu" :list="zonghebuOptions" placeholder="请选择" />
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

export default {
	components: { FileViewer },
	mixins: [renderMixin],
	props: {
		type: {
			type: String
		},
		fromPage: {
			type: String
		}
	},
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
				staff_ids: '',
				auditor: '', // 部门审批人
				zonghebu: '', // 综合部审批人
			},
			auditorOptions: [],
			zonghebuOptions: [],
			files: [], // 请假附件
			rules: {
				qjstime: [{ required: true, message: '请选择查阅时间' }],
				qjyy: [{ required: true, message: '请输入查阅文件名称' }],
			},
			qjstimeLabel: '',
			qjyyLabel: '',
			listPath: '/pages/zonghe/list',
			from: this.fromPage,
		};
	},
	mounted() {
		this.formData.qjtype = this.type
		if (this.formData.qjtype === '公司档案查阅') {
			this.qjstimeLabel = '查阅时间'
			this.qjyyLabel = '查阅文件名称'
		} else {
			this.qjstimeLabel = '借阅时间'
			this.qjyyLabel = '借阅文件名称'
		}
		this.rules.qjstime[0].message = '请选择' + this.qjstimeLabel
		this.rules.qjyy[0].message = '请输入' + this.qjyyLabel

		this.formData.qjstime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
		this.formData.qjetime = this.$dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
		const fmtOptions = (arr) => {
			return (arr || []).map(val => {
				return {
					label: val.DisplayName,
					value: val.UserID,
				}
			})
		}
		this.doGet('/CarMileages/getShenHeRen').then(res => {
			this.auditorOptions = fmtOptions(res.data.buMenShenHeList)
			if (this.auditorOptions.length) {
				this.formData.auditor = this.auditorOptions[0].value
			}
			this.zonghebuOptions = fmtOptions(res.data.zongHeBulist)
			if (this.zonghebuOptions.length) {
				this.formData.zonghebu = this.zonghebuOptions[0].value
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
				this.formData.staff_ids = [this.formData.auditor, this.formData.zonghebu].join(',')
				if (this.files.length) {
					this.uploadFile('/zhsp/zhspadd', this.formData, this.files).then(() => {
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
import { axiosRequest } from '@/util/post.js'
export default {
  methods: {
		change(renderParams) {
			if (renderParams !== null) {
				axiosRequest('/zhsp/zhspadd', renderParams, axios).then(res => {
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
