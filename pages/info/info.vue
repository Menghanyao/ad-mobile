<template>
	<form class='loginView' @submit="login">
		<view class="input-view">
			<view class="label-view">
				<text class="label">姓名 </text>
			</view>
			<input class="input" type="text" placeholder="请输入姓名" v-model="user.userName"/>
		</view>
		<view class="input-view">
			<view class="label-view">
				<text class="label">年龄</text>
			</view>
			<view>
				<slider show-value value="50" @change="sliderChange" activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9" block-size="20" />
			</view>
			<!-- <input class="input" type="number" placeholder="请输入年龄" v-model="user.userAge"/> -->
		</view>
		
		<view class="input-view">
			<view class="label-view">
				<text class="label">性别</text>
			</view>
			<radio-group @change="radioChange">
				<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in gender" :key="item.value">
					<radio :value="item.value" :checked="index === item.index" >{{item.value}}<span> </span></radio>
				</label>
			</radio-group>
		</view>
		
		
		<view class="input-view">
			<view class="label-view">
				<text class="label">在校 </text>
			</view>
			<radio-group @change="radioChange1">
				<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in student" :key="item.value">
					<radio :value="item.value" :checked="index1 === item.index" >{{item.value}}<span> </span></radio>
				</label>
			</radio-group>
		</view>
		<view class="input-view">
			<view class="label-view">
				<text class="label">城市 </text>
			</view>
			<input class="input" type="text" placeholder="请输入城市" v-model="user.userCity"/>
		</view>
		<!-- <view class="input-view">
			<view class="label-view">
				<text class="label">收入 </text>
			</view>
			<input class="input" type="number" placeholder="请输入月收入" name="income" />
		</view> -->
		<view class="button-view">
			<button type="default" class="login" hover-class="hover" formType="submit">提 交</button>
		</view>
	</form>
</template>

<script>
	export default {
		data() {
			return {
				user: {},
				index: null,
				index1: null,
				gender: [
					{
						index: 1,
						value: '男'
					},
					{
						index: 2,
						value: '女'
					}
				],
				student: [
					{
						index: 1,
						value: '是'
					},
					{
						index: 0,
						value: '否'
					}
				]
			};
		},
		onReady() {
			let _this = this
			uni.getStorage({
				key: "user",
				success(res) {
					console.log("从缓存中得到user：", res)
					_this.user = res.data
					if (res.data.userName == null || res.data.userName == 'null') {
						_this.user.userName = ''
					}
					if (res.data.userCity == null || res.data.userCity == 'null') {
						_this.user.userCity = ''
					}
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
		
		methods: {
			
			sliderChange(val) {
				console.log(val)
				this.user.userAge = val.detail.value
			},
			radioChange(item) {
				console.log(item)
				this.index = item.index
				this.user.userGender = item.target.value
			},
			radioChange1(item) {
				console.log(item)
				this.index1 = item.index
				this.user.isStudent = item.target.value == '是' ? 1 : 0
			},
			login(e) {
				// console.log(e)
				// console.log("得到性别:"+ e.detail.value.gender + 
				// ';得到年龄:' + e.detail.value.age +
				// ';得到是否大学生:' + e.detail.value.isStudent +
				// ';得到城市:' + e.detail.value.city +
				// ';得到收入:' + e.detail.value.income
				// )
				console.log(this.user)
				let _this = this
				
				uni.request({
					url: 'http://localhost:8081/updateUser',
					data: JSON.stringify(_this.user),
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
							uni.setStorageSync('user', res.data);
							uni.getStorage({
								key: "user",
								success(res) {
									console.log("刚刚存入了：", res)
								}
							})
							uni.switchTab({
								url: '/pages/center/center'
							})
						}
					}
				})
				
			},
			register() {
				console.log("前往注册页面")
			}
		}
	}
</script>

<style scoped>

.input .label{
	font-size: 32upx;
}
</style>
