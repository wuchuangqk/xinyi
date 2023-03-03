<template>
	<view class="pic-wrap">
		<view v-for="(file, index) in files" class="pic-item">
			<image class="img" mode="aspectFill" :src="file.url" alt="" @click="preview(file)"></image>
			<view class="remove" @click="remove(index)">
				<u-icon name="close" color="#fff" size="20"></u-icon>
			</view>
		</view>
		<view v-if="files.length < limit" class="pic-item" @click="chooseImage">
			<view class="empty"><u-icon name="camera-fill" color="#d9d9d9" size="50"></u-icon></view>
		</view>
	</view>
</template>

<script>
export default {
	model: {
		value: 'value',
		event: 'change'
	},
	props: {
		value: {
			type: Array
		},
		// 是否允许从相册选择图片
		album: {
			type: Boolean,
			default: true,
		},
		limit: {
			type: Number,
			default: 5,
		}
	},
	data() {
		return {
			show: false,
			url: '',
			files: [],
		}
	},
	methods: {
		chooseImage() {
			uni.chooseImage({
				count: 1, // 图片数量
				sourceType: this.album ? ['album', 'camera'] : ['camera'], // 相册/相机
				success: (res) => {
					this.files.push({
						url: res.tempFilePaths[0],
						file: res.tempFiles[0]
					})
					this.$emit('change', this.files)
				},
				fail: () => {
					// 用户点击取消
				}
			})
		},
		remove(index) {
			this.files.splice(index, 1)
			this.$emit('change', this.files)
		},
		preview(file) {
			uni.previewImage({
				urls: [file.url],
				current: 0
			})
		}
	}
}
</script>

<style lang="scss">
.pic-wrap {
	display: flex;

	.pic-item {
		width: 160rpx;
		height: 160rpx;
		position: relative;
		background-color: #f7f8fa;
		margin-right: 20rpx;
		border-radius: 2px;
		overflow: hidden;

		&:last-of-type {
			margin-right: 0;
		}
	}

	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.img {
		width: 100%;
		height: 100%;
	}

	.remove {
		position: absolute;
		right: 0;
		top: 0;
		background-color: rgba(0, 0, 0, 0.6);
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
