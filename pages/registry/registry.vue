<template>
	<form class='loginView' @submit="registry">
		<view class="input-view">
			<view class="label-view">
				<text class="label">账号 </text>
			</view>
			<input class="input" type="text" placeholder="请输入用户名" name="nameValue" />
		</view>
		<view class="input-view">
			<view class="label-view">
				<text class="label">密码</text>
			</view>
			<input class="input" type="password" placeholder="请输入密码" name="passwordValue" />
		</view>
		<view class="button-view">
			<button type="default" class="login" hover-class="hover" formType="submit">注册</button>
			<button type="default" class="register" hover-class="hover" @click="login">登录</button>
		</view>
	</form>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {
			registry(e) {
				console.log(e)
				console.log("得到账号:"+ e.detail.value.nameValue + ';得到密码:' + e.detail.value.passwordValue)
			},
			login() {
				console.log("前往登录页面")
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
		}
	}
</script>

<style>
	
</style>
