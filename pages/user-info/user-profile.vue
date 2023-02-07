<template>
	<view class="page">
		<view style="height: 1px;background-color: white;"></view>
		<!-- 正式员工 -->
		<regular-employee v-if="isRegularEmp" ref="regular" :isShowBasicInfo="isShowBasicInfo" :userId="userId" :isShowMoney="isShowMoney" :from="from"></regular-employee>
		<!-- 临时工 -->
		<temporary-employee v-else ref="temporary" :userId="userId" :isShowMoney="isShowMoney" :from="from"></temporary-employee>
	</view>
</template>

<script>
import RegularEmployee from './components/RegularEmployee.vue';
import TemporaryEmployee from './components/TemporaryEmployee.vue';
export default {
	components: {
		RegularEmployee,
		TemporaryEmployee
	},
	data() {
		return {
			isRegularEmp: null, // 是否是正式员工
			isShowBasicInfo: true,
			userId: null,
			isShowMoney: false, // 是否显示薪资相关信息
			from: null
		};
	},
	// 从查看部门人员信息页面跳转至本页面，会传userType和userId
	// 从个人主页点查看个人资料进到本页面，需要从登录信息里获取身份类型
	// permission: 查看所有部门权限
	onLoad({ userType, userId, permission }) {
		this.isShowMoney = permission === 'true';
		if (userType !== undefined) {
			// 班组长和临时工能看到基本信息和永景经历，其他身份只能看到永景经历
			if (+userType !== 2 && +userType !== 3) {
				this.isShowBasicInfo = false;
			}
			this.userId = +userId;
			this.isRegularEmp = +userType !== 3;
			this.from = 'dept';
		} else {
			// 获取员工类型
			const { userType } = uni.getStorageSync(this.$const.USER_INFO);
			// userType:2、1、0为正式员工，userType:3为临时员工
			this.isRegularEmp = +userType !== 3;
			this.from = 'user';
		}
	},
	onNavigationBarButtonTap() {
		if (this.isRegularEmp) {
			this.$refs['regular'].submit();
		} else {
			this.$refs['temporary'].submit();
		}
	},
	methods: {}
};
</script>

<style scoped lang="scss">
.page {
	height: 100%;
	background-color: $-bg-color;
}
</style>
