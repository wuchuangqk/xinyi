<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<uni-forms ref="form" :modelValue="formData" :rules="rules" :labelWidth="120" :border="true" class="form">
			<view class="card">
				<uni-forms-item label="项目名称" name="address">
					<uni-easyinput v-model="projectName" disabled :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item label="项目负责人" name="userId" :required="true">
					<app-select v-if="dutyUserOption.length" v-model="formData.userId" :selectData="dutyUserOption"></app-select>
				</uni-forms-item>
				<uni-forms-item label="公司名称" name="invoicingId" :required="true">
					<app-select v-if="companyOption.length" v-model="formData.invoicingId" @change="invoicingIdChange" :selectData="companyOption"></app-select>
				</uni-forms-item>
				<uni-forms-item label="纳税人识别号" name="address">
					<uni-easyinput v-model="companyInfo.sn" disabled :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item label="地址电话" name="address">
					<text>{{ companyInfo.address }}</text>
				</uni-forms-item>
				<uni-forms-item label="开户行及账号" name="address">
					<text>{{ companyInfo.bankName }}</text>
				</uni-forms-item>
				<uni-forms-item label="开票类型" name="type">
					<app-select v-if="invoiceOption.length" v-model="formData.type" :selectData="invoiceOption"></app-select>
				</uni-forms-item>
				<uni-forms-item style="border-top: none;" label="开票日期" name="days">
					<uni-datetime-picker
						type="date"
						:value="formData.days"
						:border="false"
						:showClear="false"
						@change="setDateValue"
					></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item label="开票含税金额" name="hasTax" :required="true">
					<uni-number-box :value="formData.hasTax" :min="0" :max="99999999" @change="taxChange"></uni-number-box>
				</uni-forms-item>
				<uni-forms-item label="税点(%)" name="point">
					<uni-number-box :value="formData.point" :min="0" :max="99999999" :is-integer="true" @change="setNumber"></uni-number-box>
				</uni-forms-item>
				<uni-forms-item label="开票不含税金额" name="tax">
					<!-- <uni-number-box :value="formData.tax" :min="0" :max="99999999" @change="taxChange"></uni-number-box> -->
					<uni-easyinput v-model="formData.tax" disabled :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item label="税金(元)" name="price">
					<uni-easyinput v-model="formData.price" disabled :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item v-if="unitCache.length" label="已录入的客户名称" name="approvalContent">
					<app-select v-model="selectUnit" @change="matchCache" :selectData="unitCache"></app-select>
				</uni-forms-item>
				<uni-forms-item label="客户名称" name="customer" :required="true">
					<uni-easyinput v-model="formData.customer" placeholder="请输入客户名称" :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item label="客户纳税人识别号" name="taxNumber">
					<uni-easyinput v-model="formData.taxNumber" placeholder="请输入客户纳税人识别号" :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item label="客户地址电话" name="addressMobile">
					<uni-easyinput v-model="formData.addressMobile" placeholder="请输入客户地址电话" :inputBorder="false" />
				</uni-forms-item>
				<uni-forms-item label="客户开户行及账号" name="bankNameNumber">
					<uni-easyinput v-model="formData.bankNameNumber" placeholder="请输入客户开户行及账号" :inputBorder="false" />
				</uni-forms-item>
			</view>

		</uni-forms>

		<view><button class="btn" :loading="submitLoading" @click="submit">提交</button></view>
		<view style="height: 8px;"></view>
	</view>
</template>

<script>
import { getRiseSelect, saveInvoicing } from '@/api/project/invoice.js';
import AppSelect from '@/components/app-select.vue';
import { getById as getProject } from '@/api/project/basicInfo.js';
import {storageKeys} from '@/util/constants.js'

export default {
	components: { AppSelect },
	data() {
		return {
			formData: {
				customer: null, // 客户名称
				days: null, // 开票日期
				fileCode: '', // 票据
				id: null,
				invoicingId: null, // 所属抬头
				point: 0, // 税点
				projectId: null, // 所属项目
				hasTax: 0, // 开票含税金额(元)
				tax: 0, // 开票不含税金额(元)
				type: 0, // 开票类型 0-专票 1-普票
				userId: null, // 负责人
				price: 0.00,
				addressMobile: '', // 客户地址电话
				bankNameNumber: '', // 客户开户行及账号
				taxNumber: '', // 客户纳税人识别号
			},
			show: false,
			rules: {
				userId: {
					rules: [
						{
							required: true,
							errorMessage: '请选择项目负责人'
						},
					]
				},
				invoicingId: {
					rules: [
						{
							required: true,
							errorMessage: '请选择公司名称'
						}
					]
				},
				hasTax: {
					rules: [
						{
							required: true,
							errorMessage: '请输入开票含税金额'
						}
					]
				},
				customer: {
					rules: [
						{
							required: true,
							errorMessage: '请输入客户名称'
						}
					]
				}
			},
			submitLoading: false,
			projectName: '',
			unitCache: [], // 收款单位缓存
			dutyUserOption: [], // 项目负责人
			companyOption: [], // 公司
			invoiceOption: [], // 开票类型
			customNameOption: [], // 客户名称
			companyInfo: {},
			selectUnit: null,
		};
	},
	onLoad({ projectId }) {
		this.formData.projectId = projectId
		this.formData.days = this.$dayjs().format('YYYY-MM-DD')
		// 获取项目名称和项目负责人
		getProject(projectId).then(res => {
			this.projectName = res.projectName
			const { userNames, userIds } = res.xmProjectCoordinateForms.find(v => v.coordinateCode === 'XMFZR')
			const idArr = userIds.split(',')
			const nameArr = userNames.split(',').map(v => {
				return v.split('-')[0]
			})
			this.dutyUserOption = idArr.map((val, index) => {
				return {
					label: nameArr[index],
					value: +val
				}
			})
			if (this.dutyUserOption.length) {
				this.formData.userId = this.dutyUserOption[0].value
			}
		})
		// 获取公司名称下拉框
		getRiseSelect().then(res => {
			this.companyOption = (res.records || []).map(v => {
				v.address = v.address + ' ' + v.mobile
				v.bankName = v.bankName + ' ' + v.bankNumber
				v.label = v.title
				v.value = v.id
				return v
			})
			if (this.companyOption.length) {
				if (this.formData.invoicingId === null) {
					this.formData.invoicingId = this.companyOption[0].id
				}
				this.invoicingIdChange()
			}
		})
		this.invoiceOption = [
			{ label: '专票', value: 0 },
			{ label: '普票', value: 1 },
		]
		this.getUnitCache()
	},
	methods: {
		// 从缓存中填充已录入的收款单位信息
		matchCache(value) {
			this.formData.customer = value
			const temp = this.unitCache.find(v => v.value === value)
			if (temp && temp.addressMobile !== undefined) {
				this.formData.addressMobile = temp.addressMobile
				this.formData.bankNameNumber = temp.bankNameNumber
				this.formData.taxNumber = temp.taxNumber
			}
		},
		// 获取缓存中的收款信息输入建议
		getUnitCache() {
			let option = uni.getStorageSync(storageKeys.CUSTOM_NAME_CACHE)
			if (option !== null && option !== '') {
				this.unitCache = option
			}
			if (this.unitCache.length) {
				this.matchCache(this.unitCache[0].value)
			}
		},
		// 存储用户输入的收款单位信息，提供输入建议
		saveUnitCache() {
			const {customer, addressMobile, bankNameNumber, taxNumber} = this.formData
			// 名称相同采取覆盖
			const sameItem = this.unitCache.find(v => v.value === customer)
			if (sameItem) {
				sameItem.addressMobile = addressMobile
				sameItem.bankNameNumber = bankNameNumber
				sameItem.taxNumber = taxNumber
			} else {
				// 新增
				this.unitCache.push({
					value: customer,
					label: customer,
					addressMobile,
					bankNameNumber,
					taxNumber,
				})
			}
			// 序列化保存
			uni.setStorageSync(storageKeys.CUSTOM_NAME_CACHE, this.unitCache)
		},
		submit() {
			if (this.submitLoading) {
				return;
			}
			this.$refs.form.validate().then(res => {
				this.taxChange(this.formData.hasTax)
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
				saveInvoicing(this.formData)
					.then(() => {
						this.submitLoading = false;
						this.saveUnitCache()
						uni.hideLoading();
						uni.$emit(this.$events.UPDATE_INVOICE_STATE);
						uni.navigateBack();
					})
					.catch(err => {
						console.log(err)
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
		setDateValue(value) {
			this.formData.days = value;
		},
		/**
		 * 根据请假天数，计算请假结束时间
		 */
		taxChange(value) {
			this.formData.hasTax = value;
			this.calcTax()
		},
		setNumber(value) {
			this.formData.point = parseInt(value)
			this.calcTax()
		},
		// 计算税金
		calcTax() {
			// 开票不含税金额（自动计算：公式为开票含税金额/（1+税点））
			// 税金（自动计算：公式为开票不含税金额*税点）
			this.formData.tax = (+this.formData.hasTax / (1 + (+this.formData.point) / 100)).toFixed(2)
			this.formData.price = (+this.formData.point / 100 * (+this.formData.tax)).toFixed(2)
			// this.formData.price = ((+this.formData.point) / 100 * (+this.formData.tax)).toFixed(2)
		},
		invoicingIdChange() {
			const temp = this.companyOption.find(v => v.id === this.formData.invoicingId)
			if (temp) {
				this.companyInfo = temp
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
