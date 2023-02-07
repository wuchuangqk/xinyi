<template>
	<view class="card" style="margin-top: 0;margin-bottom: 0;">
		<view class="card-title">
			<view class="left"><text>今日永景</text></view>
			<view class="right"><navigator url="/pages/index/wen-xuan-list" style="color:#1989fa;" hover-class="none">更多</navigator></view>
		</view>
		<view class="list-item" v-for="(item, index) in listData" :key="index" @click="goDetail(item.infoId)">
			<view class="row top">
				<text class="item-title">{{ item.infoTitle }}</text>
				<!-- <view class="state" :class="+item.isReads === 0 ? 'un-read' : 'has-read'">{{ +item.isReads === 0 ? '未读' : '已读' }}</view> -->
			</view>
			<!-- <view class="row bottom">
				<text>{{ item.created }}</text>
				<text>{{ item.creatorName }}</text>
			</view> -->
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs';
import { getWenXuan } from '@/api/office/wenXuan.js';
export default {
	data() {
		return {
			listData: [],
			infoTitle: '',
			pageIndex: 1,
			pageSize: 10
		};
	},
	created() {
		this.fetchData();
		uni.$on(this.$events.UPDATE_WEN_XUAN_STATE, () => {
			this.listData.length = 0;
			this.fetchData();
		});
	},
	methods: {
		fetchData() {
			getWenXuan(this.pageIndex, this.pageSize).then(res => {
				res.records = res.records || [];
				res.records.forEach(v => (v.created = v.created ? dayjs(v.created).format('YYYY-MM-DD') : null));
				this.listData = res.records;
				/* const badge = uni.getStorageSync(this.$const.BADGE_COUNT)
					badge.notice = this.listData.length
					uni.setStorageSync(this.$const.BADGE_COUNT, badge) */
				this.$emit('update-count', {
					index: 3,
					count: this.listData.filter(v => +v.isReads === 0).length
				});
				this.$emit('load-done', {type: 'wen-xuan'});
			});
		},
		loadMore() {
			if (this.isLoadingMore || this.isLoadAll) {
				return;
			}
			this.pageIndex++;
			this.more = 'loading';
			this.fetchData();
		},
		reload() {
			this.pageIndex = 1;
			this.listData.length = 0;
			this.fetchData();
		},
		goDetail(infoId) {
			uni.navigateTo({
				url: '/pages/index/wen-xuan-detail?infoId='+ infoId
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import '@/styles/list.scss';
</style>
