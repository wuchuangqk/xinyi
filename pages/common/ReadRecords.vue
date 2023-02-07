<template>
	<view class="page">
		<view class="tab">
			<view class="tab-item" :class="{active: activeTabIndex === 0}" @click="activeTabIndex = 0">
				<text>未读人员</text>
				<text v-if="readList.unRead.length !==0">({{readList.unRead.length}})</text>
				<view class="line"></view>
			</view>
			<view class="tab-item" :class="{active: activeTabIndex === 1}" @click="activeTabIndex = 1">
				<text>已读人员</text>
				<text v-if="readList.hasRead.length !==0">({{readList.hasRead.length}})</text>
				<view class="line"></view>
			</view>
		</view>
		<swiper class="swiper" :current="activeTabIndex" @change="swiperChange">
			<swiper-item>
				<scroll-view :scroll-y="true" style="height: 100%;">
					<view class="card">
						<view v-for="(item,index) in readList.unRead" :key="index" class="list-item">
							<text class="user-name">{{item.displayName}}</text>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item style="height: 100%;">
				<scroll-view :scroll-y="true" style="height: 100%;">
					<view class="card">
						<view v-for="(item,index) in readList.hasRead" :key="index" class="list-item">
							<text class="user-name">{{item.displayName}}</text>
							<text class="read-time">{{item.readTime}}</text>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		getReadingList
	} from '@/api/office/other.js'
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				readList: {
					hasRead: [],
					unRead: []
				},
				activeTabIndex: 0,
			}
		},
		// type: 2=通知公告
		onLoad({
			type,
			id
		}) {
			getReadingList(id, type).then(res => {
				res.records = res.records || []
				res.records.forEach((val) => {
					val.readTime = val.readTime ? dayjs(val.readTime).format('YYYY-MM-DD HH:mm') : null
					if (+val.isReads === 0) {
						this.readList.unRead.push(val)
					} else {
						this.readList.hasRead.push(val)
					}
				});
			})
		},
		methods: {
			swiperChange(e) {
				this.activeTabIndex = e.detail.current
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100%;
		background-color: $-bg-color;
		display: flex;
		flex-direction: column;

		.swiper {
			flex: 1;
		}
	}

	.tab {
		display: flex;
		width: 100%;
		justify-content: space-evenly;
		margin: 10px 0;

		.tab-item {
			flex: 1;
			position: relative;
			color: #8c8c8c;
			text-align: center;
			font-size: 15px;

			&.active {
				color: #1989fa;

				.line {
					display: block;
				}
			}
		}

		.line {
			display: none;
			position: absolute;
			background-color: #1989fa;
			left: 50%;
			transform: translateX(-50%);
			width: 25%;
			height: 3px;
			border-radius: 2px;
			bottom: -5px
		}
	}

	.list-item {
		display: flex;
		justify-content: space-between;
		font-size: 15px;
		padding: 10px 0;

		.read-time {
			font-size: 14px;
			color: #9c9c9c;
		}
	}
</style>
