<template>
	<div>
		<h1 class="cl">管理员列表
		 <el-button type="primary" @click="goAdd()">添加管理员</el-button>
		</h1>
		<div class="search cl">
			<el-input
			  placeholder="请输入管理员名字"
			  v-model="searchForm.name"
			  clearable>
			</el-input>
			<el-select v-model="searchForm.isShelf" placeholder="是否禁用">
			  <el-option label="全部" value=""></el-option>
			  <el-option label="禁用" value="0"></el-option>
			  <el-option label="正常" value="1"></el-option>
			</el-select>
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
			      label="管理员名字"
			      width="100">
			    </el-table-column>
				<el-table-column
				  prop="phone"
				  label="联系方式"
				  width="150">
				</el-table-column>
				<el-table-column
				  prop="amount"
				  label="账号">
				</el-table-column>
			    <el-table-column
			      prop="password"
			      label="登录密码"
				   width="150">
			    </el-table-column>
				<el-table-column
				  prop="role"
				  label="角色"
				  width="180">
				  <template slot-scope="scope">
				  		<p>{{scope.row.role==1?'系统管理员':(scope.row.role==2?'企业':'')}}</p>
				  </template>
				</el-table-column>	
				<el-table-column
				  prop="createTime"
				  label="创建时间"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="isForbidden"
				  label="账号状态"
				  width="180">
				  <template slot-scope="scope">
					<p>{{scope.row.isForbidden==1?'正常':'禁用'}}</p>
				  </template>
				</el-table-column>				
				<el-table-column
				  prop="forbiddenTime"
				  label="封号时间"
				  width="180">				 
				</el-table-column>							
				<el-table-column
				  prop="name"
				  label="操作"
				  width="240">
				  <template slot-scope="scope">
					  <div class="tablebtns">
						  <el-button type="text" @click="deleteUser(scope.row)">删除</el-button>
						  <el-button type="text" @click="lookInfo(scope.row)">查看详情</el-button>
						  <el-button type="text" @click="changeForbidden(scope.row)">{{scope.row.isForbidden==1?'禁用':'解禁'}}</el-button>
						  <!-- <el-button type="text" v-if="scope.row.isForbidden!=1">解禁</el-button> -->
					  </div>
				  </template>
				</el-table-column>
			  </el-table>
			  <div class="block cl">
				  <div class="batch">
					<el-checkbox @change="selectAll" v-model="SelectAll">全选</el-checkbox>  
					<div class="tablebtns">
					  <el-button type="text" @click="deleteUser()">删除</el-button>
					  <el-button type="text" @click="changePwd()">重置密码</el-button>
					  <el-button type="text" @click="changeForbidden(0,1)">解封</el-button>
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
					isShelf:'',
					size:10,
					page:1,
				},
				tableData:[],
				selectIds:[],
				total:null,
				SelectAll:false
			}
		},
		created(){
			this.init()
		},
		methods:{
			goAdd(){
				this.$router.push({name:'jurisdiction'})
			},
			lookInfo(row){
				// 查看详情，修改
				this.$router.push({name:'jurisdiction',query:{id:row.id}})
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
			handleSelectionChange(e){
				// 多选
				console.log(e)
				let list=[]
				e.forEach((item,index)=>{
					list.push(item.id)
				})
				this.selectIds=list
			},
			init(){
				this.$axios.post(this.$url+'mmanager/list',this.searchForm).then(res=>{
					if(res.code==100){
						this.tableData=res.info.rows
						this.total=res.info.total
					}
				})
			},
			changeForbidden(row,type){
				// 是否禁用
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
					isShelf=row.isForbidden==0?1:0
				}
				this.$confirm('是否要'+(isShelf==1?'解封':'禁用')+'账号?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					this.$axios.post(this.$url+'mmanager/shelf',{
						ids:ids,
						isShelf:isShelf
					}).then(res=>{
						if(res.code==100){
							this.init()
							this.$message({
								type: 'success',
								message: '修改成功!'
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
			deleteUser(row){
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
				this.$confirm('是否要删除账号?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					this.$axios.post(this.$url+'mmanager/delete',{
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
			changePwd(){
				// 重置密码
				let ids=''
				if(this.selectIds.length>0){
					ids=this.selectIds.join(',')
				}
				this.$confirm('是否要重置账号密码?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					this.$axios.post(this.$url+'mmanager/reset',{
						ids:ids
					}).then(res=>{
						if(res.code==100){
							this.init()
							this.$message({
								type: 'success',
								message: '重置成功!'
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
		.el-button,.el-select,.el-input{
			float: left;
			width: 120px;
			margin-right: 10px;
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
