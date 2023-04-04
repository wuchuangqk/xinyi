<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view v-if="listData.length" scroll-y style="height: 100%;">
        <view class="list-wrap">
          <view v-for="item in listData" :key="item.id" class="app-list-item">
            <view class="item-title">
              <text>{{ item.Score_Matter }}</text>
              <view class="tag-wrap">
                <view class="tag" :class="{ bad: type === '2' }">{{ item.Score || 0 }}分</view>
              </view>
            </view>
            <view class="app-flex-between color-gray">
              <view>
                <text class="label">{{ item.name }}</text>
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
import listMixin from '@/mixin/list'
export default {
  mixins: [listMixin],
  data() {
    return {
      pathList: [
        '',
      ],
      params: {
        userid: ''
      },
      type: '',
    }
  },
  onLoad({ type }) {
    this.pathList[0] = type === '1' ? '/jixiao/maxdetail' : '/jixiao/mindetail'
    uni.setNavigationBarTitle({
      title: type === '1' ? '绩效加分' : '绩效减分'
    })
    this.type = type
    const userInfo = uni.getStorageSync(this.$const.USER_INFO)
    this.params.userid = userInfo.id
  },
  onShow() {
    this.listData = []
    this.fetchData()
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
.item-title {
  display: flex;
  justify-content: space-between;

  .tag-wrap {
    flex-shrink: 0;
    margin-left: 20px;
  }

  .tag {
    padding: 2px 10px;
    background-color: #f0fef7;
    color: #0ebc3c;

    &.bad {
      background-color: #fef0f0;
      color: #d33939;
    }
  }
}
</style>