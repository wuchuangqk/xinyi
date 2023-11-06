<template>
  <view class="app-page">
    <view class="list-search-wrap">
      <u-search placeholder="输入加班事由搜索" v-model="params.title" :show-action="false" @search="search"
        @clear="search"></u-search>
    </view>
    <view class="page-main">
      <scroll-view v-if="listData.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
        <view class="list-wrap">
          <view v-for="item in listData" :key="item.id" class="app-list-item" @click="navToDetail(item.id)">
            <view class="item-title">
              <text v-if="item.qjstate" :class="{ primary: item.qjstate !== '已审批' }" class="state">
                [{{ item.qjstate }}]
              </text>
              <text>{{ item.title }}</text>
              <view v-if="activeTabIndex === 0" class="btn">
                <u-button v-if="!item.sfile" plain size="mini" type="primary"
                  @click="startJiaBan(item, 0)">开始加班</u-button>
                <u-button v-if="!item.efile && item.sfile" plain size="mini" type="primary"
                  @click="startJiaBan(item, 1)">结束加班</u-button>
              </view>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">申请人：</text>
                <text class="value">{{ item.qjr }}</text>
              </view>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">加班时间：</text>
                <text class="value">{{ item.qjstime }}</text>
                <text v-if="item.qjstime && item.qjetime" style="margin: 0 4px;">至</text>
                <text class="value">{{ item.qjetime }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <page-empty v-else />
    </view>
    <list-tabbar :tab-items="tabItems" @change="changeTab" />
    <float-button v-if="isShowAdd" @click="navAdd" />
  </view>
</template>
<script>
import listMixin from '@/mixin/list'
import dayjs from 'dayjs';
export default {
  mixins: [listMixin],
  data() {
    return {
      pathList: [
        '/jiaban/jiaban_list',
        '/jiaban/shenpi_list',
        '/jiaban/mylist',
        '/jiaban/monitor_list'
      ],
      isShowAdd: false, // 当前登录用户职位是职员没有加班申请功能
    }
  },
  onLoad() {
    this.getJiaBanPermission()
  },
  onShow() {
    this.listData = []
    this.fetchData()
  },
  methods: {
    navAdd() {
      uni.navigateTo({
        url: '/pages/jiaban/form'
      });
    },
    navToDetail(id) {
      // 待办有审批
      const isApprove = this.activeTabIndex === 1 ? '1' : '0'
      uni.navigateTo({
        url: `/pages/qingjia/detail?dataId=${id}&url=/jiaban/shenpi_detail&isApprove=${isApprove}`,
      });
    },
    startJiaBan(item, isStart) {
      if (!this.timeRangeCheck(item, isStart)) return
      uni.navigateTo({
        url: `/pages/jiaban/detail?dataId=${item.id}&isStart=${isStart}`,
      });
    },
    async getJiaBanPermission() {
			const res = await this.doGet('/jiaban/IsWorker')
			this.isShowAdd = res.data[0].post === '非职员用户'
		},
    // 限制上传时间
		timeRangeCheck(item, isStart) {
			const start = dayjs(item.qjstime).format('YYYY-MM-DD')
			const end = dayjs(item.qjetime).format('YYYY-MM-DD')
			const now = dayjs()
			const today = now.format('YYYY-MM-DD') // 当天的年月日部分
			if (item.qjtype === '工作日延时') {
				// [] 表示包含开始和结束
				if (!dayjs(today).isBetween(start, end, 'day', '[]')) {
					uni.showToast({ title: '已超过规定上传时间', icon: 'none' });
					return false
				}
				// 开始加班
				if (isStart === 0) {
					// 18:00之前
					if (now.isAfter(`${today} 18:00:00`)) {
						uni.showToast({ title: '请于18:00前上传加班开始照片', icon: 'none' });
						return false
					}
				} else {
					// 结束加班
					// 21:30后
					if (now.isBefore(`${today} 21:30:00`)) {
						uni.showToast({ title: '请于21:30后上传加班结束照片', icon: 'none' });
						return false
					}
				}
			} else if (item.qjtype === '周六日加班') {
				if (!dayjs(today).isBetween(start, end, 'day', '[]')) {
					uni.showToast({ title: '已超过规定上传时间', icon: 'none' });
					return false
				}
				// 开始加班
				if (isStart === 0) {
					// 9:00之前或12:00-14:00
					if (now.isAfter(`${today} 09:00:00`) && !now.isBetween(`${today} 12:00:00`, `${today} 14:00:00`)) {
						uni.showToast({ title: '请于9:00前或12:00-14:00之间上传加班开始照片', icon: 'none' });
						return false
					}
				} else {
					// 结束加班
					// 17:00-18:00或21:30后
					if (!now.isBetween(`${today} 17:00:00`, `${today} 18:00:00`) && now.isBefore(`${today} 21:30:00`)) {
						uni.showToast({ title: '请于17:00-18:00间或21:30后上传加班结束照片', icon: 'none' });
						return false
					}
				}
			}
			return true
		},
  }
}
</script>
<style scoped lang="scss">
.item-title {
  display: flex;

  .btn {
    margin-left: auto;
  }
}
</style>