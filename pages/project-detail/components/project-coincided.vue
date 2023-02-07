<template>
	<view class="tab-page" id="work-daily">
		<view class="card">
			<view class="detail-item">
				<text class="label">月份</text>
				<view class="value" style="display: flex;">
					<picker mode="date" fields="month" :value="yearsMonth" @change="handleChange" style="margin-right: 3px;">
						<text>{{ yearsMonth }}</text>
					</picker>
					<uni-icons type="arrowdown"></uni-icons>
				</view>
			</view>
			<view class="detail-item radio"><app-radio v-model="type" :selectData="types" @select-change="search"></app-radio></view>
		</view>
		<scroll-view scroll-x="true" v-for="item in detailData.coincidedInfos">
			<view class="scroll-cell">
				<view class="cell">
					<view class="inner">
						<view class="card-title"><text class="left">任务分项</text></view>
						<view class="content">{{ item.typeText }}</view>
					</view>
				</view>
				<view class="cell">
					<view class="inner">
						<view class="card-title"><text class="left">区域</text></view>
						<view class="content">{{ item.areas }}</view>
					</view>
				</view>
				<view class="cell">
					<view class="inner">
						<view class="card-title"><text class="left">品类</text></view>
						<view class="content">{{ item.category }}</view>
					</view>
				</view>
				<view class="cell">
					<view class="inner">
						<view class="card-title"><text class="left">数量</text></view>
						<view class="content">{{ item.count }}</view>
					</view>
				</view>
				<view class="cell">
					<view class="inner">
						<view class="card-title"><text class="left">开始时间</text></view>
						<view class="content">{{ item.beginTimeText }}</view>
					</view>
				</view>
				<view class="cell">
					<view class="inner">
						<view class="card-title"><text class="left">完成时间</text></view>
						<view class="content">{{ item.endTimeText }}</view>
					</view>
				</view>
				<view class="cell">
					<view class="inner">
						<view class="card-title"><text class="left">备注</text></view>
						<view class="content">{{ item.remarks }}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="card">
			<view class="card-title"><text class="left">备注</text></view>
			<view>{{ detailData.remarks }}</view>
		</view>
		<view v-if="managePermission" class="card" style="margin-top: 10px;">
			<view class="card-title"><text class="left">抄送对象</text></view>
			<text class="username" v-for="username in detailData.ccUserNames || []">{{ username }}</text>
		</view>
	</view>
</template>

<script>
import { getListByProjectId, getDetailById } from '@/api/project/workDaily.js';
import { getById as getUserById } from '@/api/user.js';
import AppRadio from '@/components/app-radio.vue';
export default {
	components: { AppRadio },
	props: {
		projectId: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			yearsMonth: '2021-07-01',
			type: '0',
			detailData: {
				coincidedInfos: []
			},
			userId: null,
			managePermission: false,
			workTypeMap: {
				0: '施工',
				1: '对接',
				2: '放样制图'
			},
			types: [{ label: '上旬', value: '0' }, { label: '中旬', value: '1' }, { label: '下旬', value: '2' }]
		};
	},
	created() {
		this.userId = '' + uni.getStorageSync(this.$const.USER_INFO).userId;
		this.managePermission = this.$hasPermission('xunbaoguanli', this.$const.PROJECT_PERMISSION);
		this.yearsMonth = this.$dayjs().format('YYYY-MM');
		this.fetchData();
	},
	methods: {
		async fetchData() {
			let id = null;
			const tempData = uni.getStorageSync(this.$const.TEMP)
			uni.removeStorageSync(this.$const.TEMP)
			uni.$emit(this.$events.UPDATE_TODO_STATE)
			if(tempData !== '') {
				id = tempData
			}else {
				const res = await getListByProjectId(this.projectId, this.yearsMonth, this.type);
				if (res.records && res.records.length) {
					id = res.records[0].id;
				}
			}
			
			if (id) {
				getDetailById(id).then(res => {
					res.ccUserIdsTemp = res.ccUserIds ? res.ccUserIds.split(',') : [];
					if (!this.managePermission) {
						res.ccUserNames = [];
						res.ccUserIdsTemp.forEach(userId => {
							getUserById(userId).then(user => {
								res.ccUserNames.push(user.displayName);
							});
						});
					}
					res.coincidedInfos.forEach(val => {
						// 格式化开始和完成时间字段，只显示月份和天
						val.beginTimeText = val.beginTime ? this.$dayjs(val.beginTime).format('M-DD') : null;
						val.endTimeText = val.endTime ? this.$dayjs(val.endTime).format('M-DD') : null;
						val.typeText = this.workTypeMap[val.type];
					});
					this.detailData = res;
				});
			}
		},
		handleChange(e) {
			this.yearsMonth = e.detail.value;
			this.fetchData();
		},
		search(e) {
			this.type = e;
			this.fetchData();
		}
	}
};
</script>

<style lang="scss"></style>
<style scoped lang="scss">
@import '../style/common.scss';
@import '@/styles/detail.scss';

/deep/ .uni-date__input {
	height: initial;
	width: initial;
	padding-right: 0;
}
/deep/ .uni-date-x {
	padding-right: 0;
}
.card {
	margin: 5px 0;
	font-size: 14px;
	.card-title {
		margin-bottom: 10px;
	}
}
.scroll-cell {
	width: 1300px;
	display: flex;
	margin: 5px 0;
	border-radius: 8px;
	background-color: white;

	.cell {
		width: 70%;
		padding: 10px;
		font-size: 14px;
		.card-title {
			color: #b1b1b1;
			margin-bottom: 10px;
		}
		.inner {
			border-right: 1px solid #e7e7e7;
		}

		&:last-of-type {
			.inner {
				border-right: none;
			}
		}
	}
}
.problem {
	display: flex;
	align-items: center;
	margin-bottom: 6px;
	.problem-icon {
		flex-shrink: 0;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: white;
		border: 2px solid #fa1919;
		margin-right: 5px;
	}
}
.username {
	font-size: 13px;
	display: inline-block;
	padding: 4px 6px;
	background-color: #f4f4f5;
	border: 1px solid #e9e9eb;
	border-radius: 5px;
	margin: 0 6px 6px 0;
	color: #909399;
	line-height: 1;
}
.radio {
	padding: 5px 0 0 0;
}
.app-radio {
	padding-left: 0;
}
</style>
