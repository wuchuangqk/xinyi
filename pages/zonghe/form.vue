<template>
	<view class="app-page">
		<u-tabs-swiper ref="uTabs" :list="list" :is-scroll="false" :current="current" :offset="[5, 80]"
			@change="tabsChange"></u-tabs-swiper>
		<swiper style="height: 100%;" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<!-- 档案查阅 -->
			<swiper-item class="swiper-item">
				<DangAnChaYue type="公司档案查阅" />
			</swiper-item>
			<!-- 档案借出 -->
			<swiper-item class="swiper-item">
				<DangAnChaYue type="公司档案借出" />
			</swiper-item>
			<!-- 事务申请 -->
			<swiper-item class="swiper-item">
				<ShiWuShenQing :selectedUsers="selectedUsers" />
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import DangAnChaYue from './components/DangAnChaYue.vue';
import ShiWuShenQing from './components/ShiWuShenQing.vue';
export default {
	components: { DangAnChaYue, ShiWuShenQing },
	data() {
		return {
			list: [
				{ name: '档案查阅' },
				{ name: '档案借出' },
				{ name: '事务申请' },
			],
			current: 0,
			swiperCurrent: 0,
			selectedUsers: [],
		}
	},
	onShow() {
		// 读取选择的用户
		this.selectedUsers = this.$store.state.selectedUsers
	},
	onUnload() {
		this.$store.dispatch('selectedUsers', [])
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
