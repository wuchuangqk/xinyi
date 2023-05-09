<template>
  <view>
    <view class="placeholder"></view>
    <view class="tabbar">
      <view v-for="item in tabbarItems" :key="item.pagePath" class="tabbar-item" :class="{ active: text === item.text }"
        @click="switchTabbar(item.pagePath)">
        <image :src="text === item.text ? item.selectedIconPath : item.iconPath" class="tabbar-icon" />
        <text>{{ item.text }}</text>
      </view>
    </view>
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
          pagePath: "/pages/tabbar/more",
          iconPath: "/static/img/tabBarIco/office.png",
          selectedIconPath: "/static/img/tabBarIco/office_.png",
          text: "更多"
        },
        {
          pagePath: "/pages/user-info/user-info",
          iconPath: "/static/img/tabBarIco/user.png",
          selectedIconPath: "/static/img/tabBarIco/user_.png",
          text: "我的"
        },
      ],
    };
  },
  methods: {
    switchTabbar(url) {
      uni.switchTab({ url });
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

}
</style>
