<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<template v-if="dailyImg">
			<view class="card">
				<!-- <view class="card-title"><view class="left">进场交底</view></view> -->
				<image style="width: 100%;height: 500px;" :src="dailyImg" mode="aspectFit" @click="preview"></image>
			</view>
		</template>
		<view v-if="!dailyImg" class="card"><PageEmpty></PageEmpty></view>
		<view class="view-port">
			<button type="default" id="btn" @click="convert.toImg" :detailData="detailData" :change:detailData="convert.toImg">测试</button>
			<view class="preview-container">
				<view ref="target" class="target" id="target">
					<table>
						<tbody>
							<tr><td class="header">进场交底</td></tr>
							<tr>
								<td><text class="title">一、价格清单相关（以报价单内容进行解读）</text></td>
							</tr>
							<tr>
								<td>
									<view>技术参数重点（针对规格、厚度和表面处理工艺进行如何满足本项目进行交底）：</view>
									<view>{{ detailData.technology }}</view>
								</td>
							</tr>
							<tr>
								<td>
									<view>计量单位及结算面积（根据本项目分类明确计算公式及实际过程中从下单到现场安装的控制办法）：</view>
									<view>{{ detailData.metering }}</view>
								</td>
							</tr>
							<tr>
								<td>
									<view>税金（采购票据相关，主要扈阳和永景的开票成本和需要的发票种类）：</view>
									<view>{{ detailData.tax }}</view>
								</td>
							</tr>
							<tr>
								<td>
									<view>运输（运输成本和下单量控制及如何提前向财务申请运费资金）：</view>
									<view>{{ detailData.transport }}</view>
								</td>
							</tr>
							<tr>
								<td>
									<view>制作工艺解析：</view>
									<view>{{ detailData.workmanship }}</view>
								</td>
							</tr>

							<tr>
								<td><text class="title">二、合同相关（以合同内容进行解读）</text></td>
							</tr>
							<tr>
								<td>
									<view>合同是否签订及项目负责人需要接收的事务：</view>
									<view>{{ detailData.sign }}</view>
								</td>
							</tr>
							<tr>
								<td>
									<view>合同签订人与项目的关系：</view>
									<view>{{ detailData.relationship }}</view>
								</td>
							</tr>
							<tr>
								<td>
									<view>是否初次合作（初次合作要以全面配合为主，吃小亏赚长远，且重点交底合同不明确的事项如何应对）：</view>
									<view>{{ detailData.cooperation }}</view>
								</td>
							</tr>
							<tr>
								<td>
									<view>完成节点（详细交底与项目上前期沟通的施工部位先后顺序及重点按期完成时间）：</view>
									<view>{{ detailData.node }}</view>
								</td>
							</tr>
							<tr>
								<td>
									<view>打样交底（是否已打样，打样编号交底。根据工程量大小和合同签订表面处理方式进行打样时间和如何确定样品）：</view>
									<view>{{ detailData.template }}</view>
								</td>
							</tr>
							<tr>
								<td>
									<view>付款方式与过程控制办法：</view>
									<view>{{ detailData.payment }}</view>
								</td>
							</tr>

							<tr>
								<td><text class="title">三、安全交底（1.早晚会提醒 2.过程监督 3.不抱侥幸心理 4.做好表率）</text></td>
							</tr>
							<tr>
								<td>
									<view>根据本项目情况定部位、定方法交底：</view>
									<view>{{ detailData.security }}</view>
								</td>
							</tr>

							<tr>
								<td><text class="title">四、质量交底（1.早晚会提醒 2.过程监督 3.不抱侥幸心理 4.做好表率）</text></td>
							</tr>
							<tr>
								<td>
									<view>根据本项目情况定部位、定方法交底：</view>
									<view>{{ detailData.quality }}</view>
								</td>
							</tr>

							<tr>
								<td><text class="title">项目负责人交底确认</text></td>
							</tr>
							<tr>
								<td>
									<view v-for="item in detailData.infoVos || []" style="min-height: auto;">
										<text class="name">{{ item.userName }}：</text>
										<text>{{ item.content }}</text>
									</view>
								</td>
							</tr>
						</tbody>
					</table>
				</view>
			</view>
		</view>
		<view v-if="confirmData" class="footer">
			<view class="primary btn" @click="doConfirm">接收交底</view>
		</view>
	</view>
</template>

<script>
import { getWorkDetail, confirmDetail } from '@/api/project/peopleManage.js';
import { getFileInfo } from '@/api/system/file.js';
import PageEmpty from '@/components/page-empty.vue';
import { uploadHost } from '@/util/http';
import { base64ToPath } from 'image-tools';

export default {
	components: { PageEmpty },
	data() {
		return {
			dailyImg: null,
			detailData: {},
			projectId: null,
			confirmData: null,
		};
	},
	async onLoad({ projectId }) {
		this.projectId = projectId;
	},
	onReady() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			getWorkDetail(this.projectId).then(res => {
				if (res.discloseId !== null) {
					// 更新待阅
					uni.$emit(this.$events.UPDATE_TODO_STATE);
					this.detailData = res;
					uni.showLoading({
						title: '图片处理中...'
					});
					const userId = uni.getStorageSync(this.$const.USER_INFO).userId;
					// 当前账号是项目负责人之一，且状态是未确认
					this.confirmData = res.infoVos.find(v => v.userId === userId && v.state === 0)
					// if (this.confirmData) {
					// 	this.confirmData.content = '确认已清楚以上交底内容且按照交底运营项目，如有违反本人愿承担相应责任'
					// }
				}
			});
		},
		preview(type) {
			uni.previewImage({
				urls: [this.dailyImg],
				current: 0
			});
		},
		handleResult(url) {
			base64ToPath(url) //logoul为base64为图片流
				.then(path => {
					let imgsArray = [];
					uni.hideLoading();
					this.dailyImg = path;
				})
				.catch(error => {
					that.$refs.uToast.show({
						title: '图片加载失败',
						type: 'warning'
					});
					uni.hideLoading();
				});
			// this.dailyImg = url
		},
		// 接收交底
		doConfirm() {
			uni.showLoading({
				title: '正在提交',
				mask: true
			});
			this.confirmData.state = 1
			this.confirmData.content = '确认已清楚以上交底内容且按照交底运营项目，如有违反本人愿承担相应责任'
			confirmDetail(this.confirmData).then(() => {
				this.confirmData = null
				uni.hideLoading();
				uni.$emit(this.$events.UPDATE_TODO_STATE);
				this.fetchData()
			})
		}
	}
};
</script>
<script module="convert" lang="renderjs">
import html2canvas from 'html2canvas';
export default{
	methods: {
		toImg(event, ownerInstance) {
			this.$nextTick(() => {
				let el = document.getElementById('target')
				html2canvas(el).then(canvas => {
					const dataUrl = canvas.toDataURL('images/jpg');
					this.$ownerInstance.callMethod('handleResult', dataUrl)
				});
			})
		},
	}
}
</script>

<style lang="scss"></style>
<style scoped lang="scss">
@import '@/styles/detail.scss';
.page {
	min-height: 100%;
	background-color: $-bg-color;
}

.detail-item {
	.form-label {
		padding: 7px 10px 0 0;
		line-height: 1.5;
	}
}

.view-port {
	position: relative;
	width: 1000px;
	height: 0;
	overflow: hidden;
}
.preview-container {
	position: absolute;
	left: 0;
	right: 0;
	.target {
		padding: 40px;
		background: white;
	}
}
table,
th,
td {
	border: 1px solid #898989;
}

table {
	border-collapse: collapse;
	width: 100%;
}
h3 {
	text-align: center;
	font-weight: 500;
}
.title {
	font-weight: bold;
}
td {
	font-size: 14px;
	padding: 10px;
	uni-view:first-of-type {
		margin-bottom: 10px;
		&.title {
			margin-bottom: 0;
		}
	}

	uni-view:nth-of-type(2) {
		min-height: 40px;
	}
}
.header {
	text-align: center;
	font-size: 20px;
	font-weight: bold;
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
