<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view v-if="listData.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
        <view class="list-wrap">
          <view v-for="item in listData" :key="item.id" class="app-list-item" @click="navToDetail(item.id)">
            <view class="item-title">
              <text v-if="item.docState" :class="{ primary: item.docState !== '已审批' }" class="state">
                [{{ item.docState }}]
              </text>
              <text>{{ item.docTitle }}</text>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">维修车辆：</text>
                <text class="value">{{ item.Vehicle }}</text>
              </view>
              <view>
                <text class="label">维修时间：</text>
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
      tabItems: [
        {
          name: '维修列表',
          icon: 'icon-shenqing1',
        },
        {
          name: '待办申请',
          icon: 'icon-daiban',
        },
        {
          name: '已办申请',
          icon: 'icon-yibanrenwu',
        },
      ],
      pathList: [
        "/car/weixiulist",
        "/car/todo",
        "/car/mylist",
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
        url: '/pages/car/weixiu/form'
      });
    },
    navToDetail(id) {
      // 待办有审批
      const isApprove = this.activeTabIndex === 1 ? '1' : '0'
      uni.navigateTo({
        url: `/pages/car/weixiu/detail?dataId=${id}&isApprove=${isApprove}`,
      });
    },
  }
}
</script>
<style scoped lang="scss"></style>