<template>
	<view class="content">
		<cover-view></cover-view>
		<!-- 头部：定位城市，区域下拉，，关注公众号按钮 搜索框 -->
		<view class="header">
			<view class="top cl">
				<image @click="cityShow=true" src="../../static/img/RC-dw.png" mode="widthFix"></image>
				<span @click="cityShow=true">{{city}}</span> 			
				<xfl-select
					:list="areaStrList"
					:clearable="false"
					:showItemNum="5" 
					:listShow="false"
					:isCanInput="false"  
					:style_Container="'padding:0;padding-left:20rpx;text-align:center;height:50rpx;line-height:50rpx;width:280rpx; font-size: 12px;'"
					:placeholder = "'请选择'"
					:initValue="selectValue"
					:selectHideType="'hideAll'"
					@change="selectChange"
				>
				</xfl-select>
			</view>
			<div class="inputbox">
				<view class="searchtype cl">
					<view class="selectbox cl" @click="searchSelect=!searchSelect">
						<text>{{searchType==1?'企业':'岗位'}}</text>
						<image src="../../static/img/GS-XLTB.png" mode="widthFix"></image>
					</view>		
						<!-- 搜索框 -->
					<input type="text" confirm-type="search" @confirm="init()" v-model="form.name" value="" placeholder="请搜索招聘企业/招聘岗位" />
					<view class="showbox" v-show="searchSelect">
						<image src="../../static/img/RC-JJ.png" mode="widthFix"></image>
						<p @click="changeSearchType(1)">企业</p>
						<p @click="changeSearchType(2)">岗位</p>
					</view>
				</view>
			</div>
			<!-- 岗位 -->
			<view class="post_hy cl" v-if="searchType==2">
				<text :class="form.industryId==''?'checkhy sl':'sl'" @click="goSearch()">全部</text>
				<text :class="form.industryId==item.id?'checkhy sl':'sl'"
				 v-for="(item,index) in hyList"
				 @click="changeHy(item.id)">{{item.dictName}}</text>
			</view>
		</view>
		<!-- <view>debug:{{debug}}</view> -->
		<!-- banner -->
		<view class="uni-padding-wrap" v-if="searchType==1">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="5000" :duration="duration">
						<swiper-item v-for="(item,index) in banner">
							<view class="swiper-item uni-bg-red">
								<image :src="imgUrl+'file/readFile/'+item.url" mode=""></image>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<!-- 企业类型 -->
		<view class="company_type cl"  v-if="searchType==1">
			<view @click="changeComType(10)">
				<image src="../../static/img/RC-gc.png" mode=""></image>
			</view>
			<view @click="changeComType(9)">
				<image src="../../static/img/RC-sydw.png" mode=""></image>
			</view>
			<view @click="changeComType(8)">
				<image src="../../static/img/RC-qygs.png" mode=""></image>
			</view>
		</view>
		<!-- 企业列表 -->
		<view class="company_list"  v-if="searchType==1">
			<view class="cl" v-for="(item,index) in compayList" @click="lookCompany(item)">
				<view class="imgbox">
					<image :src="imgUrl+'file/readFile/'+item.logo" mode="heightFix"></image>
				</view>
				<view>
					<h3>{{item.name}}</h3>
					<view class="describe">
						<text>{{item.type}}</text>
						<text>{{item.scale}}人</text>
						<text>{{item.industry}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 岗位列表 -->
		<view class="post_list" v-if="searchType==2">
			<view class="tit">精选职位</view>
			<view class="box" v-for="(item,index) in postList" @click="lookPostDetails(item.id)">
				<view class="title cl">
					<text>{{item.name}}</text>
					<text class="money">{{item.treatmentStart}}-{{item.treatmentEnd}}K</text>
				</view>
				<view class="info cl">
					<view class="cl">
						<text>{{item.type}}</text>
						<text>{{item.education}}</text>
						<text>{{item.requirements}}</text>
					</view>
					<text>{{item.city}}-{{item.area}}</text>
				</view>
				<view class="keywords cl">
					<text v-for="(keyitem,keyindex) in item.keyWord">{{keyitem}}</text>
					<text v-for="(waitem,waindex) in item.welfare">{{waitem.name}}</text>					
				</view>
				<view class="comname cl">
					<view>
						<image src="../../static/img/RC-GGTB.png" mode="widthFix"></image>
						<text>{{item.enterpriseName}}</text>
					</view>
					<button>申请</button>
				</view>
			</view>
		</view>
		<!-- 城市列表 -->
		<view class="cityshadow" v-if="cityShow">
			<view class="box">
				<view class="list cl">
					<view class="left">
						<h4>省份</h4>
						<view v-for="(item,index) in cityList"
						:class="nowProIndex==index?'txt':''"
						@click="nowProIndex=index"
						>{{item.label}}>></view>
					</view>
					<view class="right">
						<h4>城市</h4>
						<view v-for="(item,index) in cityList[nowProIndex].children"
						@click="changeCity(item)"
						>{{item.label}}</view>
					</view>
				</view>
				<view class="btns">
					<button type="default" @click="cityShow=false">取消</button>
				</view>
			</view>
			
		</view>
		<!-- 分享 -->
		<button open-type="share" class="share">
			<image src="../../static/img/RC-GGH.png" mode=""></image>
		</button>		
		<!-- 关注公众号 -->
		 <!--  -->
		<official-account class="gghbtn"></official-account>
		<!-- tabar -->
		<footer class="cl">
			<!-- 首页 -->
			<view @click="changeComType('')">
				<!-- 当前公司类型 -->
				<image :src="form.type==''?'../../static/img/RC-sytab4.png':'../../static/img/RC-sytab44.png'" mode="heightFix"></image>
				<!-- <image v-if="form.type==''" src="../../static/img/RC-sytab4.png" mode="heightFix"></image> -->
				<!-- 未选中时 -->
				<!-- <image v-else src="../../static/img/RC-sytab44.png" mode="heightFix"></image> -->
				<text :class="form.type==''?'now_type':''">首页</text>
			</view>
			<!-- 工厂 -->
			<view @click="changeComType(10)">
				<!-- 当前公司类型 -->
				<image :src="form.type==10?'../../static/img/RC-sytab33.png':'../../static/img/RC-sytab2.png'" mode="heightFix"></image>
				<!-- <image v-if="form.type==10" src="../../static/img/RC-sytab33.png" mode="heightFix"></image> -->
				<!-- 未选中时 -->
				<!-- <image v-else src="../../static/img/RC-sytab2.png" mode="heightFix"></image> -->
				<text :class="form.type==10?'now_type':''">工厂</text>
			</view>
			<!-- 事业单位 -->
			<view @click="changeComType(9)">
				<!-- 当前公司类型 -->
				<image :src="form.type==9?'../../static/img/RC-sytab22.png':'../../static/img/RC-sytab3.png'" mode="heightFix"></image>
				<!-- <image v-if="form.type==9" src="../../static/img/RC-sytab22.png" mode="heightFix"></image> -->
				<!-- 未选中时 -->
				<!-- <image v-else src="../../static/img/RC-sytab3.png" mode="heightFix"></image> -->
				<text :class="form.type==9?'now_type':''">事业单位</text>
			</view>
			<!-- 企业/公司 -->
			<view @click="changeComType(8)">
				<!-- 当前公司类型 -->
				<image :src="form.type==8?'../../static/img/RC-sytab11.png':'../../static/img/RC-sytab1.png'" mode="heightFix"></image>
				<!-- <image v-if="form.type==8" src="../../static/img/RC-sytab11.png" mode="heightFix"></image> -->
				<!-- 未选中时 -->
				<!-- <image v-else src="../../static/img/RC-sytab1.png" mode="heightFix"></image> -->
				<text :class="form.type==8?'now_type':''">企业/公司</text>
			</view>
		</footer>
	</view>
</template>

<script>
	import xflSelect from '../../components/xfl-select/xfl-select.vue';
	var QQMapWX = require('../../components/untils/qqmap-wx-jssdk.js');
	var qqmapsdk;
	export default {
		components:{
			xflSelect
		},
		data() {
			return {
				banner:[],
				compayList:[],//企业列表
				postList:[],//岗位列表
				city:"",
				selectValue:'',
				arealist:[],//区域列表
				areaStrList:[],
				cityList:[],//城市列表
				hyList:[],//所属行业部分数据
				searchSelect:false,
				imgUrl:'',
				form:{
					page:1,
					size:10,
					type:'',
					name:'',
					areaId:null,
					industryId:'',
					cityName:''
				},
				total:null,
				searchType:1,//1企业  2岗位
				nowProIndex:0,
				cityShow:false,
				flag:false,//是否允许下刷新
				debug:''
			}
		},
		onLoad() {
			this.imgUrl=this.$imgUrl
			qqmapsdk = new QQMapWX({
			  key: 'ZTFBZ-BYK6S-BHIO3-6DRD3-FCYBH-D7F5U' //这里自己的key秘钥进行填充
			});
			this.getCity()
			this.getcitylsit()
			setTimeout(()=>{
				// this.getCompanyList()
				// this.init()
			},5000)
			uni.clearStorageSync('hyTpe')
		},
		onShow(){
			this.getBannr()
			if(this.searchType==2){
				let type=uni.getStorageSync('hyTpe')
				if(type||type==''){
					this.form.industryId=type
				}else{
					// this.form.industryId=''
				}
			}
			// let earaInfo=uni.getStorageSync('areaInfo')
			// if(earaInfo){
			// 	earaInfo=
			// 	this.selectValue
			// }
			this.init()
		},
		watch:{
			selectValue:function(newval,oldval){
				console.log(newval)
				this.selectValue=newval
			}
		},
		methods: {			
			getCity(){
				var that=this
				console.log('获取位置')
				uni.getLocation({
					type: 'wgs84',
					geocode:true,
					// desc:"您的位置信息将用于位置展示",
					fail:function (re){
						console.log("获取位置错误")
						console.log(re)
						that.debug="获取位置错误"+(JSON.stringify(re))
					},
				   success: function (res) {
					   console.log(res)
					   var latitude=res.latitude
					   var longitude=res.longitude
					   qqmapsdk.reverseGeocoder({
						 location: {
						   latitude: latitude,
						   longitude: longitude
						 },
						 success: function (res) {
						   console.log(res);
						   let province = res.result.ad_info.province
						   let city = res.result.ad_info.city
						   that.city=city
						   that.selectValue=res.result.ad_info.district
						   uni.setStorageSync('city',that.city)
						   // that.regCity(city)
						   that.getcitylsit()
						   that.debug="获取城市成功"
						 },
						 fail: function (res) {
							 that.debug="获取中文位置失败"+JSON.stringify(res)
						   console.log(res);
						   // this.regCity('武汉市')
						 },
						 complete: function (res) {
						   // console.log(res);
						 }
					   });
				   },
				})
			},
			getBannr(){
				this.$http.post('hbanner/list').then(res=>{
					if(res.code==100){
						this.banner=res.info
					}
				})
			},
			getCompanyList(){
				this.$http.post('hhome/list',this.form).then(res=>{
					if(res.code==100){
						// this.compayList=res.info.rows
						let list=res.info.rows
						this.total=res.info.total
						if(this.form.page==1){
							this.compayList=[]
						}
						list.forEach((item,index)=>{
							this.compayList.push(item)
						})
						uni.stopPullDownRefresh()
						setTimeout(()=>{
							this.flag=true
						},1000)
					}
				})
			},
			getcitylsit(){
				// 获取省市区列表
				this.$http.post('mDict/areaTree').then(res=>{
					if(res.code==100){
						// this.cityList=res.info
						let list=res.info
						list.forEach((item,index)=>{
							let list2=item.children
							list2.forEach((city,ci)=>{
								// console.log(city.children)
								city.children.unshift({label:'全部',value:'',children:null})
							})
						})
						this.cityList=list
						console.log("36412121")
						console.log(list)
						this.regCity(this.city)
					}
				})
			},
			getHy(){
				// 获取所属行业
				this.$http.post('mDict/getByTypeCode',{
					typeCode:'04'
				}).then(res=>{
					if(res.code==100){
						this.hyList=res.info
						this.hyList=this.hyList.slice(0,7)
					}
				})
			},
			regCity(city){
				let list=this.cityList
				console.log("323232323")
				console.log(this.cityList)
				let count=0
				this.areaStrList=[]
				console.log(city)
				list.forEach((item,index)=>{
					item.children.forEach((item2,index2)=>{
						if(item2.label==city){
							count=1
							this.arealist=item2.children
							if(item2.children.length>0){
								let list2=item2.children
								let areaCount=0								
								list2.forEach((item3,index3)=>{
									this.areaStrList.push(item3.label)
									// if(this.selectValue==item3.label){
									// 	areaCount=1
									// 	this.form.areaId=item3.value
									// 	// this.selectValue=
									// }
								})
								if(areaCount==0){
									this.form.areaId=list2[0].value
									this.selectValue=list2[0].label
								}
								// this.getCompanyList()
							}else{
								this.form.areaId=''
								this.selectValue=''
							}
							this.init()
						}
					})
				})
				if(count==0){
					console.log("2222")
					this.city='武汉市'
					this.regCity('武汉市')
					uni.setStorageSync('city',this.city)
				}
			},
			init(){
				this.flag=false
				this.form.cityName=this.city
				if(this.searchType==1){
					this.getCompanyList()
				}else{
					this.getPost()
				}
			},
			getPost(){
				// 岗位信息
				this.$http.post("hpsot/list",this.form).then(res=>{
					if(res.code==100){
						this.total=res.info.total
						if(this.form.page==1){
							this.postList=[]
						}
						let list=res.info.rows
						list.forEach((item,index)=>{
							item.treatmentStart=(item.treatmentStart)
							item.treatmentEnd=(item.treatmentEnd)
							item.keyWord=JSON.parse(item.keyWord)
							item.keyWord=item.keyWord.slice(0,2)
							item.welfare=JSON.parse(item.welfare)
							item.welfare=item.welfare.slice(0,2)
							this.postList.push(item)
							uni.stopPullDownRefresh()
							setTimeout(()=>{
								this.flag=true
							},1000)
						})
					}
				})
			},
			changeSearchType(e){
				// 企业。岗位变化
				this.searchType=e
				this.searchSelect=false
				let areaId=this.form.areaId
				this.form.page=1
				if(e==1){
					this.form.industryId=''
				}
				if(e==2&&this.hyList.length==0){
					this.getHy()
				}
				this.init()
			},
			changeHy(code){
				// 所属行业
				this.form.industryId=code
				this.init()
			},
			goSearch(){
				// 去筛选  所有所属行业
				let id=''
				id=this.form.industryId?this.form.industryId:''
				uni.navigateTo({
					url:"../../components/pages/search?code=04&industryId="+id
				})
			},
			selectChange(e){
				// 区域变更
				console.log(e)
				let index=e.index
				this.form.areaId=this.arealist[index].value
				this.init()
				let data={}
				data.value=this.form.areaId
				data.str=e.newVal
				data=JSON.stringify(data)
				uni.setStorageSync('areaInfo',data)
			},
			changeComType(type){
				this.form.type=type
				this.form.page=1
				this.form.name=''
				this.form.industryId=''
				this.init()
			},
			changeCity(e){
				console.log(e)
				this.city=e.label
				this.regCity(e.label)
				uni.setStorageSync('city',e.label)
				this.cityShow=false
			},
			lookCompany(item){
				// 查看企业详情
				uni.navigateTo({
					url:"../../components/pages/enterprise?id="+item.id
				})
			},
			lookPostDetails(id){
				// 岗位详情
				uni.navigateTo({
					url:"../../components/pages/post?id="+id
				})
			}
		},
		// 上拉加载
		onReachBottom : function() {
			let length=null
			length=this.searchType==1?this.compayList.length:this.postList.length
			if(this.total>length){
				this.form.page++
				this.init()	
			}	
		},
		onPullDownRefresh: function() {
			// 下拉刷新
			if(this.cityList.length>0){
				if(this.flag){
					this.form.page=1
					this.form.name=''
					this.form.industryId=''
					this.init()
				}			
			}else{
				console.log("000000000000000")
				this.getcitylsit()
				this.getBannr()
			}	
			
		},
		onShareAppMessage:function (options) {//小程序分享
			return {
				title:'铭聚人力',
			   path:'pages/index/index'
			}
		},
	}
</script>

<style lang="scss" scoped>
	cover-view{
		height: 40rpx;
		background-color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		margin: auto;
	}
	.content{
		padding-top: 40rpx;
		background-color: #f4f4f4;
		padding-bottom: 360rpx;
	}
	.header{
		background-color: #fff;
		padding: 0 20rpx;
		padding-bottom: 30rpx;
		padding-top: 30rpx;
		.top{
			image{
				float: left;
				width: 50rpx;
			}
			span{
				float: left;
				margin: 0 10rpx;
				font-size: 18px;
				max-width:200rpx ;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
		.inputbox{
			border-radius: 50rpx;
			margin-top: 25rpx;
			padding:20rpx;
			border: 1px solid $uni-color-primary;
			height: 34rpx;
			line-height: 34rpx;
			font-size: 14px;
			color: #666;
			position: relative;
			.showbox{
				position: absolute;
				top: 80rpx;
				left: 10rpx;
				text-align: center;
				line-height: 50rpx;
				color: #000;
				width: 200rpx;
				border-radius: 5px;
				border: 1px solid $uni-color-primary;
				background-color: #fff;
				padding: 10rpx 0;
				z-index: 1000000;
				image{
					width: 30rpx;
					position: absolute;
					top: -16rpx;
					left: 20rpx;
				}
				p{
					border-bottom: 1px solid #ccc;
				}
				p:last-child{
					border: 0;
				}
					
			}
			.searchtype{
				.selectbox{
					float: left;
					text{
						float: left;				
					}
					image{
						float: left;
						width: 20rpx;
						margin: 0 10rpx;
						margin-top: 10rpx;
					}
				}
				
			}			
			input{
				width: 500rpx;
				float: left;
				line-height: 0;
				margin-top: -10rpx;
			}
		}
	}
	.swiper{
		height: 320rpx;
		background-color: #fff;
		image{
			width: 100%;
			height: 320rpx;
		}
	}
	.company_type{
		height: 190rpx;
		background-color: #fff;
		view{
			float: left;
			width: 248rpx;
			text-align:center;
		}
		view:nth-child(2){
			border-right: 1px solid #eee;
			border-left: 1px solid #eee;
		}
		image{
			width: 190rpx;
			height: 190rpx;
		}
	}
	.company_list{
		padding: 0 14rpx;
		>view{
			// width: 100%;
			height: 150rpx;
			border-radius: 10rpx;
			box-shadow: 0px 1px 4px 2px #eee;
			padding: 25rpx 35rpx;
			padding-right: 0;
			margin-top: 25rpx;
			background-color: #fff;
			>view{
				float: left;
			}
			.imgbox{
				width: 150rpx;
				height: 150rpx;
				border-radius: 10rpx;
				border: 1px solid $uni-color-primary;
				overflow: hidden;
				margin-right: 20rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			h3{
				max-width: 470rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				line-height: 80rpx;
				font-size: 16px;
				font-weight: bold;
			}
			.describe{
				height: 30rpx;
				text{
					color: #666;
					padding: 0 10rpx;
					border-left: 1px solid #666;
					font-size: 14px;
					float: left;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					max-width: 147rpx;
				}
				text:first-child{
					border: 0;
					padding-left: 0;
				}
				text:last-child{
					max-width: 185rpx;
				}
			}
		}
	}
	.post_hy{
		margin-top: 10px;
		text{
			float: left;
			line-height: 50rpx;
			width: 153rpx;
			text-align: center;
			background-color: #ececec;
			margin: 12rpx;
			font-size: 14px;
		}
		.checkhy{
			color: $uni-color-primary;
		}
	}
	.post_list{
		padding: 0 14rpx;
		margin-top: 20rpx;
		.tit{
			font-size: 16px;
			font-weight: bold;
		}
		.box{
			background-color: #fff;
			border-radius: 20rpx;
			padding: 10rpx 0;
			box-sizing: border-box;
			margin: 20rpx 0;
			image{
				width: 20rpx;
			}
			.title,.comname,.info{
				padding:0 30rpx;
				>text:last-child{
					float: right;
					width: 190rpx;
					text-align: right;
				}
				>view,>text:first-child{
					float: left;
					width: 470rpx;
				}				
			}
			.title{
				margin-bottom: 20rpx;
			}
			.info{
				margin: 10rpx 0;
				view{
					width: 400rpx;
					text{
						float: left;
						padding: 0 20rpx;
						height: 25rpx;
						line-height: 25rpx;
						border-left:2px solid #666;
						color: #333;
						font-size: 14px;
					}
					text:first-child{
						border: 0;
						padding-left: 0;
					}
				}
				>text:last-child{
					color: #666;	
					width: inherit;
				}
			}
			.keywords{
				margin: 20rpx 0;
				padding:0 30rpx;
				text{
					float: left;
					text-align: center;
					padding: 0 10rpx;
					font-size: 12px;
					background-color: #ececec;
					margin-right: 10rpx;
					border-radius: 5rpx;
				}
			}
			.title{
				font-size: 16px;
				font-weight: bold;
				>text:last-child{
					color: $uni-color-primary;
				}
			}
			.comname{
				border-top: 1px solid #ccc;
				padding: 20rpx 30rpx;
				line-height: 30rpx;
				font-size: 14px;
				image{
					width: 12rpx;
					display: inline-block;
					margin-right: 10rpx;
				}
				button{
					font-size: 12px;
					padding: 0;
					width: 46px;
					line-height: 34rpx;
					float: right;
					background-color: $uni-color-primary;
					color: #fff;
					letter-spacing: 2px;
				}
			}
		}
	}
	.cityshadow{
		position: fixed;
		z-index: 100000;		
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		margin: auto;
		background-color: rgba(0,0,0,.5);
		.box{
			width: 80%;
			height: 600rpx;
			background-color: #fff;
			border-radius: 20rpx;
			position: absolute;
			top: 0;
			bottom: 0;
			right: 0;
			left: 0;
			margin: auto;
			.list{
				height: 500rpx;				
				overflow-y: scroll;
				overflow-x: hidden;
				>view{
					float: left;
					width: 50%;
					text-align: center;
					line-height: 60rpx;
					font-size: 14px;
					view{
						border-bottom: 1px solid #eee;
						margin: 0 20rpx;
					}
					h4{
						margin: 0;
						border: 0;
					}
					view:first-child{
						// border: 0;
					}
				}
				
			}
			.btns{
				height: 100rpx;
				line-height: 100rpx;
			}
			.txt{
				color: $uni-color-primary;
			}
		}
	}
	.share{
		width: 120rpx;
		height: 130rpx;		
		position: fixed;
		padding: 0;
		background-color: rgba(0,0,0,0);
		top: 0;
		right: 30rpx;
		bottom: 0;
		margin: auto;
		image{
			width: 100%;
			height: 100%;
		}
	}
	footer{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		text-align: center;
		background: #fff;
		padding:20rpx 0 ;
		view{
			width: 25%;
			float: left;
			text{
				line-height: 40rpx;
				letter-spacing: 2px;
			}
			.now_type{
				color: $uni-color-primary;
			}
		}
		image{
			height: 60rpx;
			display: block;
			margin: auto;
		}
	}
	.gghbtn{
		position: fixed;
		bottom: 140rpx;
		left: 0rpx;
		width: 100%;
		// height: 100rpx;
		// z-index: 1000;
		// background-image: url(../../static/img/RC-GGH.png);
		// background-size: 100% 100%;
		
	}
</style>
