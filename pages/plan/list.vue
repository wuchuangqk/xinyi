<template>
  <view class="app-page">
    <view class="list-search-wrap">
      <u-form-item label="日期">
        <date-picker v-model="params.NianYue" :defaultTime="params.NianYue" placeholder="请选择日期" mode="month"
          @update:modelValue="search" />
      </u-form-item>
    </view>
    <view class="page-main">
      <scroll-view v-if="listData.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
        <view class="list-wrap">
          <view v-for="item in listData" :key="item.id" class="app-list-item" @click="navToDetail(item.id)">
            <view class="item-title">
              <text>项目名称：{{ item.projectname }}</text>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">工作计划：</text>
                <text class="value">{{ item.jihua }}</text>
              </view>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">工作完成情况：</text>
                <text class="value">{{ item.jiHuacheck }}</text>
              </view>
              <view>
                <text class="label">责任人：</text>
                <text class="value">{{ item.zrr }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <page-empty v-else />
    </view>
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
        "/month/list",
      ],
      params: {
        NianYue: '', // 月份
        pageindex: 1,
      },
    }
  },
  onLoad() {
    this.params.NianYue = this.$dayjs().format('YYYY-MM-01')
  },
  onShow() {
    this.listData = []
    this.fetchData()
  },
  methods: {
    navAdd() {
      uni.navigateTo({
        url: '/pages/plan/form'
      });
    },
    navToDetail(id) {
      // 待办有审批
      // const isApprove = this.activeTabIndex === 1 ? '1' : '0'
      uni.navigateTo({
        url: `/pages/plan/detail?dataId=${id}`,
      });
    },
  }
}
</script>
<style scoped lang="scss"></style>