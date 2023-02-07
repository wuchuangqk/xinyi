<template>
	<view class="module">
		<view class="header">
			<view class="left">
				<view class="img-wrap">
					<!-- <img :src="userInfo.headPath" alt="" @error="photoErr"> -->
					<image class="img-wrap" :src="userInfo.headPath" mode="aspectFill" @error="imgErr"></image>
				</view>
				<view class="user">
					<text class="user-name">{{userInfo.userName}}</text>
					<text class="dept">{{userInfo.departName}}</text>
				</view>
			</view>
			<view class="right">
				<text>{{todayStr}}</text>
			</view>
		</view>
		<view class="time-line">
			<view class="state" :class="{active : timeLineStatus === 1}"></view>
			<view class="content">
				<view class="time">
					<text style="margin-right: 5px;">上班打卡时间</text>
					<text>{{attendanceSetting.toStartTime}} - {{attendanceSetting.toEndTime}}</text>
				</view>
				<view v-if="punchRecords.toWorkTime" class="punch-time">
					<text>打卡时间</text>
					<text>{{punchRecords.toWorkTime}}</text>
				</view>
				<view v-if="punchRecords.toAddress" class="address">
					<icon-font icon="icon-daka" style="font-size: 14px;margin-right: 5px;"></icon-font>
					<text>{{punchRecords.toAddress}}</text>
				</view>
				<!-- 已经超出了上班打卡范围却没有打卡 -->
				<view v-if="timeLineStatus !== 1 && !punchRecords.toWorkTime">
					<view class="un-punch">缺卡</view>
				</view>
			</view>
		</view>
		<view class="time-line second">
			<view class="state" :class="{active : timeLineStatus === 2}"></view>
			<view class="content">
				<view class="time">
					<text style="margin-right: 5px;">下班打卡时间</text>
					<text>{{attendanceSetting.offStartTime}} - {{attendanceSetting.offEndTime}}</text>
				</view>
				<view v-if="punchRecords.offWorkTime" class="punch-time">
					<text>打卡时间</text>
					<text>{{punchRecords.offWorkTime}}</text>
				</view>
				<view v-if="punchRecords.offAddress" class="address">
					<icon-font icon="icon-daka" style="font-size: 14px;margin-right: 5px;"></icon-font>
					<text>{{punchRecords.offAddress}}</text>
				</view>
				<view v-if="timeLineStatus === 3 && !punchRecords.offWorkTime">
					<view class="un-punch">缺卡</view>
				</view>
			</view>
		</view>
		<view class="punch-card">
			<view class="punch-button" @click="doPunch">
				<text class="title">{{punchButtonText}}</text>
				<text class="sub-title">{{realTime}}</text>
			</view>
			<view class="punch-tip">
				<view class="icon">
					<uni-icons :type="punchTip.iconType" size="16" :color="punchTip.iconColor"></uni-icons>
				</view>
				<text>{{punchTip.text}}</text>
			</view>
		</view>
    <view v-if="isShowPunch" class="add-punch punch-tip">
      您昨日有未完成的考勤，<text class="add-punch-btn" @click="doSupple">点击此处补卡</text>
    </view>
	</view>
</template>

<script>
	import IconFont from '@/components/icon-font.vue'
	import dayjs from 'dayjs'
	export default {
		components: {
			IconFont
		},
		props: {
			userInfo: {
				type: Object,
				required: true
			},
			attendanceSetting: {
				type: Object,
				required: true
			},
			punchRecords: {
				type: Object,
				required: true
			},
			status: {
				type: Number,
				required: true
			},
			realTime: {
				type: String,
				required: true
			},
			todayStr: {
				type: String,
				required: true
			},
			punchButtonText: {
				type: String,
				required: true
			},
			// 时间线状态：1=上班，2=下班
			timeLineStatus: {
				type: Number,
				required: true
			},
      // 是否显示补卡按钮
      isShowPunch: {
        type: Boolean,
        required: true
      }
		},
		data() {
			return {
				punchTip: {
					text: '请打开手机定位功能来使用打卡',
					iconType: 'info',
					iconColor: '#fe9445'
				},
			}
		},
		watch:{
			status() {
				switch (this.status) {
					case 0:
						this.punchTip.text = '请打开手机定位功能来使用打卡'
						this.punchTip.iconType = 'info'
						this.punchTip.iconColor = '#fe9445'
						break
					case 1:
						this.punchTip.text = '已进入考勤范围'
						this.punchTip.iconType = 'checkbox'
						this.punchTip.iconColor = '#44c854'
						break
					case 2:
						this.punchTip.text = '当前不在考勤范围内'
						this.punchTip.iconType = 'info'
						this.punchTip.iconColor = '#fe9445'
						break
				}
			}
		},
		methods: {
			doPunch() {
				this.$emit('doPunch')
			},
			imgErr() {
				this.userInfo.headPath = '/static/img/default.jpg'
			},
      doSupple() {
        this.$emit('doSupple')
      }
		}
	}
</script>

<style scoped lang="scss">
	@import './common.scss';
</style>
