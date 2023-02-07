<template>
	<view class="tab-page">
		<uni-collapse accordion="true">
			<uni-collapse-item :showAnimation="true" title="项目附件" class="title-color-type1">
				<view class="expanded-content">
					<view v-for="(item, index) in projectFiles" class="file-item" @click="showFileDetail(item)">
						<view style="display: flex;">
							<image class="img" :src="item.icon" mode="aspectFill" @error="setDefaultIcon(item)"></image>
							<text class="app-text-overflow">{{ item.fileName }}</text>
						</view>
						<uni-icons type="arrowright" size="14" color="#919191"></uni-icons>
					</view>
				</view>
			</uni-collapse-item>
			<uni-collapse-item :showAnimation="true" title="资料汇总" class="title-color-type2">
				<view class="list-item" v-for="tender in profileSummary" @click="showNodeDetail(tender)">
					<view class="list-item-title">{{ tender.title }}</view>
					<view class="info">
						<view class="info-item">
							<view class="icon"><!-- <img src="assets/icon/user.png" alt=""> --></view>
							<text>类别:{{ tender.dataTypeTitle }}</text>
						</view>
						<view class="info-item">
							<view class="icon"><!-- <img src="assets/icon/user2.png" alt=""> --></view>
							<text>添加人:{{ tender.creatorName }}</text>
						</view>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>

		<!-- 项目附件 -->
		<detail-wrapa :show="isShowFile">
			<view class="detail-mode">
				<view class="detail-mode-head">
					<text class="head-title">{{ fileDetail.fileName }}</text>
					<uni-icons type="arrowdown" class="close" @click="isShowFile = false"></uni-icons>
				</view>
				<view class="detail-mode-content">
					<view class="detail-mode-content-item">
						<text class="label">附件类型：</text>
						<text class="value">{{ fileDetail.filetype }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">添加人：</text>
						<text class="value">{{ fileDetail.creatorName }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">添加时间：</text>
						<text class="value">{{ fileDetail.createdTime }}</text>
					</view>
					<view v-if="fileDetail.isImg && !fileDetail.isLoadImgFail" class="detail-mode-content-item"><image :src="fileDetail.url" mode="aspectFill"></image></view>
					<view class="detail-mode-content-item" style="justify-content: space-evenly;">
						<view class="btn view" @click="preview(fileDetail)">预览</view>
						<view class="btn download" @click="download(fileDetail)">下载</view>
					</view>
				</view>
			</view>
		</detail-wrapa>

		<!-- 资料汇总 -->
		<detail-wrapa :show="showModel">
			<view class="detail-mode">
				<view class="detail-mode-head">
					<text class="head-title">{{ profileDetail.title }}</text>
					<uni-icons type="arrowdown" class="close" @click="showModel = false"></uni-icons>
				</view>
				<view class="detail-mode-content">
					<view class="detail-mode-content-item">
						<text class="label">创建时间：</text>
						<text class="value">{{ profileDetail.createdTime }}</text>
					</view>
					<view class="detail-mode-content-item file">
						<view class="label">附件：</view>
						<file-viewer :files="profileDetail.fileList || []" platform="project"></file-viewer>
					</view>
					<view class="detail-mode-content-item rich-text" v-html="profileDetail.remark"></view>
				</view>
			</view>
		</detail-wrapa>
	</view>
</template>

<script>
import { getDataPageList, getFilesPageList, getById } from '@/api/project/projectProfile.js';
import DetailWrapa from './detail-wrap.vue';
import FileViewer from '@/components/file-viewer.vue';
import { uploadHost } from '@/util/http.js';
export default {
	props: {
		projectId: {
			type: Number,
			required: true
		}
	},
	components: { DetailWrapa, FileViewer },
	data() {
		return {
			showModel: false,
			isShowFile: false,
			profileDetail: {},
			projectFiles: [], // 项目附件
			profileSummary: [], // 资料汇总
			fileDetail: {},
			imgTyps: ['png', 'jpeg', 'jpg', 'gif'],
			svgIconMap: new Map([
				['pdf', '/static/svg/_pdf.svg'],
				['docx', '/static/svg/_word.svg'],
				['doc', '/static/svg/_word.svg'],
				['xlsx', '/static/svg/_excel.svg'],
				['xls', '/static/svg/_excel.svg'],
				['pptx', '/static/svg/_excel.svg'],
				['ppt', '/static/svg/_ppt.svg']
			])
		};
	},
	created() {
		getFilesPageList(this.projectId).then(res => {
			this.projectFiles = (res.records || []).map(v => {
				const extend = v.filePath.substring(v.filePath.lastIndexOf('.') + 1);
				v.extend = extend;
				v.fileName = v.fileName + '.' + extend;
				v.url = uploadHost.project + v.filePath.replace('/upload', '');
				v.isImg = this.imgTyps.includes(extend);
				v.isLoadImgFail = false;
				if (v.isImg) {
					v.icon = v.url;
				} else {
					v.icon = this.svgIconMap.get(extend) || '/static/svg/_unknow.svg';
				}
				return v;
			});
		});

		getDataPageList(this.projectId).then(res => {
			this.profileSummary = res.records || [];
		});
	},
	methods: {
		showNodeDetail({ dataId }) {
			getById(dataId).then(res => {
				this.profileDetail = res;
			});
			this.showModel = true;
		},
		// 图片加载失败时，显示默认图片图标
		setDefaultIcon(item) {
			item.isLoadImgFail = true;
			item.icon = '/static/svg/_img.svg';
		},
		showFileDetail(item) {
			this.fileDetail = item;
			this.isShowFile = true;
		},
		preview(item) {
			// 判断文件类型
			if (item.isImg) {
				uni.previewImage({
					urls: [item.url],
					current: 0
				});
				return;
			}
			uni.showLoading({
				title: '正在打开文件',
				mask: true
			});
			uni.downloadFile({
				url: item.url,
				success: res => {
					var filePath = res.tempFilePath;
					uni.openDocument({
						filePath: filePath,
						success: () => {},
						fail: () => {
							uni.showToast({
								title: '文件打开失败，已为您下载到本地',
								icon: 'none'
							});
							uni.saveFile({
								tempFilePath: filePath,
								success: () => {
									uni.showToast({
										title: '下载成功'
									});
								},
								fail: () => {
									uni.showToast({
										title: '下载失败'
									});
								}
							});
						}
					});
				},
				fail: () => {
					uni.showToast({
						title: '打开失败'
					});
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		download(item) {
			uni.showLoading({
				title: '正在下载',
				mask: true
			});
			uni.downloadFile({
				url: item.url,
				success: res => {
					uni.saveFile({
						tempFilePath: res.tempFilePath,
						success: () => {
							uni.showToast({
								title: '下载成功',
								icon: 'none'
							});
						},
						fail: () => {
							uni.showToast({
								title: '下载失败',
								icon: 'none'
							});
						}
					});
				},
				fail: () => {
					uni.showToast({
						title: '下载失败',
						icon: 'none'
					});
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import '../style/common.scss';

.file-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.img {
		width: 20px;
		height: 20px;
		margin-right: 5px;
		vertical-align: middle;
	}
}
.btn {
	width: 30%;
	display: flex;
	font-size: 13px;
	justify-content: center;
	align-items: center;
	padding: 7px;
	border-radius: 30px;
	color: white;
	&.view {
		background-color: #dd524d;
	}
	&.download {
		background-color: #1989fa;
	}
}
.list-item {
	//margin: 0.533rem 0.533rem;
	background-color: white;
	border-radius: 6px;
	position: relative;

	&:first-of-type {
		margin-top: 0.107rem;
	}
	.list-item-title {
		font-size: 13px;
		color: #333;
		line-height: 20px;
		padding-top: 15px;
		margin: 0 12px 10px 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.info {
		border-top: 1px solid #fafafa;
		font-size: 12px;
		color: #999;
		display: flex;
		padding: 10px 12px;

		.info-item:nth-of-type(1) {
			//width: 24%;
			.icon {
				background-color: #0066ff;
			}
		}

		.info-item:nth-of-type(2) {
			//width: 27%;
			.icon {
				background-color: #ff6600;
			}
		}

		.info-item:nth-of-type(3) {
			//width: 49%;
			.icon {
				background-color: #ff0000;
			}
		}

		.info-item {
			display: flex;
			align-items: center;
			margin: 0 0.533rem 0 0;

			.icon {
				width: 0.7rem;
				height: 0.7rem;
				border-radius: 50%;
				//padding: 0.267rem;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 0.213rem;
				flex-shrink: 0;

				img {
					width: 60%;
					height: 60%;
					object-fit: cover;
				}
			}
			span {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
			}
		}
	}
}
</style>
