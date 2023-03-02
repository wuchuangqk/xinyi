<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view style="height: 1px;"></view>
				<view class="card">
					<view v-for="item in detailList" :key="item.label" class="detail-item">
						<text class="label">{{ item.label }}</text>
						<text class="value" v-html="detail[item.field]"></text>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 只有创建人和责任人可以填写 -->
		<view v-if="detail.hasRight" class="app-page-footer">
			<button class="btn" @click="submit">填写工作计划</button>
		</view>
	</view>
</template>

<script>
import FileViewer from '@/components/image-viewer.vue';

export default {
	components: {
		FileViewer,
	},
	data() {
		return {
			detailList: [
				{ label: '年月', field: 'NianYue' },
				{ label: '工作分类', field: 'MonthTypeName' },
				{ label: '项目名称', field: 'ProjectName' },
				{ label: '工作计划', field: 'JiHua' },
				{ label: '工作完成情况', field: 'JiHuaCheck' },
				{ label: '下月工作计划', field: 'NextJiHua' },
				{ label: '存在的问题及需领导解决的事项', field: 'ProblemWork' },
				{ label: '责任人', field: 'zrr' },
			], // 详情字段
			detail: {},
			dataId: '', // 主键id
		};
	},
	onLoad({ dataId, }) {
		this.dataId = dataId
	},
	onShow() {
		this.getDetail()
	},
	methods: {
		getDetail() {
			this.doGet('/month/list/' + this.dataId).then(res => {
				res.data.MonthTypeName = res.data.MonthType == 1 ? '日常工作' : '重点工作';
				this.detail = res.data
			})
		},
		submit() {
			uni.navigateTo({
				url: '/pages/plan/report?dataId=' + this.dataId
			});
		},
	}
};
</script>
<style scoped lang="scss">
@import '@/styles/detail.scss';

.card .card-title {
	margin-bottom: 15px;
}

.btn-wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.btn {
		flex: 1;
	}
}
</style>
