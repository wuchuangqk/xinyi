<template>
	<view :class="size">
		<view v-for="item in filesCopy" @click="clickFile(item)" class="file-item">
			<view v-if="item.isImg" class="img-wrap">
				<image class="img" mode="aspectFill" :src="item.url" alt="" />
			</view>
			<view v-else>
				<image class="img" mode="aspectFill" :src="'/static/svg/' + (svgMap.get(item.extend) || '_unknow') + '.svg'"
					alt="" />
			</view>
			<text class="file-name">{{ item.fileName }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: "file-viewer",
	props: {
		files: {
			type: Array,
			required: true
		},
		size: {
			type: String,
			required: false,
			default: ''
		}
	},
	data() {
		return {
			svgMap: new Map([
				['.pdf', '_pdf'],
				['.docx', '_word'],
				['.doc', '_word'],
				['.xlsx', '_excel'],
				['.xls', '_excel'],
				['.pptx', '_excel'],
				['.ppt', '_ppt'],
			]),
			imgTyps: ['.png', '.jpeg', '.jpg', '.gif'],
			filesCopy: [],
		};
	},
	created() {
		this.filesCopy = this.extendFiles(this.files)
	},
	methods: {
		extendFiles(fileList) {
			return fileList.map((v, index) => {
				const fileext = (v.fileext || '').toLowerCase()
				return {
					fileId: index,
					fileName: v.filename.endsWith(fileext) ? v.filename : v.filename + fileext,
					extend: fileext,
					url: this.setFileUrl(v.fileurl),
					isImg: this.imgTyps.includes(fileext)
				}
			})
		},
		clickFile(item) {
			if (item.imgErr) {
				uni.showToast({
					title: '图片地址有误无法预览',
					icon: 'none'
				});
				return
			}
			// 判断文件类型
			if (item.isImg) {
				uni.previewImage({
					urls: [item.url],
					current: 0
				})
				return
			}
			uni.showLoading({
				title: '正在打开文件',
				mask: true
			})
			uni.downloadFile({
				url: item.url,
				success: (res) => {
					var filePath = res.tempFilePath;
					uni.openDocument({
						filePath: filePath,
						success: () => { },
						fail: () => {
							uni.showToast({
								title: '文件打开失败，已为您下载到本地',
								icon: 'none'
							});
							uni.saveFile({
								tempFilePath: filePath,
								success: () => {
									uni.showToast({
										title: '下载成功',
										icon: 'none'
									})
								},
								fail: () => {
									uni.showToast({
										title: '下载失败',
										icon: 'none'
									})
								}
							});
						}
					});
				},
				fail: () => {
					uni.showToast({
						title: '打开失败'
					})
				},
				complete: () => {
					uni.hideLoading()
				},
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.file-item {
	display: flex;
	align-items: center;
	margin-bottom: 10px;

	.file-name {
		font-size: 14px;
		margin-left: 10px;
		color: #333;
	}
}

.img {
	width: 28px;
	height: 28px;
	vertical-align: middle;
}

.upload-button {
	border: 1px dashed #1989fa;
	height: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
	margin: 10px;
	text-align: center;
}

.option {
	background: white;
	text-align: center;
	padding: 10px 0;
	border-radius: 5px;
	margin: 0 5px;

	&:nth-of-type(1) {
		border-radius: 5px 5px 0 0;
		border-bottom: 1px solid #eee;
	}

	&:nth-of-type(2) {
		border-radius: 0 0 5px 5px;
		margin-bottom: 10px;
	}

	&:nth-of-type(3) {
		margin-bottom: 20px;
	}
}

.small {
	.file-item .file-name {
		font-size: 12px;
		color: #666;
	}

	.img {
		width: 20px;
		height: 20px;
		vertical-align: middle;
	}
}
</style>
