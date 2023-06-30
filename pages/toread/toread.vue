<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view v-if="listData.length" scroll-y style="height: 100%;">
        <view class="list-wrap">
          <view v-for="item in listData" :key="item.key" class="app-list-item" @click="handleTodo(item)">
            <view class="item-title">
              <text>{{ item.title }}</text>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">类别：</text>
                <text class="value">{{ item.type }}</text>
              </view>
              <view>
                <text class="label">日期：</text>
                <text class="value">{{ item.time }}</text>
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
import toreadMixin from '@/mixin/toread'

export default {
  mixins: [toreadMixin],
  data() {
    return {
      listData: [],
    }
  },
  onShow() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      uni.showLoading({
        title: '加载中',
        mask: false
      });
      this.doGet('/home/ToReadlist').then(res => {
        this.listData = (res.data || []).map(val => {
          val.key = Symbol()
          return val
        })
        uni.hideLoading();
      }).catch(() => {
        uni.hideLoading();
      })
    },
  }
}
</script>
<style scoped lang="scss">
.list-wrap {
  padding-top: 8px;
}
</style>