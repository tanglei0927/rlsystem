<template>
	<view class="eninfo_page">
		<!-- 基本信息 -->
		<view class="info_box">
			<!-- banner -->
			<image class="banner" :src="imgUrl+form.banner" mode="widthFix"></image>
			<view class="info cl">
				<view class="logo">
					<image :src="imgUrl+form.logo" mode="heightFix"></image>
				</view>
				<div class="msg">
					<h3>{{form.name}}</h3>
					<view>
						<span>
							<image src="../../static/img/GW-TB1.png" mode="widthFix"></image>
							<text>{{form.scale}}人</text>
						</span>
						<span class="ent_type">
							<image src="../../static/img/GW-TB2.png" mode="widthFix"></image>
							<text>{{form.type}}</text>
						</span>
					</view>
					<view>
						<span>
							<image src="../../static/img/GW-TB3.jpg" mode="widthFix"></image>
							<text>{{form.industry}}</text>
						</span>
					</view>
				</div>
			</view>
			<!-- 企业福利 -->
			<view class="welfare cl">
				<text>企业福利:</text>
				<view v-for="(item,index) in form.welfare">{{item.name}}</view>
			</view>
		</view>
		<!-- 公司信息，招聘列表 -->
		<view class="listpage_box">
			<view class="tits cl">
				<view ><text :class="lookType==1?'check':''" @click="changeLookType(1)">公司信息</text></view>
				<view><text :class="lookType==2?'check':''" @click="changeLookType(2)">招聘列表</text></view>
			</view>
			<!-- 变换部分 -->
			<!-- 公司信息 -->
			<view class="enterinfo" v-if="lookType==1">
				<h3>公司简介</h3>
				<view class="brief">
					<view :class="briefMore?'more':''">{{form.introduction}}</view>
					<image @click="briefMore=!briefMore" src="../../static/img/GS-XLTB.png" mode="widthFix"></image>
				</view>
				<h3>公司地址</h3>
				<view class="address">
					<image class="addressicon" src="../../static/img/GS-DZDH.png" mode="widthFix"></image>
					<view  @click="goAddress()">
						{{form.address}}
					</view>
					<image @click="goAddress()" class="addressmore" src="../../static/img/GS-DZTB.png" mode="widthFix"></image>
				</view>
				<h3 class="comtit">公司环境</h3>
				<view class="imgsbox">
					<view class="imgs" :style="'width:'+(form.album.length/2+0.8)*100+'%;'">
						<image  v-for="(item,index) in form.album" @click="lookImg(item)" :src="item" mode="heightFix"></image>
					</view>
				</view>
				<h3>联系方式</h3>
				<view class="phone cl">
					<view>
						<image src="../../static/img/GS-DHTB.jpg" mode="widthFix"></image>
						<text>电话:</text>
					</view>
					<view v-for="(item,index) in form.phone" @click="dialPhone(item.phone)">
						{{item.contacts}}:{{item.phone}}
						<!-- <text class="btn">拨打</text> -->
					</view>
				</view>
			</view>
			<!-- 招聘列表 -->
			<view class="postlist" v-else>
				<view class="titps cl">
					<view @click="goSearch('2')">
						<text>职能</text>
						<image src="../../static/img/GS-XLTB.png" mode="widthFix"></image>
					</view>
					<view @click="goSearch('1')">
						<text>薪资</text>
						<image src="../../static/img/GS-XLTB.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="postlsit_box">
					<view class="box" v-for="(item,index) in postList" @click="lookPostDetails(item.id)">
						<h3>
							{{item.name}}
							<text>{{item.treatmentStart}}-{{item.treatmentEnd}}K</text>
						</h3>
						<view class="cl infos">
							<text>{{item.city}}-{{item.area}}</text>
							<text>{{item.education}}</text>
							<text>{{item.requirements}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="kfbtn">
			<button class="fkbox" :session-from="KFinfo" open-type="contact" bindcontact="handleContact" >
				<!-- 客服 -->
			<!-- <view class=""> -->
				<image src="../../static/img/RC-GTTB.png" mode="heightFix"></image>
				<text>在线沟通</text>
			<!-- </view> -->
					
			</button>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				id:null,
				form:{},
				lookType:1,
				imgUrl:'',
				briefMore:false,
				total:null,
				postList:[],
				postInfo:{
					page:1,
					size:10,
					enterpriseId:null,
					treatmentStart:'',
					treatmentEnd:'',
					industryId:''
				},
				KFinfo:{
				
				},
				city:''
			}
		},
		onLoad(e){
			this.id=e.id
			this.postInfo.enterpriseId=e.id
			this.imgUrl=this.$imgUrl+'file/readFile/'
			this.init()
			// uni.clearStorageSync('hyTpe')			
			this.city=uni.getStorageSync('city')
			uni.clearStorageSync('xzInfo')
			uni.clearStorageSync('znInfo')
			uni.clearStorageSync('searchZnindex')
			uni.clearStorageSync('searchXzindex')
			//再次设置城市，解决被clear的bug
			uni.setStorageSync('city',this.city)
			setTimeout(()=>{
				// 客服配置
				this.KFinfo.userinfo={
					nickName:'来自:'+this.city+'咨询:'+this.form.name
				}
				// 按城市分配客服
				// if(this.city=='武汉市'){
					this.KFinfo.tagid=1000
				// }else{
				// 	this.KFinfo.tagid=1001
				// }
				this.KFinfo.keyword=''
				this.KFinfo.ctag=""
				this.KFinfo=encodeURIComponent(JSON.stringify(this.KFinfo))
				console.log(this.KFinfo)
			},1000)
		},
		onShow(){
			if(this.lookType==2){
				// let type=uni.getStorageSync('hyTpe')
				// if(type||type==''){
				// 	this.postInfo.industryId=type
				// }
				let type=uni.getStorageSync('znInfo')
				if(type||type==''){
					this.postInfo.name=type
				}
				let xZinfo=uni.getStorageSync('xzInfo')
				if(xZinfo){
					xZinfo=JSON.parse(xZinfo)
					this.postInfo.treatmentStart=xZinfo.start
					this.postInfo.treatmentEnd=xZinfo.end
				}else{
					this.postInfo.treatmentStart=''
					this.postInfo.treatmentEnd=''
				}
				this.getPost()
			}
		},
		methods:{
			init(){
				this.$http.post('hhome/detail',{
					id:this.id
				}).then(res=>{
					if(res.code==100){
						this.form=res.info
						this.form.welfare=JSON.parse(res.info.welfare)
						this.form.phone=JSON.parse(res.info.phone)
						let imglist=JSON.parse(res.info.album)
						let list=[]
						imglist.forEach((item,index)=>{
							list.push(this.imgUrl+item)
						})
						this.form.album=list
						uni.setNavigationBarTitle({
						　　title:this.form.name
						})
					}
				})
			},
			getPost(){
				// 招聘列表
				this.$http.post('hpsot/listSimple',this.postInfo).then(res=>{
					if(res.code==100){
						// this.postList=res.info.rows
						let list=res.info.rows
						this.total=res.info.total
						if(this.postInfo.page==1){
							this.postList=[]
						}
						list.forEach((item,index)=>{
							this.postList.push(item)
						})
					}
				})
			},
			goAddress(){
				// 定位
				uni.openLocation({
					latitude:this.form.latitude*1,
					longitude:this.form.longitude*1,
					success:(re)=>{
						console.log("success")
						console.log(re)
					},
					fail(err){
						console.log('吊起错误ss')
						console.log(err)
					}
				})
			},
			lookImg(url){
				// 打开图片
				uni.previewImage({
					current:url,
					urls:this.form.album
				})
			},
			dialPhone(phone){
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			changeLookType(type){
				this.lookType=type
				if(type==1){
					this.init()
				}else{
					this.postInfo.treatmentStart=''					this.postInfo.treatmentEnd=''					this.postInfo.industryId=''
					this.getPost()
				}
			},
			goSearch(type){			
				 let index=null
				if(type==2){
					index=uni.getStorageSync('searchZnindex')
					index=index?index:0
					uni.navigateTo({
						url:"search?code=2&enterId="+this.id+"&index="+index
					})
				}else{
					index=uni.getStorageSync('searchXzindex')
					index=index?index:0
					uni.navigateTo({
						url:"search?code="+type+"&index="+index
					})
				}
				
			},
			lookPostDetails(id){
				uni.navigateTo({
					url:"post?id="+id
				})
			}
		},
		// 上拉加载
		onReachBottom : function() {
			let length=null
			if(this.lookType==2){
				length=this.postList.length
				if(this.total>length){
					this.postInfo.page++
					this.getPost()	
				}
			}				
		},
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.eninfo_page{
		padding-top: 40rpx;
		.info_box{
			padding: 20rpx;				
		}
		.info{
			margin-top: 20rpx;
			>view{
				float: left;
			}
			.logo{
				width: 150rpx;
				height: 150rpx;
				overflow: hidden;
				border-radius: 10rpx;
				margin-right: 26rpx;
				border: 1px solid $uni-color-primary;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.msg{
				width: 530rpx;
				h3{
					font-size: 16px;
					font-weight: bold;
					margin-bottom: 20rpx;
				}
				>view{
					margin-bottom: 20rpx;
				}
				span{
					font-size: 12px;
					color: #666;
					min-width: 130rpx;
					image{
						width: 20rpx;
						margin-right: 10rpx;
					}
				}
				.ent_type{
					margin-left: 30rpx;
				}
			}
		}
		.welfare{
			text{
				float: left;
				margin-right: 20rpx;
				width: 120rpx;
			}
			view{
				float: left;
				width: 120rpx;
				text-align: center;
				background-color: #F4F4F4;
				border-radius: 5rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
			}
		}
		.banner{
			width: 100%;
			border-radius: 10rpx;
		}
		.listpage_box{
			.tits{
				view{
					float: left;
					width: 50%;
					text-align: center;
					line-height: 70rpx;
					font-size: 16px;
					font-weight: bold;
					background-color: #ececec;
					text{
						padding: 0 30rpx;
					}
					.check{
						border-bottom: 2px solid $uni-color-primary;
						color: $uni-color-primary;
						padding-bottom: 10rpx;
					}
				}
			}
			.enterinfo{
				padding: 0 20rpx;
				>view{
					padding-bottom: 30rpx;
				}
				h3{
					font-size: 16px;
					font-weight: bold;
					margin: 20rpx 0;
					padding: 0;
				}
				.brief{
					border-bottom: 1px solid #ececec;
					font-size: 14px;
					view{
						height: 135rpx;
						overflow : hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 4;
						-webkit-box-orient: vertical;
						margin-bottom: 30rpx;
					}
					.more{
						height: inherit;
						-webkit-line-clamp: inherit;
					}
					image{
						display: block;
						width: 30rpx;
						margin: auto;
					}
					
				}
				.address{
					padding-left: 60rpx;					
					position: relative;
					image{
						position: absolute;
						top: 0;
						bottom: 0;
						left: 0;
						width: 35rpx;
						margin: auto;
					}
					view{
						line-height: 30rpx;
						font-size: 14px;
						width: 600rpx;
						padding-top: 20rpx;
					}
					.addressmore{
						width: 20rpx;
						left: 670rpx;
					}
				}
				.comtit{
					margin-top: 30rpx;
					border-top: 1px solid #ececec;
					padding-top: 30rpx;
				}
				.imgsbox{
					width: 100%;
					overflow-x: scroll;
					height: 220rpx;
					overflow-y: hidden;
					margin-bottom: 30rpx;
					view{
						height: 220rpx;
						width: 300%;
						image{
							height: 100%;
							margin-right: 10rpx;
						}
					}
				}
				.phone{
					>view{
						float:left;
						margin-right: 20rpx;
						font-size: 14px;
						line-height: 40rpx;
						image{
							width: 30rpx;
							margin-right: 20rpx;
						}
						.btn{
							color: $uni-color-primary;
							font-size: 14px;
							padding-left: 10rpx;
						}
					}
				}
			}
			.postlist{
				.titps{
					border-bottom: 1px solid #ececec;
					view{
						float: left;
						width: 50%;
						text-align: center;
						padding: 15rpx 0;
						font-size: 14px;
						text{
							letter-spacing: 3px;
							color: #494949;
						}
						image{
							width: 30rpx;
							margin-left: 10rpx;
						}
					}
				}
				.postlsit_box{
					>view{
						padding: 20rpx 30rpx;
						border-bottom: 1px solid #ececec;
						h3{
							font-size: 16px;
							font-weight: bold;
							line-height: 50rpx;
							text:last-child{
								color: $uni-color-primary;
								float: right;
								font-size: 18px;
							}
						}
						.infos{
							margin-top: 20rpx;
							text{
								padding: 0 20rpx;
								border-left: 2px solid #666666;
								color: #3b3b3b;
								font-size: 14px;
								line-height: 15px;
								height: 30rpx;
								float: left;
							}
							text:first-child{
								border: 0;
								padding-left: 0;
							}
						}
					}
				}
				
			}
		}		
	}
	.kfbtn{
		background-color: #fff;
		padding: 20rpx 50rpx;
		border-top: 1px solid #ccc;
		margin-top: 100rpx;
		>button{
			line-height: 70rpx;
			border-radius: 50rpx;
			width: 100%;
			background-color: $uni-color-primary;
			color: #fff;
			text-align: center;
			font-size: 16px;
			image{
				height: 35rpx;
				display: inline-block;
				margin-right: 20rpx;
			}
		}
	}
</style>
