<template>
	<view class="app-radio">
		<radio-group @change="handleChange">
			<label v-for="item in selectData" style="margin-right: 30px;">
				<radio class="small" :value="item.value" :checked="checkedValue === item.value" />
				{{item.label}}
			</label>
		</radio-group>
	</view>
</template>

<script>
	export default {
		model: {
			prop: "value",
			event: "select-change",
		},
		props: {
			selectData: {
				type: Array,
				required: true
			},
			value: {
				type: [String],
				required: true
			}
		},
		data() {
			return {
				checkedValue: null
			}
		},
		created() {
			this.checkedValue = this.value
		},
		watch: {
			value(newVal, oldVal) {
				this.checkedValue = newVal
			}
		},
		methods: {
			handleChange(e) {
				this.checkedValue = e.target.value
				this.$emit('select-change', this.checkedValue)
			}
		}
	}
</script>

<style scoped lang="scss">
	.app-radio {
		min-height: 36px;
		line-height: 36px;
		padding-left: 10px;
	}
	.small {
		/deep/ .uni-radio-input {
			transform: scale(0.8);
		}
	}
	
</style>
