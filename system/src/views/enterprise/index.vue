<template>
	<div>
		<h1 class="cl">企业列表
		 <el-button type="primary" @click="goAdd()">添加企业</el-button>
		</h1>
		<div class="search cl">
			<el-input
			  placeholder="请输入企业名称"
			  v-model="searchForm.name"
			  clearable>
			</el-input>
			<el-select filterable v-model="searchForm.type" placeholder="请选择企业类型">
				<el-option label="全部" value=""></el-option>
			  <el-option v-for="(item,index) in typeList" :label="item.dictName" :value="item.id"></el-option>
			</el-select>
			 <el-cascader
			    v-model="value"
				filterable
			    :options="areaList"
			    @change="handleChange"				
				placeholder="请选择地区"
				:props="{ checkStrictly: true }"
				></el-cascader>
			<!-- <el-select v-model="searchForm.status" placeholder="请选择活动区域">
			  <el-option label="企业状态" value=""></el-option>
			  <el-option label="下架" value="0"></el-option>
			  <el-option label="上架" value="1"></el-option>
			</el-select> -->
			<el-button type="primary" @click="init()">查询</el-button>
		</div>
		<div class="table">
			<!-- 表格 -->
			<el-table
			    :data="tableData"
				ref="multipleTable"
			    stripe
				border
				@selection-change="handleSelectionChange"
			    style="width: 100%">
			    <el-table-column
				  type="selection"
				  width="55">
				</el-table-column>
			    <el-table-column
			      prop="id"
			      label="序号"
			      width="60">
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="企业名"
			      width="180">
			    </el-table-column>
				<el-table-column
				  prop="scale"
				  label="企业规模"
				  width="100">
				</el-table-column>
			    <el-table-column
			      prop="address"
			      label="企业地址"
				  width="180">
			    </el-table-column>
				<el-table-column
				  prop="phoneUSer"
				  label="企业联系人"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="phoneNumber"
				  label="联系方式"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="industry"
				  label="所属行业"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="type"
				  label="企业类型"
				  width="180">
				</el-table-column>
				<!-- <el-table-column
				  prop="name"
				  label="招聘岗位数（具体招聘的数量）"
				  width="180">
				</el-table-column> -->
				<el-table-column
				  prop="createUser"
				  label="发布人"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="createTimeStr"
				  label="发布时间"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="isShelfTimeStr"
				  label="下架时间"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="isShelf"
				  label="企业状态"
				  width="180">
				  <template slot-scope="scope">
				  	<p>{{scope.row.isShelf==0?'冻结':'激活'}}</p>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="name"
				  label="操作"
				  width="240">
				  <template slot-scope="scope">
					  <div class="tablebtns">
						  <el-button type="text" @click="deleteInfo(scope.row)">删除</el-button>
						  <el-button type="text" @click="editInfo(scope.row)">查看详情</el-button>
						  <el-button type="text" @click="changeStauts(scope.row)">{{scope.row.isShelf==0?'激活':'冻结'}}</el-button>
						  <!-- <el-button type="text">激活</el-button> -->
					  </div>
				  </template>
				</el-table-column>
			  </el-table>
			  <div class="block cl">
				  <div class="batch">
					<el-checkbox @change="selectAll" v-model="SelectAll">全选</el-checkbox>  
					<div class="tablebtns">
					  <el-button type="text" @click="deleteInfo()">删除</el-button>
					  <el-button type="text" @click="changeStauts(0,0)">冻结</el-button>
					  <el-button type="text" @click="changeStauts(0,1)">激活</el-button>
					</div>
				  </div>
			      <el-pagination
			        @size-change="handleSizeChange"
			        @current-change="handleCurrentChange"
			        :current-page="searchForm.page"
			        :page-sizes="[10, 20, 30, 40]"
			        :page-size="10"
			        layout="total, sizes, prev, pager, next, jumper"
			        :total="total">
			      </el-pagination>
			    </div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				searchForm:{
					name:'',
					type:'',
					size:10,
					page:1,
					managerId:null,
				},
				tableData:[],
				total:null,
				SelectAll:false,
				selectIds:[],
				typeList:[],
				areaList:[],
				value:[]
			}
		},
		created(){
			console.log("vuex数据")
			// console.log(this.$store.state.dictionaries)
			let userInfo=sessionStorage.userInfo
			if(userInfo){
				userInfo=JSON.parse(userInfo)
				this.searchForm.managerId=userInfo.id
			}
			this.getType()
			this.init()
		},
		methods:{
			goAdd(){
				this.$router.push({name:'enterprise'})
			},
			editInfo(row){
				this.$router.push({name:'enterprise',query:{id:row.id}})
			},
			handleSizeChange(num){
				this.searchForm.page=1
				this.searchForm.size=num
				this.init()
			},
			handleCurrentChange(num){
				this.searchForm.page=num
				this.init()
			},
			handleSelectionChange(e){
				// 多选
				console.log(e)
				let list=[]
				e.forEach((item,index)=>{
					list.push(item.id)
				})
				this.selectIds=list
			},
			selectAll(e){
				if(e){
					let list=[]
					this.tableData.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
						list.push(row.id)
					});
					this.selectIds=list
				}else{
					this.$refs.multipleTable.clearSelection();
					this.selectIds=[]
				}
			},
			handleChange(e){
			},
			init(){
				let data={}
				data=this.searchForm
				let length=this.value.length
				if(length>0){
					data.provinceId=this.value[0]
				}
				if(length>1){
					data.cityId=this.value[1]
				}
				if(length>2){
					data.areaId=this.value[2]
				}
				this.$axios.post(this.$url+"mEnter/list",data).then(res=>{
					if(res.code==100){
						this.tableData=res.info.rows
						this.total=res.info.total
					}
				})
			},
			getType(){
				// 获取所属行业
				this.$axios.post(this.$url+'mDict/getByTypeCode',{
					typeCode:'05'
				}).then(res=>{
					if(res.code==100){
						this.typeList=res.info
					}
				})
				// 获取省市区数据
				this.$axios.post(this.$url+'mDict/areaTree').then(res=>{
					if(res.code==100){
						this.areaList=res.info
					}
				})
			},
			deleteInfo(row){
				// 删除 
				 let ids=""
				 // let idList=[]
				if(row){
					ids=row.id+''
				}else{
					if(this.selectIds.length!=0){
						ids=this.selectIds.join(',')
					}
				}
				this.$confirm('是否要删除企业?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					this.$axios.post(this.$url+'mEnter/delete',{
						ids:ids
					}).then(res=>{
						if(res.code==100){
							this.init()
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						}
					})				  
				}).catch(() => {
				  this.$message({
					type: 'info',
					message: '已取消'
				  });          
				});
			},
			changeStauts(row,type){
				// 冻结激活
				let ids=''
				let isShelf=null
				if(type||type==0){
					// 多个
					if(this.selectIds.length!=0){
						ids=this.selectIds.join(',')
						isShelf=type
					}
				}else{
					ids=row.id+''
					isShelf=row.isShelf==0?1:0
				}
				this.$confirm('是否要'+(isShelf==1?'激活':'冻结')+'企业?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					this.$axios.post(this.$url+'mEnter/shelf',{
						ids:ids,
						shelf:isShelf
					}).then(res=>{
						if(res.code==100){
							this.init()
							this.$message({
								type: 'success',
								message: '操作成功!'
							});
						}
					})				  
				}).catch(() => {
				  this.$message({
					type: 'info',
					message: '已取消'
				  });          
				});
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
	.search{
		margin:20px 0;
		.el-button,.el-select,.el-input,.el-cascader{
			float: left;
			width: 120px;
			margin-right: 10px;
		}
		.el-select{
			width: 150px;
		}
		.el-cascader{
			width: 220px;
		}
		.el-input{
			width: 300px;
		}
	}
	.tablebtns{
		.el-button{
			border-left: 1px solid #0000FE;
			padding:0;
			border-radius: 0;
			padding-left: 10px;
		}
		.el-button:first-child{
			border: 0;
			padding-left: 0;
		}
	}
	.block{
		margin-top: 20px;
		.el-pagination{
			float: right;
		}
		.batch{
			float: left;
			.tablebtns,.el-checkbox{
				float: left;
				margin-right: 10px;
			}
		}
	}
</style>
