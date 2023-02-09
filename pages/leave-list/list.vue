<template>
  <view class="app-page">
    <view class="list-search-wrap">
      <u-search placeholder="搜索请假原因" v-model="params.title" :show-action="false" @search="search"
        @clear="search"></u-search>
    </view>
    <view class="page-main">
      <scroll-view v-if="listData.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
        <view class="list-wrap">
          <view v-for="item in listData" :key="item.id" class="app-list-item" @click="navToDetail(item.id)">
            <view class="item-title">
              <text v-if="item.qjstate" :class="{ primary: item.qjstate !== '已审批' }" class="state">[{{ item.qjstate }}]</text>
              <text>{{ item.title }}</text>
            </view>
            <view class="item-sub">
              <text class="label">申请人：</text>
              <text class="value">{{ item.qjr }}</text>
            </view>
            <view class="item-sub">
              <text class="label">请假类型：</text>
              <text class="value">{{ item.qjtype }}</text>
            </view>
            <view class="item-sub">
              <text class="label">开始时间：</text>
              <text class="value">{{ item.qjstime }}</text>
            </view>
            <view class="item-sub">
              <text class="label">结束时间：</text>
              <text class="value">{{ item.qjetime }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
      <page-empty v-else />
    </view>
    <list-tabbar :tab-items="tabItems" @change="changeTab" />
    <float-button @click="navAdd" />
  </view>
</template>
<script>
import listMixin from '@/mixin/list'
export default {
  mixins: [listMixin],
  data() {
    return {
      pathList: [
        '/qingjia/qingjialist',
        '/qingjia/shenpi_list',
        '/qingjia/mylist',
        '/qingjia/monitor_list'
      ]
    }
  },
  onShow() {
    this.listData = []
    this.fetchData()
  },
  methods: {
    navAdd() {
      uni.navigateTo({
        url: '/pages/leave-list/leave-form'
      });
    },
    navToDetail(id) {
      // 待办有审批
      const isApprove = this.activeTabIndex === 1 ? '1' : '0'
      uni.navigateTo({
        url: `/pages/leave-list/leave-detail?dataId=${id}&url=/qingjia/shenpi_detail&isApprove=${isApprove}`,
      });
    },
  }
}
</script>
<style scoped lang="scss">
</style>