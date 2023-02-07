<template>
	<view class="page">
		<swiper class="swiper">
			<swiper-item>
				<view class="component-wrap" id="com1">
					<view class="fold-item" v-for="(item,index) in items">
						<view class="item-header">
							<text>{{item.title}}</text>
							<uni-icons type="arrowdown" @click="item.show = !item.show"></uni-icons>
						</view>
						<view v-show="item.show" class="item-section"></view>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="component-wrap" id="com2">
					<view class="fold-item" v-for="(item,index) in items2">
						<view class="item-header">
							<text>{{item.title}}</text>
							<uni-icons type="arrowdown" @click="item.show = !item.show"></uni-icons>
						</view>
						<view v-show="item.show" class="item-section"></view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: [
					{show: false, title: '标题1'},
					{show: false, title: '标题2'}
				],
				items2: [
					{show: false, title: '标题1'},
					{show: false, title: '标题2'}
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.page {
		height: 100%;
		.swiper {
			height: 100%;
		}
	}
	.component-wrap {
		height: 100%;
	}
	#com1 {
		background-color: aliceblue;
	}
	#com2 {
		background-color: antiquewhite;
	}
	.fold-item {
		background-color: white;
		margin: 0 10px 10px;
		.item-section {
			height: 80px;
		}
	}
</style>
