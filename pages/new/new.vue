<template>
	<view class="index">
		<!-- <block v-for="item in list" :key="item.img_src"> -->
		<block v-for="item in adList" :key="item.adId">
			<view class="card" 
			@click="clickLike()"
			>
			<!-- @click="goDetail(item)" -->
				<image class="card-img" :src="item.adPicture" mode="aspectFill"></image>
				<div class="card-num-view jubao" @click.stop="jubao(item)">举报</div>
				<text class="card-num-view">{{ adTypeToText(item.adType) }}</text>
				<view class="progress" 
				:class="[csstime ? 'loading' : 'success']"
				:style="{width: progressWidth +'%'}"
				>
					<div class="progress-div"></div>
				</view>
				<view class="card-bottm row">
					<view class="car-title-view row">
						<!-- <text class="card-title">{{item.title}}</text> -->
						<text class="card-title">{{ item.adDescription }}</text>
						<!-- <text class="card-title">这里东西超级多，是商家广告的说明内容，可能会占据两行左右的空间，因此这段话要足够长，并且要限制长度</text> -->
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
				csstime: 0,	// 控制进度条样式
				timer: null,	// 计时器
				progressWidth: 0,	//进度条
				isPass: false,
				isFinish: false,
				isLike: false,
				isDownload: false,
				offset: 0,
				restart: false,
				user: {},
				adList: [],
				reportDTO: {
					adId: null,
					shopId: null,
					fromId: null,
					toId: null,
					noticeType: null,
					noticeReason: '',
				},
				record: {
					userId: null,
					adId: null,
					adType: null,
					operation: null,
				}
			}
		},
		onReady() {
			let _this = this
			uni.getStorage({
				key: "user",
				success(res) {
					console.log("从缓存中得到user：", res)
					_this.user = res.data
					console.log("从缓存中得到user：", _this.user)
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
			this.getAd();
			// this.getData();
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
			// this.getData();
			this.getAd();
		},
		watch: {
			progressWidth: function() {
				if (this.progressWidth != 100) {
					this.csstime = true
				} else {
					this.csstime = false
				}
			}
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
			clearAll() {
				this.reportDTO = {}
				this.isPass = false
				this.isFinish = false
				this.isLike = false
				this.isDownload = false
				this.progressWidth = 0
			},
			async getAd(offset) {
				let res = await this.sendMessage('/readList', {userId: this.user.userId, current: offset})
				console.log("test:",res)
				if (res.statusCode == 200 && res.data) {
					uni.showToast({
						title: '请求成功'
					})
					if (this.refreshing) {
						this.refreshing = false;
						uni.stopPullDownRefresh();
					}
					this.clearAll()
					this.adList = res.data
					this.onProgressLoading(this, this.adList[0].adTime)
				}
			},
			async sendMessage(target, data) {
				let base = 'http://localhost:8081'
				let url = base + target
				console.log("url:", url)
				console.log("data:", data)
				let res = await uni.request({
					url: url,
					data: JSON.stringify(data),
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(res => {
					console.log("post返回结果", res[1])
					return res[1]
				})
				return res
				
			},
			jubao(item) {
				let noticeDTO = {
					adId : this.adList[0].adId,
					shopId : this.adList[0].shopId,
					fromId : this.user.userId,
					toId : this.adList[0].userId,
				}
				let reasonList = ['内容引起不适', '广告内容违规', '有害信息']
				let _this = this
				uni.showActionSheet({
				    itemList : ['内容引起不适', '广告内容违规', '有害信息'],
				    success: async function (res) {
				        console.log('选中了第' + (res.tapIndex + 1) + '个按钮',res);
						noticeDTO.noticeReason = reasonList[res.tapIndex +1]
						
						const res1 = await _this.sendMessage('/addNotice', noticeDTO)
						if (res1.data.code == 41) {
							uni.showToast({
								title: '我们已经收到您的举报，稍后会处理'
							})
						} else {
							uni.showToast({
								title: '网络有些卡顿，请再试试'
							})
						}
				    }
				});
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
				let url = this.adList[0].adPicture
				let _this = this
				uni.downloadFile({
					url: url,
					success: (e) => {
						uni.saveImageToPhotosAlbum({
							filePath: e.tempFilePath,
							success: () => {
								uni.showToast({
									icon: 'none',
									title: '已保存到手机相册'
								})
								_this.isDownload = true
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
			adTypeToText(val) {
				switch (val) {
					case 0: return '餐饮类'
					case 1: return '服装类'
					case 2: return '女性类'
					case 3: return '儿童类'
					case 4: return '户外类'
					case 5: return '宠物类'
				}
			},
			async gotoNext() {
				uni.showToast({
					icon: 'none',
					title: '点击下一个按钮'
				})
				// this.getData()
				console.log("现在的user是：:",this.user)
				let record = {
					userId : this.user.userId,
					adId : this.adList[0].adId,
					adType : this.adList[0].adType,
					operation: 0
				}
				if(this.finish) {
					record.operation = 3
				} else {
					record.operation = 2
				}
				if (this.isLike) {
					record.operation = 3
				} else if (this.isDownload) {
					record.operation = 4
				}
				const res = await this.sendMessage('/addRecord', record)
				if (res.data.code ==71) {
					this.offset = this.offset + 1
					this.getAd(this.offset)
				} else {
					uni.showToast({
						title: '遇到问题，请联络管理员'
					})
				}
			},
			// 进度条函数onProgressLoading
			onProgressLoading(that,t) {
				let _this = that
				this.progressWidth = 0
				let desc = t
				let timer = setInterval(function() {
					desc -= 1
					_this.progressWidth += 100 / t
					// _this.progressWidth += 100/(t*10)
					console.log("当前时间和进度：", desc, _this.progressWidth)
					if(desc <= 0 || _this.progressWidth >= 100) {
						desc = 0
						_this.progressWidth = 100
						clearInterval(timer)
						_this.isFinish = true
						console.log("清除定时器")
						console.log("清除时的时间和进度分别是：", desc, _this.progressWidth)
					}
				},1000) 
				
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
	content: '❤';
	/* content: '♡♥'; */
	/* content: '好きだ'; */
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
