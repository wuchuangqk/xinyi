<template>
	<view class="child-page">
		<view class="tab">
			<view v-for="(item, index) in items" class="tab-item" :class="{ active: curTabIndex === index }" @click="curTabIndex = index">
				<text>{{ item }}</text>
				<view class="line"></view>
			</view>
		</view>
		<swiper :current="curTabIndex" @change="swiperChange" style="flex:1">
			<swiper-item v-if="isShowBasicInfo" style="overflow: auto;">
				<view class="card">
					<view class="card-title">
						<view class="left">
							<text>基础信息</text>
						</view>
					</view>
					<view class="detail-item">
						<text class="label">身份证号码</text>
						<text class="value">{{detailData.identityCards}}</text>
					</view>
					<view class="detail-item">
						<text class="label">民族</text>
						<text class="value">{{detailData.nation}}</text>
					</view>
					<view class="detail-item">
						<text class="label">学历</text>
						<text class="value">{{detailData.education}}</text>
					</view>
					<view class="detail-item">
						<text class="label">婚姻</text>
						<text class="value">{{detailData.marry}}</text>
					</view>
					<view class="detail-item">
						<text class="label">毕业院校</text>
						<text class="value">{{detailData.graduateSchool}}</text>
					</view>
					<view class="detail-item">
						<text class="label">专业</text>
						<text class="value">{{detailData.major}}</text>
					</view>
					<view class="detail-item">
						<text class="label">户籍所在地</text>
						<text class="value">{{detailData.domicilePlace}}</text>
					</view>
					<view class="detail-item">
						<text class="label">现住地址</text>
						<text class="value">{{detailData.currentResidence}}</text>
					</view>
					<template v-if="isShowMoney">
						<view class="detail-item">
							<text class="label">试用期薪资</text>
							<text class="value">{{detailData.probationPrice}}</text>
						</view>
						<view class="detail-item">
							<text class="label">转正薪资</text>
							<text class="value">{{detailData.formalPrice}}</text>
						</view>
						<view class="detail-item">
							<text class="label">日薪</text>
							<text class="value">{{detailData.daily}}</text>
						</view>
						<view class="detail-item">
							<text class="label">加班费</text>
							<text class="value">{{detailData.overtime}}</text>
						</view>
					</template>
					<view class="detail-item">
						<text class="label">紧急联系人</text>
						<text class="value">{{detailData.urgentContacts}}</text>
					</view>
					<view class="detail-item">
						<text class="label">联系人电话</text>
						<text class="value">{{detailData.urgentMobile}}</text>
					</view>
					<view class="detail-item">
						<text class="label">健康状况</text>
						<text class="value">{{detailData.healthy}}</text>
					</view>
					<view class="detail-item">
						<text class="label">入职日期</text>
						<text class="value">{{detailData.entryTime}}</text>
					</view>
				</view>
			</swiper-item>
			<swiper-item v-if="from === 'dept'" style="overflow: auto;">
				<view v-for="(item,index) in experiences" class="card">
					<view class="card-title">
						<view class="left">
							<text>经历</text>
						</view>
					</view>
					{{item.text}}
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import AppSelect from '@/components/app-select.vue';
import AppDatePicker from '@/components/app-date-picker.vue';
import AppRadio from '@/components/app-radio.vue';
import { getEmpInfo, saveOrUpdateEmp } from '@/api/user.js';
import { getFileInfo } from '@/api/system/file.js';
import { uploadHost } from '@/util/http.js';
import FileViewer from '@/components/file-viewer.vue';
import { validIDNumber, isPhone } from '@/util/validate.js';
export default {
	components: {
		AppSelect,
		AppDatePicker,
		AppRadio,
		FileViewer
	},
	props:{
		isShowBasicInfo: {
			type: Boolean
		},
		isShowMoney: {
			type: Boolean,
		},
		userId: {
			type: Number
		},
		// 从哪个页面进来
		from: {
			type: String
		}
	},
	data() {
		const numReg = /^\d+(\.\d{1,2})?$/;
		return {
			formData: {
				id: null,
				bankCardPositive: null, // 银行卡正面
				bankCardReverse: null, // 银行卡反面
				bankDeposit: null, // 银行卡开户行
				bankNumber: null, // 银行卡卡号
				currentResidence: null, //现居地
				daily: null, // 日薪
				domicilePlace: null, // 户籍所在地
				education: '', // 学历(0:小学,1:初中,2:高中,3:大专,4:本科,5:研究生,6:博士生)
				educationHistory: null, // 教育经历
				entryTime: '', // 入职时间
				familyMembers: null, // 家庭成员
				formalPrice: '', // 正式薪资
				graduateSchool: null, // 毕业学校
				healthy: null, // 健康状况
				identityCardPositive: null, // 身份证正面
				identityCardReverse: null, // 身份证反面
				identityCards: '', // 身份证号码
				major: null, // 专业
				marry: '', // 婚姻(0:未婚,1:已婚,2:丧偶)
				nation: null, // 民族
				overtime: null, // 加班费
				probationPrice: '', // 试用薪资
				urgentContacts: null, // 紧急联系人
				urgentMobile: '', // 紧急联系人电话
				userId: null, // 用户Id
				workHistory: null, // 工作经历
				labourFile: '', // 劳务证书
				resumeFile: '' // 简历和资质证书
			},
			rules: {
				identityCards: {
					rules: [
						{
							validateFunction: function(rule, value, data, callback) {
								if (value && !validIDNumber(value)) {
									callback('身份证号格式错误');
								}
								return true;
							}
						}
					]
				},
				probationPrice: {
					rules: [
						{
							validateFunction: function(rule, value, data, callback) {
								if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
									callback('试用期薪资格式错误');
								}
								return true;
							}
						}
					]
				},
				formalPrice: {
					rules: [
						{
							validateFunction: function(rule, value, data, callback) {
								if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
									callback('转正薪资格式错误');
								}
								return true;
							}
						}
					]
				},
				urgentMobile: {
					rules: [
						{
							validateFunction: function(rule, value, data, callback) {
								if (value && !isPhone(value)) {
									callback('联系电话格式错误');
								}
								return true;
							}
						}
					]
				}
			},
			index: 0,
			selectOptions: {
				// 婚姻状况
				marryOptions: [
					{
						value: '',
						label: '请选择'
					},
					{
						value: 0,
						label: '未婚'
					},
					{
						value: 1,
						label: '已婚'
					},
					{
						value: 2,
						label: '丧偶'
					}
				],
				// 学历
				educationOptions: [
					{
						value: '',
						label: '请选择'
					},
					{
						value: 0,
						label: '小学'
					},
					{
						value: 1,
						label: '初中'
					},
					{
						value: 2,
						label: '高中'
					},
					{
						value: 3,
						label: '大专'
					},
					{
						value: 4,
						label: '本科'
					},
					{
						value: 5,
						label: '研究生'
					},
					{
						value: 6,
						label: '博士生'
					}
				],
				// 是否毕业
				isGraduateOptions: [
					{
						value: '1',
						label: '是'
					},
					{
						value: '0',
						label: '否'
					}
				]
			},
			current: 0,
			items: ['基础信息', '永景经历'],
			token: null,
			labourFileFileList: [],
			resumeFileFileList: [],
			labourFile: [],
			resumeFile: [],
			curTabIndex: 0,
			// 教育经历
			educationHistory: [],
			// 工作经历
			workHistory: [],
			// 家庭成员
			familyMembers: [],
			index: 0,
			current: 0,
			imageValue: [],
			detailData: {},
			experiences: []
		};
	},
	created() {
		this.formData.entryTime = this.$dayjs().format('YYYY-MM-DD');
		// 从部门人员进来，班组长和临时工能看基础信息和永景经历，其他身份只允许看永景经历
		this.items = this.isShowBasicInfo ? ['基础信息', '永景经历'] : ['永景经历']
		// 从我的页面进来只能看到基础信息
		if(this.from === 'user') {
			this.items = ['基础信息']
		}
	},
	mounted() {
		this.token = uni.getStorageSync(this.$const.TOKEN);
		const userId = this.userId === null ? uni.getStorageSync(this.$const.USER_INFO).userId : this.userId
		getEmpInfo(userId)
			.then(res => {
				const { educationHistory, workHistory, familyMembers, entryTime, education, marry } = res;
				res.entryTime = entryTime === null ? '' : entryTime;
				res.education = education === null ? '' : this.selectOptions.educationOptions.find(v => v.value === education).label
				res.marry = marry === null ? '' : this.selectOptions.marryOptions.find(v => v.value === marry).label
				this.resumeFile = res.resumeFile === null || res.resumeFile === '' ? [] : res.resumeFile.split(',');
				this.labourFile = res.labourFile === null || res.labourFile === '' ? [] : res.labourFile.split(',');
				this.experiences = res.experience ? JSON.parse(res.experience) : [];
				this.detailData = res;
			})
			.catch(err => {
				uni.showToast({
					title: err,
					icon: 'none'
				});
			});
	},
	methods: {
		batchQuery(fileIds) {
			fileIds.split(',').forEach(val => {
				getFileInfo(val).then(res => {
					this.resumeFileFileList.push(res);
				});
			});
		},
		radioChange() {},
		// 触发提交表单
		submit() {
			this.$refs.form
				.validate()
				.then(valid => {
					if (!this.checkData()) {
						return;
					}
					uni.showLoading({
						title: '正在提交',
						mask: true
					});
					this.formData.labourFile = this.labourFileFileList.map(v => v.fileId).join(',');
					this.formData.resumeFile = this.resumeFileFileList.map(v => v.fileId).join(',');
					this.formData.educationHistory = JSON.stringify(this.educationHistory);
					this.formData.workHistory = JSON.stringify(this.workHistory);
					this.formData.familyMembers = JSON.stringify(this.familyMembers);
					this.formData.labourFile = this.labourFile.join(',');
					this.formData.resumeFile = this.resumeFile.join(',');
					if (this.formData.entryTime === '') {
						this.formData.entryTime = this.$dayjs().format('YYYY-MM-DD');
					}
					saveOrUpdateEmp(this.formData)
						.then(() => {
							uni.showToast({
								title: '提交成功',
								icon: 'none'
							});
							uni.hideLoading();
						})
						.catch(err => {
							uni.showToast({
								title: '提交失败',
								icon: 'none'
							});
							uni.hideLoading();
						});
				})
				.catch(err => {
					console.log('表单错误信息：', err);
				});
		},
		addEdu() {
			this.educationHistory.push({
				key: new Date().getTime(),
				date: null, // 起止日期
				school: null, // 就读学校
				major: null, // 专业
				isGraduate: '1' // 是否毕业
			});
		},
		removeEdu(index) {
			this.educationHistory.splice(index, 1);
		},
		addWork() {
			this.workHistory.push({
				key: new Date().getTime(),
				date: null, // 起止日期
				company: null, // 工作单位
				position: null, // 职位
				reason: null // 离职原因
			});
		},
		removeWork(index) {
			this.workHistory.splice(index, 1);
		},
		addFamily() {
			this.familyMembers.push({
				key: new Date().getTime(),
				name: null, // 姓名
				relation: null, // 关系
				age: null // 年龄
			});
		},
		removeFamily(index) {
			this.familyMembers.splice(index, 1);
		},
		checkData() {
			let notComplete =
				this.educationHistory.filter(v => {
					return !v.date || !v.school || !v.major;
				}).length > 0;
			if (notComplete) {
				uni.showToast({
					title: '请填写完整的教育经历',
					icon: 'none'
				});
				return !notComplete;
			}
			notComplete =
				this.workHistory.filter(v => {
					return !v.date || !v.company || !v.position || !v.reason;
				}).length > 0;
			if (notComplete) {
				uni.showToast({
					title: '请填写完整的工作经历',
					icon: 'none'
				});
				return !notComplete;
			}
			notComplete =
				this.familyMembers.filter(v => {
					return !v.name || !v.relation || !v.age;
				}).length > 0;
			if (notComplete) {
				uni.showToast({
					title: '请填写完整的家庭成员',
					icon: 'none'
				});
				return !notComplete;
			}
			return true;
		},
		back() {
			uni.navigateBack();
		},
		swiperChange(e) {
			this.curTabIndex = e.detail.current;
		},
		// 劳保证书
		upload1(fileIds) {
			this.labourFile = fileIds;
		},
		// 资质和简历证书
		upload2(fileIds) {
			this.resumeFile = fileIds;
		},
		handleChange(e) {
			this.formData.entryTime = e;
		}
	}
};
</script>

<style scoped lang="scss">
	.child-page {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
.remove {
	color: red;
}

.tab {
	display: flex;
	justify-content: space-evenly;
	background: #f2f1f6;
	padding: 10px 0 20px 0;

	.tab-item {
		flex: 1;
		position: relative;
		color: #8c8c8c;
		text-align: center;
		font-size: 15px;

		&.active {
			color: #1989fa;

			.line {
				display: block;
			}
		}
	}

	.line {
		display: none;
		position: absolute;
		background-color: #1989fa;
		left: 50%;
		transform: translateX(-50%);
		width: 25%;
		height: 3px;
		border-radius: 2px;
		bottom: -5px;
	}
}

.btn {
	// margin: 20px 10px;
	margin: 0 10px;
	background-color: #1989fa;
	color: white;
	border-radius: 25px;
	font-size: 15px;
	border: 1px solid #48a3ff;

	&::after {
		border: none;
	}
}

.card-title {
	.right {
		color: #b1b1b1;
	}
}
	.card .card-title {
		margin-bottom: 10px;
	}
	.detail-item {
		padding: 10px 0;
		font-size: 14px;
		color: #333333;
		display: flex;
		line-height: 36px;
		.label {
			width: 90px;
			flex-shrink: 0;
		}
		.value {
			flex:1;
		}
	}
</style>
