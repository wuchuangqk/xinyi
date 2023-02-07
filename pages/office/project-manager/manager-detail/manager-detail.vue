<template>
	<view class="page">
		<uni-nav-bar left-icon="back" :fixed="true" @clickLeft="back" :statusBar="true">
		{{infoData.projectName}}
		</uni-nav-bar>
		<view class="title-info">
			<view>
				<text>项目码:{{infoData.projectCode}}</text>
				<text>项目负责人:{{userStr}}</text>
			</view>
			<view>
				<text>建设阶段:{{buildStageTypeName}}</text>
				<text>建设性质:{{buildNatureTypeName}}</text>
			</view>
		</view>
		<view class="tab">
			<view class="tab-item" v-for="(item,index) in tabs" :class="{active: activeTabIndex === index}" @click="activeTabIndex = index">
				<text>{{item.label}}</text>
				<view class="line"></view>
			</view>
		</view>
		<swiper :current="activeTabIndex" @change="swiperChange" style="height: 100%;">
			<swiper-item>
				<view class="header">
					<uni-collapse accordion="true">
					    <uni-collapse-item title="基本信息">
					        <view style="padding: 30rpx;">
					            手风琴效果
					        </view>
					    </uni-collapse-item>
					    <uni-collapse-item title="项目协调小组">
					        <view style="padding: 30rpx;">
					            手风琴效果
					        </view>
					    </uni-collapse-item>
					    <uni-collapse-item title="单位信息">
					        <view style="padding: 30rpx;background-color: #EEEEEE;">
					            手风琴效果
					        </view>
					    </uni-collapse-item>
						<uni-collapse-item title="批复情况">
						    <view style="padding: 30rpx;background-color: #EEEEEE;">
						        手风琴效果
						    </view>
						</uni-collapse-item>
						<uni-collapse-item title="考核计划">
						    <view style="padding: 30rpx;background-color: #EEEEEE;">
						        手风琴效果
						    </view>
						</uni-collapse-item>
					</uni-collapse>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="header">
					2
				</view>
			</swiper-item>
			<swiper-item>
				<view class="header">
					3
				</view>
			</swiper-item>
			<swiper-item>
				<view class="header">
					4
				</view>
			</swiper-item>
			<swiper-item>
				<view class="header">
					5
				</view>
			</swiper-item>
			<swiper-item>
				<view class="header">
					6
				</view>
			</swiper-item>
			<swiper-item>
				<view class="header">
					7
				</view>
			</swiper-item>
			<swiper-item>
				<view class="header">
					8
				</view>
			</swiper-item>
			<swiper-item>
				<view class="header">
					9
				</view>
			</swiper-item>
			<swiper-item>
				<view class="header">
					10
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {getById,getStageTypeMap,getNatureTypeMap} from '@/api/office/project.js'
	export default {
		data() {
			return {
			
				infoData:{},
				userStr:"",//项目负责人
				buildNatureTypeName:null,//建设性质
				buildStageTypeName:null, //建设阶段
				activeTabIndex:0,
				tabs : [
					{label: '基本信息',value:0},
					{label: '进度计划',value:1},
					{label: '工程招标',value:2},
					{label: '工程合同',value:3},
					{label: '合同进度',value:4},
					{label: '工程变更',value:5},
					{label: '进度月报',value:6},
					{label: '质量安全',value:7},
					{label: '竣工验收',value:8},
					{label: '工程资料',value:9}
				]
			}
		},
		onLoad({projectId}){
			// console.log('projectId',projectId)
			getById(projectId).then(res => {
				
				let index = res.xmProjectCoordinateForms[0].userNames.lastIndexOf("-")
				let str=res.xmProjectCoordinateForms[0].userNames.substring(0,index);
				console.log("res",res)
				this.infoData = res
				this.userStr = str
				
			}),
			this.getDept()
			
		},
		onShow() {
			this.getDept()
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			getDept(){
				getStageTypeMap().then(res => {
					 this.buildStageTypeName = res[this.infoData.buildStageType];
				}),
				getNatureTypeMap().then(res => {
					this.buildNatureTypeName = res[this.infoData.buildNatureType];
				})
			},	
			swiperChange(e) {
				this.activeTabIndex = e.detail.current
			},
			
		}
	}
</script>

<style scoped lang="scss">
	.page {
		height: 100%;
		background-color: $-bg-color;
	
	}
	 .title-info{
		 margin:30rpx 60rpx;
	 }
	 .title-info view{
		 margin-bottom: 20rpx;
	 }
	 .title-info view text {
		 margin-right: 50rpx;
		 font-size: 30rpx;
	 }
	 
	 .tab {
	 	display: flex;
	 	width: 200%;
	 	justify-content: space-evenly;
	 
	 	.tab-item {
	 		flex: 1;
	 		position: relative;
	 		color: #8c8c8c;
	 		text-align: center;
	 
	 		&.active {
	 			color: #1989fa;
	 
	 			.line {
	 				display: block;
	 			}
	 		}
	 	}
	 
	 	.line {
	 		display: none;
	 		position: absolute;
	 		background-color: #1989fa;
	 		left: 50%;
	 		transform: translateX(-50%);
	 		width: 70%;
	 		height: 3px;
	 		border-radius: 2px;
	 		bottom: -5px
	 	}
	 
	 	.mark {
	 		position: absolute;
	 		top: 6px;
	 		right: 5px;
	 		width: 18px;
	 		height: 18px;
	 		border-radius: 50px;
	 		display: flex;
	 		justify-content: center;
	 		align-items: center;
	 		background-color: #ff2727;
	 		color: white;
	 		font-size: 11px;
	 		font-weight: bold;
	 	}
	 }
	 .header {
	 	display: flex;
	 	justify-content: space-between;
	 	align-items: center;
	 	background-color: white;
	 	padding: 0 10px 0 2px;
		margin: 20rpx 0;
	 
	 	.more {
	 		color: #1989fa;
	 	}
	 }
	 
</style>
