<template>
	<picker mode="date" :value="date" @change="handleChange">
		<view class="picker-content">{{date}}</view>
	</picker>
</template>

<script>
	export default {
		model: {
			prop: "value",
			event: "select-change",
		},
		props: {
			value: {
				type: [String, Date],
				required: true
			}
		},
		data() {
			return {
				date: ''
			}
		},
		created() {
			this.date = this.$dayjs().format('YYYY-MM-DD')
		},
		methods: {
			handleChange(e) {
				this.date = e.target.value
				this.$emit('select-change', this.date)
			}
		}
	}
</script>

<style scoped lang="scss">
	.picker-content {
		min-height: 36px;
		line-height: 36px;
		padding-left: 10px;
	}
</style>
