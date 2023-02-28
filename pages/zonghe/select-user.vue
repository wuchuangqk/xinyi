<template>
  <view class="app-page">
    <view class="header">
      <text>当前部门：{{ departName }}</text>
      <text v-show="parentDepartIds.length > 1" class="primary" @click="back">返回上一级</text>
    </view>
    <view class="page-main">
      <scroll-view scroll-y style="height: 100%;">
        <!-- 渲染区 -->
        <u-cell-group v-show="departs.length > 0" :title="`部门`">
          <u-cell-item v-for="depart in departs" :key="depart.id" :arrow="true" @click="nextDepart(depart)">
            <view slot="title">
              <text>{{ depart.name }}</text>
              <text class="sub-text">{{ depart.staff_num }}人</text>
            </view>
          </u-cell-item>
        </u-cell-group>
        <u-cell-group v-show="staffs.length > 0" :title="`人员`">
          <u-cell-item v-for="user in staffs" :key="user.id" :arrow="false">
            <view slot="title">
              <text>{{ user.name }}</text>
              <text class="sub-text">{{ user.position }}</text>
            </view>
            <u-checkbox v-model="user.checked" @change="e => change(e, user)"></u-checkbox>
          </u-cell-item>
        </u-cell-group>
      </scroll-view>
    </view>
    <view class="app-page-footer">
      <view class="user-name">已选用户：{{ selectedUsers.map(user => user.name).join(',') }}</view>
      <button class="btn" @click="submit">确定</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      parentDepartIds: [],
      departName: '',
      departs: [], // 部门
      staffs: [], // 员工
      selectedUsers: [],
    };
  },
  onReady() {
    this.selectedUsers = JSON.parse(JSON.stringify(this.$store.state.selectedUsers))
    this.nextDepart({ id: '0000', name: '所有部门' })
  },
  methods: {
    nextDepart(depart) {
      this.parentDepartIds.push(depart)
      this.getListData(depart)
    },
    back() {
      this.parentDepartIds.pop()
      const len = this.parentDepartIds.length
      const depart = len ? this.parentDepartIds[len - 1] : { id: '0000', name: '所有部门' }
      this.getListData(depart)
    },
    submit() {
      this.$store.dispatch('selectedUsers', this.selectedUsers)
      uni.navigateBack();
    },
    getListData(depart) {
      this.departName = depart.name
      this.doGet('/staffs/list', { depart_id: depart.id }).then(res => {
        this.departs = res.data.departs
        this.staffs = res.data.staffs.map(val => {
          val.displayname = val.name
          val.userid = val.id
          val.checked = this.selectedUsers.some(v => v.id === val.id)
          return val
        })
      })
    },
    change(checked, user) {
      if (checked.value) {
        this.selectedUsers.push(user)
      } else {
        const index = this.selectedUsers.findIndex(v => v.id === user.id)
        if (index !== -1) {
          this.selectedUsers.splice(index, 1)
        }
      }
    },
  }
};
</script>
<style scoped lang="scss">
/deep/ .u-checkbox__label {
  margin-right: 0;
}

.app-page-footer {
  padding: 5px 8px;
  display: flex;
  align-items: center;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  position: relative;

  .user-name {
    flex: 1;
    overflow: hidden;
    margin-right: 10px;
  }
}

.sub-text {
  color: #999;
  font-size: 13px;
  margin-left: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 8px;

  .primary {
    color: #3880ff;
  }
}
</style>
