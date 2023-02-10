<template>
	<view class="app-page">
		<view class="list-search-wrap">
			<u-search placeholder="输入标题搜索" v-model="params.title" :show-action="false" @search="search"
				@clear="search"></u-search>
		</view>
		<view class="page-main">
			<scroll-view v-if="listData.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
				<view class="list-wrap">
					<view v-for="item in listData" :key="item.id" class="app-list-item" @click="navToDetail(item.id)">
						<view class="item-title">
							<text :class="{ primary: item.read === '0' }" class="state">
								[{{ item.read === '0' ? '未读' : '已读' }}]
							</text>
							<text>{{ item.title }}</text>
						</view>
						<view class="app-flex-between color-gray">
							<view>
								<text class="label">发布人：</text>
								<text class="value">{{ item.creator }}</text>
							</view>
							<view>
								<text class="label">发布日期：</text>
								<text class="value">{{ item.date }}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<page-empty v-else />
		</view>
		<float-button @click="navAdd" />
	</view>
</template>
<script>
import listMixin from '@/mixin/list'
export default {
	mixins: [listMixin],
	data() {
		return {
			pathList: [
				'/notices/list',
			]
		}
	},
	onShow() {
		this.listData = []
		this.fetchData()
	},
	methods: {
		navAdd() {
			uni.navigateTo({
				url: '/pages/notice/form'
			});
		},
		navToDetail(id) {
			uni.navigateTo({
				url: `/pages/noticeDetail/noticeDetail?dataId=${id}`,
			});
		},
	}
}
</script>
<style scoped lang="scss">

</style>