<template>
	<view class="card">
		<view class="card-title">
			<view class="left"><text>待阅事项</text></view>
			<view class="right"><navigator url="/pages/office/to-do-work?tab=read" style="color:#1989fa;" hover-class="none">更多</navigator></view>
			<!-- <button type="default" @click="getSchedule()">更多</button> -->
		</view>
		<view class="list-item" v-for="(item, index) in listData" :key="index" @click="handleRead(item)">
			<view class="row top">
				<text class="item-title">{{ item.title }}</text>
				<!-- <view class="state">未读</view> -->
			</view>
			<view class="row bottom">
				<text>{{ item.createTime }}</text>
				<text>{{ item.type }}</text>
			</view>
		</view>
		<neil-modal :show="showModel" title="提示" content="此功能正在开发中" :show-cancel="false" align="center" @confirm="showModel = false" @close="showModel = false"></neil-modal>
	</view>
</template>

<script>
import dayjs from 'dayjs';
import todo from '@/mixin/todo.js'
import {
		getTodoRead
	} from '@/api/core/notification.js'
export default {
	mixins:[todo],
	data() {
		return {
			listData: [],
			userId: null,
			showModel: false
		};
	},
	created() {
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		this.fetchData();
		uni.$on(this.$events.UPDATE_TODO_STATE, () => {
			this.listData.length = 0;
			this.fetchData();
		});
	},
	methods: {
		fetchData() {
			getTodoRead(this.userId).then(res => {
				this.listData = res || [];
				const badge = uni.getStorageSync(this.$const.BADGE_COUNT);
				badge.todo_read = this.listData.length;
				uni.setStorageSync(this.$const.BADGE_COUNT, badge);
				this.$emit('update-count', {
					index: 3,
					count: this.listData.length
				});
				this.$emit('load-done');
			});
		},
		
	}
};
</script>

<style scoped lang="scss">
.card-title {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;

	.left {
		color: #b1b1b1;
	}
}

.list-item {
	border-bottom: 1px solid #f1f1f1;
	padding-bottom: 10px;
	margin-bottom: 15px;

	&:last-of-type {
		border-bottom: none;
		padding-bottom: 0;
		margin-bottom: 0;
	}
}

.top {
	display: flex;
	justify-content: space-between;
	font-size: 15px;

	.item-title {
		flex: 1;
	}

	.state {
		flex-shrink: 0;
	}
}

.bottom {
	color: #adadad;
	font-size: 13px;
	margin-top: 10px;
	display: flex;
	justify-content: space-between;
}
</style>
