<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view v-if="listData.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
        <view class="list-wrap">
          <view v-for="item in listData" :key="item.id" class="app-list-item" @click="navtoDetail(item.id)">
            <view class="item-title">
              <text v-if="item.docstate" :class="{ primary: item.docstate === '加油' }" class="state">
                [{{ item.docstate }}]
              </text>
              <text>{{ item.docTitle }}</text>
              <view v-if="activeTabIndex === 0 && item.docstate === '加油'" class="btn">
                <u-button plain size="mini" type="primary" @click="navtoForm(item.id)">填写加油单</u-button>
              </view>
              <view v-if="activeTabIndex === 1" class="btn">
                <u-button plain size="mini" type="primary" @click="navtoApproval(item.id)">加油审核</u-button>
              </view>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">申请时间：</text>
                <text class="value">{{ item.docDate }}</text>
              </view>
              <view>
                <text class="label">状态：</text>
                <text class="value">{{ item.docstate || '审核' }}</text>
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
      ],
      pathList: [
        "/jiayou/list",
        "/jiayou/todo",
      ]
    }
  },
  onShow() {
    this.listData = []
    this.fetchData()
  },
  methods: {
    // 加油申请
    navAdd() {
      uni.navigateTo({
        url: '/pages/car/jiayou/form'
      });
    },
    // 填写加油单
    navtoForm(id) {
      uni.navigateTo({
        url: `/pages/car/jiayou/jiayoudan?dataId=${id}`
      });
    },
    navtoDetail(id) {
      uni.navigateTo({
        url: `/pages/car/huanka/detail?dataId=${id}&type=detail`
      });
    },
    // 加油审核
    navtoApproval(id) {
      uni.navigateTo({
        url: `/pages/car/jiayou/shenhe?dataId=${id}`
      });
    }
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