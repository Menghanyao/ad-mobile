<template>
	<form class='loginView' @submit="login">
		<view class="input-view">
			<view class="label-view">
				<text class="label">账号 </text>
			</view>
			<input class="input" type="text" placeholder="请输入电话号" name="nameValue" />
		</view>
		<view class="input-view">
			<view class="label-view">
				<text class="label">密码</text>
			</view>
			<input class="input" type="password" placeholder="请输入密码" name="passwordValue" />
		</view>
		<view class="button-view">
			<button type="default" class="login" hover-class="hover" formType="submit">登录</button>
			<p>注意：新用户自动登录</p>
			<!-- <button type="default" class="register" hover-class="hover" @click="register">免费注册</button> -->
		</view>
	</form>
</template>

<script>
	import {actionSaveUser} from '../store/index.js'
	export default {
		data() {
			return {};
		},
		methods: {
			// ...mapActions(['actionSaveUser']),
			// ...mapMutations(['savevueUser']),
			login(e) {
				console.log(e)
				console.log("得到账号:"+ e.detail.value.nameValue + ';得到密码:' + e.detail.value.passwordValue)
				let userDTO = {
					userPhone: e.detail.value.nameValue,
					userPassword: e.detail.value.passwordValue,
					userType: 1
				}
				console.log(userDTO)
				
				uni.request({
					url: 'http://localhost:8081/login',
					data: JSON.stringify(userDTO),
					method: 'POST',
					headers: {
								'Content-Type': 'application/json'
					},
					success(res) {
						console.log(res)
						if (res.data) {
							if (res.data.code) {
								uni.showToast({
									title: res.data.message
								})
								return
							}
							uni.showToast({
								title: '登录成功'
							})
							// this.$store.dispatch('savevueUser',res.data)
							// this.$store.commit('savevueUser', res.data)
							uni.setStorageSync('user', res.data);
							uni.getStorage({
								key: "user",
								success(res) {
									console.log("刚刚存入了：", res)
								}
							})
							uni.switchTab({
								url: '/pages/new/new'
							})
							
						}
						
					}
				})
				
			},
			register() {
				// console.log("前往注册页面")
				// uni.navigateTo({
				// 	url: '/pages/registry/registry'
				// });
			}
		}
	}
</script>

<style>
	
</style>
