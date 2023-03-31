<template>
  <view class="app-page">
    <view class="list-search-wrap">
      <u-search placeholder="输入派车事由搜索" v-model="params.title" :show-action="false" @search="search"
        @clear="search"></u-search>
    </view>
    <view class="page-main">
      <scroll-view v-if="listData.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
        <view class="list-wrap">
          <view v-for="item in listData" :key="item.id" class="app-list-item" @click="navToDetail(item.DocId)">
            <view class="item-title">
              <text v-if="item.DocStateName" :class="{ primary: item.DocStateName !== '已审批' }" class="state">
                [{{ item.DocStateName }}]
              </text>
              <text>{{ item.DocTitle }}</text>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">申请人：</text>
                <text class="value">{{ item.shenQingRen }}</text>
              </view>
              <view>
                <text class="label">派车时间：</text>
                <text class="value">{{ item.DocDate }}</text>
              </view>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">起止地点：</text>
                <text class="value">{{ item.DiDianCurr }}</text>
                <text v-if="item.DiDianCurr && item.DiDianCurrEnd" style="margin: 0 4px;">至</text>
                <text class="value">{{ item.DiDianCurrEnd }}</text>
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
          name: '申请',
          icon: 'icon-shenqing1',
        },
        {
          name: '审核',
          icon: 'icon-daiban',
        },
        {
          name: '审批',
          icon: 'icon-yibanrenwu',
        },
        {
          name: '还车',
          icon: 'icon-yibanrenwu',
        },
        {
          name: '流程监控',
          icon: 'icon-liucheng1',
        }
      ],
      pathList: [
        "/CarMileages/MyList",
        "/CarMileages/MyShenPiList",
        "/CarMileages/MyShenHeList",
        "/CarMileages/HuanCheList",
        "/CarMileages/monitor_List"
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
        url: '/pages/car/paiche/form'
      });
    },
    navToDetail(id) {
      // 审核1 审批2 还车3
      uni.navigateTo({
        url: `/pages/car/paiche/detail?dataId=${id}&type=${this.activeTabIndex}`,
      });
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