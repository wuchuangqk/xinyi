<template>
	<view class="app-page">
		<view class="list-search-wrap" style="display: flex;">
			<u-search placeholder="输入公司名称搜索" v-model="params.gsmc" :show-action="false" @search="search"
				@clear="search"></u-search>
			<u-icon name="more-circle" size="46" class="app-search-expend" @click="showFilterDialog = true"></u-icon>
		</view>
		<view class="page-main">
			<scroll-view v-if="listDataFmt.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
				<view class="list-wrap">
					<view v-for="item in listDataFmt" :key="item.id" class="app-list-item">
						<view class="item-title">
							<text>{{ item.mc }}</text>
						</view>
						<view class="app-flex-between color-gray">
							<view>
								<text class="label">公司法人：</text>
								<text class="value">{{ item.fr }}</text>
							</view>
						</view>
						<view v-if="item.files.length">
							<u-collapse>
								<u-collapse-item :title="`附件(${item.files.length})`">
									<FileViewer :files="item.files" />
								</u-collapse-item>
							</u-collapse>
						</view>
					</view>
				</view>
			</scroll-view>
			<page-empty v-else />
		</view>
		<u-popup v-model="showFilterDialog" mode="bottom" border-radius="14">
			<view class="app-popup-header">
				<text class="header-title">请选择</text>
				<u-icon class="close" name="close" @click="showFilterDialog = false"></u-icon>
			</view>
			<scroll-view scroll-y="true" style="height: 200px;">
				<view class="app-popup-body">
					<view class="picker-group">
						<view class="group-title"><text>公司名称</text></view>
						<view class="group-content" style="margin-bottom: 20px;">
							<u-search placeholder="请输入公司名称" v-model="params.gsmc" :show-action="false"
								:showSearchIcon="false"></u-search>
						</view>
					</view>
					<view class="picker-group">
						<view class="group-title"><text>公司法人</text></view>
						<view class="group-content" style="margin-bottom: 20px;">
							<u-search placeholder="请输入公司法人" v-model="params.gsfr" :show-action="false"
								:showSearchIcon="false"></u-search>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="app-popup-btn">
				<u-button shape="circle" size="medium" @click="reset">重置</u-button>
				<u-button type="primary" shape="circle" size="medium" @click="doSearch">确定</u-button>
			</view>
		</u-popup>
	</view>
</template>
<script>
import listMixin from '@/mixin/list'
import FileViewer from '@/components/file-viewer.vue'
export default {
	mixins: [listMixin],
	components: {
		FileViewer
	},
	data() {
		return {
			pathList: [
				'/zhgl/zgslist',
			],
			showFilterDialog: false,
			params: {
				gsmc: '',
				gsfr: '',
			}
		}
	},
	onShow() {
		this.listData = []
		this.fetchData()
	},
	computed: {
		listDataFmt() {
			const reg = /<a href='(?<fileurl>.*)'>(?<filename>.*)<\/a>/;
			return this.listData.map(val => {
				val.files = [];
				(val.file || []).forEach(file => {
					const result = reg.exec(file.files);
					if (result !== null) {
						const { fileurl, filename } = result.groups
						const fileext = fileurl.substring(fileurl.lastIndexOf('.'))
						val.files.push({
							filename,
							fileurl,
							fileext
						})
					}
				})
				return val
			})
		}
	},
	methods: {
		reset() {
			this.params.gsmc = ''
			this.params.gsfr = ''
			this.params.pageindex = 1
			this.search()
		},
		async fetchData() {
			uni.showLoading({
				title: '加载中',
				mask: false
			});
			const params = { pageindex: this.params.pageindex }
			if (this.params.gsmc) params.gsmc = this.params.gsmc
			if (this.params.gsfr) params.gsfr = this.params.gsfr
			this.doGet(this.pathList[this.activeTabIndex], params).then(res => {
				this.listData = this.listData.concat(res.data)
				this.hasnext = res.hasnext
				uni.hideLoading();
			}).catch(() => {
				uni.hideLoading();
			})
		},
		doSearch() {
			this.showFilterDialog = false
			this.search()
		}
	}
}
</script>
<style scoped lang="scss"></style>