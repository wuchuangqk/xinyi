<template>
	<view class="page">
		<scroll-view scroll-y="true" class="scroll">
			<view style="height: 1px;"></view>
			<view class="user-img">
				<view style="display: flex;justify-content: center;">
					<image class="img-wrap" :src="userInfo.headPath" mode="aspectFill" @error="imgErr" @click="previewImg(userInfo.headPath)"></image>
				</view>
				<view class="user-name">
					<text>{{ userInfo.userName }}</text>
				</view>
			</view>
			<view class="list">
				<view class="item">
					<text class="label">部门</text>
					<text class="value">{{ userInfo.departName }}</text>
				</view>
				<view class="item">
					<text class="label">职位</text>
					<text class="value">{{ userInfo.posName }}</text>
				</view>
				<view class="item">
					<text class="label">电话</text>
					<text class="value">{{ userInfo.mobilePhone }}</text>
				</view>
				<view class="item">
					<text class="label">版本号</text>
					<text class="value">{{ appVersion }}</text>
				</view>
				<view class="item">
					<text class="label">头像</text>
					<navigator url="/pages/user-info/modify-ohoto" style="color:#1989fa;" hover-class="none">修改头像</navigator>
				</view>
				<view class="item">
					<text class="label">密码</text>
					<navigator url="/pages/user-info/modify-password" style="color:#1989fa;" hover-class="none">修改密码</navigator>
				</view>
				<view class="item">
					<text class="label">个人资料</text>
					<navigator url="/pages/user-info/user-profile" style="color:#1989fa;" hover-class="none">查看个人资料</navigator>
				</view>
				<view v-if="isShowDeptEntry" class="item">
					<text class="label">部门人员信息</text>
					<navigator url="/pages/user-info/dept-info" style="color:#1989fa;" hover-class="none">查看</navigator>
				</view>
			</view>
			<view class="item center" @click="showModel = true"><text class="label">退出登录</text></view>
		</scroll-view>
		<neil-modal :show="showModel" title="提示" content="确定退出系统吗" confirmColor="#dd524d" align="center" @confirm="exit" @close="showModel = false"></neil-modal>
	</view>
</template>

<script>
import { getById, logOut } from '@/api/user.js';
import NeilModal from '@/components/neil-modal/neil-modal.vue';
export default {
	components: { NeilModal },
	data() {
		return {
			userInfo: {},
			userImgPath: null,
			showModel: false,
			appVersion: null
		};
	},
	created() {
		uni.$on(this.$events.UPDATE_USER_INFO, () => {
			this.getUserPhoto();
		});
		this.getUserPhoto();

		this.isShowDeptEntry = this.$hasPermission('suoyoubumenchakan', this.$const.OA_PERMISSION) || this.$hasPermission('zijisuozaibumen', this.$const.OA_PERMISSION);
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
			this.appVersion = widgetInfo.version;
		});
		// #endif
	},
	methods: {
		exit() {
			uni.showLoading({
				title: '正在退出',
				mask: true
			});
			logOut(this.userInfo.userId);
			uni.removeStorageSync(this.$const.TOKEN);
			uni.removeStorageSync(this.$const.USER_INFO);
			uni.removeStorageSync(this.$const.IS_LOGIN);
			uni.removeStorageSync(this.$const.EMPLOYEE_INFO);
			uni.setStorageSync(this.$const.BADGE_COUNT, {
				notice: 0, // 通知公告
				todo: 0, // 待处理事项
				schedule: 0, // 日程
				exchange: 0 // 工作交流
			});
			uni.reLaunch({
				url: '/pages/login/login'
			});
			uni.hideLoading();
		},
		imgErr() {
			this.userInfo.headPath = '/static/img/default.jpg';
		},
		getUserPhoto() {
			this.userInfo = uni.getStorageSync(this.$const.USER_INFO);
			if (this.userInfo.headPath === null) {
				this.userInfo.headPath = '/static/img/default.jpg';
			}
		},
		/**图片预览
		 * @param {Object} imgSrc
		 */
		previewImg(imgSrc) {
			uni.previewImage({
				urls: [imgSrc],
				current: 0
			});
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	background-color: $-bg-color;
	height: 100%;
}
.scroll {
	height: 100%;
	padding-bottom: 8px;
	box-sizing: border-box;
}
.user-img {
	padding: 50px 0 40px;
	background-color: white;
	margin-top: $-space-height;
}
.img-wrap {
	width: 100px;
	height: 100px;
	margin: 0 auto;
	border-radius: 50%;
}
.user-name {
	font-size: 16px;
	text-align: center;
	color: #333333;
	margin-top: 15px;
}
.list {
	padding: 0 0 0 15px;
	background-color: white;
	margin-top: 8px;
}
.item {
	padding: 15px 15px 15px 0;
	border-bottom: 1px solid #f7f7f7;
	display: flex;
	justify-content: space-between;
	color: #333;
	.value {
		color: #9c9c9c;
	}
}
.center {
	border-bottom: none;
	margin-top: 8px;
	background-color: white;
	justify-content: center;
}
</style>
