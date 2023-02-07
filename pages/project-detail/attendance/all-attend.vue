<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card"><attend-calendar ref="calendar" type="all-person" :projectId="projectId" :isManager="isShowAdd" @select="handleSelect"></attend-calendar></view>
		<view v-if="isShowAdd" class="float-button" @click="gotoForm"><uni-icons type="plusempty" size="22" color="#ffffff"></uni-icons></view>
	</view>
</template>

<script>
import AttendCalendar from '@/components/attend-calendar.vue';
import { getUserList, getList } from '@/api/project/attendance.js';
import { getById as getProjectInfo } from '@/api/project/basicInfo.js';
import { getCoordinateUsers, getWorkDetail } from '@/api/project/peopleManage.js';
export default {
	components: { AttendCalendar },
	data() {
		return {
			projectId: null,
			isAttendManager: false, // 是否是考勤管理员
			userId: null,
			isRightDate: false,
			today: null,
			yesterday: null,
			selectDate: null,
			attendUser: [], // 项目下参与考勤的人
		};
	},
	computed: {
		// 是考勤管理员，且所选日期为今天和昨天
		isShowAdd() {
			return (this.isAttendManager || [1, 75].includes(this.userId)) && this.isRightDate;
		}
	},
	async onLoad({ projectId }) {
		this.projectId = projectId;
		const projectInfo = await getProjectInfo(this.projectId);
		this.userId = uni.getStorageSync(this.$const.USER_INFO).userId;
		// 查询当前用户是否是副职
		getCoordinateUsers(projectInfo.xmProjectCoordinateForms[1].proCoorId).then(res => {
			const curGroupUserList = res;
			// 判断当前用户是否在项目负责人里
			// 查出项目负责人的id
			// 只有一个人时，直接取id，有两个人时，取职位是副职的id（isDeputy=1）
			const userIds = curGroupUserList.length === 1 ? [curGroupUserList[0].userId] : curGroupUserList.filter(v => v.isDeputy === 1).map(v => v.userId);
			const isAttendManager = userIds.includes(this.userId);
			// 不是项目负责人（副职）
			if (!isAttendManager) {
				this.isAttendManager = isAttendManager
				return
			}
			// 如果是副职，再判断进场交底状态是否为交底完成（此条件只针对2022-01-17号后创建的项目）
			if (this.$dayjs(projectInfo.createdTime).isBefore('2022-01-16 23:59:59')) {
				this.isAttendManager = isAttendManager
			} else {
				// 检查进场交底状态
				getWorkDetail(projectId).then(res => {
					if (res.discloseId !== null && res.infoVos.every(v => v.state === 1)) {
						this.isAttendManager = isAttendManager
					}
				})
			}
		});
		// const attendUsers = projectInfo.xmProjectCoordinateForms.find(v => v.coordinateCode === 'KQGLY' || v.coordinateCode === 'XMFZR').userIds.split(',');
		// this.isAttendManager = attendUsers.includes('' + this.userId);
		this.today = this.$dayjs().format('YYYY-MM-DD');
		this.yesterday = this.$dayjs()
			.subtract(1, 'day')
			.format('YYYY-MM-DD');
			this.handleSelect(this.today)
			// 获取该项目下所有参与考勤的人
			getUserList(this.projectId).then(res=> {
				this.attendUser = res
			})
	},
	methods: {
		handleSelect(date) {
			this.selectDate = date;
			this.isRightDate = date === this.today || date === this.yesterday;
		},
		gotoForm() {
			const result = this.$refs.calendar.isHaveUnAttendUser(this.attendUser)
			if(result.length) {
				uni.setStorageSync(this.$const.TEMP, result);
				uni.navigateTo({
					url: `/pages/project-detail/attendance/attend-form?projectId=${this.projectId}&date=${this.selectDate}`
				});
			}else {
				uni.showToast({
					title: '今日考勤已记录',
					icon: 'none'
				});
			}
		},
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: 100%;
	background-color: $-bg-color;
}
.float-button {
	position: fixed;
	z-index: 9;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
	background-color: #1989fa;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	right: 5%;
	bottom: 15%;
	& + .float-button {
		bottom: 23%;
	}
}
</style>
