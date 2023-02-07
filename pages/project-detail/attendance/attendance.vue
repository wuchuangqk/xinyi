<template>
	<view class="page">
		<view class="search">
			<uni-search-bar ref="search" placeholder="请输入姓名" v-model="name" :radius="100" @confirm="search" @cancel="search" @clear="search"></uni-search-bar>
			<picker mode="date" fields="day" :value="days" @change="handleChange" style="margin-right: 3px;">
				<text>{{ days }}</text>
			</picker>
			<uni-icons type="arrowdown"></uni-icons>
		</view>
		<view class="list">
			<view v-for="(item, index) in dataList" class="list-item" @click="showDetail(item)">
				<view class="left">
					<image :src="item.headPhoto" @error="imgErr(item)" mode="aspectFill" class="user-img"></image>
					<view class="flex-col">
						<view style="margin-bottom: 5px;">
							<text class="user-name">{{ item.userName }}</text>
							<text class="phone">{{ item.deptName }}</text>
						</view>
						<view>
							<text class="dept-name">{{ item.posName }}</text>
							<text class="dept-name posi">{{ item.mobile }}</text>
						</view>
						<view>
							<text class="dept-name">添加人：{{item.creatorName}}</text>
						</view>
					</view>
				</view>
				<view class="flex-col">
					<view class="flex-end hour" :class="stateMap.get(item.state).class">
						<icon-font icon="icon-shijian" class="hour-icon"></icon-font>
						<text style="font-weight: bold;">{{ item.hours }}</text>
						<text class="hour-unit">小时</text>
					</view>
					<view class="state" :class="stateMap.get(item.state).class">
						<view class="icon"></view>
						<text>{{ stateMap.get(item.state).text }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- <view v-if="isAttendManager" class="float-button" @click="gotoForm"><uni-icons type="plusempty" size="22" color="#ffffff"></uni-icons></view> -->
	</view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
import dayjs from 'dayjs';
import { getUserList, getList, getAppList } from '@/api/project/attendance.js';
import { getById as getProjectInfo } from '@/api/project/basicInfo.js';
import {getById as getUser} from '@/api/user.js'
import {uploadHost} from '@/util/http.js'
export default {
	components: {
		IconFont
	},
	data() {
		return {
			name: '',
			days: '2021-07-14',
			dataList: [],
			defaultUserPhoto: '/static/img/default.jpg',
			projectId: null,
			userList: [],
			stateMap: new Map([[0, { text: '待确认', class: 'un-confirm' }], [1, { text: '已确认', class: 'has-confirm' }], [2, { text: '待审核', class: 'auditing' }]]),
			projectInfo: {},
			isCanQueryAll: false, // 当前登录用户是否查看所有人的考勤记录
			userId: null,
			isAttendManager: false, // 当前用户是否是考勤管理员
		};
	},
	async onLoad({ projectId }) {
		this.projectId = projectId;
		this.days = this.$dayjs().format('YYYY-MM-DD');
		uni.$on(this.$events.UPDATE_PROJECT_ATTEND, () => {
			this.fetchData();
		});
		this.projectInfo = await getProjectInfo(this.projectId);
		// 判断当前用户的身份类型，以及是否在当前项目的班组长里
		// userType:-1=超级管理员，0=企业用户,1=审核员，2=施工人员，3=临时工
		// 企业用户和审核员可以看到全部，施工人员和临时工如果在班组长里也能看全部
		let { userType, userId } = uni.getStorageSync(this.$const.USER_INFO);
		userType = +userType;
		this.userId = userId;
		// 查看是否在考勤人员里
		const attendUsers = this.projectInfo.xmProjectCoordinateForms.find(v => v.coordinateCode === 'KQGLY' || v.coordinateCode === 'XMFZR').userIds.split(',');
		this.isAttendManager = attendUsers.includes('' + userId);
		this.isCanQueryAll = userType === 0 || userType === 1 || userType === -1 || this.isAttendManager
		this.fetchData();
	},
	onPullDownRefresh() {
		this.pulling = true;
		this.fetchData();
	},
	methods: {
		fetchData() {
			getAppList(this.projectId, this.name, this.days).then(res => {
				res.forEach(v => v.headPhoto = 'null')
				if (this.isCanQueryAll) {
					this.dataList = res;
				} else {
					// 只保留userId等于当前账号的
					this.dataList = res.filter(v => v.userId === this.userId);
				}
				this.dataList.forEach(val => {
					getUser(val.userId).then(res=> {
						if(res.headPhotoFile) {
							val.headPhoto = uploadHost.core + res.headPhotoFile.webFilePath
						}
					})
				})
			});
		},
		imgErr(item) {
			console.log(item)
			item.headPhoto = this.defaultUserPhoto
		},
		search() {
			this.name = this.name === '' ? '' : this.name.value;
			this.fetchData();
		},
		handleChange(e) {
			this.days = e.detail.value;
			this.fetchData();
		},
		gotoForm() {
			uni.navigateTo({
				url: '/pages/project-detail/attendance/attend-form?projectId=' + this.projectId
			});
		},
		showDetail(item) {
			// 如果该条考勤记录的状态 state=3(待审核)，且创建人Id等于当前登录账号Id，则跳转到编辑页面
			if (item.state === 2 && item.creatorId === this.userId) {
				uni.navigateTo({
					url: `/pages/project-detail/attendance/attend-form?id=${item.id}`
				});
			} else {
				// 否则跳转到详情页面
				uni.navigateTo({
					url: '/pages/project-detail/attendance/attend-detail?id=' + item.id
				});
			}
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: calc(100% - 51px);
	background-color: $-bg-color;
	padding: 1px 0 50px 0;
}

.flex-col {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.flex-end {
	display: flex;
	justify-content: flex-end;
}
.list-item {
	padding: 10px;
	background-color: white;
	margin: 10px;
	display: flex;
	border-radius: 2px;
	justify-content: space-between;
	/* .right {
		flex: 1;
	} */
	.left {
		display: flex;
	}
	.user-name {
		font-size: 14px;
		color: #333;
		margin-right: 10px;
	}
	.phone {
		font-size: 13px;
		color: gray;
		// margin-left: 5px;
	}
	.posi {
		margin-left: 10px;
	}
	.dept-name {
		font-size: 13px;
		color: gray;
	}
	.user-img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 10px;
	}
	.top {
		margin-bottom: 10px;
	}
	.bottom {
		display: flex;
		justify-content: space-between;
		font-size: 14px;
	}
}

.search {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: white;
	padding: 0 10px 0 2px;

	.uni-searchbar {
		flex: 1;
		margin-right: 10px;
	}
}

.state {
	font-size: 13px;
	display: flex;
	align-items: center;
	color: gray;
	.icon {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		margin-right: 5px;
		background-color: gray;
	}
	/* &.has-confirm {
		color: #02a7f0;
		.icon {
			background: #02a7f0;
		}
	}
	&.un-confirm {
		color: #70b603;
		.icon {
			background: #70b603;
		}
	}
	&.auditing {
		color: #f59a23;
		.icon {
			background: #f59a23;
		}
	} */
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
}
.hour-icon {
	font-size: 13px;
	margin-right: 5px;
	margin-top: 2px;
}
.hour-unit {
	font-size: 14px;
}
.hour {
	width: 86px;
	background-color: #02a7f0;
	color: white;
	padding: 2px 10px;
	border-radius: 30px;
	align-items: center;
	box-sizing: border-box;
	justify-content: flex-start;
	&.has-confirm {
		background-color: #02a7f0;
	}
	&.un-confirm {
		background-color: #70b603;
	}
	&.auditing {
		background-color: #f59a23;
	}
}
</style>
