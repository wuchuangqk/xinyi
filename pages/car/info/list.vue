<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view v-if="listData.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
        <view class="list-wrap">
          <view v-for="item in listData" :key="item.id" class="app-list-item" @click="navToDetail(item.id)">
            <view class="item-title">
              <text>{{ item.CarNumber }}</text>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">车型：</text>
                <text class="value">{{ item.CarModels }}</text>
              </view>
              <view>
                <text class="label">车辆状态：</text>
                <text class="value">{{ item.State }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <page-empty v-else />
    </view>
  </view>
</template>
<script>
import listMixin from '@/mixin/list'
export default {
  mixins: [listMixin],
  data() {
    return {
      pathList: [
        "/car/list",
      ],
      params: {
        NianYue: '', // 月份
        pageindex: 1,
      },
    }
  },
  onShow() {
    this.listData = []
    this.fetchData()
  },
  methods: {
    navToDetail(id) {
      uni.navigateTo({
        url: `/pages/car/info/detail?dataId=${id}`,
      });
    },
  }
}
</script>
<style scoped lang="scss"></style>