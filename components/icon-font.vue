<template>
	<i class="iconfont" :class="icon"></i>
</template>

<script>
	export default {
		name:"IconFont",
		props: {
			// 图标类名
			icon: {
				type: String,
				required: true
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
 @import "../static/iconfont/iconfont.css";
 .iconfont {
	 font-size: 32rpx;
 }
</style>
