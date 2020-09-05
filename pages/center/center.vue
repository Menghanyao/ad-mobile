<template>
	<view class="center">
		<view class="logo" :hover-class="!login ? 'logo-hover' : ''">
			<image class="logo-img" :src="login? avatarUrl : 'avatarUrl'"></image>
			<view class="logo-title">
				<text class="uer-name">Hi，{{login ? user.userPhone : '您未登录'}}</text>
				<text class="go-login navigat-arrow" v-if="login">￥：</text>
				<text class="go-login navigat-arrow" v-if="login">{{user.userCash / 10}}</text>
				<text class="go-login navigat-arrow" @click="goLogin" v-if="!login">&#xe65e;</text>
				<text class="go-login navigat-arrow" @click="goLogin" v-if="login">&#xe65e;</text>
			</view>
		</view>
		<!-- <view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe60c;</text>
				<text class="list-text">收藏图片</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item">
				<text class="list-icon">&#xe60d;</text>
				<text class="list-text">收藏图集</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe60b;</text>
				<text class="list-text">管理图片</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item">
				<text class="list-icon">&#xe61a;</text>
				<text class="list-text">上传图片</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view> -->
		<view class="center-list">
			<view class="center-list-item"  @click="goInfo" v-if="login">
				<text class="list-icon">&#xe609;</text>
				<text class="list-text">账号管理</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" @click="goAbout">
				<text class="list-icon">&#xe603;</text>
				<text class="list-text">使用说明</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				login: false,
				avatarUrl: '/static/logo.png',
				uerInfo: {},
				user : {}
			}
		},
		onReady() {
			let _this = this
			uni.getStorage({
				key: "user",
				success(res) {
					console.log("从缓存中得到user：", res)
					_this.user = res.data
				},
				fail() {
					uni.showToast({
						title: '需要登录，否则无收益'
					})
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			})
		},
		watch: {
			user: function() {
				if (this.user) {
					this.login = true
				} else {
					this.login = false
				}
			}
		},
		methods: {
			goLogin() {
				if (!this.login) {
					console.log("去登录")
					uni.navigateTo({
						url: '/pages/login/login'
					});
				} else if (this.login) {
					console.log("切换账号")
					uni.removeStorageSync("user")
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},
			goAbout() {
				uni.navigateTo({
					url: '/pages/about/about'
				});
			},
			goInfo() {
				uni.navigateTo({
					url: '/pages/info/info'
				});
			}
		}
	}
</script>

<style>
</style>
