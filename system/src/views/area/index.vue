<template>
	<div>
		<h1 class="cl">区域列表
		 <el-button type="primary" @click="goAdd()">添加区域</el-button>
		</h1>
		<div class="search cl">
			<el-input
			  placeholder="请输入地区名"
			  v-model="searchForm.name"
			  clearable>
			</el-input>
			<!-- <el-select v-model="searchForm.isDelete" placeholder="是否可用">
			  <el-option label="全部" value=""></el-option>
			  <el-option label="不可用" value="0"></el-option>
			  <el-option label="可用" value="1"></el-option>
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
			      prop="province"
			      label="省"
			      width="180">
			    </el-table-column>
				<el-table-column
				  prop="city"
				  label="市"
				  width="180">
				</el-table-column>
			    <el-table-column
			      prop="area"
			      label="区">
			    </el-table-column>
				<el-table-column
				  prop="createUserName"
				  label="发布人"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="createTimeStr"
				  label="发布时间"
				  width="180">
				</el-table-column>	
			<!-- 	<el-table-column
				  prop="isDelete"
				  label="是否可用"
				  width="180">
				  <template slot-scope="scope">
				  	<p>{{scope.row.isDelete=='0'?'不可用':'可用'}}</p>
				  </template>
				</el-table-column>	 -->
				<el-table-column
				  prop="name"
				  label="操作"
				  width="240">
				  <template slot-scope="scope">
					  <div class="tablebtns">
						  <el-button type="text" @click="goEdit(scope.row)">编辑</el-button>
						  <el-button type="text" @click="deleteArea(scope.row)">删除</el-button>
						<!-- <el-button type="text">上架</el-button>
						  <el-button type="text">下架</el-button> -->
					  </div>
				  </template>
				</el-table-column>
			  </el-table>
			  <div class="block cl">
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
					str:'',
					status:'',
					size:10,
					page:1,
				},
				tableData:[],
				total:null,
				SelectAll:false
			}
		},
		created(){
			this.init()
		},
		methods:{
			goAdd(){
				this.$router.push({name:'area'})
			},
			goEdit(row){
				this.$router.push({name:'area',query:{id:row.id}})
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
			init(){
				this.$axios.post(this.$url+'mDict/areaList',this.searchForm).then(res=>{
					if(res.code==100){
						this.tableData=res.info.rows
						this.total=res.info.total
					}
				})
			},
			deleteArea(row){
				// 删除
				this.$confirm('是否要删除区域'+row.area+'?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					this.$axios.post(this.$url+'mDict/delete',{
						id:row.id
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
