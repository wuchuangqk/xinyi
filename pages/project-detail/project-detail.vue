<template>
	<view class="page">
		<view class="bg"></view>
		<view class="content">
			<view class="section">
				<view class="top-info">
					<view class="row">
						<view class="col left">
							<text style="flex-shrink: 0;">项目负责人：</text>
							<text>{{ deptUsers }}</text>
						</view>
						<view class="col right">
							<text style="flex-shrink: 0;">所属工程部门：</text>
							<text>{{ projectInfo.team }}</text>
						</view>
					</view>
					<view class="row">
						<view class="col left">
							<text style="flex-shrink: 0;">建设阶段：</text>
							<text>{{ projectInfo.buildStageType }}</text>
						</view>
						
					</view>
				</view>

				<view style="padding: 0 10px;">
					<view class="link" @click="goToAttend">
						<text>考勤记录</text>
						<uni-icons type="arrowright" size="20" color="#bbb"></uni-icons>
					</view>
					<view v-if="workDetails" class="link" @click="doNav('/pages/project-detail/work-details')">
						<text>进场交底</text>
						<uni-icons type="arrowright" size="20" color="#bbb"></uni-icons>
					</view>
					<view v-if="userManage" class="link" @click="doNav('/pages/people-manage/index')">
						<text>人员管理</text>
						<uni-icons type="arrowright" size="20" color="#bbb"></uni-icons>
					</view>
					<view v-if="daily" class="link" @click="goToDaily">
						<text>施工日志</text>
						<uni-icons type="arrowright" size="20" color="#bbb"></uni-icons>
					</view>
					<view v-if="fundApplication" class="link" @click="doNav('/pages/project-detail/moneyApply/entrance')">
						<text>资金申请</text>
						<uni-icons type="arrowright" size="20" color="#bbb"></uni-icons>
					</view>
					<view v-if="invoicingAdd" class="link" @click="doNav('/pages/project-detail/invoice/invoice-list')">
						<text>开票添加</text>
						<uni-icons type="arrowright" size="20" color="#bbb"></uni-icons>
					</view>
					<uni-collapse>
						<uni-collapse-item title="合同信息" :showAnimation="true">
							<view class="expanded-content files">
								<view class="detail-item">
									<text class="label">合同名称</text>
									<text class="value">{{ contractInfo.contractName }}</text>
								</view>
								<view class="detail-item">
									<text class="label">甲方名称</text>
									<text class="value">{{ contractInfo.employer }}</text>
								</view>
								<view class="detail-item">
									<text class="label">甲方负责人</text>
									<text class="value">{{ contractInfo.manager }}</text>
								</view>
								<view class="detail-item">
									<text class="label">联系电话</text>
									<text class="value">{{ contractInfo.managerQualification }}</text>
								</view>
								<view class="detail-item">
									<text class="label">合同暂定价</text>
									<text class="value">{{ contractInfo.contractPrice }} [万元]</text>
								</view>
								<view class="file">
									<view class="label">合同附件</view>
									<file-viewer :files="contractInfo.contractFilesURL || []" platform="project"></file-viewer>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="综合成本" :showAnimation="true">
							<view class="expanded-content files">
								<view class="detail-item">
									<text class="label">人工成本</text>
									<text class="value">{{ (comprehensiveCost.workerCost || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">外包人工成本</text>
									<text class="value">{{ (comprehensiveCost.outsourceCost || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">人工合计</text>
									<text class="value">{{ (comprehensiveCost.workerCostTotal || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">差旅费</text>
									<text class="value">{{ (comprehensiveCost.travelCost || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">招待费</text>
									<text class="value">{{ (comprehensiveCost.entertainCost || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">办公费</text>
									<text class="value">{{ (comprehensiveCost.officeCost || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">运输费</text>
									<text class="value">{{ (comprehensiveCost.transportCost || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">其他</text>
									<text class="value">{{ (comprehensiveCost.otherCost || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">报销费用合计</text>
									<text class="value">{{ (comprehensiveCost.claimTotal || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">辅材费用</text>
									<text class="value">{{ (comprehensiveCost.auxiliaryCost || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">辅材税金</text>
									<text class="value">{{ (comprehensiveCost.auxiliaryTax || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">主材费用</text>
									<text class="value">{{ (comprehensiveCost.mainCost || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">主材税金</text>
									<text class="value">{{ (comprehensiveCost.mainTax || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">材料合计</text>
									<text class="value">{{ (comprehensiveCost.mainCostTotal || 0).toFixed(2) }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">总合计</text>
									<text class="value">{{ (comprehensiveCost.total || 0).toFixed(2) }} [元]</text>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="项目决算" :showAnimation="true">
							<view class="expanded-content files">
								<view class="detail-item">
									<text class="label">支出</text>
									<text class="value">{{ finalAccounting.expenditure }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">收益</text>
									<text class="value">{{ finalAccounting.profit }} [元]</text>
								</view>
								<view class="detail-item">
									<text class="label">结余</text>
									<text class="value">{{ finalAccounting.money3 }} [元]</text>
								</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef APP-PLUS
const dom = weex.requireModule('dom');
// #endif
import { getById, getNatureTypeMap, getStageTypeMap } from '@/api/project/basicInfo.js';
import { getByProjectId, getTeamTypeMap } from '@/api/project/myProject.js';
import { getTotalCost, getAccounts } from '@/api/project/financeStatistics.js';
import IconFont from '@/components/icon-font.vue';
import FileViewer from '@/components/file-viewer.vue';
import {calcHelper} from '@/util/index'

export default {
	components: {
		IconFont,
		FileViewer
	},
	data() {
		return {
			tabItem: [
				{ label: '基本信息', key: 'basic-info', permission: 'jbxx', needPermission: true, isLoad: true },
				{ label: '进度计划', key: 'schedule-plan', permission: 'jdjh', needPermission: true, isLoad: false },
				{ label: '工程招标', key: 'project-tender', permission: 'gczb', needPermission: true, isLoad: false },
				{ label: '工程合同', key: 'project-contract', permission: 'gcht_xxk', needPermission: true, isLoad: false },
				{ label: '合同进度', key: 'contract-progress', permission: 'no-permission', needPermission: true, isLoad: false },
				{ label: '工程变更', key: 'project-change', permission: 'gcjdbg', needPermission: true, isLoad: false },
				{ label: '施工日志', key: 'work-daily', permission: 'sgrz', needPermission: false, isLoad: false },
				{ label: '工程安排', key: 'work-plan', permission: 'gcap', needPermission: false, isLoad: false },
				{ label: '项目旬报', key: 'project-coincided', permission: 'xmxb', needPermission: true, isLoad: false },
				{ label: '进度月报', key: 'monthly-report', permission: 'jdyb', needPermission: true, isLoad: false },
				{ label: '质量安全', key: 'quality-safe', permission: 'zlaq', needPermission: true, isLoad: false },
				{ label: '竣工验收', key: 'completed-check', permission: 'jgys', needPermission: true, isLoad: false },
				{ label: '工程资料', key: 'project-profile', permission: 'gczl_xxk', needPermission: true, isLoad: false }
			],
			tabbarLineWidth: 0, // tabbar下划线宽度
			tabbarLineLeft: 0, // tabbar绝对定位left的值
			curTabIndex: 0, // 当前选中的tab页
			tabbarWidthArr: [], // 保存所有tabbar宽度的集合
			swiperWidth: 0, // swiper宽度
			projectId: null,
			projectInfo: {},
			tabItems: [
				{
					name: '项目详情',
					icon: 'icon-icon'
				},
				{
					name: '考勤记录',
					icon: 'icon-huizong',
					isLink: true,
					linkUrl: '/pages/project-detail/attendance/attendance'
				}
			],
			scrollInto: '',
			isTempEmp: false, // 是否是临时工(userType:2和3)
			permissionTabItem: [],
			contractInfo: {}, // 合同信息
			finalAccounting: {}, // 项目决算
			comprehensiveCost: {} // 综合成本
		};
	},
	computed: {
		// 施工日志权限
		daily() {
			return this.$hasPermission('sgrz', this.$const.PROJECT_PERMISSION);
		},
		// 进场交底权限
		workDetails() {
			return this.$hasPermission('mobilizationDisclosure', this.$const.PROJECT_PERMISSION);
		},
		// 人员管理权限
		userManage() {
			return this.$hasPermission('userManage', this.$const.PROJECT_PERMISSION);
		},
		// 资金申请权限
		fundApplication() {
			return this.$hasPermission('fundApplication', this.$const.PROJECT_PERMISSION);
		},
		// 开票添加权限
		invoicingAdd() {
			return this.$hasPermission('InvoicingAdd', this.$const.PROJECT_PERMISSION);
		},
		// 工程队管理员
		manager() {
			if (this.projectInfo.xmProjectCoordinateForms) {
				for (let i = 0; i < this.projectInfo.xmProjectCoordinateForms.length; i++) {
					const item = this.projectInfo.xmProjectCoordinateForms[i]
					if (item.coordinateCode === 'GCBZG' || item.coordinateCode === 'FZR') {
						return item?.userNames.split('-')[0];
					}
				}
			}
			return '';
		},
		// 项目负责人
		deptUsers() {
			if (this.projectInfo.xmProjectCoordinateForms) {
				for (let i = 0; i < this.projectInfo.xmProjectCoordinateForms.length; i++) {
					const item = this.projectInfo.xmProjectCoordinateForms[i]
					if (item.coordinateCode === 'FZR' || item.coordinateCode === 'XMFZR') {
						return item.userNames.split(',').map(v => {
							return v.split('-')[0]
						}).join('，')
					}
				}
			}
			return '';
		}
	},
	onLoad({ projectId, projectName, moduleKey, displayName }) {
		this.projectId = +projectId;
		this.tabItems[1].linkUrl += '?projectId=' + this.projectId;
		if (projectName !== undefined) {
			uni.setNavigationBarTitle({
				title: projectName
			});
		}
		const userType = uni.getStorageSync(this.$const.USER_INFO).userType;
		this.isTempEmp = +userType === 3 || +userType === 2;
		this.permissionTabItem = this.isTempEmp ? this.tabItem.filter(v => !v.needPermission) : this.tabItem;
		if (moduleKey !== undefined) {
			this.loadModule(moduleKey);
			this.curTabIndex = this.permissionTabItem.findIndex(v => v.key === moduleKey);
			this.scrollInto = this.permissionTabItem[this.curTabIndex].key;
			this.updateUnderlinePosition();
		} else {
			this.loadModule(this.permissionTabItem[0].key);
		}
		// 获取项目信息
		getById(this.projectId).then(projectInfo => {
			projectInfo.displayName = displayName;
			getStageTypeMap().then(res => {
				projectInfo.buildStageType = res[projectInfo.buildStageType];
			});
			this.setProjectInfo(projectInfo);
		});

		// 根据项目id获取合同信息
		getByProjectId(this.projectId).then(res => {
			this.contractInfo = res;
		});

		// 综合成本
		getTotalCost().then(res => {
			const item = (res || []).find(v => v.projectId === this.projectId)
			if (item) {
				item.workerCostTotal = calcHelper([item.workerCost, item.outsourceCost])
				item.claimTotal = calcHelper([
					item.travelCost,
					item.entertainCost,
					item.officeCost,
					item.transportCost,
					item.otherCost,
				])
				item.mainCostTotal = calcHelper([
					item.auxiliaryCost,
					item.auxiliaryTax,
					item.mainCost,
					item.mainTax,
				])
				item.total = calcHelper([
					item.workerCostTotal,
					item.claimTotal,
					item.mainCostTotal,
				])
				this.comprehensiveCost = item
			}
		});

		// 项目决算
		getAccounts(this.projectId, 1, 9999).then(res => {
			const temp = {
				expenditure: 0, // 支出
				profit: 0, // 收益
				money3: 0 // 结余
			};
			(res.records || []).forEach(v => {
				temp.expenditure += v.expenditure;
				temp.profit += v.profit;
				temp.money3 += v.profit - v.expenditure;
			});
			temp.expenditure = temp.expenditure.toFixed(2);
			temp.profit = temp.profit.toFixed(2);
			temp.money3 = temp.money3.toFixed(2);
			this.finalAccounting = temp;
		});
	},
	onReady() {
		// this.selectorQuery();
	},
	methods: {
		onswiperchange(e) {
			this.curTabIndex = e.target.current;
			this.updateUnderlinePosition();
			this.loadModule(this.permissionTabItem[this.curTabIndex].key);
			this.scrollInto = this.tabItem[this.curTabIndex].key;
		},
		// 施工人员和临时工只能看到 施工日志、工程安排、项目考勤
		isShow(key) {
			if (!this.isTempEmp) {
				return true;
			}
			return !this.tabItem.find(v => v.key === key).needPermission;
		},
		loadModule(key) {
			this.permissionTabItem.find(v => v.key === key).isLoad = true;
		},
		isLoadModule(key) {
			return this.permissionTabItem.find(v => v.key === key).isLoad;
		},
		// 返回到上个页面
		back() {
			uni.navigateBack();
		},
		// 获取tabbar和swiper宽度
		selectorQuery() {
			// 每个tabitem的宽度
			uni
				.createSelectorQuery()
				.in(this)
				.selectAll('.tab-item')
				.boundingClientRect(rects => {
					rects.forEach((rect, index) => {
						this.tabbarWidthArr.push(rect);
					});
					// 给第一个tabitem设置宽度和left
					this.updateUnderlinePosition();
				})
				.exec();
		},
		// 更新tabitem 指示线位置和宽度
		updateUnderlinePosition() {
			this.tabbarLineLeft = this.tabbarWidthArr[this.curTabIndex].left + 5;
			this.tabbarLineWidth = this.tabbarWidthArr[this.curTabIndex].width - 10;
		},
		// 当点击不同的tabitem时切换标签页
		changeTab(tabIndex) {
			this.curTabIndex = tabIndex;
			// 更新指示条位置
			this.updateUnderlinePosition();
			// this.lazyLoad[tabIndex].isLoad = true;
			this.loadModule(this.permissionTabItem[this.curTabIndex].key);
		},
		setProjectInfo(payload) {
			this.projectInfo = payload;
			uni.setNavigationBarTitle({
				title: payload.projectName
			});
			getTeamTypeMap().then(res => {
				this.projectInfo.team = res[this.projectInfo.team];
			});
		},
		// 切换底部选项卡
		switchTab(tabIndex) {
			const tabItem = this.tabItems[tabIndex];
			if (tabItem.isLink) {
				uni.navigateTo({
					url: tabItem.linkUrl
				});
				return;
			}
			this.curTabIndex = tabIndex;
		},
		goToAttend() {
			uni.navigateTo({
				url: '/pages/project-detail/attendance/all-attend?projectId=' + this.projectId
			});
		},
		doNav(url) {
			uni.navigateTo({
				url: `${url}?projectId=${this.projectId}`
			});
		},
		// 施工日志
		goToDaily() {
			uni.navigateTo({
				url: `/pages/project-detail/project-daily?projectId=${this.projectId}`
			});
		},
		// 工程安排
		goToPlan() {
			uni.navigateTo({
				url: `/pages/project-detail/project-plan?projectId=${this.projectId}`
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import '@/styles/tabbar.scss';
@import './style/common.scss';
/deep/ .uni-navbar--border {
	border: none;
}

.page {
	height: 100%;
	overflow: auto;
	background-color: #f2f3f5;
}

.bg {
	background-color: #3c88f2;
	position: absolute;
	left: 0;
	right: 0;
	height: 18%;
	z-index: 0;
}

.content {
	height: 100%;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;

	.section {
		flex-shrink: 0;
	}

	.main {
		flex: 1;
		padding-bottom: 60px;
	}
}

.header {
	color: white;
	padding: 0 5px;
	margin-bottom: 20rpx;
}

.top-info {
	font-size: 13px;
	padding: 0 20px;
	margin: 20rpx 0 40rpx 0;
	color: #ecf1f8;
	.row {
		display: flex;

		&:first-of-type {
			margin-bottom: 16rpx;
		}
	}

	.left {
		width: 50%;
	}

	.right {
		width: 50%;
	}
}

.tab-bar {
	width: 100%;
	height: 42px;
	width: 750rpx;
}

/* #ifndef APP-NVUE */
.tab-bar ::-webkit-scrollbar {
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
}

/* #endif */
.tab-item {
	color: white;
	// color: #8c8c8c;
	padding: 0 20rpx 0 20rpx;
	white-space: nowrap;
	position: relative;

	&.active {
		color: #ffffcc;
		// color: #171717;
		// font-weight: bold;
	}
}

.line {
	position: absolute;
	background-color: #1989fa;
	left: 50%;
	transform: translateX(-50%);
	width: 25%;
	height: 3px;
	border-radius: 2px;
	bottom: -6px;
}

.underline-wrap {
	position: relative;
	height: 2px;
	background-color: transparent;
	margin-top: 6rpx;

	.underline {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 0;
		background-color: #ffffcc;
		transition-duration: 0.2s;
		transition-property: left;
	}
}

.row {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}

.col {
	display: flex;
	width: 25%;
	margin-bottom: 10px;
}

.icon-bg {
	width: 55px;
	height: 55px;
	border-radius: 5px;
	background: #0188fd;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 10px;
}

.item {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}

.item-name {
	// margin-top: 6px;
	font-size: 16px;
	color: #333333;
	// text-align: center;
}

.mark {
	position: absolute;
	top: -8px;
	right: -3px;
	width: 18px;
	height: 18px;
	border-radius: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #ff2727;
	color: white;
	font-size: 11px;
	font-weight: bold;
}

.item-icon {
	color: white;
	font-size: 25px;
}
.link {
	padding: 12px;
	background-color: white;
	margin-bottom: 10px;
	font-size: 14px;
	display: flex;
	justify-content: space-between;
	border-radius: 4px;
}
</style>
