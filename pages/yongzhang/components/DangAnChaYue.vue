<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card-space">
						<view class="card form-card">
							<u-form-item :label="docTitleLabel" prop="docTitle" required>
								<u-input v-model="formData.docTitle" :placeholder="'请输入' + docTitleLabel" />
							</u-form-item>
							<u-form-item :label="docDateLabel" prop="docDate" required>
								<date-picker v-model="formData.docDate" :defaultTime="formData.docDate"
									:placeholder="'请选择' + docDateLabel" />
							</u-form-item>
							<u-form-item label="用章事由" prop="comments" required>
								<u-input v-model="formData.comments" placeholder="请输入用章事由" />
							</u-form-item>
						</view>
						<!-- 审批人 -->
						<view class="card">
							<view class="card-title" style="margin-bottom: 0;">
								<view class="left"><text>审批人</text></view>
							</view>
							<u-form-item label="部门审批人" prop="sign1" required label-width="200">
								<option-picker v-model="formData.sign1" :list="sign1Options" placeholder="请选择" />
							</u-form-item>
							<u-form-item label="分管副总审批" prop="sign2" required label-width="200">
								<option-picker v-model="formData.sign2" :list="sign2Options" placeholder="请选择" />
							</u-form-item>
							<u-form-item label="综合部审批" prop="sign3" required label-width="200">
								<option-picker v-model="formData.sign3" :list="sign3Options" placeholder="请选择" />
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
import renderMixin from '@/mixin/render'

export default {
	mixins: [renderMixin],
	props: {
		yingtype: {
			type: Number
		},
		fromPage: {
			type: String
		}
	},
	data() {
		return {
			formData: {
				sign1: '', // 部门审批
				sign2: '', // 分管副总审批
				sign3: '', // 综合部审批
				docTitle: "", // 用章名称
				docDate: '', // 盖章时间
				comments: '', // 事由
				yingtype: this.yingtype
			},
			sign1Options: [],
			sign2Options: [],
			sign3Options: [],
			rules: {
				docTitle: [{ required: true, message: '' }],
				docDate: [{ required: true, message: '' }],
				comments: [{ required: true, message: '请输入用章事由' }],
			},
			docDateLabel: '',
			docTitleLabel: '',
			listPath: '/pages/yongzhang/list',
			from: this.fromPage,
		};
	},
	mounted() {
		if (this.formData.yingtype === 0) {
			this.docDateLabel = '盖章时间'
			this.docTitleLabel = '用章名称'
		} else {
			this.docDateLabel = '外带时间'
			this.docTitleLabel = '外带名称'
		}
		this.rules.docDate[0].message = '请选择' + this.docDateLabel
		this.rules.docTitle[0].message = '请输入' + this.docTitleLabel

		this.formData.docDate = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
		const fmtOptions = (arr) => {
			return (arr || []).map(val => {
				return {
					label: val.username,
					value: val.userid,
				}
			})
		}
		// 部门审批人
		this.doGet('/ying/bmsp').then(res => {
			this.sign1Options = fmtOptions(res.data)
			if (this.sign1Options.length) {
				this.formData.sign1 = this.sign1Options[0].value
			}
		})
		// 分管副总审批
		this.doGet('/ying/fgfzsp').then(res => {
			this.sign2Options = fmtOptions(res.data)
			if (this.sign2Options.length) {
				this.formData.sign2 = this.sign2Options[0].value
			}
		})
		// 综合部审批
		this.doGet('/ying/zhbsp').then(res => {
			this.sign3Options = fmtOptions(res.data)
			if (this.sign3Options.length) {
				this.formData.sign3 = this.sign3Options[0].value
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
				this.renderParams = this.setPostData(this.formData)
			})
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
				doPost('/ying/add', renderParams, axios).then(res => {
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
