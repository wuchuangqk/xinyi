<template>
	<view class="app-page">
		<u-tabs-swiper ref="uTabs" :list="list" :is-scroll="false" :current="current" :offset="[5, 80]"
			@change="tabsChange"></u-tabs-swiper>
		<swiper style="height: 100%;" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<!-- 登记用章 -->
			<swiper-item class="swiper-item">
				<DangAnChaYue :yingtype="0" />
			</swiper-item>
			<!-- 公章外带 -->
			<swiper-item class="swiper-item">
				<DangAnChaYue :yingtype="1" />
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import DangAnChaYue from './components/DangAnChaYue.vue';
export default {
	components: { DangAnChaYue },
	data() {
		return {
			list: [
				{ name: '登记用章' },
				{ name: '公章外带' },
			],
			current: 0,
			swiperCurrent: 0,
			selectedUsers: [],
		}
	},
	methods: {
		tabsChange(index) {
			this.swiperCurrent = index;
		},
		transition(e) {
			let dx = e.detail.dx;
			this.$refs.uTabs.setDx(dx);
		},
		animationfinish(e) {
			let current = e.detail.current;
			this.$refs.uTabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
		},
	}
}
</script>

<style lang="scss" scoped></style>
