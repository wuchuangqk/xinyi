<template>
	<view>
		<view @click="open()">
			<slot></slot>
		</view>
		<uni-popup ref="popup" type="bottom" :maskClick="false" @maskClick="cancel">
			<view class="wrap">
				<view class="header">
					<text @click="cancel">取消</text>
					<text class="title">请选择</text>
					<text @click="confirm">确定</text>
				</view>
				<view class="body">
					<view v-for="(item, index) in selectData" :key="index" class="item" :class="{ checked: isChecked(item), disabled: isDisabled(item) }" @click="doSelect(item)">
						{{ item.label }}
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	props: {
		selectData: {
			type: Array,
			required: true
		},
		value: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			selectDataCopy: []
		};
	},
	methods: {
		open() {
			this.$refs.popup.open();
			// 创建副本
			this.selectDataCopy = JSON.parse(JSON.stringify(this.value))
		},
		close() {
			this.$refs.popup.close();
		},
		confirm() {
			this.$emit('select-change', this.selectDataCopy)
			this.$emit('confirm', {
				ids: this.selectDataCopy,
				names: this.formatName(this.selectDataCopy)
			});
			this.close();
		},
		formatName(ids) {
			const names = []
			ids.forEach(id => {
				const temp = this.selectData.find(v => v.value === id)
				names.push(temp ? temp.label : id)
			})
			return names;
		},
		cancel() {
			// 当关闭时，把所有不在数组里，但是是选中状态的项移除掉
			this.selectData.forEach(item => {
				if(!this.isDisabled(item)) {
					if(this.isChecked(item) && !this.value.includes(item.value)) {
						item.checked = false
					}
				}
			})
			this.$emit('cancel');
			this.close();
		},
		doSelect(item) {
			// 当点击一个禁用的选项时，它同时也是选中状态的
			// 如果当前数组没有这个选项，说明它不是在这个数组里被选择的
			if(this.isDisabled(item)) {
				return
			}
			if(this.isChecked(item)) {
				item.checked = false
			} else {
				item.checked = true
			}
			// 当选中一项时，加进数组里
			if(item.checked) {
				this.selectDataCopy.push(item.value)
			} else {
				const index = this.selectDataCopy.findIndex(id => id === item.value)
				this.selectDataCopy.splice(index, 1)
			}
		},
		isDisabled(item) {
			// 在被选中的情况，如果当前数组不包含则禁用
			return item.checked && !this.selectDataCopy.some(id => id === item.value)
		},
		// 选中的条件：当前数组包含这个选项
		isChecked(item) {
			return this.selectDataCopy.some(id => id === item.value)
		}
	}
};
</script>

<style scoped lang="scss">
.wrap {
	height: 300px;
	background-color: white;
	display: flex;
	flex-direction: column;
	.header {
		flex-shrink: 0;
		display: flex;
		justify-content: space-between;
		padding: 10px 15px;
		border-bottom: 1px solid #eee;
		.title {
			font-size: 16px;
		}
	}
	.body {
		flex: 1;
		overflow: auto;
		padding: 15px;
		.item {
			display: inline-block;
			background-color: #f3f3f3;
			padding: 5px 10px;
			margin: 0 7px 7px 0;
			font-size: 13px;
			border-radius: 4px;
			color: #555;
			&.disabled {
				color: #a9a9a9;
			}
			&.checked {
				background: #1989fa;
				color: white;
			}
		}
	}
}
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
