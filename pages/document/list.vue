<template>
  <view class="app-page">
    <view class="list-search-wrap">
      <u-search placeholder="输入标题搜索" v-model="params.title" :show-action="false" @search="search"
        @clear="search"></u-search>
    </view>
    <view class="page-main">
      <scroll-view v-if="listData.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
        <view class="list-wrap">
          <view v-for="item in listData" :key="item.id" class="app-list-item" @click="navToDetail(item.id)">
            <view class="item-title">
              <text>{{ item.title }}</text>
              <view v-if="item.getman === '办理'" class="btn">
                <u-button plain size="mini" type="primary" @click="navToDetail(item.id, '1')">办理</u-button>
              </view>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">起草人：</text>
                <text class="value">{{ item.creator }}</text>
              </view>
              <view>
                <text class="label">提交时间：</text>
                <text class="value">{{ item.created }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <page-empty v-else />
    </view>
    <list-tabbar :tab-index="activeTabIndex" :tab-items="tabItems" @change="changeTab" />
  </view>
</template>
<script>
import listMixin from '@/mixin/list'
export default {
  mixins: [listMixin],
  data() {
    return {
      pathList: [
        '/circula/initiate_list',
        '/circula/participate_list',
        '/circula/monitor_list'
      ],
      tabItems: [
        {
          name: '我发起的',
          icon: 'icon-shenqing1',
        },
        {
          name: '我参与的',
          icon: 'icon-daiban',
        },
        {
          name: '所有流转',
          icon: 'icon-liucheng1',
        },
      ],
    }
  },
  onLoad({ tabName }) {
    const index = this.tabItems.findIndex(val => val.name === tabName)
    if (index !== -1) {
      this.activeTabIndex = index
    }
  },
  onShow() {
    this.listData = []
    this.fetchData()
  },
  methods: {
    navToDetail(id, isHandle = '0') {
      uni.navigateTo({
        url: `/pages/document/detail?dataId=${id}&isHandle=${isHandle}`,
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