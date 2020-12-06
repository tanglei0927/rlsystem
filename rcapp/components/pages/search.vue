<template>
	<view class="search_page">
		<view class="cl" v-if="code=='04'">
			<h3>所属行业</h3>
			<view class="list_box cl">
				<text  v-for="(item,index) in hyList"
				 :class="hytype==item.id?'check':''"
				 @click="clickType(item.id)"
				>{{item.dictName}}</text>
			</view>
		</view>
		<view class="cl" v-if="code=='1'">
			<h3>薪资</h3>
			<view class="list_box cl">
				<text  v-for="(item,index) in xzList"
				 :class="xzchek==index?'check':''"
				 @click="searchXz(index)"
				>{{item.str}}</text>
			</view>
		</view>
		<view class="cl" v-if="code=='2'">
			<h3>职能</h3>
			<view class="list_box cl">
				<text  v-for="(item,index) in zlList"
				 :class="zncheck==index?'check':''"
				 @click="searchZn(index)"
				>{{item}}</text>
			</view>
		</view>
		<div class="btns cl">
			<button type="default" @click="clearType()" class="cancel">清除</button>
			<button type="default" @click="isOk()" class="isok">确定</button>
		</div>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				code:'',
				hyList:[],
				zlList:[],
				hytype:'',
				xzchek:0,
				zncheck:0,
				enterId:null,
				xzList:[
					{
						str:'不限',
						start:'',
						end:''
					},
					{
						str:'3K以下',
						start:'',
						end:3
					},
					{
						str:'3-5K',
						start:3,
						end:5
					},
					{
						str:'5-10K',
						start:5,
						end:10
					},
					{
						str:'10-20K',
						start:10,
						end:20
					},
					{
						str:'20-50k',
						start:20,
						end:50
					},
					{
						str:'50K以上',
						start:50,
						end:''
					}
				]
			}
		},
		onLoad(e){
			console.log(e)
			// this.code='04'
			this.code=e.code
			if(e.enterId){
				this.enterId=e.enterId
			}
			if(e.code=='04'){
				this.hytype=e.industryId
				this.getType('04')
			}
			if(e.code=='2'){
				this.getznList()
				if(e.index){
					this.zncheck=e.index					
				}
			}
			if(e.index&&e.code=='1'){
				this.xzchek=e.index
			}
			
		},
		methods:{
			getType(e){
				this.$http.post('mDict/getByTypeCode',{
					typeCode:e
				}).then(res=>{
					if(res.code==100){
						let list=res.info
						list.unshift({code:'',dictName:'不限',id:''})
						if(e=='04'){
							this.hyList=list
						}
					}
				})
			},
			getznList(){
				this.$http.post("hpsot/getNameByEnter",{
					enterId:this.enterId
				}).then(res=>{
					if(res.code==100){
						let list=res.info
						list.unshift('不限')
						this.zlList=list
					}
				})
			},
			clearType(){
				if(this.code=='04'){
					this.hytype=''
				}else if(this.code=='1'){
					this.xzchek=''
				}else{
					this.zncheck=0
				}
			},
			clickType(type){
				if(this.code=='04'){
					this.hytype=type
				}
			},
			isOk(){
				let index=0
				if(this.code=='04'){
					uni.setStorageSync('hyTpe',this.hytype)
				}else if(this.code=='1'){
					if(this.xzchek||this.xzchek==0){
						let info=this.xzList[this.xzchek]
						info=JSON.stringify(info)
						uni.setStorageSync('xzInfo',info)
						index=this.xzchek
						uni.setStorageSync('searchXzindex',index)
					}else{
						uni.setStorageSync('xzInfo','')
					}
				}else if(this.code=='2'){
					// 职能
					if(this.zncheck){
						uni.setStorageSync('znInfo',this.zlList[this.zncheck])
						index=this.zncheck
					}else{
						uni.setStorageSync('znInfo','')
					}
					uni.setStorageSync('searchZnindex',index)
				}
				uni.navigateBack({})
			},
			searchXz(index){
				// 薪资
				this.xzchek=index
			},
			searchZn(index){
				this.zncheck=index
			}
		}
	}
</script>

<style lang="scss" >
	page{
		background: #fff ;
	}
	.search_page{
		padding: 30rpx;
		padding-bottom: 100rpx;
	}
	.btns{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		height: 80rpx;
		line-height: 80rpx;
		border-top: 1px solid #ccc;
		padding: 20rpx 30rpx;
		button{
			border: 10rpx;
			float: left;
		}
		.cancel{
			width: 250rpx;
			background-color: #f7f5f6;
			margin-right: 20rpx;
			color: #666;
		}
		.isok{
			background-color: $uni-color-primary;
			color: #fff;
			width: 400rpx;
		}
	}
	h3{
		font-size: 18px;
		font-weight: bold;
		line-height: 50rpx;
		letter-spacing: 2px;
		margin-bottom: 10rpx;
	}
	.list_box{
		text{
			float: left;
			padding: 20rpx;
			min-width: 200rpx;
			margin: 10rpx;
			marign-top:0;
			marign-left:0;
			box-sizing: border-box;
			text-align: center;
			border:1px solid #f7f5f6;
			border-radius: 5rpx;
			background-color: #f7f5f6;
			font-size: 14px;
		}
		.check{
			border-color: $uni-color-primary;
			color: $uni-color-primary;
			box-shadow: 0 0rpx 5rpx 0 #000000;
		}
	}
</style>
