<template>
	<view>
		<uni-swipe-action>
			<uni-swipe-action-item v-for="(item, index) in filesCopy"
				:right-options="mode === 'upload' ? uploadOptions : viewOptions" @click="(e) => onClick(e, item, index)">
				<view @click="clickFile(item)" class="file-item">
					<image class="img" mode="aspectFill" :src="item.url" alt="" />
					<!-- <text class="file-name">{{ item.fileName }}</text> -->
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<view v-if="mode === 'upload' && filesCopy.length < limit" @click="uploadImg" class="upload-button">
			<uni-icons type="plusempty" size="16" color="#1989fa"></uni-icons>
		</view>
		<neil-modal :show="showModel" title="提示" :content="modelContent" :show-cancel="false" @confirm="showModel = false"
			@close="showModel = false"></neil-modal>
	</view>
</template>

<script>
import {
	uploadHost
} from '@/util/http.js'
import NeilModal from '@/components/neil-modal/neil-modal.vue'
export default {
	name: "file-viewer",
	components: {
		NeilModal
	},
	props: {
		platform: {
			type: String,
			required: false
		},
		files: {
			type: Array,
			required: true
		},
		// view只做文件展示和下载
		// upload提供上传功能
		mode: {
			type: String,
			required: false,
			default: 'view'
		},
		limit: {
			type: Number,
			required: false,
			default: 1
		},
		fileType: {
			type: String,
			required: false,
			default: ''
		}
	},
	data() {
		return {
			svgMap: new Map([
				['pdf', '_pdf'],
				['docx', '_word'],
				['doc', '_word'],
				['xlsx', '_excel'],
				['xls', '_excel'],
				['pptx', '_excel'],
				['ppt', '_ppt'],
			]),
			uploadHost,
			showModel: false,
			modelContent: '',
			imgTyps: ['png', 'jpeg', 'jpg', 'gif'],
			viewOptions: [{
				text: '下载',
				style: {
					backgroundColor: '#007aff'
				}
			}],
			uploadOptions: [{
				text: '下载',
				style: {
					backgroundColor: '#007aff'
				}
			},
			{
				text: '删除',
				style: {
					backgroundColor: '#dd524d'
				}
			}
			],
			token: null,
			filesCopy: [],
			uploadUrlMap: {
				'oa': '/api/system/files/upload',
				'core': '/core/file/upload'
			},
			uploadFiles: [], // 保存上传成功的文件
		};
	},
	created() {
		this.token = uni.getStorageSync(this.$const.TOKEN)
		this.filesCopy = this.extendFiles(this.files)
	},
	watch: {
		files(newVal, oldVal) {
			if (newVal && newVal.length !== 0) {
				this.filesCopy = this.extendFiles(newVal)
			}
		}
	},
	methods: {
		imgLoadErr(item) {
			this.$set(item, 'imgErr', true)
		},
		extendFiles(fileList) {
			return fileList.map(v => {
				// const extend = v.webFilePath.substring(v.webFilePath.lastIndexOf('.') + 1)
				return {
					// fileId: v.fileId,
					fileName: '图片1',
					url: v.url
				}
			})
		},
		setFileUrl(url) {
			if (this.platform === 'project') {
				// url = url.replace('/upload', '')
			}
			return this.uploadHost[this.platform] + url
		},
		extendFile(file) {
			const extend = file.webFilePath.substring(file.webFilePath.lastIndexOf('.') + 1)
			return {
				fileId: file.fileId,
				fileName: file.fileName + '.' + extend,
				extend,
				url: this.uploadHost[this.platform] + file.webFilePath,
				isImg: this.imgTyps.includes(extend)
			}
		},
		onClick(e, item, index) {
			if (e.content.text === '删除') {
				uni.showLoading({
					title: '正在删除',
					mask: true
				})
				setTimeout(() => {
					this.filesCopy.splice(index, 1)
					this.uploadFiles.splice(index, 1)
					this.$emit('file-change', this.uploadFiles)
					uni.hideLoading()
				}, 500)
				return
			}
			uni.showLoading({
				title: '正在下载',
				mask: true
			})
			uni.downloadFile({
				url: item.url,
				success: (res) => {
					uni.saveFile({
						tempFilePath: res.tempFilePath,
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
				},
				fail: () => {
					uni.showToast({
						title: '下载失败',
						icon: 'none'
					})
				},
				complete: () => {
					uni.hideLoading()
				},
			})
		},
		clickFile(item) {
			if (item.imgErr) {
				this.modelContent = '图片地址有误无法预览'
				this.showModel = true
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
							this.modelContent = '文件打开失败，已为您下载到本地'
							this.showModel = true
							uni.saveFile({
								tempFilePath: filePath,
								success: () => {
									uni.showToast({
										title: '下载成功'
									})
								},
								fail: () => {
									uni.showToast({
										title: '下载失败'
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
		openModel() {
			this.$refs.popup.open()
		},
		closeModel() {
			this.$refs.popup.close()
		},
		uploadImg() {
			uni.chooseImage({
				count: 1,
				success: (res) => {
					this.uploadFiles.push({
						url: res.tempFilePaths[0],
						file: res.tempFiles[0]
					})
					this.filesCopy.push({
						fileName: '图片1',
						url: res.tempFilePaths[0],
					})
					this.$emit('file-change', this.uploadFiles)
				},
				fail: () => {
					/* uni.showToast({
						title: '未知错误',
						icon: 'none'
					}) */
				}
			})
		},
		doUpload(filePath) {
			const uploadUrl = this.uploadUrlMap[this.platform]
			uni.uploadFile({
				url: uploadHost[this.platform] + `${uploadUrl}?fileType=${this.fileType}`,
				filePath,
				name: 'file',
				header: {
					token: this.token
				},
				success: (res) => {
					this.filesCopy.push(this.extendFile(JSON.parse(res.data)))
					this.uploadFiles.push(JSON.parse(res.data))
					this.$emit('file-change', this.uploadFiles)
				},
				fail: (res) => {
					uni.showToast({
						title: '上传失败',
						icon: 'none'
					})
				},
				complete: () => {
					uni.hideLoading()
				}
			})
		}
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
</style>
