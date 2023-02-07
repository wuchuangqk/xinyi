<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<view class="detail-item">
				<text class="label">申请人</text>
				<text class="value">{{ detailData.userName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">申请时间</text>
				<text class="value">{{ detailData.createTime }}</text>
			</view>
			<view class="detail-item">
				<text class="label">所属部门</text>
				<text class="value">{{ detailData.deptName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">报销时间</text>
				<text class="value">{{ detailData.approvalSTime }}</text>
			</view>
			<view class="detail-item">
				<text class="label">报销项目</text>
				<text class="value">{{ detailData.addressText }}</text>
			</view>
			<view class="detail-item">
				<text class="label">报销说明</text>
				<text class="value">{{ detailData.approvalContent }}</text>
			</view>
			<view class="detail-item">
				<text class="label">报销金额(小写)</text>
				<text class="value">{{ detailData.moneyMIN }}</text>
			</view>
			<view class="detail-item">
				<text class="label">报销金额(大写)</text>
				<text class="value">{{ detailData.moneyMAX }}</text>
			</view>
			<view class="detail-item">
				<text class="label">费用明细</text>
				<text class="value">{{ detailData.remarks }}</text>
			</view>
		</view>
		<view class="card">
			<view class="card-title">
				<view class="left"><text>报销凭证</text></view>
			</view>
			<view>
				<view v-if="detailData.invoiceFile && detailData.invoiceFile.length" class="img-item">
					<view class="label">发票收据</view>
					<file-viewer platform="oa" :files="detailData.invoiceFile || []"></file-viewer>
				</view>
				<view v-if="detailData.payingFile && detailData.payingFile.length" class="img-item">
					<view class="label">支付凭证</view>
					<file-viewer platform="oa" :files="detailData.payingFile || []"></file-viewer>
				</view>
				<view v-if="detailData.detailedFile && detailData.detailedFile.length" class="img-item">
					<view class="label">清单</view>
					<file-viewer platform="oa" :files="detailData.detailedFile || []"></file-viewer>
				</view>
			</view>
		</view>
		<view v-if="detailData.paymentFiles && detailData.paymentFiles.length" class="card">
			<view class="card-title">
				<view class="left"><text>付款凭证</text></view>
			</view>
			<view><file-viewer platform="oa" :files="detailData.paymentFiles || []"></file-viewer></view>
		</view>

		<view class="card" :style="{ 'margin-bottom': type === 0 ? '0' : '50px' }">
			<view class="card-title">
				<view class="left"><text>审批流程</text></view>
			</view>
			<approval-time-line :flowList="flowList"></approval-time-line>
		</view>

		<!-- <view v-if="type === 1 || (type === 2 && isCanEditComment)" style="height: 220px;"></view> -->
		<!-- type:0=只查看，1=审批，2=修改审批意见 -->
		<view v-if="type === 1" id="approval" class="card approval approval1" :style="{bottom: isExpend ? 0 : -shinkBottom + 'px'}" :class="{ expend: isExpend }" ref="approval">
			<view class="card-title">
				<view class="left"><text>审批</text></view>
				<view class="right"><uni-icons @click="openPopup()" type="chat" size="22" color="#666"></uni-icons></view>
				<uni-icons @click="doShink('#approval')" :type="isExpend ? 'arrowdown' : 'arrowup'" size="20" color="#666" class="arr-btn"></uni-icons>
			</view>
			<uni-forms ref="form" :modelValue="formData" :rules="rules" :labelWidth="80" :border="true">
				<uni-forms-item label="审批选项" name="type"><app-radio v-model="formData.type" :selectData="typeData"></app-radio></uni-forms-item>
				<!-- <uni-forms-item v-show="isLastStep && formData.type !== '1'" label="是否抄送出纳" name="type" :labelWidth="100">
					<checkbox-group @change="getIsCopy">
							<label>
									<checkbox value="1" />
							</label>
					</checkbox-group>
				</uni-forms-item> -->

				<uni-forms-item v-if="formData.type === '1' && rejectBackList.length" label="退回到" name="type">
					<app-select v-model="rejectBackTo" :selectData="rejectBackList"></app-select>
				</uni-forms-item>
				<uni-forms-item label="审批意见" name="type" :required="true">
					<uni-easyinput type="textarea" autoHeight v-model="formData.comment" placeholder="请输入审批意见" :inputBorder="false" />
				</uni-forms-item>
			</uni-forms>
			<!-- 没有勾选抄送给出纳，是流程最后一步，不是退回 -->
			<!-- <view v-show="!isCopy && isLastStep && formData.type !== '1'">
				<view class="tip">请上传付款凭证<text class="sub-tip">(在未勾选抄送给出纳时，付款凭证为必填项)</text></view>
				<scroll-view :scroll-y="true" style="height: 180px;">
					<file-viewer mode="upload" :files="[]" :limit="99" platform="oa" fileType="expenseVoucher" @file-change="upload"></file-viewer>
				</scroll-view>
			</view> -->
			<view class="btn-wrap">
				<view v-if="formData.type === '0'" class="primary btn" @click="submit">通过</view>
				<view v-if="formData.type === '1'" class="secondary btn" @click="reject">退回</view>
			</view>
		</view>

		<!-- 修改审批意见 -->
		<view v-if="type === 2" class="card approval2" :class="{ approval: isCanEditComment, expend: isExpend }">
			<view class="card-title">
				<view class="left">
					<text>{{ isCanEditComment ? '修改审批意见' : '我的审批意见' }}</text>
				</view>
				<view v-if="isCanEditComment" class="right"><uni-icons @click="openPopup()" type="chat" size="22" color="#666"></uni-icons></view>
				<uni-icons v-if="isCanEditComment" @click="isExpend = !isExpend" :type="isExpend ? 'arrowdown' : 'arrowup'" size="20" color="#666" class="arr-btn"></uni-icons>
			</view>
			<uni-forms v-if="isCanEditComment" ref="form" :modelValue="formData" :rules="rules" :labelWidth="80" :border="true">
				<uni-forms-item label="审批意见" name="type">
					<uni-easyinput type="textarea" autoHeight v-model="formData.comment" placeholder="请输入审批意见" :inputBorder="false" />
				</uni-forms-item>
			</uni-forms>
			<view v-else>{{ formData.comment }}</view>
			<view v-if="isCanEditComment" class="btn-wrap"><view v-if="formData.type === '0'" class="primary btn" @click="doEdit">保存</view></view>
		</view>

		<!-- 上传付款凭证 -->
		<view v-if="type === 4" class="card approval upload" :class="{ expend: isExpend }">
			<view class="card-title">
				<view class="left"><text>上传付款凭证</text></view>
				<uni-icons @click="isExpend = !isExpend" :type="isExpend ? 'arrowdown' : 'arrowup'" size="20" color="#666" class="arr-btn"></uni-icons>
			</view>
			<view>
				<view class="tip">请上传付款凭证</view>
				<scroll-view :scroll-y="true" style="height: 180px;">
					<file-viewer mode="upload" :files="[]" :limit="99" platform="oa" fileType="expenseVoucher" @file-change="upload"></file-viewer>
				</scroll-view>
				<view class="btn-wrap"><view class="primary btn" @click="doUpload">保存</view></view>
			</view>
		</view>
		<view style="height: 8px;"></view>
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="picker-view-wrap" ref="picker">
				<view class="picker-header">
					<text @click="closePopup">取消</text>
					<text class="complete" @click="completeSelect">完成</text>
				</view>
				<picker-view :indicator-style="indicatorStyle" :value="opinionValue" @change="pickerChange" class="picker-view">
					<picker-view-column>
						<view class="picker-item" v-for="(item, index) in opinionList" :key="index">{{ item.text }}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import FileViewer from '@/components/file-viewer.vue';
import ApprovalTimeLine from './components/approval-timeline.vue';
import { getClaimInfo, accept, rollback, flowList as getFlowList, returnUserList, updateDone, uploadPayment, getExpenseType,
 queryAllLevelTwoParamMap, getProjectClaim} from '@/api/office/claim.js';
import { getById } from '@/api/user.js';
import AppRadio from '@/components/app-radio.vue';
import { uploadHost } from '@/util/http.js';
import AppSelect from '@/components/app-select.vue';
import { getDeptInfo } from '@/api/system/dept';
import { getById as getProject } from '@/api/project/basicInfo.js';
import dataMixin from './mixin/dataMixin.js'

export default {
	components: {
		FileViewer,
		ApprovalTimeLine,
		AppRadio,
		AppSelect
	},
	mixins: [dataMixin],
	data() {
		return {
			detailData: {},
			approvalId: null,
			type: null,
			formData: {
				type: '0', // 审批选项: 0=通过，1=退回
				comment: '', // 审批意见
				signIndex: null,
				signId: null,
				approvalId: null
			},
			typeData: [
				{
					value: '0',
					label: '通过'
				},
				{
					value: '1',
					label: '退回'
				}
			],
			rules: {},
			defaultImg: '/static/img/default.jpg',
			flowList: [],
			opinionList: [{ text: '同意', value: '同意' }, { text: '已处理', value: '已处理' }, { text: '请领导审批', value: '请领导审批' }], // 审批意见快捷模板
			opinionValue: [0],
			indicatorStyle: `height: 34px;`,
			rejectBackList: [], // 可以退回的步骤列表
			rejectBackTo: null, // 退回的步骤
			userId: null,
			isCanEditComment: true,
			signId: null,
			isExpend: true,
			isCc: false, // 从待办【请假抄送】进来的会有这个参数
			isDoneHandle: false, // 抄送或确认后，状态改成true
			isApplyUserTemp: false, // 是否是临时工
			selectedUsers: [],
			deptName: null, // 所属部门
			pageParams: {}, // 页面参数
			uploadData: {
				approvalId: null,
				paymentFiles: []
			},
			isCopy: false, // 是否抄送给出纳
			shinkBottom: 0,
			isLastStep: false, // 是否是最后一步
			isForProject: false,
		};
	},
	onLoad(params) {
		this.pageParams = params;
	},
	onReady() {
		const { approvalId, signIndex, type, isCc, isForProject } = this.pageParams;
		if (isForProject !== undefined && isForProject !== '') {
			this.isForProject = true
		}
		this.approvalId = approvalId;
		this.type = +type;
		this.formData.approvalId = approvalId;
		this.uploadData.approvalId = approvalId;
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		const method = this.isForProject ? getProjectClaim : getClaimInfo
		method(approvalId).then(res => {
			res.addressText = res.address
			res.approvalSTime = this.$dayjs(res.approvalSTime).format('YYYY-MM-DD');
			res.moneyMIN = res.moneyMIN.toFixed(2)
			this.detailData = res;
			this.formData.signIndex = res.signIndex;

			// 获取报销说明
			if (this.isForProject) {
				// 项目报销
				queryAllLevelTwoParamMap().then(res => {
					const arr = res || []
					const temp = arr.find(val => val.pid === +this.detailData.approvalContent)
					this.detailData.approvalContent = temp ? temp.pname : this.detailData.approvalContent
				});
				// 格式化报销项目
				getProject(+this.detailData.address).then(res => {
					this.detailData.addressText = res.projectName
				})
			} else {
				const temp = this.approvalContentOptions.find(v => v.value === +this.detailData.approvalContent)
				if (temp !== undefined) { 
					this.detailData.approvalContent = temp.label
				} else {
					getExpenseType().then(res => {
						const arr = [];
						let index = 0;
						Object.keys(res).forEach(key => {
							const itemsObj = res[key];
							const children = [];
							Object.keys(itemsObj).forEach(itemKey => {
								children.push({
									label: itemsObj[itemKey],
									value: itemKey
								});
							});
							arr.push({
								label: key,
								value: index++,
								children: children
							});
						});
						let isFind = false;
						for (let i = 0; i < arr.length; i++) {
							for (let j = 0; j < arr[i].children.length; j++) {
								if (arr[i].children[j].value === this.detailData.approvalContent) {
									this.detailData.approvalContent = arr[i].children[j].label;
									isFind = true;
									break;
								}
							}
							if (isFind) {
								break;
							}
						}
					});
				}
			}

			getFlowList(approvalId).then(res => {
				const temp = res.result.map(v => {
					if (+v.isReturn === 1) {
						v.state = 4;
					} else if (+v.signed === 1) {
						v.state = 2;
					} else if (+v.signIndex === this.formData.signIndex) {
						v.state = 1;
						v.created = '审批中';
					} else {
						v.state = 0;
						v.created = '待审批';
					}
					v.headPhoto = null;
					if (this.formData.signIndex === v.signIndex) {
						this.formData.signId = v.signId;
					}
					return v;
				});
				temp.forEach((user, index) => {
					getById(user.creator).then(res => {
						if (res.headPhotoFile) {
							user.headPhoto = /^http(s)\/\//.test(res.headPhotoFile.webFilePath) ? res.headPhotoFile.webFilePath : uploadHost.core + res.headPhotoFile.webFilePath;
						} else {
							user.headPhoto = this.defaultImg;
						}
					});
					// 已办审批，当下面的人没有审批时，可以修改审批意见
					if (this.type === 2 && user.creator === this.userId) {
						this.formData.comment = user.comments;
						this.signId = user.signId;
						const next = this.flowList[index + 1];
						if (next && next.signed) {
							this.isCanEditComment = false;
						}
					}
				});
				this.flowList = temp;
				// 最后一步流程
				if (this.formData.signIndex === this.flowList[this.flowList.length-1].signIndex) {
					this.isLastStep = true
				}
			});
			uni.$emit(this.$events.UPDATE_TODO_STATE);
		});

		// 获取退回名单
		returnUserList(approvalId).then(res => {
			res.forEach(v => {
				v.label = v.displayName;
				v.value = v.signIndex;
			});
			res.unshift({
				signId: 0,
				signIndex: 0,
				label: '申请人',
				value: 0
			});
			this.rejectBackTo = 0;
			this.rejectBackList = res;
		});

		// 监听选择用户
		uni.$on(this.$events.UPDATE_COPY_USERS, users => {
			this.selectedUsers = users;
		});
	},
	methods: {
		getIsCopy(e) {
			this.isCopy = e.detail.value.length !== 0
		},
		swiperChange(e) {
			this.activeTabIndex = e.detail.current;
		},
		goReadRecords() {
			uni.navigateTo({
				url: `/pages/common/ReadRecords?type=2&id=` + this.detailData.noticeId
			});
		},
		// 通过
		submit() {
			if (this.formData.comment.trim().length === 0) {
				uni.showToast({
					title: '请填写审批意见',
					icon: 'none'
				});
				return;
			}
			// 判断是否上传付款凭证
			// if (this.isLastStep && !this.isCopy && this.uploadData.paymentFiles.length === 0) {
			// 	uni.showToast({
			// 		title: '请至少上传一张付款凭证',
			// 		icon: 'none'
			// 	});
			// 	return;
			// }
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			const params = {
				approvalSign: {
					approvalId: this.formData.approvalId,
					comments: this.formData.comment,
					signIndex: this.formData.signIndex
				},
				ids: [],
				userCc: this.selectedUsers.map(v => v.value).join(','),
				isCc: this.isLastStep ? 1 : 0, // 是否抄送给出纳(只有在最后一步且勾选抄送的情况下，才传1)
			}
			// 抄送只需提交，不抄送需同时上传付款凭证
			// 默认是只审批
			let arr = [accept(params)]
			// 如果在最后一步，且没有勾选抄送，则要同时上传付款凭证
			// if (this.isLastStep && !this.isCopy) {
			//  	arr = [accept(params),uploadPayment(this.uploadData)]
			// }
			Promise.all(arr).then(() => {
				uni.$emit(this.$events.UPDATE_CLAIM_STATE);
				uni.$emit(this.$events.UPDATE_TODO_STATE);
				uni.hideLoading();
				uni.navigateBack();
			});
		},
		// 退回
		reject() {
			if (this.formData.comment.trim().length === 0) {
				uni.showToast({
					title: '请填写审批意见',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			rollback({
				stepIndex: this.rejectBackTo, // 退回到步骤
				approvalId: this.approvalId,
				comments: this.formData.comment,
				signIndex: this.formData.signIndex,
				creator: this.userId
			}).then(() => {
				uni.$emit(this.$events.UPDATE_CLAIM_STATE);
				uni.$emit(this.$events.UPDATE_TODO_STATE);
				uni.hideLoading();
				uni.navigateBack();
			});
		},
		// 修改审批意见
		doEdit() {
			if (this.formData.comment.trim().length === 0) {
				uni.showToast({
					title: '请填写审批意见',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			updateDone({
				approvalSign: {
					approvalId: this.formData.approvalId,
					comments: this.formData.comment,
					signId: this.signId
				}
			}).then(() => {
				uni.hideLoading();
				uni.navigateBack();
			});
		},
		openPopup() {
			this.$refs.popup.open('top');
		},
		closePopup() {
			this.$refs.popup.close();
		},
		completeSelect() {
			this.formData.comment = this.opinionList[this.opinionValue[0]].value;
			this.closePopup();
		},
		pickerChange(e) {
			this.opinionValue = e.detail.value;
		},
		/**
		 * 跳转到用户选择器页面
		 */
		navToUserSelector() {
			uni.setStorageSync(this.$const.COPY_USER, this.selectedUsers);
			uni.navigateTo({
				url: `/pages/common/carbon-copy/carbon-copy`
			});
		},
		upload(files) {
			this.uploadData.paymentFiles = files;
		},
		doUpload() {
			if (this.uploadData.paymentFiles.length === 0) {
				uni.showToast({
					title: '请至少上传一张付款凭证',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			uploadPayment(this.uploadData).then(() => {
				uni.$emit(this.$events.UPDATE_CLAIM_STATE);
				uni.$emit(this.$events.UPDATE_TODO_STATE);
				uni.hideLoading();
				uni.navigateBack();
			});
		},
		doShink(id) {
			this.isExpend = !this.isExpend
			const query = uni.createSelectorQuery().in(this);
			query.select(id).boundingClientRect(data => {
				// 50为头部高度
				this.shinkBottom = data.height - 50
			}).exec();
		}
	}
};
</script>

<style scoped lang="scss">
@import '@/styles/detail.scss';
.page {
	min-height: 100%;
	background-color: $-bg-color;
}

.btn {
	text-align: center;
	padding: 8px 0;
	color: white;
	border-radius: 17px;
}
.secondary {
	width: 100%;
	background-color: #dd524d;
	margin-right: 10px;
}
.primary {
	width: 100%;
	background-color: #1989fa;
}
.default {
	border: 1px solid #1890ff;
	width: 100%;
	color: #1890ff;
}
.card .card-title {
	margin-bottom: 15px;
}
.btn-wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.btn {
		flex: 1;
	}
}

.picker-view-wrap {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 300px;
	font-size: 15px;

	.picker-item {
		line-height: 30px;
		background-color: white;
		text-align: center;
		font-size: 16px;
		color: #333333;
	}

	.picker-header {
		display: flex;
		justify-content: space-between;
		padding: 10px;
		color: #666666;
		background-color: white;
		font-size: 16px;

		.complete {
			color: #007aff;
		}

		border-bottom: 1px solid #e5e5e5;
	}
}

.picker-view {
	height: 100%;
	background-color: white;
}
.approval {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	margin: 0;
	box-shadow: 0 -3px 5px rgba(0, 0, 0, 0.1);
	transition: all 0.2s;
}
.approval1 {
	bottom: -230px;
}
.approval1.expend {
	bottom: 0;
}
.approval2 {
	bottom: -170px;
}
.approval2.expend {
	bottom: 0;
}

.upload {
	height: 300px;
	bottom: -280px;
	
	.btn-wrap {
		position: absolute;
		left: 15px;
		right: 15px;
		bottom: 15px;
	}
}

.tip {
		font-size: 14px;
		color: #666;
		margin-bottom: 10px;
		.sub-tip {
			font-size: 13px;
			color: #999;
			margin-left: 5px;
		}
	}
.upload.expend {
	bottom: 0;
}

.card-title {
	position: relative;
}
.arr-btn {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
}

.footer-btn-wrap {
}
.user-select {
	line-height: 36px;
	display: flex;
	justify-content: space-between;
	.placeholder {
		color: #7c7c7c;
	}
	.icon-wrap {
		padding: 0 10px;
	}
}
.copy-tip {
	font-size: 13px;
	color: #999;
	margin-bottom: 10px;
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
