<template>
  <view class="app-page">
    <view class="list-search-wrap">
      <u-search placeholder="输入用章名称搜索" v-model="params.title" :show-action="false" @search="search"
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
              <text>{{ item.docTitle }}</text>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">申请人：</text>
                <text class="value">{{ item.qjr }}</text>
              </view>
              <view>
                <text class="label">申请时间：</text>
                <text class="value">{{ item.docDate }}</text>
              </view>
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
        "/ying/list",
        "/ying/shenpi_list",
        "/ying/mylist",
        "/ying/monitor_list"
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
        url: '/pages/yongzhang/form'
      });
    },
    navToDetail(id) {
      // 待办有审批
      const isApprove = this.activeTabIndex === 1 ? '1' : '0'
      uni.navigateTo({
        url: `/pages/qingjia/detail?dataId=${id}&url=/ying/detail&isApprove=${isApprove}&isReject=1`,
      });
    },
  }
}
</script>
<style scoped lang="scss"></style>