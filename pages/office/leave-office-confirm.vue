<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<view class="detail-item">
				<text class="label">姓名</text>
				<text class="value">{{ detailData.userName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">所属部门</text>
				<text class="value">{{ detailData.deptName }}</text>
			</view>
			<view class="detail-item">
				<text class="label">离职日期</text>
				<text class="value">{{ detailData.quitTime }}</text>
			</view>
		</view>
		<view class="footer">
			<view class="secondary btn" @click="doConfirm(false)">驳回</view>
			<view class="primary btn" @click="doConfirm(true)">确认</view>
		</view>
		<neil-modal :show="showModel" title="提示" :content="content" confirmColor="#dd524d" align="center" @confirm="submit" @close="showModel = false"></neil-modal>
	</view>
</template>

<script>
	import { getEmpInfo, getById } from '@/api/user'
	import { getDeptInfo } from '@/api/system/dept'
	import { quitOut, quitIn } from '@/api/office/leave-office'
	import NeilModal from '@/components/neil-modal/neil-modal.vue';
	export default {
		components: { NeilModal },
		data() {
			return {
				detailData: {},
				showModel: false,
				content: '',
				isConfirm: false,
				signId: null
			};
		},
		onLoad({ userId, signId }) {
			this.signId = signId
			getEmpInfo(userId).then(res => {
				res.userName = ''
				res.deptName = ''
				this.detailData = res
				getById(userId).then(res => {
					this.detailData.userName = res.displayName
					getDeptInfo(res.departId).then(res => {
						this.detailData.deptName = res.departName
					})
				})
			})
		},
		methods: {
			submit() {
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
				const promise = this.isConfirm ? quitOut(this.detailData.userId) : quitIn(this.detailData.userId, this.signId)
				promise.then(() => {
					uni.$emit(this.$events.UPDATE_TODO_STATE)
					uni.hideLoading();
					uni.navigateBack();
				})
			},
			doConfirm(isConfirm) {
				this.isConfirm = isConfirm
				this.content = `${isConfirm ? '确认离职申请' : '驳回离职申请'}吗？`
				this.showModel = true
			}
		}
	}
</script>

<style scoped lang="scss">
	@import '@/styles/detail.scss';
.page {
	min-height: 100%;
	background-color: $-bg-color;
}

.footer {
	display: flex;
	font-size: 13px;
	padding: 10px;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	.btn {
		text-align: center;
		padding: 8px 0;
		color: white;
		border-radius: 17px;
		flex: 1;
	}
	.secondary {
		background-color: #dd524d;
		margin-right: 10px;
	}
	.primary {
		background-color: #1989fa;
	}
}
</style>
