<template>
	<view class="app-page">
		<view class="notice">注：2000元以下提交至副书记（王局）审批，2000元以上含2000元提交至总经理（王总）审批。</view>
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card form-card">
						<u-form-item label="申请部门" required>
							<option-picker v-model="formData.zgbumen" :list="zgbumenOptions" placeholder="请选择申请部门" />
						</u-form-item>
						<u-form-item label="资产名称" prop="zgmc" required>
							<u-input v-model="formData.zgmc" placeholder="请输入资产名称" />
						</u-form-item>
						<u-form-item label="购置理由" prop="zgyy" required>
							<u-input v-model="formData.zgyy" placeholder="请输入购置理由" />
						</u-form-item>
						<u-form-item label="购置类型">
							<u-input v-model="formData.zgtype" placeholder="例如：一般办公用品、专用设备、电子产品、其他等" />
						</u-form-item>
						<u-form-item label="规格型号">
							<u-input v-model="formData.zgxh" placeholder="请输入规格型号" />
						</u-form-item>
						<u-form-item label="数量">
							<u-input v-model="formData.zgsl" type="number" placeholder="请输入数量" />
						</u-form-item>
						<u-form-item label="预算金额(元)">
							<u-input v-model="formData.ysje" type="number" placeholder="请输入预算金额" />
						</u-form-item>
						<u-form-item label="申请日期">
							<date-picker v-model="formData.zgtime" :defaultTime="formData.zgtime" placeholder="请选择申请日期" mode="date" />
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
						<u-form-item label="分管副总审批" label-width="200">
							<option-picker v-model="formData.sign2" :list="sign2Options" placeholder="请选择" />
						</u-form-item>
						<u-form-item label="副书记审批" label-width="200">
							<option-picker v-model="formData.sign3" :list="sign3Options" placeholder="请选择" />
						</u-form-item>
						<u-form-item label="总经理审批" label-width="200">
							<option-picker v-model="formData.sign4" :list="sign4Options" placeholder="请选择" />
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
				zgbumen: '', // 申请部门
				zgtime: '', // 申请日期
				staff_ids: '',
				zgtype: '', // 购置类型
				zgmc: '', // 资产名称
				zgxh: '', // 规格型号
				zgsl: '', // 数量
				ysje: '', // 预算金额
				zgyy: '', // 购置理由
				sign1: '', // 部门审批
				sign2: '', // 分管副总审批
				sign3: '', // 副书记审批
				sign4: '', // 总经理审批
			},
			zgbumenOptions: [], // 申请部门
			sign1Options: [],
			sign2Options: [],
			sign3Options: [],
			sign4Options: [],
			rules: {
				zgbumen: [{ required: true, message: '请选择申请部门' }],
				zgmc: [{ required: true, message: '请输入资产名称' }],
				zgyy: [{ required: true, message: '请输入购置理由' }],
				sign1: [{ required: true, message: '请选择部门审批人' }],
			},
			listPath: '/pages/zichan/list',
		};
	},
	onLoad({ from }) {
		this.from = from
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
		const userInfo = uni.getStorageSync(this.$const.USER_INFO)
		const fmtOptions = (arr) => {
			return (arr || []).map(val => {
				return {
					label: val.username,
					value: val.userid,
				}
			})
		}
		// 申请部门
		this.doGet('/zhigou/bumen_list').then(res => {
			this.zgbumenOptions = res.data.map(val => {
				return {
					label: val.name,
					value: val.id,
				}
			})
			this.formData.zgbumen = userInfo.departid
		})
		// 部门审批
		this.doGet("/zhigou/bmsp").then((res) => {
			this.sign1Options = fmtOptions(res.data)
			if (this.sign1Options.length > 0) {
				this.formData.sign1 = this.sign1Options[0].value;
			}
		});
		// 分管副总审批
		this.doGet("/zhigou/fgfzsp").then((res) => {
			this.sign2Options = fmtOptions(res.data)
		});
		// 副书记审批
		this.doGet("/zhigou/fsjsp").then((res) => {
			this.sign3Options = fmtOptions(res.data);
		});
		// 总经理审批
		this.doGet("/zhigou/dszsp").then((res) => {
			this.sign4Options = fmtOptions(res.data);
		});
		this.formData.zgtime = this.$dayjs().format('YYYY-MM-DD')
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
import { doPost } from '@/util/post.js'
export default {
  methods: {
		change(renderParams) {
			if (renderParams !== null) {
				doPost('/zhigou/zhigou_add', renderParams, axios).then(res => {
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

.notice {
	background: #fdf6ec;
	color: #ff9900;
	padding: 9px 12px;
	font-size: 13px;
}
</style>
