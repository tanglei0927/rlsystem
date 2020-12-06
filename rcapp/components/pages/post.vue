<template>
	<view class="postinfo_page">
		<view class="postjb_info">
			<h3>{{form.name}}
				<text>{{form.treatmentStart}}-{{form.treatmentEnd}}K/月</text>
			</h3>
			<view class="dyinfo cl">
				<view>
					<image src="../../static/img/RC-TB5.png" mode="heightFix"></image>
					<text>招{{form.recruitersNumber}}人</text>
				</view>
				<view>
					<image src="../../static/img/RC-TB6.png" mode="heightFix"></image>
					<text>{{form.education}}</text>
				</view>
				<view>
					<image src="../../static/img/RC-TB7.jpg" mode="heightFix"></image>
					<text>{{form.requirements}}</text>
				</view>
			</view>
			<view class="welfare cl">
				<text v-for="(item,index) in form.welfare">{{item.name}}</text>
			</view>
		</view>
		<h2>职位描述</h2>
		<view class="ms_box" v-html="form.introduction"></view>
		<h2 class="noweight">
			<image src="../../static/img/RC-QYDH.png" mode="heightFix"></image>
			企业联系方式：<text v-for="(item,index) in enForm.phoneList" @click="goTell(item.phone)">{{item.phone}}</text>
		</h2>
		<view class="entinfo_box cl">
			<view class="logo">
				<image :src="imgUrl+enForm.logo" mode="heightFix"></image>
			</view>
			<view class="entdetails">
				<h3>{{form.enterpriseName}}</h3>
				<view class="icons">
					<image src="../../static/img/GW-TB1.png" mode="heightFix"></image>
					<text>{{enForm.scale}}人</text>
				</view>
				<view class="icons">
					<image src="../../static/img/GW-TB3.jpg" mode="heightFix"></image>
					<text>{{enForm.industry}}</text>
				</view>
			</view>
			<image @click="lookEnterDetails()" src="../../static/img/GS-DZTB.png" mode="heightFix"></image>
		</view>
		<view class="mapbox">
			<map  @click="goMap()" :latitude="latitude" :longitude="longitude" :markers="covers"></map>
		</view>
		<view class="kfbtn">
			<button class="fkbox" :session-from="KFinfo"  open-type="contact" bindcontact="handleContact" >
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
				form:{},
				enForm:{},
				latitude:null,
				longitude:null,
				id:null,
				covers:[],	
				imgUrl:'',
				KFinfo:{
				
				},
				city:''
			}
		},
		onLoad(e){
			this.imgUrl=this.$imgUrl+"file/readFile/"
			this.id=e.id
			this.init()
			this.city=uni.getStorageSync('city')
			setTimeout(()=>{
				// console.log(this.city)
				this.KFinfo.userinfo={
					nickName:'来自:'+this.city+'咨询:'+this.form.enterpriseName+'岗位:'+this.form.name
				}
				//区域客服设置
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
		methods:{
			init(){
				// 获取岗位信息
				this.$http.post('hpsot/detail',{
					id:this.id
				}).then(res=>{
					if(res.code==100){
						this.form=res.info
						this.form.welfare=JSON.parse(res.info.welfare)
						this.getEnInfo()
						uni.setNavigationBarTitle({
						　　title:this.form.name
						})
					}
				})
			},
			getEnInfo(){
				// 企业信息
				this.$http.post('hhome/detail',{
					id:this.form.enterpriseId
				}).then(res=>{
					if(res.code==100){
						this.enForm=res.info
						this.latitude=this.enForm.latitude
						this.longitude=this.enForm.longitude
						this.covers=[{
							longitude:this.longitude,
							latitude:this.latitude,
							iconPath:'../../static/img/qietu_20.png'
						}]
					}
				})
			},
			goMap(){
				uni.openLocation({
					latitude:this.latitude*1,
					longitude:this.longitude*1,
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
			lookEnterDetails(){
				uni.navigateTo({
					url:"enterprise?id="+this.enForm.id
				})
			},
			goTell(phone){
				uni.makePhoneCall({
					phoneNumber:phone
				})
			}
		},
		onShareAppMessage:function (options) {//小程序
			return {
			   title: this.form.name,
			   path:'/components/pages/post?id='+this.form.id
			}
		},
	}
</script>
<style>
	page{
		background-color: #fff;
	}
</style>
<style lang="scss" scoped>	
	.postinfo_page{
		.postjb_info{
			margin: 20rpx;
			margin-bottom: 30rpx;
			padding: 20rpx 30rpx;
			border-radius: 10rpx;
			box-shadow: 0px 0px 5px 0px #ccc;
			image{
				height: 20rpx;
			}
			h3{
				font-size: 16px;
				font-weight: bold;
				text{
					color: $uni-color-primary;
					float: right;
					font-size: 18px;
				}
			}
			.dyinfo{
				margin: 10rpx 0;
				font-size: 14px;
				line-height: 40rpx;
				view{
					float: left;
					margin-right: 30rpx;
					color: #666;
					image{
						margin-right: 15rpx;
					}
				}
			}
			.welfare{
				margin-top: 20rpx;
				text{
					background-color: #F4F4F4;
					padding: 5rpx 15rpx;
					border-radius: 5rpx;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
					font-size: 12px;
					float: left;
				}
			}
		}
		h2{
			line-height: 80rpx;
			background-color: #ececec;
			padding: 0 30rpx;
			font-size: 16px;
			font-weight: bold;
			image{
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
		.noweight{
			font-weight: normal;
			text{
				margin-right:20rpx ;
			}
		}
		.ms_box{
			padding: 35rpx;
			font-size: 14px;
			line-height: 46rpx;
		}
		.entinfo_box{
			position: relative;
			padding: 30rpx;
			>view{
				float: left;
			}
			.logo{
				width: 120rpx;
				height: 120rpx;
				margin-right: 20rpx;
				overflow: hidden;
				border-radius: 10rpx;
				border: 1px solid $uni-color-primary;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.entdetails{
				width: 525rpx;
				image{
					height: 30rpx;
				}
				h3{
					font-size: 14px;
					font-weight: bold;
				}
				.icons{
					color: #666;
					image{
						margin-right: 15rpx;
					}
				}
			}
			>image{
				height: 40rpx;
				position: absolute;
				top: 0;
				bottom: 0;
				margin: auto;
			}
		}
		.mapbox{
			padding: 0 30rpx;
			border-radius: 20rpx;
			overflow: hidden;
			map{
				width: 100%;
				height: 510rpx;
			}
		}
		.kfbtn{
			background-color: #fff;
			padding: 20rpx 50rpx;
			border-top: 1px solid #ccc;
			margin-top: 100rpx;
			>button,>view{
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
	}
	
</style>
