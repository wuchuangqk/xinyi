<template>
	<view class="tab-page">
		<uni-collapse accordion="true">
			<uni-collapse-item :showAnimation="true" title="前期管理" class="title-color-type1">
				<view v-for="item in stageData[0].data" class="list">
					<view v-for="val in item.xmProjectNodeDataVos" @click="showNodeDetail(val)">
						<view class="label title">
							<text class="state" :class="val.stateClass"></text>
							<text class="one-line">{{ val.dataName }}</text>
						</view>
						<uni-icons type="arrowright" size="14" color="#919191" ></uni-icons>
					</view>
				</view>
			</uni-collapse-item>
			<uni-collapse-item :showAnimation="true" title="施工管理" class="title-color-type2">
				<view v-for="item in stageData[1].data" class="list">
					<view v-for="val in item.xmProjectNodeDataVos" @click="showNodeDetail(val)">
						<view class="label title">
							<text class="state" :class="val.stateClass"></text>
							<text class="one-line">{{ val.dataName }}</text>
						</view>
						<uni-icons type="arrowright" size="14" color="#919191" ></uni-icons>
					</view>
				</view>
			</uni-collapse-item>
			<uni-collapse-item :showAnimation="true" title="验收管理" class="title-color-type3">
				<view v-for="item in stageData[2].data" class="list">
					<view v-for="val in item.xmProjectNodeDataVos" @click="showNodeDetail(val)">
						<view class="label title">
							<text class="state" :class="val.stateClass"></text>
							<text class="one-line">{{ val.dataName }}</text>
						</view>
						<uni-icons type="arrowright" size="14" color="#919191"></uni-icons>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>

		<detail-wrapa :show="showModel">
			<view class="detail-mode">
				<view class="detail-mode-head">
					<text class="head-title">节点详情</text>
					<uni-icons type="arrowdown" class="close" @click="showModel = false"></uni-icons>
				</view>
				<view class="detail-mode-content">
					<view class="detail-mode-content-item">
						<text class="label">节点名称：</text>
						<text class="value">{{ nodeDetail.dataName }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">节点状态：</text>
						<text class="value">{{ nodeDetail.dataName }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">责任人：</text>
						<text class="value">{{ nodeDetail.dataUserNames }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">计划结束时间：</text>
						<text class="value">{{ nodeDetail.planEndTime }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">实际结束时间：</text>
						<text class="value">{{ nodeDetail.actualEndTime }}</text>
					</view>
				</view>
			</view>
		</detail-wrapa>
	</view>
</template>

<script>
import { getList } from '@/api/project/schedulePlan.js';
import DetailWrapa from './detail-wrap.vue'
export default {
	props: {
		projectId: {
			type: Number,
			required: true
		}
	},
	components:{DetailWrapa},
	data() {
		return {
			stageData: [
				{
					data: [],
					isEmpty: false
				},
				{
					data: [],
					isEmpty: false
				},
				{
					data: [],
					isEmpty: false
				}
			],
			stateName: new Map([
				['plan_wait', '待办'],
				['plan_handling', '在办'],
				['plan_done', '按时完成'],
				['plan_stop', '暂停'],
				['plan_not_need', '无需办理'],
				['plan_overtime', '超时未完成'],
				['plan_overtime_done', '超时完成']
			]),
			showModel: false,
			nodeDetail: {}
		};
	},
	created() {
		for (let i = 0; i < this.stageData.length; i++) {
			getList(this.projectId, i + 1).then(res => {
				this.stageData[i].data = res.map(val => {
					val.xmProjectNodeDataVos = val.xmProjectNodeDataVos.map(v => {
						const { state, planEndTime, actualEndTime } = v;
						v.stateClass = this.getNodeState(state, planEndTime, actualEndTime);
						return v;
					});
					return val;
				});
				// 如果该阶段下的每个标段的节点都是空，则赋空值
				if (
					this.stageData[i].data.every(v => {
						return !v.xmProjectNodeDataVos.length;
					})
				) {
					this.stageData[i].data = [];
					this.stageData[i].isEmpty = true;
				}
			});
		}
	},
	methods: {
		// 计算节点状态
		getNodeState(state, planEndTime, actualEndTime) {
			if (state === 4) {
				// 暂停
				return 'plan_stop';
			} else if (state === 5) {
				// 无需办理
				return 'plan_not_need';
			} else {
				// 既不是暂停，也不是无需办理
				// 如果是完成，如果超时了，就标记超时完成，否则完成
				if (state === 3) {
					if (actualEndTime && planEndTime && new Date(actualEndTime) > new Date(planEndTime)) {
						return 'plan_overtime_done';
					} else {
						return 'plan_done';
					}
				} else {
					// 如果计划结束时间小于当前时间，标记为超时未完成
					if (planEndTime && new Date(planEndTime) < new Date()) {
						return 'plan_overtime';
					} else {
						if (state === 1) {
							// 待办
							return 'plan_wait';
						} else if (state === 2) {
							// 在办
							return 'plan_handling';
						}
					}
				}
			}
		},
		showNodeDetail(node) {
			this.nodeDetail = node;
			this.showModel = true
		}
	}
};
</script>

<style scoped lang="scss">
@import '../style/common.scss';
.list {
	& > view {
		display: flex;
		justify-content: space-between;
		padding: 10px;
		border-bottom: 1px solid $-border-line-color;
		&:first-of-type {
			padding-top: 0;
		}
	}
	.label.title {
		font-size: 15px;
		color: #333;
		display: flex;
		align-items: center;
		flex: 1;
		.state {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			margin-right: 7px;
			flex-shrink: 0;
			&.plan_wait {
				background-color: #ff9900;
			}
			&.plan_handling {
				background-color: #0066cc;
			}
			&.plan_done {
				background-color: #00cc00;
			}
			&.plan_stop {
				background-color: #6b3ac5;
			}
			&.plan_not_need {
				background-color: #bab86b;
			}
			&.plan_overtime {
				background-color: #d81e06;
			}
			&.plan_overtime_done {
				background-color: #666666;
			}
		}
	}
	.arrow {
		transform: rotateZ(-180deg);
		color: #919191;
	}
}
</style>
