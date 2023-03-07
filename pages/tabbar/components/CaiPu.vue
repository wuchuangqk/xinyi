<template>
  <view class="home-card">
    <view class="card-title notice">
      <view>
				<icon-font icon="icon-gerenzhuye-xxdaocaipux" class="item-icon" color="#303133" style="margin-right: 4px;"></icon-font>
        <text>每周菜谱</text>
      </view>
      <!-- <text class="state" :class="subscribeStatus ? 'active' : 'normal'" @click="showConfirm = true">
        {{ subscribeText }}
      </text> -->
      <text class="sub-title">
        {{ foodMenuList.time }}
      </text>
    </view>
    <view class="food-menu">
      <view class="tab-wrap">
        <u-tabs-swiper ref="uTabs" :list="list" :is-scroll="false" :current="current"
          @change="tabsChange"></u-tabs-swiper>
      </view>
      <swiper style="height: 120px;" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
        <swiper-item v-for="food in foodList" class="swiper-item">
          <view class="app-flex-between food">
            <text class="label">早餐</text>
            <text>{{ food.breakfast }}</text>
          </view>
          <view class="app-flex-between food">
            <text class="label">午餐</text>
            <text>{{ food.lunch }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <u-modal v-model="showConfirm" content="早餐预约截止时间：前一天17:00；午餐预约截止时间：当天10:00，在截止时间之前，可点击取消预约按钮取消预约。" show-cancel-button
      cancel-text="关闭" :confirm-text="confirmText" @confirm="subscribe"></u-modal>
    <view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
  </view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
export default {
	components: {
		IconFont,
	},
  data() {
    return {
      dateArr: [],
      selected: 0,
      foodMenuList: {}, // 菜谱
      breakfast: '', // 早餐
      lunch: '', // 午餐
      weekNum: '', // 今日是周几
      list: [
        { name: '周一' },
        { name: '周二' },
        { name: '周三' },
        { name: '周四' },
        { name: '周五' },
        { name: '周六' },
      ],
      current: 0,
      swiperCurrent: 0,
      foodList: [],
      subscribeInfo: {}, // 早餐午餐预约状态
      subscribeText: '',
      showConfirm: false,
      confirmText: '',
      subscribeStatus: false,
      renderParams: null,
    }
  },
  mounted() {
    // 每周菜谱
    this.doGet('/home/caipu').then(res => {
      this.foodMenuList = res.data
      for (let index = 1; index <= 6; index++) {
        this.foodList.push({
          breakfast: this.foodMenuList.breakfast[index - 1]['Breakfast_' + (index)].replace(/\r\n/g, '\t'),
          lunch: this.foodMenuList.lunch[index - 1]['Lunch_' + (index)].replace(/\r\n/g, '\t')
        })
      }
    })
    this.getSubscribeInfo()
  },
  methods: {
    // 预约状态
    getSubscribeInfo() {
      this.doGet('/food/GetCannce').then(res => {
        this.subscribeInfo = res.data
        // 是否可以预约早餐
        if (res.data.BreakfastState) {
          // 是否已预约
          this.subscribeStatus = res.data.Breakfasttip !== ''
          if (this.subscribeStatus) {
            this.subscribeText = res.data.Breakfasttip
            this.confirmText = '取消预约'
          } else {
            this.confirmText = this.subscribeText = '预约早餐'
          }
        }
        // 是否可以预约午餐
        if (res.data.LunchState) {
          // 是否已预约
          this.subscribeStatus = res.data.Lunchtip !== ''
          if (this.subscribeStatus) {
            this.subscribeText = res.data.Lunchtip
            this.confirmText = '取消预约'
          } else {
            this.confirmText = this.subscribeText = '预约午餐'
          }
        }
      })
    },
    tabsChange(index) {
      this.swiperCurrent = index;
    },
    transition(e) {
      let dx = e.detail.dx;
      this.$refs.uTabs.setDx(dx);
    },
    animationfinish(e) {
      let current = e.detail.current;
      this.$refs.uTabs.setFinishCurrent(current);
      this.swiperCurrent = current;
      this.current = current;
    },
    // 预约/取消预约
    subscribe() {
      this.renderParams = this.subscribeInfo.BreakfastState ? '/food/SetBreakfast' : '/food/SetLunch'
    },
    callback({ success, res }) {
      uni.hideLoading();
      if (success) {
        this.renderParams = null
        this.$u.toast(res.data)
        this.getSubscribeInfo()
      } else {
        this.renderParams = null
        this.handleError(res)
      }
    },
  }
}
</script>
<script module="renderModule" lang="renderjs">
import axios from 'axios'
import { doPost } from '@/util/post.js'
export default {
  methods: {
		change(renderParams) {
			if (renderParams !== null) {
				doPost(renderParams, {}, axios).then(res => {
					this.$ownerInstance.callMethod('callback', {
						success: true,
            res
					})
				}).catch(err => {
					this.$ownerInstance.callMethod('callback', {
						success: false,
						res: err
					})
				})
			}
		}
  },
}
</script>
<style lang="scss" scoped>
.home-card {
  background-color: white;
  border-radius: 4px;
  margin-top: 12px;

  &:first-of-type {
    margin-top: 0;
  }
}

.card-title {
  padding: 8px 12px 10px;
  font-size: 16px;
  border-bottom: 1px solid #eee;
  margin-bottom: 18px;

  &.notice {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
}

.calendar-body {
  margin: 20px 0 20px 0;
}

.row {
  display: flex;
  margin: 10px 0;
}

.col {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 14px;
}

.date {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 50%;
  position: relative;
  color: #737373;
  transition: all 0.1s linear;

  &.today {
    background-color: #f2f8fe;
    color: #737373;
  }

  &.active {
    background-color: #1989fa;
    color: white;
  }

  .dot {
    position: absolute;
    width: 5px;
    height: 5px;

    border-radius: 50%;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);

    &.blue {
      background-color: #1989fa;
    }

    &.green {
      background-color: #70b603;
    }
  }
}

.food {
  background: rgba(56, 128, 255, 0.1);
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;
  align-items: center;
  height: 50px;
  padding-right: 10px;

  .label {
    flex-shrink: 0;
    margin-right: 10px;
    background: rgb(56, 128, 255);
    width: 20px;
    color: white;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}

.food-menu {
  padding: 0 15px 10px;
}

.time {
  margin: 10px 0;
  color: #999;
}

.tab-wrap {
  margin-bottom: 10px;
}

.state {
  &.normal {
    color: #3880ff;
  }

  &.active {
    color: orange;
  }
}

.sub-title {
  font-size: 14px;
  color: #999;
}
</style>