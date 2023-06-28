<template>
	<view class="approval-line">
		<view class="flow-step" v-for="(flow, index) in flowList">
			<view class="step-name">
				<text>{{ flow.replyname }}</text>
				<text class="step-time">
					{{ flow.created }}
				</text>
			</view>
			<view class="step-section">
				<view class="head-photo">{{ getName(flow.replyname) }}</view>
				<view class="step-content">
					<view class="arrow"></view>
					<view class="top">
						<view class="s1">
							<text>{{ flow.replycontent }}{{ flow.replycontent }}{{ flow.replycontent }}</text>
						</view>

					</view>
				</view>
				<file-viewer :files="files" size="small" style="margin-top: 10px"></file-viewer>
			</view>
		</view>
	</view>
</template>

<script>
import FileViewer from '@/components/file-viewer.vue';
export default {
	name: 'reply-list',
	components: {
		FileViewer,
	},
	props: {
		flowList: {
			type: Array,
			required: true,
			default: () => {
				return []
			}
		},
		files: {
			type: Array,
			required: true,
			default: () => {
				return []
			}
		},
	},
	data() {
		return {
			flowStateNameMap: new Map([[1, '审批中'], [2, '已审批'], [0, '待审批'], [3, '退回']]),
			stateImg: new Map([
				['wait', '/static/img/wait1.png'], // 等待办理
				['current', '/static/img/doing1.png'], // 正在办待中
				['done', '/static/img/complete1.png'], // 已完成
				['reject', '/static/img/reject.png'] // 退回
			]),
			defaultImg: '/static/img/default.jpg',
			isHasReject: false, // 流程里是否出现了驳回
		};
	},
	created() { },
	methods: {
		imgErr(flow) {
			flow.headPhoto = this.defaultImg;
		},
		getName(name) {
			if (name.length <= 2) {
				return name
			}
			return name.substring(name.length - 2)
		},
		setStateImg(index, flow) {
			// 已审批
			if (flow.Signed) {
				if (index === this.currentStep) {
					this.isHasReject = true
					return this.stateImg.get('reject')
				} else {
					return this.stateImg.get('done')
				}
			} else {
				// 审批中
				if (index === this.currentStep) {
					return this.stateImg.get('current')
				} else {
					return this.stateImg.get('wait')
				}
			}
		},
		fmtTime(time) {
			return this.$dayjs(time).format('YYYY-MM-DD HH:mm:ss')
		}
	}
};
</script>

<style lang="scss" scoped>
// .s1 {
// 	display: flex;
// 	align-items: center;
// }
.step-time {
	margin-left: auto;
	font-size: 12px;
	color: #949494;
	flex-shrink: 0;
}

/*步骤名称*/
.step-name {
	padding-left: 35px;
	color: #666;
	font-size: 13px;
	margin-left: 15px;
	position: relative;
	margin-bottom: 3px;
	display: flex;
	justify-content: space-between;

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

	&>.top {
		display: flex;
		align-items: flex-start;

		/*审批时间*/

	}

	.arrow {
		border-left: 6px solid transparent;
		border-right: 6px solid #f5f5f5;
		border-top: 6px solid transparent;
		border-bottom: 6px solid transparent;
		position: absolute;
		left: -12px;
		top: 50%;
		transform: translateY(-50%);
	}
}

.s1 {
	word-break: break-all;
}

/*审批状态*/
.step-state {
	width: 14px;
	height: 14px;
	margin: 2px 5px 0;
	flex-shrink: 0;

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
		top: -6px;
		left: -18px;
		background-color: #3980fc;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
