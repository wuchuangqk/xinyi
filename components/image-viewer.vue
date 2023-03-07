<template>
	<view class="pic-wrap">
		<view v-for="(file, index) in files" class="pic-item" :class="size">
			<image class="img" mode="aspectFill" :src="setUrl(file.fileurl)" alt="" @click="preview(file)"></image>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		files: {
			type: Array
		},
		size: {
			type: String,
			default: 'normal', // normal|small
		}
	},
	data() {
		return {
		}
	},
	methods: {
		preview(file) {
			uni.previewImage({
				urls: [this.setFileUrl(file.fileurl)],
				current: 0
			})
		},
		setUrl(url) {
			return this.setFileUrl(url)
		}
	}
}
</script>

<style lang="scss">
.pic-wrap {
	display: flex;

	.pic-item {
		position: relative;
		background-color: #f7f8fa;
		margin-right: 20rpx;

		&:last-of-type {
			margin-right: 0;
		}

		&.normal {
			width: 160rpx;
			height: 160rpx;
		}

		&.small {
			width: 80rpx;
			height: 80rpx;
		}
	}

	.img {
		width: 100%;
		height: 100%;
	}
}
</style>
