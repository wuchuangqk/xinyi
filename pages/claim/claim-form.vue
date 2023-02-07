<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<uni-notice-bar v-if="isWeekend" single="true" text="请于周一至周五进行报销申请"></uni-notice-bar>
		<uni-forms ref="form" :modelValue="formData" :rules="rules" :labelWidth="110" :border="true" class="form">
			<view class="card">
				<uni-forms-item style="border-top: none;" label="报销时间" name="approvalSTime">
					<uni-datetime-picker
						v-if="refresh"
						type="date"
						:value="formData.approvalSTime"
						:border="false"
						:showClear="false"
						@change="e => setDateValue(e, 1)"
					></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item v-if="!isForProject" label="报销项目" name="address" :required="true">
					<uni-easyinput v-model="formData.address" placeholder="请输入报销项目" maxlength="150" :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item v-if="isForProject" label="报销项目" name="address">
					<uni-easyinput v-model="projectName" disabled :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item :label="isForProject ? '报销用途' : '报销说明'" name="approvalContent" :required="true">
					<!-- <uni-data-picker v-if="!isForProject" :localdata="baoXiaoType" popup-title="请选择报销说明" @change="onchange"></uni-data-picker> -->
					<app-select v-if="baoXiaoType.length" v-model="formData.approvalContent" :selectData="baoXiaoType"></app-select>
				</uni-forms-item>
				<uni-forms-item label="报销金额(小写)" name="moneyMIN" :required="true">
					<uni-number-box :value="formData.moneyMIN" :min="0" :max="99999999" @change="leaveDaysChange"></uni-number-box>
				</uni-forms-item>
				<uni-forms-item label="报销金额(大写)" name="moneyMAX"><uni-easyinput v-model="formData.moneyMAX" disabled :inputBorder="false" /></uni-forms-item>
				<uni-forms-item label="费用明细" name="remarks">
					<uni-easyinput type="textarea" autoHeight v-model="formData.remarks" placeholder="请输入费用明细" :inputBorder="false" />
				</uni-forms-item>
			</view>

			<view class="card">
				<view class="card-title">
					<view class="left"><text>报销凭证</text></view>
				</view>
				<view>
					<view class="img-item">
						<view class="label">发票收据</view>
						<file-viewer mode="upload" :files="[]" :limit="1" platform="oa" fileType="invoice" @file-change="e => upload(e, 'invoiceFile')"></file-viewer>
					</view>
					<view class="img-item">
						<view class="label">支付凭证</view>
						<file-viewer mode="upload" :files="[]" :limit="1" platform="oa" fileType="payment" @file-change="e => upload(e, 'payingFile')"></file-viewer>
					</view>
					<view class="img-item">
						<view class="label">清单</view>
						<file-viewer mode="upload" :files="[]" :limit="1" platform="oa" fileType="detailed" @file-change="e => upload(e, 'detailedFile')"></file-viewer>
					</view>
				</view>
			</view>

			<view class="card">
				<view class="card-title" style="margin-bottom: 20px;">
					<view class="left"><text>审批人</text></view>
				</view>
				<template>
					<view v-for="(item, index) in flowConfig.filter(v => v.isShow)" class="time-line">
						<view class="state"></view>
						<view class="content">
							<text class="label">{{ item.liableName }}</text>
							<app-select v-model="item.selectedUser" :selectData="item.userIdList"></app-select>
						</view>
					</view>
				</template>
			</view>
		</uni-forms>

		<view v-if="!isWeekend"><button class="btn" :loading="submitLoading" @click="submit">提交</button></view>
		<view style="height: 8px;"></view>
	</view>
</template>

<script>
import { getProcessConfigure, getExpenseType, save, queryAllLevelTwoParamMap, saveProjectClaim } from '@/api/office/claim.js';
import AppSelect from '@/components/app-select.vue';
import FileViewer from '@/components/file-viewer.vue';
import { getById as getProject } from '@/api/project/basicInfo.js';
import dataMixin from './mixin/dataMixin.js'

export default {
	components: { AppSelect, FileViewer },
	mixins: [dataMixin],
	data() {
		return {
			formData: {
				approvalId: null,
				userId: null, // 申请人
				deptId: null, // 部门
				approvalSTime: '', // 开始时间
				approvalContent: '', // 事由
				signs: [],
				address: '',
				moneyMIN: 0,
				moneyMAX: '零元整',
				remarks: '',
				detailedFile: [], // 清单
				invoiceFile: [], // 发票收据
				payingFile: [] // 支付凭证
			},
			show: false,
			rules: {
				approvalSTime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择报销时间'
						},
					]
				},
				address: {
					rules: [
						{
							required: true,
							errorMessage: '请输入报销项目'
						}
					]
				},
				approvalContent: {
					rules: [
						{
							required: true,
							errorMessage: '请选择报销说明'
						}
					]
				},
				moneyMIN: {
					rules: [
						{
							required: true,
							errorMessage: '请输入报销金额小写'
						}
					]
				}
			},
			submitLoading: false,
			flowConfig: [], // 流程步骤配置
			refresh: true,
			baoXiaoType: [], // 报销说明选择框
			isForProject: false, // 是否是项目的报销
			projectName: '',
		};
	},
	computed: {
		// 是否是周末（周六周日）
		isWeekend() {
			const week = new Date().getDay()
			return week === 6 || week === 0
		}
	},
	// 项目详情里的报销会传projectId
	onLoad({ projectId }) {
		if (projectId !== undefined && projectId !== 'undefined') {
			this.isForProject = true
			this.formData.address = projectId
			getProject(projectId).then(res => {
				this.projectName = res.projectName
			})
			this.rules.approvalContent.rules[0].errorMessage = '请选择报销用途'
		}
		const { userId, departId, userType } = uni.getStorageSync(this.$const.USER_INFO);
		this.formData.userId = userId;
		this.formData.deptId = departId;
		this.formData.approvalSTime = this.$dayjs().format('YYYY-MM-DD')
		// 报销固定传,正式工传5，临时工传6
		let type = null
		if (this.isForProject) {
			type = 7
		} else {
			type = (+userType === 2 || +userType === 3) ? 6 : 5
		}
		getProcessConfigure(type).then(res => {
			res.forEach((v, index) => {
				v.userIdList = v.userIdList.map(val => {
					val.label = val.displayName;
					val.value = val.userId;
					return val;
				});
				v.isShow = true;
				v.selectedUser = null;
				if (v.userIdList && v.userIdList.length) {
					v.selectedUser = v.userIdList[0].userId;
				}
				if (v.userIdList !== null && index !== 1) {
					v.userIdList.unshift({
						label: '请选择',
						value: null
					});
				}
			});
			this.flowConfig = res;
			this.setStepShow()
		});

		// 获取报销类型
		if (this.isForProject) {
			// 项目的报销类型
			queryAllLevelTwoParamMap().then(res => {
				this.baoXiaoType = (res || []).map(v => {
					return {
						label: v.pname,
						value: v.pid
					};
				})
				if (this.baoXiaoType.length) {
					this.formData.approvalContent = this.baoXiaoType[0].value
				}
			})
		} else {
			// oa的报销类型
			this.baoXiaoType = this.approvalContentOptions
		}
	},
	methods: {
		setStepShow() {
			// 报销金额大于等于1000，有第二步总经理
			// 项目是第三步有总经理
			if (this.isForProject) {
				this.flowConfig[2].isShow = this.formData.moneyMIN >= 1000
			} else {
				this.flowConfig[1].isShow = this.formData.moneyMIN >= 1000
			}
		},
		submit() {
			if (this.submitLoading) {
				return;
			}
			this.$refs.form.validate().then(res => {
				// 附件必填
				if (this.formData.invoiceFile.length === 0) {
					uni.showToast({
						title:'请上传发票收据',
						icon:'none'
					})
					return
				}
				if (this.formData.payingFile.length === 0) {
					uni.showToast({
						title:'请上传支付凭证',
						icon:'none'
					})
					return
				}
				if (this.formData.detailedFile.length === 0) {
					uni.showToast({
						title:'请上传清单',
						icon:'none'
					})
					return
				}
				const flowType = this.flowConfig.filter(v => v.isShow)
				if (flowType.every(v => !v.selectedUser)) {
					uni.showToast({
						title:'请至少选择一个步骤',
						icon:'none'
					})
					return
				}
				if (!this.isForProject) {
					this.formData.approvalContent = this.formData.approvalContent[this.formData.approvalContent.length -1].value
				}
				this.formData.approvalSTime = this.$dayjs(this.formData.approvalSTime).format('YYYY-MM-DD HH:mm:ss')
				this.leaveDaysChange(this.formData.moneyMIN)
				this.formData.signs = []
				flowType.forEach(item => {
					if (item.selectedUser) {
						this.formData.signs.push({
							userId: item.selectedUser,
							sortIndex: item.sortIndex,
							configureId: item.configureId
						});
					}
				});
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
				const method = this.isForProject ? saveProjectClaim : save
				method(this.formData)
					.then(() => {
						this.submitLoading = false;
						uni.hideLoading();
						uni.$emit(this.$events.UPDATE_CLAIM_STATE);
						uni.navigateBack();
					})
					.catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						});
						this.submitLoading = false;
						uni.hideLoading();
					});
			});
		},
		// 上传附件
		upload(files, field) {
			this.formData[field] = files
		},
		onchange(e) {
			this.formData.approvalContent = e.detail.value
		},
		setDateValue(e, type) {
			if (type === 1) {
				this.formData.approvalSTime = e;
			} else {
				this.formData.approvalETime = e;
			}
		},
		/**
		 * 根据请假天数，计算请假结束时间
		 */
		leaveDaysChange(e) {
			this.formData.moneyMIN = e;
			this.setStepShow()
			let result = this.test(this.formData.moneyMIN);
			if (result) {
				this.formData.moneyMAX = result;
			}
		},
		test(n) {
			if (n === 0) {
				return '零';
			}
			if (!/^(\+|-)?(0|[1-9]\d*)(\.\d+)?$/.test(n)) return null;
			let unit = '仟佰拾亿仟佰拾万仟佰拾元角分',
				str = '';
			n += '00';
			let a = parseFloat(n);
			if (a < 0) {
				n = n.substr(1);
			}
			let p = n.indexOf('.');
			if (p >= 0) {
				n = n.substring(0, p) + n.substr(p + 1, 2);
			}

			unit = unit.substr(unit.length - n.length);

			for (let i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
			if (a > 0) {
				return str
					.replace(/零(仟|佰|拾|角)/g, '零')
					.replace(/(零)+/g, '零')
					.replace(/零(万|亿|元)/g, '$1')
					.replace(/(亿)万|壹(拾)/g, '$1$2')
					.replace(/^元零?|零分/g, '')
					.replace(/元$/g, '元整');
			} else {
				return (
					'负' +
					str
						.replace(/零(仟|佰|拾|角)/g, '零')
						.replace(/(零)+/g, '零')
						.replace(/零(万|亿|元)/g, '$1')
						.replace(/(亿)万|壹(拾)/g, '$1$2')
						.replace(/^元零?|零分/g, '')
						.replace(/元$/g, '元整')
				);
			}
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: 100%;
	background-color: $-bg-color;
}

.btn {
	background-color: #1989fa;
	color: white;
	margin: 20px 10px 10px;
	font-size: 14px;
}

/deep/ .input-value-border {
	border: none;
}

.user-select {
	line-height: 36px;
	display: flex;
	justify-content: space-between;

	.placeholder {
		color: #7c7c7c;
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
.img-item {
	border-bottom: 1px solid #f7f7f7;
	margin-bottom: 10px;
	&:last-of-type {
		border-bottom: 0;
	}
	.label {
		font-size: 13px;
		color: #666;
		margin-bottom: 10px;
	}
}
</style>
