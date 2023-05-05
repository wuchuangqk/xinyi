<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card form-card">
						<u-form-item label="宾客姓名" prop="xingming" required>
							<u-input v-model="formData.xingming" placeholder="请输入宾客姓名" />
						</u-form-item>
						<u-form-item label="单位职位" prop="zhiwu" required>
							<u-input v-model="formData.zhiwu" placeholder="请输入单位职位" />
						</u-form-item>
						<u-form-item label="申请时间" prop="docDate" required>
							<date-picker v-model="formData.docDate" :defaultTime="formData.docDate" placeholder="请选择申请日期" />
						</u-form-item>
						<u-form-item label="接待事由" prop="comments" required>
							<u-input v-model="formData.comments" placeholder="请输入接待事由" />
						</u-form-item>
						<u-form-item label="用餐人数" prop="ycrs" required>
							<u-input v-model="formData.ycrs" type="number" placeholder="请输入用餐人数" />
						</u-form-item>
						<u-form-item label="陪餐人数" prop="pcrs" required>
							<u-input v-model="formData.pcrs" type="number" placeholder="请输入陪餐人数" />
						</u-form-item>
						<u-form-item label="用餐标准(元/人)" prop="biaozhun" label-width="220" required>
							<u-input v-model="formData.biaozhun" type="number" placeholder="请输入用餐标准" />
						</u-form-item>
					</view>
					<!-- 审批人 -->
					<view class="card">
						<view class="card-title" style="margin-bottom: 0;">
							<view class="left"><text>审批人</text></view>
						</view>
						<u-form-item label="部门审批" required prop="sign1" label-width="200">
							<option-picker v-model="formData.sign1" :list="sign1Options" placeholder="请选择" />
						</u-form-item>
						<u-form-item label="分管副总审批" required prop="sign2" label-width="200">
							<option-picker v-model="formData.sign2" :list="sign2Options" placeholder="请选择" />
						</u-form-item>
						<u-form-item label="总经理审批" required prop="sign4" label-width="200">
							<option-picker v-model="formData.sign4" :list="sign4Options" placeholder="请选择" />
						</u-form-item>
						<u-form-item label="综合部审批" required prop="sign3" label-width="200">
							<option-picker v-model="formData.sign3" :list="sign3Options" placeholder="请选择" />
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
import renderMixin from '@/mixin/render'

export default {
	mixins: [renderMixin],
	data() {
		return {
			formData: {
				// 宾客姓名
				xingming: '',
				// 单位职位
				zhiwu: '',
				// 申请时间
				docDate: '',
				// 接待事由
				comments: '',
				// 用餐人数
				ycrs: '',
				// 配餐人数
				pcrs: '',
				// 用餐标准(元/人)
				biaozhun: '',
				// 部门审批
				sign1: '',
				// 分管副总审批
				sign2: '',
				// 综合部审批
				sign3: '',
				// 总经理审批
				sign4: '1596',
			},
			sign1Options: [],
			sign2Options: [],
			sign3Options: [],
			sign4Options: [
				{ label: '王振和', value: '1596' }
			],
			rules: {
				xingming: [{ required: true, message: '请输入宾客姓名' }],
				zhiwu: [{ required: true, message: '请输入单位职位' }],
				comments: [{ required: true, message: '请输入接待事由' }],
				ycrs: [{ required: true, message: '请输入用餐人数' }],
				pcrs: [{ required: true, message: '请输入配餐人数' }],
				biaozhun: [{ required: true, message: '请输入用餐标准' }],
				sign1: [{ required: true, message: '请选择部门审批人' }],
				sign2: [{ required: true, message: '请选择分管副总审批人' }],
				sign4: [{ required: true, message: '请选择总经理审批' }],
				sign3: [{ required: true, message: '请选择综合部审批人' }],
			},
			listPath: '/pages/jiedai/list',
		};
	},
	onLoad({ from }) {
		this.from = from
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
		const fmtOptions = (arr) => {
			return (arr || []).map(val => {
				return {
					label: val.username,
					value: val.userid,
				}
			})
		}
		// 部门审批
		this.doGet("/ying/bmsp").then((res) => {
			this.sign1Options = fmtOptions(res.data)
			if (this.sign1Options.length > 0) {
				this.formData.sign1 = this.sign1Options[0].value;
			}
		});
		// 分管副总审批
		this.doGet("/ying/fgfzsp").then((res) => {
			this.sign2Options = fmtOptions(res.data)
			if (this.sign2Options.length > 0) {
				this.formData.sign2 = this.sign2Options[0].value;
			}
		});
		// 综合部审批
		this.doGet("/ying/zhbsp").then((res) => {
			this.sign3Options = fmtOptions(res.data);
			if (this.sign3Options.length > 0) {
				this.formData.sign3 = this.sign3Options[0].value;
			}
		});
		this.formData.docDate = this.$dayjs().format('YYYY-MM-DD HH:mm:00')
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (!valid) return
				uni.showLoading({
					title: '正在提交',
					mask: true,
				});
				this.renderParams = this.setPostData(this.formData)
			})
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
				axiosRequest('/jiedai/add', renderParams, axios).then(res => {
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
</style>
