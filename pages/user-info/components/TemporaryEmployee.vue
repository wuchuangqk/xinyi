<template>
	<view class="child-page">
		<view class="tab">
			<view v-for="(item,index) in items" class="tab-item" :class="{active: curTabIndex === index}"
				@click="curTabIndex = index">
				<text>{{item}}</text>
				<view class="line"></view>
			</view>
		</view>
		<swiper :current="curTabIndex" @change="swiperChange" style="flex:1">
			<swiper-item style="overflow: auto;">
				<view class="card">
					<view class="card-title">
						<view class="left">
							<text>基础信息</text>
						</view>
					</view>
					<template v-if="isShowMoney">
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
						<text class="label">入职日期</text>
						<text class="value">{{detailData.entryTime}}</text>
					</view>
				</view>
				<view class="card">
					<view class="card-title">
						<view class="left">
							<text>身份证照片</text>
						</view>
					</view>
					<view class="detail-item">
						<text class="label">身份证正面</text>
						<image :src="identityCardPositiveImg" mode="aspectFit" @click="previewImg(identityCardPositiveImg)"></image>
					</view>
					<view class="detail-item">
						<text class="label">身份证反面</text>
						<image :src="identityCardReverseImg" mode="aspectFit" @click="previewImg(identityCardReverseImg)"></image>
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
	import AppDatePicker from '@/components/app-date-picker.vue'
	import {
		getEmpInfo,
		saveOrUpdateEmp
	} from '@/api/user.js'
	import {
		uploadHost
	} from '@/util/http.js'
	import {
		getFileInfo
	} from '@/api/system/system.js'
	import {
		validIDNumber,
		isPhone
	} from '@/util/validate.js'
	export default {
		components: {
			AppDatePicker,
		},
		props: {
			userId: {
				type: Number
			},
			isShowMoney: {
				type: Boolean
			},
			// 从哪个页面进来
			from: {
				type: String
			}
		},
		data() {
			const numReg = /^\d+(\.\d{1,2})?$/
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
					bankNumber: {
						rules: [{
							validateFunction: function(rule, value, data, callback) {
								if (value && !/^\d{15,19}$/.test(value)) {
									callback('银行卡卡号格式错误')
								}
								return true
							},
						}]
					},
					daily: {
						rules: [{
							validateFunction: function(rule, value, data, callback) {
								if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
									callback('日薪格式错误')
								}
								return true
							},
						}]
					},
					overtime: {
						rules: [{
							validateFunction: function(rule, value, data, callback) {
								if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
									callback('加班费格式错误')
								}
								return true
							},
						}]
					},
					urgentMobile: {
						rules: [{
							validateFunction: function(rule, value, data, callback) {
								if (value && !isPhone(value)) {
									callback('联系人电话格式错误')
								}
								return true
							},
						}]
					},
				},
				current: 0,
				items: [
					'基础信息',
					'永景经历',
				],
				token: null,
				curTabIndex: 0,
				identityCardPositiveImg: null, // 身份证正面图片
				identityCardReverseImg: null, // 身份证反面图片
				bankCardPositiveImg: null, // 银行卡正面图片
				bankCardReverseImg: null, // 银行卡反面图片
				detailData: {},
				experiences: []
			}
		},
		created() {
			if(this.from === 'user') {
				this.items = ['基础信息']
			}
			this.formData.entryTime = this.$dayjs().format('YYYY-MM-DD')
			this.token = uni.getStorageSync(this.$const.TOKEN)
			const userId = this.userId === null ? uni.getStorageSync(this.$const.USER_INFO).userId : this.userId
			getEmpInfo(userId).then(res => {
				this.getFilePath([
					'identityCardPositive',
					'identityCardReverse',
					'bankCardPositive',
					'bankCardReverse'
				], res)
				res.entryTime = res.entryTime === null ? '' : res.entryTime
				this.experiences = res.experience ? JSON.parse(res.experience) : []
				this.detailData = res
			})
		},
		methods: {
			radioChange() {},
			// 触发提交表单
			submit() {
				this.$refs.form.validate().then(res => {
					uni.showLoading({
						title: '正在提交',
						mask: true
					})
					if (this.formData.entryTime === '') {
						this.formData.entryTime = this.$dayjs().format('YYYY-MM-DD');
					}
					saveOrUpdateEmp(this.formData).then(() => {
						uni.showToast({
							title: '提交成功',
							icon: 'none'
						})
						uni.hideLoading()
					}).catch(err => {
						uni.showToast({
							title: '提交失败',
							icon: 'none'
						})
						uni.hideLoading()
					})
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			uploadImg(type) {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						uni.showLoading({
							title: '正在上传',
							mask: true
						})
						uni.uploadFile({
							url: uploadHost.core + '/core/file/upload?fileType=userInfo',
							filePath: res.tempFilePaths[0],
							name: 'file',
							header: {
								token: this.token
							},
							success: (res) => {
								const {
									fileId,
									webFilePath
								} = JSON.parse(res.data)
								switch (type) {
									case 1:
										this.formData.identityCardPositive = fileId
										this.identityCardPositiveImg = uploadHost.core +
											webFilePath
										break
									case 2:
										this.formData.identityCardReverse = fileId
										this.identityCardReverseImg = uploadHost.core + webFilePath
										break
									case 3:
										this.formData.bankCardPositive = fileId
										this.bankCardPositiveImg = uploadHost.core + webFilePath
										break
									case 4:
										this.formData.bankCardReverse = fileId
										this.bankCardReverseImg = uploadHost.core + webFilePath
										break
								}
							},
							fail: (res) => {
								uni.showToast({
									title: '上传失败',
									icon: 'none'
								})
							},
							complete: () => {
								uni.hideLoading()
							}
						})
					},
					fail: () => {
						uni.showToast({
							title:'未知错误',
							icon:'none'
						})
					}
				})
			},
			removeImg(type) {
				switch (type) {
					case 1:
						this.formData.identityCardPositive = ''
						this.identityCardPositiveImg = null
						break
					case 2:
						this.formData.identityCardReverse = ''
						this.identityCardReverseImg = null
						break
					case 3:
						this.formData.bankCardPositive = ''
						this.bankCardPositiveImg = null
						break
					case 4:
						this.formData.bankCardReverse = ''
						this.bankCardReverseImg = null
						break
				}
			},
			handleChange({
				currentIndex
			}) {
				this.curTabIndex = currentIndex
			},
			swiperChange(e) {
				this.curTabIndex = e.detail.current
			},
			back() {
				uni.navigateBack()
			},
			getFilePath(fieldArr, data) {
				fieldArr.forEach(field => {
					if (data[field]) {
						getFileInfo(data[field]).then(res => {
							this[field + 'Img'] = uploadHost.core + res.webFilePath
						})
					}
				})
			},
			handleChange(e) {
				this.formData.entryTime = e
			},
			/**图片预览
			 * @param {Object} imgSrc
			 */
			previewImg(imgSrc){ 
				uni.previewImage({
					urls: [imgSrc],
					current: 0
				})
			}
		}
	}
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
			bottom: -5px
		}
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
	.uni-image {
		width: 280px;
		height: 200px;
	}
	.card .card-title {
		margin-bottom: 10px;
	}
</style>
