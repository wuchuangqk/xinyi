<template>
  <view>
    <view class="placeholder"></view>
    <view class="tabbar">
      <view v-for="item in tabbarItems" :key="item.pagePath" class="tabbar-item" :class="{ active: text === item.text }"
        @click="switchTabbar(item.pagePath)">
        <template v-if="item.pagePath === '快速新建'">
          <view class="add-wrap">
            <view class="add">
              <uni-icons type="plusempty" size="22" color="#ffffff"></uni-icons>
            </view>
          </view>
        </template>
        <template v-else>
          <image :src="text === item.text ? item.selectedIconPath : item.iconPath" class="tabbar-icon" />
          <text>{{ item.text }}</text>
        </template>
      </view>
    </view>
    <u-popup v-model="show" mode="bottom" border-radius="30">
      <view>
        <view class="popup-title">快速新建</view>
        <view class="row">
          <view class="col" v-for="item in officeMenus" :key="item.name" @click="nav(item.url)">
            <view class="icon-bg" :style="{ background: item.color }">
              <icon-font :icon="item.icon" class="item-icon"></icon-font>
              <view v-if="item.count" class="badge">{{ item.count }}</view>
            </view>
            <view class="item-name">
              <text>{{ item.name }}</text>
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
export default {
  props: ['text'],
  components: { IconFont },
  data() {
    return {
      tabbarItems: [
        {
          pagePath: "/pages/tabbar/tabbar1",
          iconPath: "/static/img/tabBarIco/home.png",
          selectedIconPath: "/static/img/tabBarIco/home_.png",
          text: "首页"
        },
        {
          pagePath: "快速新建",
        },
        {
          pagePath: "/pages/user-info/user-info",
          iconPath: "/static/img/tabBarIco/user.png",
          selectedIconPath: "/static/img/tabBarIco/user_.png",
          text: "我的"
        },
      ],
      show: false,
      officeMenus: [
        {
          name: '请假申请',
          icon: 'icon-qingjia',
          url: '/pages/leave-list/leave-form',
          color: '#0188fd',
        },
        {
          name: '加班申请',
          icon: 'icon-jiaban',
          url: '/pages/jiaban/form',
          color: '#f9a202',
        },
        {
          name: '出差申请',
          icon: 'icon-chucha',
          url: '/pages/chuchai/form',
          color: '#14bd82',
        },
        {
          name: '综合申请',
          icon: 'icon-zongheguanli',
          url: '/pages/zonghe/form',
          color: '#0382fb',
        },
        {
          name: '购置申请',
          icon: 'icon-wuzicaigou',
          url: '/pages/zichan/form',
          color: '#f25641',
        },
        {
          name: '接待申请',
          icon: 'icon-jiedai',
          url: '/pages/jiedai/form',
          color: '#14bd82',
        },
        {
          name: '用章申请',
          icon: 'icon-yinzhangkezhi',
          url: '/pages/yongzhang/form',
          color: '#fe8007',
        },
      ],
    };
  },
  methods: {
    switchTabbar(url) {
      if (url === '快速新建') {
        this.show = true
      } else {
        uni.switchTab({ url });
      }
    },
    nav(url) {
      this.show = false
      uni.navigateTo({
        url: url + '?from=shortcut'
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.placeholder {
  height: 50px;
}

.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background-color: white;
  color: rgb(153, 153, 153);
  font-size: 10px;

  .tabbar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    &.active {
      color: rgb(25, 137, 250);
    }
  }

  .tabbar-icon {
    width: 24px;
    height: 24px;
    margin-bottom: 3px;
  }

  .add-wrap {
    position: absolute;
    bottom: 14px;
    padding: 2px;
    border-radius: 50%;
    background-color: white;
  }

  .add {
    background-color: rgb(25, 137, 250);
    color: white;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
}

.row {
  display: flex;
  flex-wrap: wrap;
  padding: 0 8px 20px;

  .col {
    display: flex;
    flex-direction: column;
    width: 25%;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }

  .icon-bg {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .badge {
      position: absolute;
      top: -3px;
      right: -3px;
      background-color: red;
      color: white;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .item-name {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
  }

  .item-icon {
    color: white;
    font-size: 25px;
  }
}

.popup-title {
  text-align: center;
  padding: 15px 0 30px;
  font-size: 18px;
}
</style>
