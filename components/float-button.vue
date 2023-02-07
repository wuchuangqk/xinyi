<template>
  <view class="float-button" @click="$emit('click')">
    <uni-icons type="plusempty" size="22" color="#ffffff"></uni-icons>
  </view>
</template>

<script>
export default {
  name: "float-button",
}
</script>

<style lang="scss" scoped>
.float-button {
  position: absolute;
  z-index: 100;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: #1989fa;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 5%;
  bottom: 15%;
}
</style>
