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
                  @click="startJiaBan(item.id, 0)">开始加班</u-button>
                <u-button v-if="!item.efile && item.sfile" plain size="mini" type="primary"
                  @click="startJiaBan(item.id, 1)">结束加班</u-button>
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
        '/jiaban/jiaban_list',
        '/jiaban/shenpi_list',
        '/jiaban/mylist',
        '/jiaban/monitor_list'
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
        url: '/pages/jiaban/form'
      });
    },
    navToDetail(id) {
      // 待办有审批
      const isApprove = this.activeTabIndex === 1 ? '1' : '0'
      uni.navigateTo({
        url: `/pages/leave-list/leave-detail?dataId=${id}&url=/jiaban/shenpi_detail&isApprove=${isApprove}`,
      });
    },
    startJiaBan(id, isStart) {
      uni.navigateTo({
        url: `/pages/jiaban/detail?dataId=${id}&isStart=${isStart}`,
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