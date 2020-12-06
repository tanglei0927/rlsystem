<template>
	<div>
		<h1 class="cl">
			{{id&&!isEdit?'广告详情':(id&&isEdit?'修改广告信息':'添加广告')}}
			<el-button type="primary" v-if="id" @click="isEdit=true">修改</el-button>
		</h1>
		<el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-ruleForm">
			<el-form-item label="添加图片:" prop="url">
				<img class="bannerimg"  :src="$url+'file/readFile/'+imgurl" alt="">
				<el-upload
				v-if="isEdit"
				  :action="$url+'file/uploadFile'"
				  list-type="picture-card"
				  name='fileName'
				  ref="my-upload"
				  :on-success="uploadSuccess"
				  :show-file-list="false"
				 >
				  <i class="el-icon-plus"></i>
				</el-upload>
		    </el-form-item>
			<el-form-item label="广告位置:" prop="orde">
				<el-input v-model="form.orde" type="number" :disabled="!isEdit"></el-input>
			</el-form-item>
			<el-form-item label="名称:" prop="name">
				<el-input v-model="form.name" :disabled="!isEdit"></el-input>
			</el-form-item>
			<el-form-item label="" v-if="isEdit">
				<el-button type="primary" @click="onSubmit">保存</el-button>
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
				},
				rules: {
				  orde: [
					{ required: true, message: '请输入广告位置数字', trigger: 'blur' },
					// { type: 'number', required: true, message: '位置只能为数字', trigger: 'blur' }
				  ],
				  name: [
				  	{required: true, message: '请输入广告名称', trigger: 'blur' },
				  ],
				  url: [
					{required: true, message: '请上传图片', trigger: 'blur' },
				  ],				  
				},
				userInfo:{},
				imgurl:''
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
				this.userInfo=JSON.parse(userInfo)
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
				this.$axios.post(this.$url+'mbanner/detail',{
					id:this.id
				}).then(res=>{
					if(res.code==100){
						this.form=res.info
						this.imgurl=res.info.url
					}
				})
			},
			onSubmit(){
				// 提交
				this.$refs['form'].validate((valid) => {
					if(valid){
						let data={}
						data=this.form
						let url=''
						data.orde=data.orde*1
						data.user=this.userInfo.id
						url=data.id?'mbanner/update':'mbanner/add'
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
									// this.form={}
									// this.imgurl=''
								// }
							}
						})
						
					}
				})
			},
			uploadSuccess(e){
				if(e.code==100){
					this.form.url=e.info
					this.imgurl=e.info
				}
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
	.bannerimg{
		width:300px;
	}
	.el-upload{
		float: left;
	}
	.bannerimg{
		float: left;		width:200px;
	}
</style>
