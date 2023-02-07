<template>
	<view class="mask">
		<view class="search-container" ref="search">
			<view class="title">
				<uni-search-bar ref="search" v-model="searchParams.params" style="padding: 0;" :radius="100" placeholder="查询负责人、项目名称、项目码"
					cancelButton="none" :clearState="clearState"></uni-search-bar>
			</view>
			<view class="bottom-btn">
				<view class="btn" @click="reset">重置</view>
				<view class="btn primary" @click="submit">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchParams: {
					params:'',//params
				},
				clearState: 0
			}
		},
		computed: {
			
		},
		methods: {
			
			// 重置
			reset() {
				this.searchParams = {
					params: '',
				}
				this.clearState++
				this.submit()
			},
			submit(){
				this.searchParams.params = this.searchParams.params ? this.searchParams.params.value : ''
				// console.log("searchParams",this.searchParams.params)
				this.$emit('search', {
					params: this.searchParams,
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	$border: 1px solid #e5e5e5;

	.mask {
		position: fixed;
		background-color: rgba(0, 0, 0, 0.4);
		// #ifdef H5
		top: 44px;
		// #endif
		// #ifdef APP-PLUS
		top: 0;
		// #endif
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999;
	}

	.search-container {
		background-color: white;
		box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
		border-top: $border;
	}

	.search-option {
		padding: 15px 30px;

		.option-item {
			font-size: 28rpx;
			display: flex;
			justify-content: space-between;
			color: #7d7d7d;
			padding: 5px 0;

			&.active {
				color: #333;
			}

			&~.option-item {
				margin-top: 10px;
			}
		}
	}

	.bottom-btn {
		display: flex;

		.btn {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 10px 0;

			&.primary {
				color: #1989fa;
			}
		}
	}
	.title{
		margin: 30rpx 0;
	}
</style>
