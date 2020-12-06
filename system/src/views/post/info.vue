<template>
	<div class="postpage">
		<h1 class="cl">
			{{id&&!isEdit?'岗位详情':(id&&isEdit?'修改岗位信息':'添加岗位')}}
			<el-button type="primary" v-if="id" @click="goEdit()">修改</el-button>
			<el-button type="primary" @click="changeStauts()">{{form.isShelf?'下架':'上架'}}</el-button>
		</h1>
		<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
		  <el-form-item label="企业:" prop="enterpriseId">
			   <el-select v-model="form.enterpriseId" @change="changeEnter" filterable :disabled="!isEdit" placeholder="请选择所属企业">
			     <el-option v-for="(item,index) in enterList" :label="item.name" :value="item.id"></el-option>
			   </el-select>
		  </el-form-item>
		  <el-form-item label="所属行业:" prop="industry">
			 <el-select v-model="form.industry" filterable :disabled="!isEdit" placeholder="请选择行业">
			   <el-option v-for="(item,index) in typeList4" :label="item.dictName" :value="item.id"></el-option>
			 </el-select>
		  </el-form-item>
		  <el-form-item label="岗位名称:" prop="name">
			  <el-input v-model="form.name"  placeholder="请输入岗位名称" :disabled="!isEdit"></el-input>
		  </el-form-item>
		  <el-form-item label="薪资待遇:" class="dybopx" prop="treatmentStart">
			  <el-input v-model="form.treatmentStart" :disabled="!isEdit"></el-input>--
			  <el-input v-model="form.treatmentEnd" :disabled="!isEdit"></el-input>
			  <span>（千元）<strong>例：6500元：6.5</strong></span>
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
			<el-form-item label="经验要求:" prop="requirements">
			  <el-select v-model="form.requirements" filterable :disabled="!isEdit" placeholder="请选择经验要求">
			    <el-option v-for="(item,index) in typeList8" :label="item.dictName" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
			<el-form-item label="学历要求:" prop="education">
			  <el-select v-model="form.education" filterable :disabled="!isEdit" placeholder="请选择学历要求">
			    <el-option v-for="(item,index) in typeList7" :label="item.dictName" :value="item.id"></el-option>
			  </el-select>
			</el-form-item>
		    <el-form-item label="招聘人数:" prop="recruitersNumber">
		      <el-input v-model="form.recruitersNumber" placeholder="请输入招聘人数" :disabled="!isEdit"></el-input><i>（人）</i>
		    </el-form-item>
			<el-form-item label="岗位关键词:" prop="keyWords">
			  <el-input v-model="form.keyWords" placeholder="请输入岗位关键词" :disabled="!isEdit"></el-input>
			  <!-- <el-button class="addkey" @click="addKeyWords()">添加多个</el-button> -->
			  <p>（多个关键词请用 , 隔开）</p>
			</el-form-item>
			<el-form-item label="岗位描述:" prop="introduction">
			    <!-- <el-input type="textarea"  :disabled="!isEdit" rows='10' v-model="form.introduction"></el-input> -->
				<!-- <div id="wangeditor">
				    <div ref="editorElem" style="text-align:left;"></div>
				</div> -->
				<div>
					<Edit @changeMs="changeMs" :info='form.introduction'></Edit>
				</div>
			</el-form-item>
			<el-form-item label="" v-if="isEdit">
				<el-button type="primary" @click="onSubmit">保存</el-button>
				<el-button  @click="cancel()">取消</el-button>
			</el-form-item>
		</el-form>
		
	</div>
</template>

<script>
	// import E from "wangeditor";
	import Edit from '../../components/edite.vue'
	export default{
		components:{Edit},
		data(){
			return{
				id:null,
				isEdit:false,
				form:{
					// type:[1,3,5],
					keyWords:null,
					industry:null
				},
				rules: {
				  name: [
					{ required: true, message: '请输入岗位名称', trigger: 'blur' },
				  ],
				  area: [
				  	{required: true, message: '请选择所属区域', trigger: 'blur' },
				  ],
				  treatmentStart:[
					 {required: true, message: '请输入薪资待遇,例：6500元填写：6.5', trigger: 'blur' }, 
				  ],
				  keyWords: [
				  	{required: true, message: '请输入关键词', trigger: 'blur' },
				  ],
				  requirements:[
					{required: true, message: '请选择经验要求', trigger: 'blur' },
				  ],
				  education:[
					{required: true, message: '请选择学历', trigger: 'blur' },
				  ],
				  enterpriseId:[
					{required: true, message: '请选择企业', trigger: 'blur' },
				  ],
				  recruitersNumber:[
				  	{required: true, message: '请输入招聘人数', trigger: 'blur' },
				  ],
				  introduction:[
				  	{required: true, message: '请输入岗位描述', trigger: 'blur' },
				  ],
				  industry:[
					{required: true, message: '请选择岗位所属行业', trigger: 'blur' },
				  ]
				},
				imgList:[],
				areaList:[],
				value:[],
				enterList:[],
				typeList4:[],
				typeList7:[],
				typeList8:[],
				editor: null,
				editorContent: ''
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
			this.getType('07')
			this.getType('08')
			this.getEntList()
			this.getArea()
		},
		methods:{
			changeStauts(){
				this.$axios.post(this.$url+'mpsot/shelf',{
					ids:this.id,
					isShelf:this.form.isShelf?0:1,
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
			cancel(){
				// 取消
				if(!this.id){
					this.$router.go(-1)
				}else{
					// this.init()
					this.isEdit=false
				}
			},
			getArea(){
				// 获取省市区数据
				this.$axios.post(this.$url+'mDict/areaTree').then(res=>{
					if(res.code==100){
						this.areaList=res.info
					}
				})
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
							case '07':
								this.typeList7=list
								break;
							case '08':
								this.typeList8=list
								break;												
						}
						
					}
				})				
			},
			getEntList(){
				// 企业下拉
				this.$axios.post(this.$url+'mEnter/simpleList',{
					managerId:this.form.user
				}).then(res=>{
					if(res.code==100){
						this.enterList=res.info
					}
				})
			},
			goEdit(){
				if(this.form.isShelf==0){
					this.isEdit=true
				}else{
					this.$message({
						type:'warning',
						message:'岗位上架状态不能进行修改，如需修改请先下架岗位！'
					})
				}
			},
			init(){
				// 获取数据
				this.$axios.post(this.$url+'mpsot/detail',{
					id:this.id
				}).then(res=>{
					if(res.code==100){
						let info=res.info
						info.keyWords=info.keyWords.join(',')
						this.form={...info}
						this.value=[info.province,info.city,info.area]
					}
				})
			},
			handleChange(e){
				if(e.length>0){
					this.form.province=e[0]
				}
				if(e.length>1){
					this.form.city=e[1]
				}
				if(e.length>2){
					this.form.area=e[2]
				}
			},
			changeEnter(e){
				console.log(e)
				this.enterList.forEach((item,index)=>{
					if(item.id==e){
						this.form.industry=item.industry*1
					}
				})
			},
			changeMs(html){
				// 富文本数据变更
				console.log(html)
				this.form.introduction=html
			},
			onSubmit(){
				// 提交
				this.$refs['form'].validate((valid) => {
					// console.log(valid)
					if(valid){
						let data={}
						data={...this.form}
						// 关键词
						let keyWords=this.form.keyWords
						if(keyWords.indexOf(',')!=-1||keyWords.indexOf('，')!=-1){
							if(keyWords.indexOf(',')!=-1){
								data.keyWords=keyWords.split(',')
							}else{
								data.keyWords=keyWords.split('，')
							}
						}else{
							data.keyWords=[keyWords]
						}
						console.log('岗位岗位')
						console.log(data)
						let url=''
						url=data.id?'mpsot/update':'mpsot/add'
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
									// 	keyWords:null,
									// }
									// this.value=[]
								// }
							}
						})
					}
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

<style lang="scss">
	h1{
		border-bottom: 1px solid #ccc;
		// padding-bottom: 10px;
		.el-button{
			float: right;
		}
	}
	.el-form{
		margin-top: 20px;
		width:900px;
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
	
	.postpage{
		h1{
			.el-button{
				margin-left: 20px;
			}
		}
		.el-input{
			width: 300px;
		}
		.dybopx{
			.el-input{
				width: 80px;
			}
		}
		.addkey{
			margin-left: 20px;
		}
	}
	strong{
		color: #666;
	}
</style>
