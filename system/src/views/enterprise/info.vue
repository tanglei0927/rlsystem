<template>
	<div class="pagehtml">
		<h1 class="cl">
			{{id&&!isEdit?'企业详情':(id&&isEdit?'修改企业信息':'添加企业')}}
			<el-button type="primary" v-if="id" @click="goEdit()">修改</el-button>
			<el-button type="primary" @click="changeStauts()">{{form.isShelf?'冻结':'激活'}}</el-button>
		</h1>
		<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
		    <el-form-item label="企业名称:" prop="name">
		    <el-input v-model="form.name" :disabled="!isEdit"></el-input>
		    </el-form-item>
		    <el-form-item label="所属区域" prop="area">
		      <el-cascader
		        v-model="value"
				filterable
		        :options="areaList"			
				placeholder="请选择地区"
				@change="handleChange"
				:props="{ checkStrictly: true }"
				></el-cascader>
		    </el-form-item>
		    <el-form-item label="详细地址:" prop="address">
		      <el-input v-model="form.address" :disabled="!isEdit"></el-input>
		    </el-form-item>
			<el-form-item label="地图定位:" prop="latitude">
				<Map v-if="isEdit" @changeAddress="changeAddress"/>
				<Mapmarker v-else :lngs="lngs" />
			</el-form-item>
			<el-form-item label="所属行业:" prop="industry">
			  <el-select v-model="form.industry" :disabled="!isEdit" placeholder="请选择行业">
			    <el-option v-for="(item,index) in typeList4" :label="item.dictName" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
			<el-form-item label="企业类型:" prop="type">
			  <el-select v-model="form.type" :disabled="!isEdit" placeholder="请选择企业类型">
			    <el-option v-for="(item,index) in typeList5" :label="item.dictName" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
			<el-form-item label="企业规模:" prop="scale">
			  <el-select v-model="form.scale" :disabled="!isEdit" placeholder="请选择企业规模">
			    <el-option v-for="(item,index) in typeList6" :label="item.dictName" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
			<!-- <el-form-item label="联系人:" prop="user">
			  <el-input v-model="form.user" :disabled="!isEdit"></el-input>
			</el-form-item> -->
			<el-form-item label="联系电话:" prop="phoneList">
				<div class="phonebox">
					<span v-for="(item,index) in phoneList">{{item.contacts+":"+item.phone}}
					<i class="el-icon-error" @click="removePhone(index)"></i>
					</span>
				</div>
				<el-input class="phoneinput" v-model="phoneInfo.user" :disabled="!isEdit" placeholder="请输入联系人姓名"></el-input>
			   <el-input class="phoneinput" v-model="phoneInfo.phone" @blur="phoneBlur()" placeholder="请输入联系电话" v-show="isEdit"></el-input>
			  <el-button v-show="isEdit" @click="addPhones()">添加</el-button>
			</el-form-item>
			<el-form-item label="企业福利:">
				<el-checkbox-group v-model="welfare" @change="changeFL" :disabled="!isEdit">
				    <el-checkbox v-for="(item,index) in typeList9" :label="item.id" name="type">{{item.dictName}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="企业简介:">
			    <el-input type="textarea"  :disabled="!isEdit" rows='10' v-model="form.introduction"></el-input>
			</el-form-item>
			<el-form-item label="企业LOGO:" prop="">
				<img class="imgs" :src="$url+'file/readFile/'+logo" alt="">
				<el-upload
				v-if="isEdit"
				  :action="$url+'file/uploadFile'"
				  list-type="picture-card"
				  name='fileName'
				  ref="my-upload"
				  :on-success="uploadSuccessLogo"
				  :show-file-list="false"
				 >
				  <i class="el-icon-plus"></i>
				</el-upload>
			</el-form-item>
			<el-form-item label="企业背景图:" prop="">
				<img class="imgs" :src="$url+'file/readFile/'+banner" alt="">
				<el-upload
				v-if="isEdit"
				  :action="$url+'file/uploadFile'"
				  list-type="picture-card"
				  name='fileName'
				  ref="my-upload"
				  :on-success="uploadSuccessBanner"
				  :show-file-list="false"
				 >
				  <i class="el-icon-plus"></i>
				</el-upload>
			</el-form-item>
			<el-form-item label="企业相册:" prop="">
				<div class="imgbox cl">
					<div class="box" v-for="(item,index) in imgList">
						<i class="el-icon-error" @click="removeImg(item,index)"></i>
						<img class="imgs" :src="$url+'file/readFile/'+item" alt="">
					</div>
				</div>
				<el-upload
				v-if="isEdit"
				  :action="$url+'file/uploadFile'"
				  list-type="picture-card"
				  name='fileName'
				  ref="my-upload"
				  :on-success="uploadSuccess"
				  :before-upload="uploadBefore"
				  :show-file-list="false"
				 >
				  <i class="el-icon-plus"></i>
				</el-upload>
			</el-form-item>			
			<el-form-item label="" v-if="isEdit">
				<el-button type="primary" @click="onSubmit">保存</el-button>
				<el-button  @click="cancel()">取消</el-button>
			</el-form-item>
		</el-form>
		
	</div>
</template>

<script>
	
	import Map from "../../components/map"
	import Mapmarker from "../../components/showmap"
	export default{
		components:{
		   Map,Mapmarker
		},
		data(){
			return{
				id:null,
				isEdit:false,
				value:[],
				phoneList:[],
				form:{
					welfare:[],
					phoneList:[],
					album:[]
				},
				rules: {
				  area:[
					{ required: true, message: '请选择所属区域', trigger: 'blur' },
				  ],
				  name: [
					{ required: true, message: '请输入企业名称', trigger: 'blur' },
				  ],
				  address: [
				  	{required: true, message: '请输入详细地址', trigger: 'blur' },
				  ],
				  latitude: [
				  	{required: true, message: '请选择公司位置', trigger: 'blur' },
				  ],
				  industry: [
					{required: true, message: '请选择所属行业', trigger: 'blur' },
				  ],
				  type: [
					{required: true, message: '请选择企业类型', trigger: 'blur' },
				  ],
				  scale: [
					{required: true, message: '请选择企业规模', trigger: 'blur' },
				  ],
				  phoneList: [
				  	{required: true, message: '请输入联系电话', trigger: 'blur' },
					// {pattern: /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/,message: '手机号格式不对',trigger: 'blur'}
				  ]
				},
				imgList:[],
				areaList:[],
				phoneInfo:{},
				logo:'',
				banner:'',
				lngs:[],
				welfare:[],
				typeList4:[],
				typeList5:[],
				typeList6:[],
				typeList8:[],
				typeList9:[]
			}
		},
		
		created(){
			let routerInfo=this.$route
			if(routerInfo.query.id){
				this.id=routerInfo.query.id
				this.init()
			}else{
				this.isEdit=true
			}
			let userInfo=sessionStorage.userInfo
			if(userInfo){
				userInfo=JSON.parse(userInfo)
				this.form.user=userInfo.id
			}
			this.getType('04')
			this.getType('05')
			this.getType('06')
			this.getType('08')
			this.getType('09')
			this.getArea()
		},
		methods:{
			phoneBlur(){
				// 电话失去焦点
				let reg=/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/
				if(!reg.test(this.phoneInfo.phone)){
					this.$message({
						type:'warning',
						message:'电话号码错误，请核对',
					})
				}
			},
			changeStauts(){
				this.$axios.post(this.$url+'mEnter/shelf',{
					ids:this.id,
					shelf:this.form.isShelf?0:1,
				}).then(res=>{
					if(res.code==100){
						this.init()
						this.$message({
							type: 'success',
							message: '操作成功!'
						});
					}
				})			
			},
			uploadSuccess(res){
				// this.$refs['my-upload'].clearFiles();
				// 相册
				if(res.code==100){
					// this.form.album.push(res.info)
					let list=this.imgList
					list.push(res.info)
					this.imgList=[...list]
					this.form.album=[...list]
				}
			},
			uploadSuccessLogo(res){
				// logo
				if(res.code==100){
					this.form.logo=res.info
					this.logo=res.info
				}
			},
			uploadSuccessBanner(res){
				// banner
				if(res.code==100){
					this.form.banner=res.info
					this.banner=res.info
				}
			},
			uploadBefore(file){
				// 上传之前
				if(this.imgList>6){
					this.$refs['my-upload'].abort()
					this.$meaasge({
						type:'warning',
						message:'最多只能上传6张图片'
					})
				}
			},
			removeImg(img,index){
				// 删除图片
				this.imgList.splice(index,1)
				this.form.album=this.imgList
			},
			removePhone(index){
				this.phoneList.splice(index,1)
			},
			cancel(){
				// 取消
				if(!this.id){
					this.$router.go(-1)
				}else{
					this.isEdit=false
					// this.init()
				}
			},
			goEdit(){
				if(this.form.isShelf==0){
					this.isEdit=true
				}else{
					this.$message({
						type:'warning',
						message:'企业上架状态不能进行修改，如需修改请先下架企业！'
					})
				}
			},
			init(){
				// 获取数据
				this.$axios.post(this.$url+'mEnter/detail',{
					id:this.id
				}).then(res=>{
					if(res.code==100){
						let info=res.info
						this.form=info
						this.logo=info.logo
						this.banner=info.banner
						this.imgList=info.album
						this.phoneList=info.phoneList
						this.lngs=[info.longitude,info.latitude]
						this.value=[info.province,info.city,info.area]
						this.welfare=[]
						let list=[]
						info.welfare.forEach((item,index)=>{
							list.push(item.id)
						})
						this.welfare=[...list]
						console.log("./.././")
						console.log(this.welfare)
					}
				})
			},
			addPhones(){				
				let phone=this.phoneInfo.phone
				let Reg=/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/
				if(Reg.test(phone)&&this.phoneInfo.user){
					let data={}
					data.phone=phone
					data.contacts=this.phoneInfo.user
					this.phoneList.push(data)
					this.phoneInfo={}
				}
			},
			getType(type){
				// 获取字典数据 04所属行业，05公司类型，06公司规模，07学历，08经验要求  09福利待遇
				this.$axios.post(this.$url+'mDict/getByTypeCode',{
					typeCode:type
				}).then(res=>{
					if(res.code==100){
						let list=res.info
						switch(type){
							case '04':
								this.typeList4=list
								break;
							case '05':
								this.typeList5=list
								break;
							case '06':
								this.typeList6=list
								break;
							case '08':
								this.typeList8=list
								break;
							case '09':
								this.typeList9=list
								break;
												
						}
						
					}
				})				
			},
			getArea(){
				// 获取省市区数据
				this.$axios.post(this.$url+'mDict/areaTree').then(res=>{
					if(res.code==100){
						this.areaList=res.info
					}
				})
			},
			handleChange(e){
				// 区域选择
				let length=e.length
				if(length>0){
					this.form.province=e[0]
				}
				if(length>1){
					this.form.city=e[1]
				}
				if(length>2){
					this.form.area=e[2]
				}
			},
			changeAddress(e){
				// console.log("地图定位")
				// console.log(e)
				this.form.latitude=e.latitude
				this.form.longitude=e.longitude
				this.$message({
					type:'success',
					message:'定位成功'
				})
			},
			changeFL(e){
				let list=this.typeList9
				let data=[]
				e.forEach((item,index)=>{
					list.forEach((item2,index2)=>{
						let info={}
						if(item==item2.id){
							info.id=item2.id
							info.name=item2.dictName
							data.push(info)
						}
					})
				})
				this.form.welfare=data
			},
			onSubmit(){
				// 提交
				if(this.phoneList.length==0){
					let phoneInfo={}
					phoneInfo.phone=this.phoneInfo.phone					phoneInfo.contacts=this.phoneInfo.user
					this.phoneList.push(phoneInfo)
				}
				this.$refs['form'].validate((valid) => {
					// console.log(valid)
					let data={}
					data=this.form
					data.phoneList=this.phoneList
					// data.
					console.log("12121241")
					console.log(data)
					let url=''
					url=data.id?'mEnter/update':'mEnter/add'
					this.$axios.post(this.$url+url,data,'application/json;charset=UTF-8').then(res=>{
						if(res.code==100){
							this.$message({
								type:'success',
								message:'提交成功'
							})
							// if(data.id){
							// 	this.init()
							// 	this.isEdit=false
							// }else{
								this.$router.go(-1)
								// this.form={
								// 	// welfare:[],
								// 	// phoneList:[],
								// 	// album:[]
								// }
								// this.phoneInfo={}
								// this.value=[]
								// this.imgList=[]
								// this.logo=''
								// this.banner=''
								// this.phoneList=[]
								// this.welfare=[]
							// }
						}
					})
				})
			}
		},
		 beforeRouteUpdate (to, from, next) {
			 console.log("监听监听")
			 console.log(to)
			 if(!to.query.id){
				 this.form={
					 type:[]
				 }
				 this.id=null
				 this.isEdit=true
			 }
		 }
	}
</script>

<style lang="scss" scoped>
	h1{
		border-bottom: 1px solid #ccc;
		// padding-bottom: 10px;
		.el-button{
			float: right;
		}
	}
	.pagehtml{
		h1{
			.el-button{
				margin-left: 20px;
			}
		}
		.el-form{
			margin-top: 20px;
			width:800px;
			.el-input{
				width: 300px;
			}
		}
	}
	
	
	.imgbox{
		.box{
			width: 110px;
			height: 110px;
			margin: 10px;
			position: relative;
			border-radius: 5px;
			overflow: hidden;
			border: 1px solid #ccc;
			float: left;
			img{
				width: 100%;
				height: 100%;
			}
			i{
				position: absolute;
				right: 0;
				top: 0;
				font-size: 20px;
			}
			i:hover{
				color: #00aa00;
			}
		}
	}
	.el-input.is-disabled .el-input__inner{
		background-color: #fbfcfe;
		color: #000;
	}
	.el-checkbox__input.is-disabled+span.el-checkbox__label{
		color: #000;
	}
	.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
		background-color: #27d2f4;
		border-color:#fff;
	}
	.el-textarea.is-disabled .el-textarea__inner{
		background-color: #fbfcfe;
	}
	.phoneinput{
		width: 200px;
		margin-right: 20px;
		margin-bottom: 10px;
	}
	.phonebox{
		span{
			margin-right: 10px;
			color: #55aaff;
		}
		i{
			font-size: 16px;
		}
		i:hover{
			color: #478fd6;
		}
	}
	.map-chart{
		// height: 350px;
	}
	.imgs{
		width: 340px;
	}
</style>
