<template>
	<view class="mask">
		<view class="search-container" ref="search">
			<view class="tab">
				<view class="tab-item" v-for="(item,index) in tabItems" :key="index" @click="setExpanded(index)">
					<text>{{item.text}}</text>
					<uni-icons :type="item.expanded ? 'arrowup' : 'arrowdown'" color="#515151" size="17"></uni-icons>
				</view>
			</view>
			<view class="search-option">
				<view v-show="tabItems[0].expanded" class="option-wrap">
					<!-- 设置圆角 -->
					<uni-search-bar ref="search" v-model="searchParams.infoTitle" style="padding: 0;" :radius="100"
						cancelButton="none" :clearState="clearState"></uni-search-bar>
				</view>
				<view v-show="tabItems[1].expanded" class="option-wrap">
					<view class="option-item" :class="{active: item.value === searchParams.readed}"
						v-for="item in optionData.readed" :key="item.value" @click="searchParams.readed = item.value">
						<text class="option-label">{{item.label}}</text>
						<uni-icons v-show="item.value === searchParams.readed" type="checkmarkempty"
							class="selected-icon"></uni-icons>
					</view>
				</view>
				<view v-show="tabItems[2].expanded" class="option-wrap">
					<uni-datetime-picker type="daterange" v-model="dateArr"></uni-datetime-picker>
				</view>
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
		props: {
			moduleIndex: {
				type: Number,
				required: true
			}
		},
		data() {
			return {
				tabItems: [{
						text: '标题',
						expanded: true
					},
					{
						text: '查阅状态',
						expanded: false
					},
					{
						text: '发布时间',
						expanded: false
					}
				],
				optionData: {
					// 审批状态
					readed: [{
							label: '未读',
							value: 0
						},
						{
							label: '已读',
							value: 1
						}
					],
				},
				searchParams: {
					infoTitle: '',
					readed: '',
					beforDate: '',
					afterDate: '',
				},
				clearState: 0
			}
		},
		computed: {
			dateArr: {
				set(newVal) {
					if (newVal) {
						this.searchParams.beforDate = newVal[0];
						this.searchParams.afterDate = newVal[1];
					} else {
						this.searchParams.beforDate = "";
						this.searchParams.afterDate = "";
					}
				},
				get() {
					return [this.searchParams.beforDate, this.searchParams.afterDate];
				},
			}
		},
		methods: {
			setExpanded(index) {
				this.tabItems.forEach((val, ind) => {
					if (ind === index) {
						val.expanded = !val.expanded
					} else {
						val.expanded = false
					}
				})
			},
			// 重置
			reset() {
				this.searchParams = {
					infoTitle: '',
					readed: '',
					beforDate: '',
					afterDate: '',
				}
				this.clearState++
				this.submit()
			},
			submit() {
				this.searchParams.infoTitle = this.searchParams.infoTitle ? this.searchParams.infoTitle.value : ''
				this.$emit('search', {
					params: this.searchParams,
					moduleIndex: this.moduleIndex
				})
			},
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

	.tab {
		display: flex;
		justify-content: space-around;
		// padding: 5px 15px 0;
		font-size: 14px;
		color: #515151;
		padding: 2px 10px 0;

		.tab-item {
			// flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 5px 10px;
			background: #efefef;
			border-radius: 16px;
			margin-top: 6px;
		}

		/* &.active {
				background-color: #1989fa;
				color: white;
			} */
	}

	.uni-icons {
		margin-left: 4px;
	}
</style>
