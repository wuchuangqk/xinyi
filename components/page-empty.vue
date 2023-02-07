<template>
	<view class="page-empty">
		<icon-font icon="icon-zanwushuju" class="empty-icon"></icon-font>
		<text class="empty-label">暂无数据</text>
	</view>
</template>
<script>
	import IconFont from '@/components/icon-font.vue';
	export default {
		components: {
			IconFont
		},
	}
</script>
<style lang="scss" scoped>
	.page-empty {
		height: 100%;
		background: white;
		border-radius: 6px;
		display: flex;
		flex-direction: column;
		align-items: center;

		.empty-label {
			color: #9f9f9f;
			font-size: 13px;
			margin-top: 10px;
			padding-right: 12px;
		}

		.empty-icon {
			font-size: 80px;
			color: #9b9b9b;
		}
	}
</style>
