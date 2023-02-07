<template>
	<uni-transition :mode-class="['slide-bottom']" timingFunction="ease-in" :styles="styles" :show="show"
		:duration="200">
		<slot></slot>
	</uni-transition>
</template>

<script>
	export default {
		props: {
			show: {
				type:Boolean,
				required:true,
				default:false
			}
		},
		data() {
			return {
				styles: {
					'position': 'absolute',
					'top': 0,
					'left': 10 + 'px',
					'right': 10 + 'px',
					'bottom': 0,
				}
			}
		}
	}
</script>

<style>
</style>
