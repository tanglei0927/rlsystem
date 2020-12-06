<template>
	<div>
		<h1 class="cl">
			{{id&&!isEdit?'账号详情':(id&&isEdit?'修改账号信息':'添加账号')}}
			<el-button type="primary" v-if="id" @click="isEdit=true">修改</el-button>
		</h1>
		<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
		 
		    <el-form-item label="管理员姓名:" prop="name">
		      <el-input v-model="form.name" :disabled="!isEdit"></el-input>
		    </el-form-item>
			<el-form-item label="联系电话:" prop="phone">
			  <el-input v-model="form.phone" :disabled="!isEdit"></el-input>
			</el-form-item>
			<el-form-item label="登录账号:" prop="amount">
			  <el-input v-model="form.amount" :disabled="id"></el-input>
			</el-form-item>
			<el-form-item label="登录密码:" prop="password">
			  <el-input v-model="form.password" :disabled="!isEdit"></el-input>
			</el-form-item>
			<!-- 1：系统管理员  2：企业账号 -->
			<el-form-item label="账号类型:" prop="role">
				<!-- &&form.role==2 -->
			<el-radio-group v-model="form.role"  :disabled="!isEdit">
			    <el-radio :label="1">管理员</el-radio>
			    <el-radio :label="2">企业</el-radio>
			  </el-radio-group>
			</el-form-item>
			<el-form-item label="是否禁用:" prop="role">
			  <el-radio-group v-model="form.isForbidden" :disabled="!isEdit">
			    <el-radio :label="1">正常</el-radio>
			    <el-radio :label="0">禁用</el-radio>
			  </el-radio-group>
			</el-form-item>
			<el-form-item v-if="id" label="创建时间:" prop="role">
				<span>{{form.createTime}}</span>
			</el-form-item>
			<el-form-item v-if="id" label="禁用时间:" prop="role">
				<span>{{form.forbiddenTime}}</span>
			</el-form-item>
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
					role:''
				},
				rules: {
				  name: [
					{ required: true, message: '请输入管理员名称', trigger: 'blur' },
				  ],
				  amount: [
				  	{ required: true, message: '请输入登录账号', trigger: 'blur' },
				  ],
				  password: [
				  	{required: true, message: '请输入登录密码', trigger: 'blur' },
				  ],
				  phone: [
				  	{required: true, message: '请输入联系电话', trigger: 'blur' },
					{pattern: /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/,message: '手机号格式不对',trigger: 'blur'}
				  ],
				  role:[
					  {required: true, message: '请输入联系电话', trigger: 'blur' },
				  ]
				},
				imgList:[],
				isLoading:false
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
				this.$axios.post(this.$url+'mmanager/detail',{id:this.id}).then(res=>{
					if(res.code==100){
						this.form=res.info
					}
				})
			},
			onSubmit(){
				// 提交
				this.$refs['form'].validate((valid) => {
					// console.log(valid)
					if(valid){
						this.isLoading=true
						let data={}
						data=this.form
						let url=''
						url=data.id?'mmanager/update':'mmanager/add'
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
									// this.form={}
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
