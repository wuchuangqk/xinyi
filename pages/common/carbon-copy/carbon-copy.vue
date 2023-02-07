<template>
	<view class="page">
		<view style="height: 1px;"></view>
		<view class="header">
			<view class="header-top">
        <uni-search-bar
            bgColor="white"
            :radius="100"
            cancelButton="none"
            style="padding: 0;background:none;flex: 1;"
            placeholder="请输入用户姓名"
            @confirm="doFilter"
            @clear="doFilter"
        ></uni-search-bar>
      </view>
			<view class="header-top">
				<picker class="dept-picker" style="margin-right: 10px" @change="deptChange" :value="deptIndex" :range="deptData" range-key="label">
					<view class="picker-content">{{deptData[deptIndex].label}}</view>
				</picker>
        <picker class="dept-picker" @change="positionChange" :value="positionIndex" :range="positionData" range-key="label">
          <view class="picker-content">{{positionData[positionIndex].label}}</view>
        </picker>
			</view>
		</view>
		<view v-show="userList.length" class="card">
			<evan-checkbox-group v-model="userIds" @change="doChecked">
			        <evan-checkbox v-for="item in userList"
                             :key="item.value"
                             :label="item.value"
                             class="check"
              >
                <text>{{item.label}}</text>
              </evan-checkbox>
			    </evan-checkbox-group>
		</view>
    <view style="height: 1px"></view>
    <view class="footer">
      <text class="footer-label">已选择：{{userIds.length}}人</text>
      <view class="btn" @click="doSubmit">确定</view>
    </view>
	</view>
</template>

<script>
import { getUserList } from '@/api/user.js';
import { copyTo } from '@/api/office/leave.js';
import {getDept} from '@/api/system/dept.js'
import {getPosition} from '@/api/system/position.js'
export default {
	data() {
		return {
			userList: [],
      deptData: [{label:'请选择部门', value: null}], // 部门下拉框数据
      positionData: [{label:'请选择职位', value: null}], // 职位下拉框数据
      deptId: null,
      positionId: null,
      deptIndex: 0,
      positionIndex: 0,
      userName: '',
      checkedUserMap: new Map(),
      btnLoading: false,
      userIds: []
		};
	},
	onReady() {
		const temp = uni.getStorageSync(this.$const.COPY_USER) || []
		temp.forEach(user => {
		  this.checkedUserMap.set(user.value, user)
		  this.userIds = temp.map(v => v.value)
		})
		uni.removeStorageSync(this.$const.COPY_USER);
		getDept().then(res=> {
		  const temp = []
		  this.formatArrToFlat(res, temp)
		  this.deptData = this.deptData.concat(temp)
		})
		getPosition().then(res=> {
		  this.positionData = this.positionData.concat(
		      (res.records || []).map(v => {
		        return {
		          label: v.postName,
		          value: v.positionsId
		        }
		      })
		  )
		})
		this.doSearch()
	},
	methods: {
		doFilter(e) {
      this.userName = e.value
      this.doSearch()
		},
    doSearch() {
      getUserList(this.userName, this.deptId, this.positionId, 1).then(res=> {
        this.userList = (res.records || []).map(v => {
          return {
            label: v.displayName,
            value: v.userId,
          };
        });

        // 如果搜索结果里有自身，就把自身放在第一位
        const { userId } = uni.getStorageSync(this.$const.USER_INFO);
        const curUserIndex = this.userList.findIndex(v => v.value === userId);
        if(curUserIndex !== -1) {
          this.userList.unshift(this.userList.splice(curUserIndex, 1)[0])
        }
      })
    },
		doChecked() {
      this.userIds.forEach(userId => {
        const user = this.userList.find(v => v.value === userId)
        if(user) {
          this.checkedUserMap.set(userId, user)
        }
      })
		},
		/**
		 * 抄送
		 */
		doCopy() {
			if (this.type === 'copy') {
				if (this.checkedUsers.length === 0) {
					uni.showToast({
						title: '请选择至少一个用户',
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: '正在提交',
					mask: true
				});
				copyTo({
					approvalId: this.approvalId,
					userCc: this.checkedUsers.map(v => v.value).join(',')
				}).then(() => {
					uni.$emit(this.$events.UPDATE_LEAVE_COPY);
					uni.hideLoading();
					uni.showToast({
						title: '抄送成功',
						icon: 'none'
					});
					uni.navigateBack();
				});
			} else {
				uni.$emit(this.$events.UPDATE_COPY_USERS, this.checkedUsers);
				uni.navigateBack();
			}
		},
    deptChange(e) {
      this.deptIndex = e.target.value
      this.deptId = this.deptData[this.deptIndex].value
      this.doSearch()
    },
    positionChange(e) {
      this.positionIndex = e.target.value
      this.positionId = this.positionData[this.positionIndex].value
      this.doSearch()
    },
    /**
     * 嵌套树形数组格式化成扁平数组
     */
    formatArrToFlat(target, result) {
      target.forEach(v => {
        result.push({
          label: v.departName,
          value: v.departId
        })
        if(v.childs) {
          this.formatArrToFlat(v.childs, result)
        }
      })
    },
    doSubmit() {
      if(this.btnLoading) {
        return;
      }
      this.btnLoading = true
      const temp = this.userIds.map(userId => {
        return this.checkedUserMap.get(userId)
      })
      uni.$emit(this.$events.UPDATE_COPY_USERS, temp);
      uni.navigateBack();
    },
	}
};
</script>

<style lang="scss">
.page {
	min-height: 100%;
	background-color: $-bg-color;
}
.header {
	padding: 10px;
	background-color: $-bg-color;
	position: fixed;
	z-index: 1;
	left: 0;
	right: 0;
	// #ifdef H5
	top: 44px;
	// #endif
	// #ifdef APP-PLUS
	top: 0;
	// #endif
  .header-top {
    display: flex;
    justify-content: space-between;
  }
  .dept-picker {
    padding: 6px 0;
    flex: 1;
    font-size: 14px;
    //color: #333333;
    text-align: center;
    //background: #e6e6e6;
    margin-top: 10px;
    border-radius: 5px;
    color: #409eff;
    background: #ecf5ff;
    border: 1px solid #b3d8ff;
  }
}
.card {
	margin-top: 98px;
  margin-bottom: 60px;
}
.user-col:nth-of-type(odd) {
	.user-item {
		margin-right: 10px;
	}
}
.user-item {
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #efefef;
	margin-top: 10px;
	font-size: 14px;
	padding: 7px 0;
	border-radius: 3px;
	&.checked {
		color: white;
		background-color: #00c678;
	}
}

.btn {
	text-align: center;
	color: white;
	border-radius: 17px;
	background-color: #1989fa;
	width: 100px;
	line-height: 36px;
	margin-left: 10px;
}

.search {
	.uni-searchbar__box {
		background-color: white;
	}
}

.footer {
  position: fixed;
  height: 50px;
  z-index: 1;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 10px;
  border-top: 1px solid #eee;
  .footer-label {
    font-size: 14px;
    color: #666;
  }
}

.check {
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  .evan-checkbox__label {
    margin-left: 0;
  }
}

.radio-item {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-sizing: border-box;
  border:1px solid #000;
  &.un-checked {
    border-color: #c8c9cc;
  }
  &.checked {
    background-color: #108ee9;
    border-color: #108ee9;
  }
}
</style>
