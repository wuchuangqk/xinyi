<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<view class="detail-item" style="padding: 5px 0 5px 0;">
				<text class="label form-label">日期</text>
				<view class="value"><uni-datetime-picker style="width: 130px;" type="date" :value="journalTime" :showClear="false" @change="handleChange" :border="false" /></view>
			</view>
		</view>
		<template v-if="hasData">
			<view class="card">
				<view class="card-title">
					<view class="left">施工日志</view>
				</view>
				<image :src="dailyImg" mode="aspectFit" @click="preview(1)"></image>
			</view>
			<view class="card">
				<view class="card-title">
					<view class="left">明日安排</view>
				</view>
				<image :src="planImg" mode="aspectFit" @click="preview(2)"></image>
			</view>
		</template>
		<view v-if="!hasData" class="card">
			<PageEmpty></PageEmpty>
		</view>
	</view>
</template>

<script>
import { getInfoByTime } from '@/api/project/workDaily.js';
import { getFileInfo } from '@/api/system/file.js';
import PageEmpty from '@/components/page-empty.vue';
import { uploadHost } from '@/util/http'

export default {
	components: { PageEmpty },
	data() {
		return {
			showModel: false,
			content: '',
			journalTime: '',
			projectId: '',
			hasData: false,
			dailyImg: null,
			planImg: null,
		};
	},
	async onLoad({ projectId }) {
		this.projectId = projectId;
		this.journalTime = this.$dayjs().format('YYYY-MM-DD');
		this.fetchData();
	},
	methods: {
		fetchData() {
			this.hasData = false
			// 查询今天的日志，回显出图片
			Promise.all([
				getInfoByTime(this.projectId, this.journalTime, 0), // 施工日志
				getInfoByTime(this.projectId, this.$dayjs(this.journalTime).add(1,'day').format('YYYY-MM-DD'), 1), // 明日安排
			]).then(([daily, plan]) => {
				if(daily.xmJournalInfoList === null) {
					this.hasData = false
					return
				} else {
					this.hasData = true
				}
				getFileInfo(daily.fileCode).then(res => {
					this.dailyImg = uploadHost.core + res.webFilePath
				})
				getFileInfo(plan.fileCode).then(res => {
					this.planImg = uploadHost.core + res.webFilePath
				})
			})
		},
		handleChange(e) {
			this.journalTime = e;
			this.fetchData();
		},
		preview(type) {
			const url = type === 1 ? this.dailyImg : this.planImg
			uni.previewImage({
				urls: [url],
				current: 0
			})
		}
	}
};
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

</style>
