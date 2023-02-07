import {
	getTodoRead
} from '@/api/core/notification.js';
import {
	getInfoById
} from '@/api/project/workDaily.js';
import {
	getDetailById
} from '@/api/project/workDaily.js';
const todo = {
	methods: {
		// 处理待阅跳转
		handleRead({
			type,
			docId,
			signId
		}) {
			switch (type) {
				case '通知公告':
					uni.navigateTo({
						url: '/pages/noticeDetail/noticeDetail?noticeId=' + docId
					});
					break;
				case '标准化流程':
					uni.navigateTo({
						url: '/pages/office/work-exchange/exchange-detail?infoId=' + docId
					});
					break;
				case '岗位责任说明书':
					uni.navigateTo({
						url: '/pages/office/work-exchange/exchange-detail?infoId=' + docId
					});
					break;
				case '规章制度':
					uni.navigateTo({
						url: '/pages/office/work-exchange/exchange-detail?infoId=' + docId
					});
					break;
				case '请假抄送':
					uni.navigateTo({
						url: `/pages/leave-list/leave-detail?approvalId=${docId}&type=0`
					});
					break;
				case '今日永景':
					uni.navigateTo({
						url: '/pages/index/wen-xuan-detail?infoId=' + docId
					});
					break;
				case '施工日志':
					getInfoById(docId).then(res => {
						uni.setStorageSync(this.$const.TEMP, docId);
						uni.navigateTo({
							url: `/pages/project-detail/project-detail?projectId=${res.projectId}&moduleKey=work-daily`
						});
					});
					break;
				case '工程安排':
					getInfoById(docId).then(res => {
						uni.setStorageSync(this.$const.TEMP, docId);
						uni.navigateTo({
							url: `/pages/project-detail/project-detail?projectId=${res.projectId}&moduleKey=work-plan`
						});
					});
					break;
				case '项目旬报':
					getDetailById(docId).then(res => {
						uni.setStorageSync(this.$const.TEMP, docId);
						uni.navigateTo({
							url: `/pages/project-detail/project-detail?projectId=${res.projectId}&moduleKey=project-coincided`
						});
					});
					break;
				case "离职申请阅读":
					uni.navigateTo({
						url: `/pages/leave-office/leave-office-detail?approvalId=${docId}&type=3`
					})
					break;
				case "请假抄送阅读":
					uni.navigateTo({
						url: `/pages/leave-list/leave-detail?approvalId=${docId}&type=3`
					})
					break;
				case "工资单":
					uni.navigateTo({
						url: `/pages/office/salary?readId=${docId}`
					})
					break;
				case "进场交底":
					uni.navigateTo({
						url: `/pages/project-detail/work-details?projectId=${docId}`
					})
					break;
				default:
					this.showModel = true;
			}
		},
		// 处理待办跳转
		handleTodo({
			type,
			docId,
			signId
		}) {
			switch (type) {
				case '请假':
					uni.navigateTo({
						url: `/pages/leave-list/leave-detail?approvalId=${docId}&type=1`
					})
					break
				case '离职':
					uni.navigateTo({
						url: `/pages/leave-office/leave-office-detail?approvalId=${docId}&type=1`
					})
					break
				case "请假抄送":
					uni.navigateTo({
						url: `/pages/leave-list/leave-detail?approvalId=${docId}&type=3&isCc=1`
					})
					break
				case "报销":
					uni.navigateTo({
						url: `/pages/claim/claim-detail?approvalId=${docId}&type=1`
					})
					break
				case "报销单":
					uni.navigateTo({
						url: `/pages/claim/claim-detail?approvalId=${docId}&type=4`
					})
					break
				case '项目报销':
					uni.navigateTo({
						url: `/pages/claim/claim-detail?approvalId=${docId}&type=1&isForProject=true`
					})
					break
				case '项目报销单':
					uni.navigateTo({
						url: `/pages/claim/claim-detail?approvalId=${docId}&type=4&isForProject=true`
					})
					break
				case '项目请款':
					uni.navigateTo({
						url: `/pages/project-detail/moneyApply/claim/claim-detail?approvalId=${docId}&type=1`
					})
					break
				case '项目请款单':
					uni.navigateTo({
						url: `/pages/project-detail/moneyApply/claim/claim-detail?approvalId=${docId}&type=4`
					})
					break
				case '离职办理':
					uni.navigateTo({
						url: `/pages/office/leave-office-confirm?userId=${docId}&signId=${signId}`
					})
					break
				case "进场交底":
					uni.navigateTo({
						url: `/pages/project-detail/work-details?projectId=${docId}`
					})
					break;
				default:
					this.showModel = true;
			}

		}
	}
}
export default todo
