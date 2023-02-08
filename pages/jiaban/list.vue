<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view v-if="listData.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
        <view class="list-wrap">
          <view v-for="item in listData" :key="item.id" class="app-list-item">
            <view class="item-title">
              <text :class="{ primary: item.qjstate !== '已审批' }" class="state">[{{ item.qjstate }}]</text>
              <text>{{ item.title }}</text>
            </view>
            <view class="item-sub">
              <text class="label">申请人：</text>
              <text class="value">{{ item.qjr }}</text>
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
    }
  }
}
</script>
<style scoped lang="scss">

</style>