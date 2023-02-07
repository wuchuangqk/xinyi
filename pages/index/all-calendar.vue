<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<attend-calendar type="all"></attend-calendar>
		</view>
	</view>
</template>

<script>
	import AttendCalendar from '@/components/attend-calendar.vue'
	export default {
		components:{AttendCalendar},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.page {
		min-height: 100%;
		background-color: $-bg-color;
	}
</style>
