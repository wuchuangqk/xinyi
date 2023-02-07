<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<uni-forms ref="form" :modelValue="formData" :rules="rules" :labelWidth="120" :border="true" class="form">
			<view class="card">
				<uni-forms-item style="border-top: none;" label="请款时间" name="approvalSTime">
					<uni-datetime-picker
						v-if="refresh"
						type="date"
						:value="formData.approvalSTime"
						:border="false"
						:showClear="false"
						@change="e => setDateValue(e, 1)"
					></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item label="请款项目" name="address">
					<uni-easyinput v-model="projectName" disabled :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item label="款项用途" name="approvalContent" :required="true">
					<app-select v-if="useOptions.length" v-model="formData.approvalContent" :selectData="useOptions"></app-select>
				</uni-forms-item>
				<uni-forms-item label="款项类别" name="leaveType" :required="true">
					<app-select v-if="typeOptions.length" v-model="formData.leaveType" :selectData="typeOptions"></app-select>
				</uni-forms-item>
				<uni-forms-item label="款项金额(小写)" name="moneyMIN" :required="true">
					<uni-number-box :value="formData.moneyMIN" :min="0" :max="99999999" @change="leaveDaysChange"></uni-number-box>
				</uni-forms-item>
				<uni-forms-item label="款项金额(大写)" name="moneyMAX">
					<uni-easyinput v-model="formData.moneyMAX" disabled :inputBorder="false" />
				</uni-forms-item>
				
				<uni-forms-item label="是否含增值税" name="isCc">
					<AppRadio v-model="formData.isCc" :selectData="isCcOptions"/>
				</uni-forms-item>
				<!-- 当选择包含增值税时，现实税点和税金 -->
				<uni-forms-item v-show="formData.isCc === '1'" label="税点(%)" name="number">
					<uni-number-box :value="formData.number" :min="0" :max="99999999" :isInteger="true" @change="setNumber"></uni-number-box>
				</uni-forms-item>
				<uni-forms-item v-show="formData.isCc === '1'" label="税金(元)" name="payMode">
					<uni-easyinput v-model="formData.payMode" disabled :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item label="是否含运费" name="isCar">
					<AppRadio v-model="formData.isCar" :selectData="isCarOptions"/>
				</uni-forms-item>
				
				<uni-forms-item v-if="unitCache.length" label="已录入的收款单位" name="approvalContent">
					<app-select v-model="selectUnit" @change="matchCache" :selectData="unitCache"></app-select>
				</uni-forms-item>
				<uni-forms-item label="收款单位名称" name="payCompany" :required="true">
					<uni-easyinput v-model="formData.payCompany" placeholder="请输入收款单位名称" :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item label="收款单位账号" name="purpose" :required="true">
					<uni-easyinput v-model="formData.purpose" placeholder="请输入收款单位账号" :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item label="收款单位开户行" name="approvalName" :required="true">
					<uni-easyinput v-model="formData.approvalName" placeholder="请输入收款单位开户行" :inputBorder="false" />
				</uni-forms-item>
				
				<uni-forms-item label="费用明细" name="remarks">
					<uni-easyinput type="textarea" autoHeight v-model="formData.remarks" placeholder="请输入费用明细" :inputBorder="false" />
				</uni-forms-item>
			</view>

			<view class="card">
				<view class="card-title">
					<view class="left"><text>明细清单</text></view>
				</view>
				<file-viewer mode="upload" :files="[]" :limit="10" platform="oa" fileType="detailed" @file-change="upload"></file-viewer>
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

		<view><button class="btn" :loading="submitLoading" @click="submit">提交</button></view>
		<view style="height: 8px;"></view>
	</view>
</template>

<script>
import { getProcessConfigure, saveMoneyApply, getSystemParams } from '@/api/office/claim.js';
import AppSelect from '@/components/app-select.vue';
import AppRadio from '@/components/app-radio.vue';
import FileViewer from '@/components/file-viewer.vue';
import { getById as getProject } from '@/api/project/basicInfo.js';
import {storageKeys} from '@/util/constants.js'

export default {
	components: { AppSelect, FileViewer, AppRadio },
	data() {
		return {
			formData: {
				address: null, // 报销项目
				approvalContent: null, // 款项用途
				approvalId: null,
				approvalName: null, // 收款单位开户银行
				approvalSTime: null, // 申请时间
				deptId: null,
				detailedFile: [], // 明细清单
				isCar: '0', // 是否含运费
				isCc: '0', // 是否含增值税
				leaveType: null, // 款项类别
				moneyMAX: null, // 款项金额（大写）
				moneyMIN: null, // 款项金额（小写）
				number: 0, // 税点
				payCompany: null, // 收款单位名称
				payMode: 0.00, // 税金
				purpose: null, // 收款单位账号
				remarks: null, // 费用明细
				signs: [],
				userId: null, // 申请人Id
			},
			show: false,
			rules: {
				approvalSTime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择请款时间'
						},
					]
				},
				approvalContent: {
					rules: [
						{
							required: true,
							errorMessage: '请选择款项用途'
						}
					]
				},
				leaveType: {
					rules: [
						{
							required: true,
							errorMessage: '请选择款项类别'
						}
					]
				},
				moneyMIN: {
					rules: [
						{
							required: true,
							errorMessage: '请输入款项金额小写'
						}
					]
				},
				payCompany: {
					rules: [
						{
							required: true,
							errorMessage: '请输入收款单位名称'
						}
					]
				},
				purpose: {
					rules: [
						{
							required: true,
							errorMessage: '请输入收款单位账号'
						}
					]
				},
				approvalName: {
					rules: [
						{
							required: true,
							errorMessage: '请输入收款单位开户行'
						}
					]
				}
			},
			submitLoading: false,
			flowConfig: [], // 流程步骤配置
			refresh: true,
			baoXiaoType: [], // 报销说明选择框
			useOptions: [], // 款项用途
			typeOptions: [], // 款项类别
			projectName: '',
			isCcOptions: [{label: '是', value: '1'}, {label: '否', value: '0'}],
			isCarOptions: [{label: '是', value: '1'}, {label: '否', value: '0'}],
			unitCache: [], // 收款单位缓存
			selectUnit: null,
		};
	},
	onLoad({ projectId }) {
		const { userId, departId, userType } = uni.getStorageSync(this.$const.USER_INFO);
		this.formData.userId = userId;
		this.formData.deptId = departId;
		this.formData.address = projectId
		this.formData.approvalSTime = this.$dayjs().format('YYYY-MM-DD')
		getProject(projectId).then(res => {
			this.projectName = res.projectName
		})
		getProcessConfigure(8).then(res => {
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
			});
			this.flowConfig = res;
			this.setStepShow()
		});

		// 获取款项用途和款项类型
		getSystemParams('款项用途').then(res => {
			this.useOptions = res
			if (this.useOptions) {
				this.formData.approvalContent = this.useOptions[0].value
			}
		})
		getSystemParams('款项类别').then(res => {
			this.typeOptions = res
			if (this.typeOptions) {
				this.formData.leaveType = this.typeOptions[0].value
			}
		})
		this.getUnitCache()
	},
	methods: {
		// 报销金额大于等于1000，有第二步总经理
		setStepShow() {
			// this.flowConfig[1].isShow = this.formData.moneyMIN >= 1000
		},
		// 从缓存中填充已录入的收款单位信息
		matchCache({ purpose, approvalName, payCompany}) {
			this.formData.purpose = purpose
			this.formData.payCompany = payCompany
			this.formData.approvalName = approvalName
		},
		// 获取缓存中的收款信息输入建议
		getUnitCache() {
			let option = uni.getStorageSync(storageKeys.UNIT_CACHE)
			if (option !== null && option !== '') {
				this.unitCache = option
			}
			// 默认填充第一项
			if (this.unitCache.length) {
				this.matchCache(this.unitCache[0].value)
			}
		},
		// 存储用户输入的收款单位信息，提供输入建议
		saveUnitCache() {
			const {payCompany, purpose, approvalName} = this.formData
			// 名称相同采取覆盖
			const sameItem = this.unitCache.find(v => v.value.payCompany === payCompany)
			if (sameItem) {
				sameItem.value.purpose = purpose
				sameItem.value.approvalName = approvalName
			} else {
				// 新增
				this.unitCache.push({
					value: {
						payCompany,
						purpose,
						approvalName,
					},
					label: payCompany
				})
			}
			// 序列化保存
			uni.setStorageSync(storageKeys.UNIT_CACHE, this.unitCache)
		},
		submit() {
			if (this.submitLoading) {
				return;
			}
			this.$refs.form.validate().then(res => {
				if ((this.formData.leaveType === 44 || this.formData.leaveType === 46) && this.formData.detailedFile.length === 0) {
					uni.showToast({
						title:'请上传明细清单',
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
				// this.formData.approvalContent = this.formData.approvalContent[this.formData.approvalContent.length -1].value
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
				saveMoneyApply(this.formData)
					.then(() => {
						this.submitLoading = false;
						this.saveUnitCache()
						uni.hideLoading();
						uni.$emit(this.$events.UPDATE_MONEY_APPLY_STATE);
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
		upload(files) {
			this.formData.detailedFile = files
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
		leaveDaysChange(value) {
			this.formData.moneyMIN = value;
			this.calcTax()
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
		},
		setNumber(value) {
			this.formData.number = parseInt(value)
			this.calcTax()
		},
		// 计算税金
		calcTax() {
			// this.formData.payMode = ((+this.formData.number) / 100 * (+this.formData.moneyMIN)).toFixed(2)
			// 税金（自动计算公式为：款项金额/（1+税点）*税点）
			this.formData.payMode = (+this.formData.moneyMIN / ( 1 + (+this.formData.number) / 100 ) * (+this.formData.number / 100)).toFixed(2)
		},
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
