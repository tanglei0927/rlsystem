<template>
	<div>
		<h1 class="cl">
			{{id&&!isEdit?'区域详情':(id&&isEdit?'修改区域信息':'添加区域')}}
			<el-button type="primary" v-if="id" @click="isEdit=true">修改</el-button>
		</h1>
		<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">		 
		   <!-- <el-form-item label="省:" prop="parentCode">
				<el-select v-model="form.typeCode" @change="deTypeChange" :disabled="!isEdit" placeholder="请所属省份">
				  <el-option v-for="(item,index) in typeList" :label="item.name" :value="item.typeCode"></el-option>
				</el-select>
		    </el-form-item> -->
			<el-form-item label="市:" prop="parentCode">
				<el-select filterable v-model="form.parentCode" :disabled="!isEdit" placeholder="请选择或输入搜索所属城市">
				  <el-option v-for="(item,index) in parentCodeList" :label="item.dictName" :value="item.code"></el-option>
				</el-select>
				<p>没有所属城市？请前去字典管理添加省份或城市信息</p>
			</el-form-item>
			<el-form-item label="区:" prop="dictName">
			  <el-input v-model="form.dictName" placeholder="请输入区域名称" :disabled="!isEdit"></el-input>
			</el-form-item>
			<!-- <el-form-item label="是否可用:" prop="" v-if="id">
			  <el-radio-group v-model="form.isDelete" :disabled="!isEdit">
			    <el-radio :label="1">正常</el-radio>
			    <el-radio :label="0">禁用</el-radio>
			  </el-radio-group>
			</el-form-item> -->
			<el-form-item label="" v-if="isEdit">
				<el-button v-if="!isLoading" type="primary" @click="onSubmit">保存</el-button>
				<el-button v-else type="primary" :loading="true">正在提交</el-button>
				<el-button  @click="cancel()">取消</el-button>
			</el-form-item>
		</el-form>
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				id:null,
				isEdit:false,
				form:{
					parentCode:'',
					typeCode:'03',
					isDelete:'',
					dictName:''
				},
				rules: {
				  parentCode: [
					{ required: true, message: '请选择所属城市', trigger: 'blur' },
				  ],
				  dictName: [
				  	{required: true, message: '请输入字典名称', trigger: 'blur' },
				  ]
				},
				imgList:[],
				options:[{ 
					value: '1',
					label: '指南',
				},{ 
					value: '2',
					label: '资源'
				}],
				// typeList:[],
				parentCodeList:[],
				userInfo:{},
				isLoading:false
			}
		},
		computed:{
			typeList(){
				return this.$store.state.dictionaries
			},			
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
				this.userInfo=JSON.parse(userInfo)
			}
			this.deTypeChange('03')
		},
		methods:{			
			cancel(){
				// 取消
				if(!this.id){
					this.$router.go(-1)
				}else{
					// this.init()
					this.isEdit=false
				}
			},
			init(){
				// 获取数据
				this.$axios.post(this.$url+"mDict/detail",{
					id:this.id
				}).then(res=>{
					if(res.code==100){
						let info=res.info
						this.form.id=info.id
						this.form.parentCode=info.parentCode
						this.form.dictName=info.dictName
						this.form.typeCode=info.typeCode
					}
				})
			},
			onSubmit(){
				// 提交
				this.$refs['form'].validate((valid) => {
					console.log(valid)
					if(valid){
						this.isLoading=true
						let data={}
						data=this.form
						data.userid=this.userInfo.id
						let url=''
						url=data.id?'mDict/update':'mDict/add'
						// console.log("1212122")
						this.$axios.post(this.$url+url,data,'application/json;charset=UTF-8').then(res=>{
							this.isLoading=false
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
									// 	typeCode:'03'
									// }
								// }
							}
						})
					}
				})
			},
			
			deTypeChange(e){
				// parentCodeList
				this.form.parentCode=''
				if(e=='03'||e=='02'){
					let type=''
					type=e=='03'?'02':'01'
					this.$axios.post(this.$url+'mDict/getByTypeCode',{
						typeCode:type
					}).then(res=>{
						if(res.code==100){
							this.parentCodeList=res.info
						}
					})
				}
			},
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
		width:500px;
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
	.el-select{
		width: 100%;
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
</style>
