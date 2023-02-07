<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="card">
			<view class="wrap">
				<text>日期</text>
				<picker mode="date" :value="date" fields="month" :end="end" @change="handleChange">
					<view class="uni-input">
						{{ date }}
						<uni-icons type="arrowdown" style="margin-left: 5px;"></uni-icons>
					</view>
				</picker>
			</view>
		</view>
		<template v-if="hasData">
			<!-- 公司类型工资单 -->
			<template v-if="companyData">
				<view class="card">
					<!-- 两种类型的工资单都有数据的时候，显示类型标题 -->
					<view v-if="workerData" class="card-title">
						<view class="left"><text>公司类型工资单</text></view>
					</view>
					<view class="detail-item">
						<text class="label">姓名</text>
						<text class="value">{{ companyData.userName }}</text>
					</view>
					<view class="detail-item">
						<text class="label">部门</text>
						<text class="value">{{ companyData.deptName }}</text>
					</view>
					<view class="detail-item">
						<text class="label">入职日期</text>
						<text class="value">{{ companyData.entryTime }}</text>
					</view>
					<view class="detail-item">
						<text class="label">离职日期</text>
						<text class="value">{{ companyData.quitTime }}</text>
					</view>
					<view class="detail-item">
						<text class="label">基本工资</text>
						<text class="value">{{ companyData.basePay || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">绩效考核</text>
						<text class="value">{{ companyData.performance || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">应出勤</text>
						<text class="value">{{ companyData.should || 0 }}天</text>
					</view>
					<view class="detail-item">
						<text class="label">请假天数</text>
						<text class="value">{{ companyData.effective || 0 }}天</text>
					</view>
					<view class="detail-item">
						<text class="label">实际出勤</text>
						<text class="value">{{ companyData.actual || 0 }}天</text>
					</view>
					<view class="detail-item">
						<text class="label">高温补贴</text>
						<text class="value">{{ companyData.temperature || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">房补</text>
						<text class="value">{{ companyData.house || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">全勤</text>
						<text class="value">{{ companyData.regularity || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">餐补</text>
						<text class="value">{{ companyData.meal || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">应发工资</text>
						<text class="value">{{ companyData.grantWages || 0 }}元</text>
					</view>
				</view>
				<view class="card">
					<view class="card-title">
						<view class="left"><text>代扣事项</text></view>
					</view>
					<view class="detail-item">
						<text class="label">迟到</text>
						<text class="value">{{ companyData.late || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">早退</text>
						<text class="value">{{ companyData.early || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">缺卡</text>
						<text class="value">{{ companyData.defect || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">罚款</text>
						<text class="value">{{ companyData.punish || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">扣税</text>
						<text class="value">{{ companyData.tax || 0 }}元</text>
					</view>
				</view>
				<view class="card">
					<view class="detail-item">
						<text class="label">扣社保</text>
						<text class="value">{{ companyData.security || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">实发工资</text>
						<text class="value">{{ companyData.realWages || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">银行卡号</text>
						<text class="value">{{ companyData.bankNumber }}</text>
					</view>
					<view class="detail-item">
						<text class="label">开户行</text>
						<text class="value">{{ companyData.bankDeposit }}</text>
					</view>
					<view class="detail-item">
						<text class="label">身份证号码</text>
						<text class="value">{{ companyData.identityCards }}</text>
					</view>
					<view class="detail-item">
						<text class="label">联系电话</text>
						<text class="value">{{ companyData.mobile }}</text>
					</view>
				</view>
			</template>
			<!-- 工人类型工资单 -->
			<template v-if="workerData">
				<view class="card">
					<!-- 两种类型的工资单都有数据的时候，显示类型标题 -->
					<view v-if="companyData" class="card-title">
						<view class="left"><text>工人类型工资单</text></view>
					</view>
					<view class="detail-item">
						<text class="label">姓名</text>
						<text class="value">{{ workerData.userName }}</text>
					</view>
					<view class="detail-item">
						<text class="label">大队</text>
						<text class="value">{{ workerData.deptName }}</text>
					</view>
					<view class="detail-item">
						<text class="label">入职日期</text>
						<text class="value">{{ workerData.entryTime }}</text>
					</view>
					<view class="detail-item">
						<text class="label">离职日期</text>
						<text class="value">{{ workerData.quitTime }}</text>
					</view>
					<view class="detail-item">
						<text class="label">基本底薪</text>
						<text class="value">{{ workerData.basePay || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">出勤天数</text>
						<text class="value">{{ workerData.effective || 0 }}天</text>
					</view>
					<view class="detail-item">
						<text class="label">出勤薪资</text>
						<text class="value">{{ workerData.performance || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">1.5倍加班</text>
						<text class="value">{{ workerData.should || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">加班时长</text>
						<text class="value">{{ workerData.actual || 0 }}小时</text>
					</view>
					<view class="detail-item">
						<text class="label">2倍加班</text>
						<text class="value">{{ workerData.temperature || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">加班时长</text>
						<text class="value">{{ workerData.house || 0 }}小时</text>
					</view>
				</view>
				<view class="card">
					<view class="card-title">
						<view class="left"><text>奖金</text></view>
					</view>
					<view class="detail-item">
						<text class="label">临时奖金</text>
						<text class="value">{{ workerData.regularity || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">半年奖金</text>
						<text class="value">{{ workerData.meal || 0 }}元</text>
					</view>
				</view>
				<view class="card">
					<view class="card-title">
						<view class="left"><text>代扣事项</text></view>
					</view>
					<view class="detail-item">
						<text class="label">罚款</text>
						<text class="value">{{ workerData.punish || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">社保</text>
						<text class="value">{{ workerData.security || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">个税</text>
						<text class="value">{{ workerData.tax || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">三件套</text>
						<text class="value">{{ workerData.defect || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">安全帽</text>
						<text class="value">{{ workerData.early || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">生活费</text>
						<text class="value">{{ workerData.late || 0 }}元</text>
					</view>
				</view>
				<view class="card">
					<view class="detail-item">
						<text class="label">应发工资</text>
						<text class="value">{{ workerData.grantWages || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">实发工资</text>
						<text class="value">{{ workerData.realWages || 0 }}元</text>
					</view>
					<view class="detail-item">
						<text class="label">银行卡号</text>
						<text class="value">{{ workerData.bankNumber }}</text>
					</view>
					<view class="detail-item">
						<text class="label">开户行</text>
						<text class="value">{{ workerData.bankDeposit }}</text>
					</view>
					<view class="detail-item">
						<text class="label">身份证号码</text>
						<text class="value">{{ workerData.identityCards }}</text>
					</view>
					<view class="detail-item">
						<text class="label">联系电话</text>
						<text class="value">{{ workerData.mobile }}</text>
					</view>
				</view>
			</template>
		</template>
		<view v-else class="card"><PageEmpty></PageEmpty></view>
	</view>
</template>

<script>
import { getCompanySalary, getWorkerSalary, setRead } from '@/api/office/salary.js';
import PageEmpty from '@/components/page-empty.vue';
export default {
	components: { PageEmpty },
	data() {
		return {
			userId: null,
			salaryData: {},
			date: null,
			end: null,
			isTempUser: false, // 是否是临时工
			hasData: false,
			companyData: null, // 公司类型的工资单
			workerData: null // 工人类型的工资单
		};
	},
	async onLoad({ readId }) {
		if (readId) {
			const detail = await setRead(readId);
			uni.$emit(this.$events.UPDATE_TODO_STATE);
			this.date = detail.days;
		}
		// 获取用户身份
		// 身份是班组长(userType=2)和临时工(userType=3)，参数传2，其他身份传1
		const { userId } = uni.getStorageSync(this.$const.USER_INFO);
		this.userId = userId;
		// this.isTempUser = +userType === 2 || +userType === 3;
		if (this.date === null) {
			this.date = this.$dayjs()
				.subtract(1, 'month')
				.format('YYYY-MM');
		}
		this.end = this.$dayjs()
			.subtract(1, 'month')
			.date(1)
			.format('YYYY-MM-DD');
		this.fetchData();
	},
	methods: {
		handleChange(e) {
			this.date = e.detail.value;
			this.fetchData();
		},
		fetchData() {
			this.companyData = null;
			this.workerData = null;
			Promise.all([getWorkerSalary(this.date, this.userId), getCompanySalary(this.date, this.userId)]).then(([res1, res2]) => {
				this.hasData = res1.length !== 0 || res2.length !== 0;
				if (!this.hasData) {
					// 没有数据提示该月工资尚未填写
					uni.showToast({
						title: '该月工资尚未填写',
						icon: 'none'
					});
					return;
				}
				// 有数据的情况，如果状态是0，表示保存未提交，提示该月工资尚未发放
				if ((res1.length && res1[0].state !== 1) || (res2.length && res2[0].state !== 1)) {
					// 有数据但没提交
					uni.showToast({
						title: '该月工资尚未发放',
						icon: 'none'
					});
					this.hasData = false;
					return;
				}
				if (res2.length) {
					this.companyData = res2[0];
				}
				if (res1.length) {
					this.workerData = res1[0];
				}
			});
		}
	}
};
</script>

<style lang="scss">
@import '@/styles/detail.scss';
.page {
	min-height: 100%;
	background-color: $-bg-color;
}
.wrap {
	display: flex;
	justify-content: space-between;
}
</style>
