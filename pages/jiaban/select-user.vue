<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<view class="search-wrap">
					<u-search placeholder="输入用户姓名搜索" v-model="keyword" :show-action="false" @search="search"
						@clear="search"></u-search>
				</view>

				<u-cell-group>
					<u-cell-item v-for="user in listData" :key="user.userid" :title="user.displayname" :arrow="false">
						<u-checkbox v-model="user.checked"></u-checkbox>
					</u-cell-item>
				</u-cell-group>
			</scroll-view>
		</view>
		<view class="app-page-footer">
			<button class="btn" @click="submit">确定</button>
		</view>
	</view>
</template>

<script>
import AppSelect from '@/components/app-select.vue';
import FileViewer from '@/components/file-viewer.vue';

export default {
	components: { AppSelect, FileViewer },
	data() {
		return {
			listData: [],
			keyword: '',
			originData: [],
		};
	},
	onReady() {
		this.getListData()
	},
	methods: {
		submit() {
			const selectedUser = this.listData.filter(v => v.checked)
			this.$store.dispatch('selectedUsers', selectedUser)
			uni.navigateBack();
		},
		getListData() {
			this.doGet('/jiaban/QjUser').then(res => {
				this.listData = res.data.map(val => {
					val.checked = this.$store.state.selectedUsers.some(v => v.userid === val.userid)
					return val
				})
				this.originData = this.listData
			})
		},
		search() {
			if (this.keyword === '') {
				this.listData = this.originData
			} else {
				this.listData = this.listData.filter(v => v.displayname.indexOf(this.keyword) !== -1)
			}
		}
	}
};
</script>
<style scoped lang="scss">
.search-wrap {
	background-color: white;
	padding: 5px;
	margin-bottom: 10px;
}

/deep/ .u-checkbox__label {
	margin-right: 0;
}
</style>
