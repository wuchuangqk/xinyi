<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view v-if="listData.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
				<view class="list-wrap">
					<view v-for="item in listData" :key="item.id" class="app-list-item" @click="navToDetail(item.Id)">
						<view class="item-title">
							<text>{{ item.Situation }}</text>
							<view v-if="activeTabIndex === 0" class="btn">
								<u-button v-if="item.canwirte" plain size="mini" type="primary"
									@click="backTime(item.Id)">填写返回时间</u-button>
							</view>
						</view>
						<view class="app-flex-between color-gray">
							<view>
								<text class="label">外出时间：</text>
								<text class="value">{{ item.StartDate }}</text>
							</view>
							<view>
								<text class="label">申请人：</text>
								<text class="value">{{ item.DisplayName }}</text>
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
				'/beout/list',
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
				url: '/pages/waichu/form?type=add'
			});
		},
		navToDetail(id) {
			uni.navigateTo({
				url: `/pages/waichu/detail?dataId=${id}&type=detail`,
			});
		},
		// 填写返回时间
		backTime(id) {
			uni.navigateTo({
				url: `/pages/waichu/detail?dataId=${id}&type=backtime`,
			});
		}
	}
}
</script>
<style scoped lang="scss">
.item-title {
	display: flex;

	.btn {
		margin-left: auto;
	}
}
</style>