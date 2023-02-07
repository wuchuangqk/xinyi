<template>
  <view class="page">
    <view class="tab">
      <scroll-view ref="tabbar" class="tab-bar" :scroll="false" :scroll-x="true" :show-scrollbar="false">
        <view style="display: flex;flex-direction: column;">
          <!-- tabitem集合 -->
          <view style="display: flex;flex-wrap: nowrap;position: relative;padding: 0;">
            <view class="tab-item" v-for="(item, index) in tabItems" :key="index"
                  :class="{ active: index === activeTabIndex }" @click="changeTab(index)">{{ item.label }}
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <swiper class="swiper" :current="activeTabIndex" :duration="300" @change="onSwiperChange">
      <swiper-item v-for="(module, index) in modules" class="swiper-item">
        <mescroll-uni @init="e => init(e, index)" @down="pullDown(index)" :up="upOption" :down="downOption">
          <view>
            <view class="list-item" v-for="(item, ind) in module.dataList" :key="ind" @click="goDetail(item)">
              <view class="row top">
                <text class="item-title">{{ item.infoTitle }}</text>
              </view>
            </view>
            <uni-load-more :status="module.more" @clickLoadMore="handleReachBottom"></uni-load-more>
          </view>
        </mescroll-uni>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
import TheSearch from './the-search.vue';
import dayjs from 'dayjs';
import {getAllInfo, getOaTrendOfWorkTypeMap} from '@/api/office/exchange.js';
import AttendCalendar from '@/pages/index/month-calendar.vue';

export default {
  components: {
    IconFont,
    TheSearch,
    AttendCalendar
  },
  data() {
    return {
      tabItems: [],
      activeTabIndex: 0,
      pulling: false, // 标记正在进行下拉刷新
      modules: [], // 所有模块的数据集合
      mescroll: null,
      upOption: {
        use: false,
        auto: false
      },
      downOption: {
        inOffsetRate: 0.5,
        auto: false
      },
    };
  },
  async onLoad() {
    const res = await getOaTrendOfWorkTypeMap()
    const temp = []
    for (let key in res) {
      temp.push({
        label: key,
        value: res[key]
      })
    }
    this.tabItems = temp;
    if (!this.tabItems.length) {
      return
    }
    // 设置权限及初始化变量
    const isQueryAll = this.$hasPermission('exchange_all_permission', this.$const.OA_PERMISSION) ? 1 : 0;
    this.tabItems.forEach(tab => {
      this.modules.push({
        dataList: [], // 数据列表
        isLoadAll: false, // 是否已加载全部数据
        more: 'more', // laodmore状态
        isLoadingMore: false, // 是否正在请求下一页数据
        showSearch: false,
        searchParams: {
          infoUse: tab.label, // 用途
          pageIndex: 1,
          pageSize: 10,
          isQueryAll: isQueryAll, // 1=查询全部，0=查询个人可见
          infoType: '标准化流程'
        }, // 搜索条件
        queryMethod: getAllInfo,
        lazyLoad: false,
        controller: null,
        pulling: false
      });
    })

    this.fetchData();
    // 监听阅读状态更新事件
    uni.$on(this.$events.UPDATE_EXCHANGE_READ_STATE, () => {
      const module = this.modules[this.activeTabIndex];
      // 更新列表数据时，要保证和之前的数据个数一致
      module.searchParams.pageSize *= module.searchParams.pageIndex;
      module.searchParams.pageIndex = 1
      module.isLoadAll = false;
      module.dataList.length = 0;
      this.fetchData();
      module.searchParams.pageSize = 10;
    });
  },
  onReachBottom() {
    this.handleReachBottom();
  },
  methods: {
    // 当点击不同的tabitem时切换标签页
    changeTab(tabIndex) {
      this.activeTabIndex = tabIndex;
      // 如果没有加载这个tab，就去加载
      if(!this.modules[this.activeTabIndex].lazyLoad) {
        this.modules[this.activeTabIndex].lazyLoad = true
        this.fetchData()
      }
    },
    onSwiperChange(e) {
      this.activeTabIndex = e.target.current;
      if(!this.modules[this.activeTabIndex].lazyLoad) {
        this.modules[this.activeTabIndex].lazyLoad = true
        this.fetchData()
      }
    },
    handleReachBottom() {
      // 拿到正在获取的页面
      const module = this.modules[this.activeTabIndex];
      // 如果此页正在请求下一页数据或已经加载完全部的数据，就不在执行
      if (module.isLoadingMore || module.isLoadAll) {
        return;
      }
      module.isLoadingMore = true;
      module.searchParams.pageIndex++;
      this.fetchData();
    },
    fetchData() {
      const module = this.modules[this.activeTabIndex];
      module.more = 'loading'
      module.lazyLoad = true
      module.queryMethod(module.searchParams).then(res => {
        res.records = res.records || [];
        res.records.forEach(v => (v.created = dayjs(v.created).format('YYYY-MM-DD')));
        module.isLoadAll = res.records.length === 0;
        module.more = module.isLoadAll ? 'noMore' : 'more';
        module.dataList = module.dataList.concat(res.records);
        // 判断是否在下拉刷新中，如果是则结束下拉刷新
        if (module.pulling) {
          module.pulling = false;
          module.controller.endSuccess();
        }
        module.isLoadingMore = false;
      });
    },
    // 跳转到详情页面
    goDetail(item) {
      uni.navigateTo({
        url: `/pages/office/work-exchange/exchange-detail?infoId=${item.infoId}&isRead=${+item.readed}`
      });
    },
    init(e, index) {
      this.modules[index].controller = e
    },
    pullDown(index) {
      const module = this.modules[index]
      if(!module.pulling) {
        module.pulling = true
      }
      module.isLoadAll = false;
      module.isLoadingMore = false;
      module.dataList.length = 0;
      module.searchParams.pageIndex = 1;
      this.fetchData();
    },
  }
};
</script>

<style scoped lang="scss">

.top {
  display: flex;
  justify-content: space-between;
  font-size: 15px;

  .item-title {
    flex: 1;
  }

  .state {
    flex-shrink: 0;
  }
}

.list-item {
  padding: 10px;
  background-color: white;
  margin: 10px;
  border-radius: 4px;

  .item-title {
    color: #333333;
    // margin-bottom: 10px;
  }

  .item-content {
    font-size: 13px;
    color: gray;
    display: flex;
    justify-content: space-between;
  }
}

.bottom {
  color: #adadad;
  font-size: 13px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.un-read {
  position: relative;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    left: -9px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.has-read {
  color: gray;
}

/deep/ .uni-navbar--border {
  border: none;
}

.page {
  height: 100%;
  background-color: $-bg-color;
  display: flex;
  flex-direction: column;
  .tab {
    padding-top: 1px;
    flex-shrink: 0;
  }
  .swiper {
    flex: 1;
  }
}

.tab-bar {
  height: 42px;
  line-height: 42px;
  width: 750rpx;
  background-color: white;
  border-bottom: 1px solid #EEEEEE;
}

/* #ifndef APP-NVUE */
.tab-bar ::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

/* #endif */
.tab-item {
  color: #333;
  padding: 0 20rpx 0 20rpx;
  white-space: nowrap;

  &.active {
    color: #1989fa;
  }
}

.underline-wrap {
  position: relative;
  height: 2px;
  background-color: transparent;
  margin-top: 6rpx;

  .underline {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0;
    background-color: #ffffcc;
    transition-duration: 0.2s;
    transition-property: left;
  }
}

/deep/ uni-scroll-view {
  height: 100%;
}

/deep/ .mescroll-wxs-content {
  height: 100%;
}
</style>
