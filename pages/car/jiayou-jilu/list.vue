<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view v-if="listData.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
        <view class="list-wrap">
          <view v-for="item in listData" :key="item.id" class="app-list-item" @click="navToDetail(item)">
            <view class="item-title">
              <text>{{ item.bianhao }}</text>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">加油金额：</text>
                <text class="value">{{ item.jine }}</text>
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
  </view>
</template>
<script>
import listMixin from '@/mixin/list'
export default {
  mixins: [listMixin],
  data() {
    return {
      pathList: [
        "/jiayou/record",
      ]
    }
  },
  onShow() {
    this.listData = []
    this.fetchData()
  },
  methods: {
    navToDetail(item) {
      this.$store.dispatch('selectedListDetail', item)
      uni.navigateTo({
        url: `/pages/car/jiayou-jilu/detail`,
      });
    },
  }
}
</script>
<style scoped lang="scss"></style>