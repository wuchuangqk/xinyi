<template>
	<view class="approval-line">
		<view class="flow-step" v-for="flow in flowList">
			<view class="step-name">{{ flow.configureName }}</view>
			<view class="step-section">
				<view class="head-photo"><image :src="flow.headPhoto" alt="" @error="imgErr(flow)"></image></view>
				<view class="step-content">
					<view class="arrow"></view>
					<view class="top">
						<view class="step-state"><image :src="stateImg.get(flow.state)" alt=""></image></view>
						<text class="step-user-name">{{ flow.creatorName }}</text>
						<text class="step-time">{{ flow.created }}</text>
					</view>
					<view class="step-option">
						<text v-if="flow.state === 4">退回意见：</text>
						{{ flow.comments }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getById } from '@/api/user.js';
import { getByFlowId } from '@/api/project/approval.js';
import { flowList } from '@/api/office/leave.js';
import { uploadHost } from '@/util/http.js';
export default {
	name: 'approval-timeline',
	props: {
		flowList: {
			type: Array,
			required: true,
			default: ()=> {
				return []
			}
		}
	},
	data() {
		return {
			flowStateNameMap: new Map([[1, '审批中'], [2, '已审批'], [0, '待审批'], [3, '退回']]),
			stateImg: new Map([
				[0, '/static/img/wait1.png'], // 等待办理
				[1, '/static/img/doing1.png'], // 正在办待中
				[2, '/static/img/complete1.png'], // 已完成
				[4, '/static/img/reject.png'] // 退回
			]),
			defaultImg: '/static/img/default.jpg'
		};
	},
	created() {},
	methods: {
		imgErr(flow) {
			flow.headPhoto = this.defaultImg;
		}
	}
};
</script>

<style lang="scss" scoped>
/*步骤名称*/
.step-name {
	padding-left: 35px;
	color: #666;
	font-size: 13px;
	margin-left: 15px;
	position: relative;
	margin-bottom: 3px;

	&::before {
		content: '';
		position: absolute;
		width: 2px;
		background-color: #ddd;
		top: 0;
		bottom: 0;
		left: 0;
	}
}

/*步骤主体*/
.step-section {
	border-left: 2px solid #ddd;
	position: relative;
	padding-left: 30px;
	padding-bottom: 20px;
	margin-left: 15px;
}

/*步骤内容*/
.step-content {
	background-color: #f5f5f5;
	padding: 8px;
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	position: relative;

	& > .top {
		display: flex;
		align-items: flex-start;

		/*审批时间*/
		.step-time {
			margin-left: auto;
			font-size: 12px;
			color: #949494;
		}
	}

	.arrow {
		border-left: 6px solid transparent;
		border-right: 6px solid #f5f5f5;
		border-top: 6px solid transparent;
		border-bottom: 6px solid transparent;
		//transform: rotateZ(180deg);
		position: absolute;
		left: -12px;
		top: 10px;
	}
}

/*审批状态*/
.step-state {
	width: 14px;
	height: 14px;
	// margin: 0 5px 5px 3px;
	margin: 0 5px;
	image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}

/*用户名*/
.step-user-name {
	//font-weight: bold;
	font-size: 14px;
}

/*审批意见*/
.step-option {
	color: #666;
	margin-top: 2px;
	padding-left: 22px;
	font-size: 14px;
}

.flow-step {
	&:first-of-type {
		.step-name::before {
			display: none;
		}
	}

	&:last-of-type {
		.step-section {
			border-left: none;
		}
	}

	.head-photo {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: -18px;
		background-color: white;

		image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
}
</style>
