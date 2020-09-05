<template>
	<view class="index">
		<block v-for="item in list" :key="item.img_src">
			<view class="card" 
			@click="clickLike()"
			>
			<!-- @click="goDetail(item)" -->
				<image class="card-img" :src="item.img_src" mode="aspectFill"></image>
				<div class="card-num-view jubao" @click.stop="jubao(item)">举报</div>
				<text class="card-num-view">{{item.title}}</text>
				<view class="progress" 
				:class="[time ? 'loading' : 'success']"
				:style="{width: progressWidth +'%'}"
				>
					<div class="progress-div"></div>
				</view>
				<view class="card-bottm row">
					<view class="car-title-view row">
						<!-- <text class="card-title">{{item.title}}</text> -->
						<text class="card-title">这里东西超级多，是商家广告的说明内容，可能会占据两行左右的空间，因此这段话要足够长，并且要限制长度</text>
					</view>
					<!-- <view @click.stop="share(item)" class="card-share-view"></view> -->
				</view>
				
				<view class="new-btn-view">
					<view class="like btn-bottom" :class="isLike ? 'liked' : ''" @click.stop="clickLike"></view>
					<view class="download btn-bottom" :class="isDownload === true ? 'liked' : ''" @click.stop="download"></view>
					<view class="collect btn-bottom" @click.stop="gotoNext"></view>
				</view>
				
			</view>
		</block>
		<!-- <text class="loadMore">加载中...</text> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refreshing: false,
				providerList: [],
				list: [],
				fetchPageNum: 1,
				time: 0,	// 播放时间
				timer: null,	// 计时器
				progressWidth: 0,	//进度条
				isLike: false,
				isDownload: false,
				restart: false,
				user: {},
			}
		},
		onLoad() {
			uni.getStorage({
				key: "user",
				success(res) {
					console.log("从缓存中得到user：", res)
					this.user = res
				},
				fail() {
					uni.showToast({
						title: '需要登录，否则无收益'
					})
				}
			})
			this.getData();
			uni.getProvider({
				service: 'share',
				success: (e) => {
					let data = []
					for (let i = 0; i < e.provider.length; i++) {
						switch (e.provider[i]) {
							case 'weixin':
								data.push({
									name: '分享到微信好友',
									id: 'weixin'
								})
								data.push({
									name: '分享到微信朋友圈',
									id: 'weixin',
									type: 'WXSenceTimeline'
								})
								break;
							case 'qq':
								data.push({
									name: '分享到QQ',
									id: 'qq'
								})
								break;
							default:
								break;
						}
					}
					this.providerList = data;
				},
				fail: (e) => {
					console.log('获取分享通道失败', e);
				}
			});
		},
		onReachBottom() {
			console.log('滑动到页面底部')
			// this.getData();
		},
		onPullDownRefresh() {
			console.log('下拉刷新');
			this.refreshing = true;
			this.getData();
		},
		methods: {
			getData() {
				uni.request({
					url: this.$serverUrl + '/api/picture/posts.php?page=' + (this.refreshing ? 1 : this.fetchPageNum) +
						'&per_page=5',
					success: (ret) => {
						console.log('data', ret);
						if (ret.statusCode !== 200) {
							console.log('失败!');
						} else {
							if (this.refreshing && ret.data[0].id === this.list[0].id) {
								uni.showToast({
									title: '已经最新',
									icon: 'none',
								})
								this.refreshing = false;
								uni.stopPullDownRefresh();
								return;
							}
							if (this.refreshing) {
								// console.log("下拉刷新时：")
								this.refreshing = false;
								uni.stopPullDownRefresh()
								// this.list = ret.data;
								this.list = ret.data[0];
								this.fetchPageNum = 2;
							} else {
								console.log("页面初次载入&滑到底部刷新：")
								console.log("this.list:",this.list)
								console.log("ret.data",ret.data)
								this.restart = true
								this.restart = false
								if(this.list.length === 0) {
									this.list = this.list.concat(ret.data[0]);
								}
								else {
									// this.list = ret.data[0]
									this.list = []
									this.list = this.list.concat(ret.data[0]);
								}
								console.log("this.list:",this.list)
								this.fetchPageNum += 1;
								if(this.timer) {
									clearInterval(this.timer)
								}
								this.onProgressLoading(this,5)	//	重置进度条
								this.isLike = false
								this.isDownload = false
							}
						}
					}
				})
				
			},
			// goDetail(e) {
			// 	uni.navigateTo({
			// 		url: '../detail/detail?data=' + encodeURIComponent(JSON.stringify(e))
			// 	})
			// },
			share(e) {
				if (this.providerList.length === 0) {
					uni.showModal({
						title: '当前环境无分享渠道!',
						showCancel: false
					})
					return;
				}
				let itemList = this.providerList.map(function(value) {
					return value.name
				})
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						uni.share({
							provider: this.providerList[res.tapIndex].id,
							scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ?
								'WXSenceTimeline' : 'WXSceneSession',
							type: 0,
							title: 'uni-app模版',
							summary: e.title,
							imageUrl: e.img_src,
							href: 'https://uniapp.dcloud.io',
							success: (res) => {
								console.log('success:' + JSON.stringify(res));
							},
							fail: (e) => {
								uni.showModal({
									content: e.errMsg,
									showCancel: false
								})
							}
						});
					}
				})
			},
			clickLike() {
				console.log("点击了小心心")
				this.isLike = !this.isLike
				if(this.isLike) {
					uni.showToast({
						title: '❤❤❤',
						icon: 'none'
					})
				}
			},
			download() {
				uni.downloadFile({
					url: this.list[0].img_src,
					success: (e) => {
						uni.saveImageToPhotosAlbum({
							filePath: e.tempFilePath,
							success: () => {
								uni.showToast({
									icon: 'none',
									title: '已保存到手机相册'
								})
								this.isDownload = true
							},
							fail: () => {
								uni.showToast({
									icon: 'none',
									title: '保存到手机相册失败'
								})
							}
						});
					},
					fail: (e) => {
						uni.showModal({
							content: '下载失败，' + e.errMsg,
							showCancel: false
						})
					}
				})
			},
			gotoNext() {
				uni.showToast({
					icon: 'none',
					title: '点击下一个按钮'
				})
				console.log("点击了 new->gotoNext")
				this.getData()
			},
			// 进度条函数onProgressLoading
			onProgressLoading(that,t) {
				let _this = that
				this.progressWidth = 0
				this.time = t
				_this.timer = setInterval(function() {
					_this.time -= 1
					_this.progressWidth += 100/t
					// _this.progressWidth += 100/(t*10)
					console.log("当前时间和进度：",_this.time,_this.progressWidth)
					if(_this.time <= 0 || _this.progressWidth >= 100) {
						_this.time = 0
						_this.progressWidth = 100
						clearInterval(_this.timer)
						console.log("清除定时器")
						console.log("清除时的时间和进度分别是：",_this.time,_this.progressWidth)
					}
				},1000) 
				
			},
			jubao(item) {
				console.log("点击了 举报")
				uni.showToast({
					icon: 'none',
					title: '点击举报按钮'
				})
			}
		}
	}
</script>

<style>
.new-btn-view {
	width: 750upx;
	margin-bottom: 10upx;
}

.new-btn-view view {
	opacity: 0.75;
	height: 80upx;
	border-radius: 80upx;
	width: 80upx;
	justify-content: center;
	align-items: center;
	line-height: 80upx;
	margin: 0 40px;
	font-family: texticons;
	background: #eee;
	color: #555;
}

.new-btn-view .like:before {
	/* content: '❤'; */
	/* content: '♡♥'; */
	content: '❤';
}
.liked:before {
	background: #FF80AB;
	transition: all .8s;
	height: 80upx;
	border-radius: 80upx;
	width: 80upx;
	text-align: center;
}

.new-btn-view .download:before {
	content: '\e617';
}

.new-btn-view .collect:before {
	/* content: '\e68d'; */
	content: '→';
}
.btn-bottom {
	margin-left: 250upx;
}
.progress {
	margin: 0px auto;
	margin-left: 0px;
	height: 3px;
	/* background: #007AFF; */
	background: #FF80AB;
	transition: all 1s linear;
}
.success {
	/* background: aquamarine; */
	background: forestgreen;
}
.jubao {
	background: #E96900;
	left: 20upx;
	width: 60upx;
}
</style>
