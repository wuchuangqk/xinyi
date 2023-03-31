<template>
	<view class="app-page">
		<view class="page-main">
			<scroll-view scroll-y style="height: 100%;">
				<u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="180">
					<view class="card form-card">
						<u-form-item label="旧密码" prop="old_password" required>
							<u-input v-model="formData.old_password" type="password" placeholder="请输入旧密码" maxlength="12" />
						</u-form-item>
						<u-form-item label="新密码" prop="new_password" required>
							<u-input v-model="formData.new_password" type="password" placeholder="6-12位数字、字母、下划线" maxlength="12" />
						</u-form-item>
						<u-form-item label="重复新密码" prop="repeatPwd" required>
							<u-input v-model="formData.repeatPwd" type="password" placeholder="请重复新密码" maxlength="12" />
						</u-form-item>
					</view>
				</u-form>
			</scroll-view>
		</view>
		<view class="app-page-footer">
			<button class="btn" @click="submit">提交</button>
		</view>
		<view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
		<u-modal v-model="show" content="密码修改成功" @confirm="back"></u-modal>
	</view>
</template>

<script>
import renderMixin from '@/mixin/render'
import { validPwd } from '@/util/validate.js';

export default {
	mixins: [renderMixin],
	data() {
		return {
			formData: {
				old_password: '', // 旧密码
				new_password: '', // 新密码
				repeatPwd: '', // 重复新密码
			},
			rules: {
				old_password: [{ required: true, message: '请输入旧密码' }],
				new_password: [
					{ required: true, message: '请输入新密码' },
					{
						validator: () => {
							return validPwd(this.formData.new_password)
						}, message: '密码只能由6-12位数字、字母、下划线组成'
					}
				],
				repeatPwd: [
					{ required: true, message: '请再次输入新密码' },
					{
						validator: () => {
							return this.formData.new_password === this.formData.repeatPwd
						}, message: '两次密码输入不一致'
					}
				],
			},
			show: false,
		};
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (!valid) return
				uni.showLoading({
					title: '正在提交',
					mask: true,
				});
				this.renderParams = this.setPostData(this.formData)
			})
		},
		back() {
			uni.navigateBack()
		},
		callback({ success, res }) {
			uni.hideLoading();
			if (success) {
				if (!res.success) {
					this.renderParams = null
					this.$u.toast('旧密码有误')
				} else {
					this.show = true
				}
			} else {
				this.renderParams = null
				this.handleError(res)
			}
		},
	}
};
</script>
<script module="renderModule" lang="renderjs">
import axios from 'axios'
import { axiosRequest } from '@/util/post.js'
export default {
  methods: {
		change(renderParams) {
			if (renderParams !== null) {
				axiosRequest('/BindUser/ChangePassword', renderParams, axios).then(res => {
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

<style scoped lang="scss"></style>
