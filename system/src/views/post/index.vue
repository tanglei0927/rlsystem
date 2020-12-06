<template>
	<div>
		<h1 class="cl">岗位列表
		 <el-button type="primary" @click="goAdd()">添加岗位</el-button>
		</h1>
		<div class="search cl">
			<el-input
			  placeholder="请输入岗位名"
			  v-model="searchForm.name"
			  clearable>
			</el-input>
			<el-select v-model="searchForm.isShelf" placeholder="请选择活动区域">
			  <el-option label="岗位状态" value=""></el-option>
			  <el-option label="下架" value="0"></el-option>
			  <el-option label="上架" value="1"></el-option>
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
			      label="岗位名称"
			      width="180">
			    </el-table-column>
				<el-table-column
				  prop="name"
				  label="薪资待遇(千元)"
				  width="150">
				  <template slot-scope="scope">
					<p>{{scope.row.treatmentStart}}--{{scope.row.treatmentEnd}}</p>  
				  </template>
				</el-table-column>
			    <el-table-column
			      prop="address"
			      label="招聘地区"
				  width="180">
				  <template slot-scope="scope">
				  	<p>{{scope.row.province}}--{{scope.row.city}}--{{scope.row.area}}</p>  
				  </template>
			    </el-table-column>
				<el-table-column
				  prop="requirements"
				  label="经验要求(年)"
				  width="120">
				</el-table-column>
				<el-table-column
				  prop="education"
				  label="学历要求"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="enterpriseName"
				  label="所属企业"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="keyWord"
				  label="岗位关键词"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="industry"
				  label="所属行业"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="recruitersNumber"
				  label="招聘人数"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="createUser"
				  label="岗位发布人"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="createTimeStr"
				  label="发布时间"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="isShelf"
				  label="岗位状态"
				  width="180">
				<template slot-scope="scope">
					<p>{{scope.row.isShelf==1?'上架':'下架'}}</p>
				</template>
				</el-table-column>
				<el-table-column
				  prop="isShelfTimeStr"
				  label="下架时间"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="name"
				  label="操作"
				  width="240">
				  <template slot-scope="scope">
					  <div class="tablebtns">
						  <el-button type="text"  @click="deleteInfo(scope.row)">删除</el-button>
						  <el-button type="text" @click="editInfo(scope.row)">查看详情</el-button>
						  <el-button type="text" @click="changeStauts(scope.row)">{{scope.row.isShelf==0?'上架':'下架'}}</el-button>
					  </div>
				  </template>
				</el-table-column>
			  </el-table>
			  <div class="block cl">
				  <div class="batch">
					<el-checkbox @change="selectAll" v-model="SelectAll">全选</el-checkbox>  
					<div class="tablebtns">
					  <el-button type="text" @click="deleteInfo()">删除</el-button>
					  <el-button type="text" @click="changeStauts(0,1)">上架</el-button>
					  <el-button type="text"  @click="changeStauts(0,0)">下架</el-button>
					</div>
				  </div>
			      <el-pagination
			        @size-change="handleSizeChange"
			        @current-change="handleCurrentChange"
			        :current-page="searchForm.pageNum"
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
				total:null,
				SelectAll:false,
				selectIds:[]
			}
		},
		created(){
			let userInfo=sessionStorage.userInfo
			if(userInfo){
				userInfo=JSON.parse(userInfo)
				this.searchForm.managerId=userInfo.id
			}
			this.init()
		},
		methods:{
			goAdd(){
				this.$router.push({name:'post'})
			},
			editInfo(row){
				this.$router.push({name:'post',query:{id:row.id}})
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
			init(){
				this.$axios.post(this.$url+'mpsot/list',this.searchForm).then(res=>{
					if(res.code==100){
						this.tableData=res.info.rows
						this.total=res.info.total
					}
				})
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
				this.$confirm('是否要'+(isShelf==1?'上架':'下架')+'岗位信息?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					this.$axios.post(this.$url+'mpsot/shelf',{
						ids:ids,
						isShelf:isShelf
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
				this.$confirm('是否要删除岗位信息?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					this.$axios.post(this.$url+'mpsot/delete',{
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
