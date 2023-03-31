<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card form-card">
						<u-form-item label="请假原因" prop="qjyy" required>
							<u-input v-model="formData.qjyy" placeholder="请输入请假原因" />
						</u-form-item>
						<u-form-item label="请假类型" prop="qjtype" required>
							<option-picker v-model="formData.qjtype" :list="qjtypeOptions" placeholder="请选择请假类型" />
						</u-form-item>
						<u-form-item label="开始时间" prop="qjstime" required>
							<date-picker v-model="formData.qjstime" :defaultTime="formData.qjstime" placeholder="请选择开始时间"
								@update:modelValue="setVisable" />
						</u-form-item>
						<u-form-item label="结束时间" prop="qjetime" required>
							<date-picker v-model="formData.qjetime" :defaultTime="formData.qjetime" placeholder="请选择结束时间"
								@update:modelValue="setVisable" />
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
						<u-form-item v-if="bumen" label="部门领导审批" prop="signCreator1" required label-width="200">
							<option-picker v-model="formData.signCreator1" :list="signCreator1Options" placeholder="请选择" />
						</u-form-item>
						<u-form-item v-if="fenguan" label="分管领导审批" prop="signCreator2" required label-width="200">
							<option-picker v-model="formData.signCreator2" :list="signCreator2Options" placeholder="请选择" />
						</u-form-item>
						<u-form-item v-if="zongjingli" label="总经理审批" prop="signCreator3" required label-width="200">
							<option-picker v-model="formData.signCreator3" :list="signCreator3Options" placeholder="请选择" />
						</u-form-item>
						<u-form-item label="人事部意见" prop="signCreator4" required label-width="200">
							<option-picker v-model="formData.signCreator4" :list="signCreator4Options" placeholder="请选择" />
						</u-form-item>
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
				qjyy: '', // 请假原因
			},
			qjtypeOptions: [],
			signCreator1Options: [],
			signCreator2Options: [],
			signCreator3Options: [],
			signCreator4Options: [],
			files: [], // 请假附件
			rules: {
				qjyy: [{ required: true, message: '请输入请假原因' }],
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
			bumen: false, // 部门领导审批
			fenguan: false, // 分管领导审批
			zongjingli: false, // 总经理审批
			/*
			<p> 1 -> 普通员工 </p>
			<p> 2->部门负责人 </p>
			<p> 3->分管副总 </p>
			*/
			level: 1,
			listPath: '/pages/leave-list/list',
		};
	},
	onLoad({from}) {
		this.from = from
	},
	onReady() {
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
		this.doGet('/qingjia/selectdo').then(res => {
			this.bumen = res.data.select1;
			this.fenguan = res.data.select2;
			this.zongjingli = res.data.select3;
			this.level = res.data.leve;
			this.setVisable();
		})
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
				if (!this.bumen) delete this.formData.signCreator1
				if (!this.fenguan) delete this.formData.signCreator2
				if (!this.zongjingli) delete this.formData.signCreator3
				if (this.files.length) {
					this.uploadFile('/qingjia/qingjia_add', this.formData, this.files).then(() => {
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
		// 设置可见性
		setVisable() {
			const daysNumber = this.$dayjs(this.formData.qjetime).diff(this.formData.qjstime, 'day')
			// 普通员工
			if (this.level == 1) {
				if (daysNumber < 2) {
					this.bumen = true;
					this.fenguan = true;
					this.zongjingli = false;
				} else {
					this.bumen = true;
					this.fenguan = true;
					this.zongjingli = true;
				}
			} else if (this.level == 2) {
				if (daysNumber < 2) {
					this.bumen = false;
					this.fenguan = true;
					this.zongjingli = false;
				} else {
					this.bumen = false;
					this.fenguan = true;
					this.zongjingli = true;
				}
			} else if (this.level == 3) {
				this.bumen = false;
				this.fenguan = false;
				this.zongjingli = true;
			}
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
				axiosRequest('/qingjia/qingjia_add', renderParams, axios).then(res => {
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
<style scoped lang="scss"></style>
