<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="item" @click="doNav('/pages/claim/claim-manage')">
			<image src="/static/svg/bao_xiao.svg" mode="" class="img"></image>
			<text class="title">报销管理</text>
			<uni-icons type="arrowright" size="20" color="#bbb" class="arrow"></uni-icons>
		</view>
		<view class="item" @click="doNav('/pages/project-detail/moneyApply/claim/claim-manage')">
			<image src="/static/svg/qing_kuan.svg" mode="" class="img"></image>
			<text class="title">请款管理</text>
			<uni-icons type="arrowright" size="20" color="#bbb" class="arrow"></uni-icons>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			projectId: null
		};
	},
	onLoad({ projectId }) {
		this.projectId = projectId;
	},
	methods: {
		doNav(url) {
			uni.navigateTo({
				url: `${url}?projectId=${this.projectId}`
			});
		}
	}
};
</script>

<style lang="scss">
.page {
	min-height: 100%;
	background-color: $-bg-color;
}
.item {
	background-color: white;
	margin: 15px;
	border-radius: 6px;
	padding: 10px;
	display: flex;
	align-items: center;
	.img {
		width: 60px;
		height: 60px;
	}
	.arrow {
		margin-left: auto;
	}
	.title {
		font-size: 18px;
		margin-left: 10px;
	}
}
</style>
