

<template>
  <view class="picker-wrap">
    <view class="picker" @click="show = true">
      <text v-if="!value" class="placeholder">{{ placeholder }}</text>
      <text v-else>{{ value }}</text>
      <u-icon name="arrow-down-fill" color="#c0c4cc" size="24" />
    </view>
    <u-select v-model="show" :list="list" @confirm="change"></u-select>
  </view>
</template>

<script>
export default {
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: {
    modelValue: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
  },
  data() {
    return {
      show: false,
      value: '',
    }
  },
  watch: {
    modelValue() {
      if (this.value === '' && this.modelValue) {
        const temp = this.list.find(val => val.value === this.modelValue)
        if (temp) {
          this.value = temp.label
        }
      }
    }
  },
  methods: {
    change(data) {
      this.value = data[0].label
      this.$emit(data[0].value)
    }
  }
}
</script>

<style scoped lang="scss">
.picker-wrap {
  position: relative;
  flex: 1;
}

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.placeholder {
  color: #c0c4cc;
}
</style>
