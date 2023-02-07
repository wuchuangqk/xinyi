<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view v-if="imgUrl" class="img-wrap"><image :src="imgUrl" mode="aspectFill"></image></view>
		<view v-else @click="uploadImg" class="add-img-wrap">
			<uni-icons type="plusempty" class="add-img" color="rgba(25, 137, 250, 0.56)" size="50">
				
			</uni-icons></view>
		<view><button class="btn" :loading="submitLoading" v-if="imgCode !== null" @click="submit">保存</button></view>
	</view>
</template>

<script>
import { uploadHost } from '@/util/http.js';
import { uploadHeadImg } from '@/api/user.js';
export default {
	data() {
		return {
			imageValue: [],
			imgUrl: '',
			token: null,
			imgCode: null,
			submitLoading: false,
			userId: null
		};
	},
	onLoad() {
		this.token = uni.getStorageSync(this.$const.TOKEN);
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
	},
	methods: {
		uploadImg(type) {
			uni.chooseImage({
				count: 1,
				success: res => {
					uni.showLoading({
						title: '正在上传',
						mask: true
					});
					uni.uploadFile({
						url: uploadHost.core + '/core/file/upload?fileType=UserHeadImage',
						filePath: res.tempFilePaths[0],
						name: 'file',
						header: {
							token: this.token
						},
						success: res => {
							const { fileId, webFilePath } = JSON.parse(res.data);
							this.imgUrl = uploadHost.core + webFilePath;
							this.imgCode = fileId;
						},
						fail: res => {
							uni.showToast({
								title: '上传失败',
								icon: 'none'
							});
						},
						complete: () => {
							uni.hideLoading();
						}
					});
				},
				fail: (err) => {
					// console.log(err)
					/* uni.showToast({
						title: '未知错误',
						icon: 'none'
					}); */
				}
			});
		},
		submit() {
			if (this.submitLoading) {
				return;
			}
			this.submitLoading = true;
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			uploadHeadImg(this.imgCode, this.userId)
				.then(() => {
					const userInfo = uni.getStorageSync(this.$const.USER_INFO)
					userInfo.headPath = this.imgUrl
					uni.setStorageSync(this.$const.USER_INFO, userInfo)
					uni.$emit(this.$events.UPDATE_USER_INFO)
					uni.hideLoading();
					uni.navigateBack();
				})
				.catch(() => {
					uni.showToast({
						title: '提交失败',
						icon: 'none'
					});
					uni.hideLoading();
				});
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: 100%;
	background-color: $-bg-color;
}
.add-img-wrap {
	border: 1px dashed #1989fa;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 200px;
	height: 200px;
	border-radius: 50%;
	background: white;
	margin: 20px auto 0;

	.add-img {
		font-size: 50px;
		color: rgba(25, 137, 250, 0.56);
	}
}

.btn {
	background-color: #1989fa;
	color: white;
	margin: 20px 10px;
	font-size: 14px;
}
.img-wrap {
	width: 200px;
	height: 200px;
	margin: 20px auto 0;
	background-color: white;
	border-radius: 50%;
	overflow: hidden;
	image {
		width: 100%;
		height: 100%;
	}
}
</style>
