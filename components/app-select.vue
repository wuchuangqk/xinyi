<template>
	<view class="app-select">
		<picker @change="handleChange" :value="index" :disabled="disabled" :range="selectData" range-key="label">
			<view class="picker-content">{{selectData[index].label}}</view>
		</picker>
		<uni-icons type="arrowdown" color="#666" size="14" style="margin-left: 3px;"></uni-icons>
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
				required: true
			},
      // 是否禁用
      disabled: {
        type: Boolean,
        required: false,
        default: false
      }
		},
		data() {
			return {
				index: 0
			}
		},
		watch: {
			value(newVal, oldVal) {
				const index = this.selectData.findIndex(v => v.value === newVal)
				if(index !== -1) {
					this.index = index
				}
			}
		},
		created() {
			const index = this.selectData.findIndex(v => v.value === this.value)
			if(index !== -1) {
				this.index = index
			}
		},
		methods: {
			handleChange(e) {
				this.index = e.target.value
				this.$emit('select-change', this.selectData[this.index].value)
				this.$emit('change', this.selectData[this.index].value)
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
	.app-select {
		display: flex;
		align-items: center;
	}
</style>
