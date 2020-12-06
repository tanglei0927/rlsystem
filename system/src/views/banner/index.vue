<template>
	<div>
		<h1 class="cl">广告管理
		 <el-button type="primary" @click="goAdd()">添加广告</el-button>
		</h1>
		<div class="table">
			<!-- 表格 -->
			<el-table
			    :data="tableData"
				ref="multipleTable"
			    stripe
				border
			    style="width: 100%">
			    <el-table-column
			      prop="id"
			      label="序号"
			      width="60">
			    </el-table-column>				
				<el-table-column
				  prop="orde"
				  label="位置"
				  width="180">
				</el-table-column>
			    <el-table-column
			      prop="name"
			      label="广告名"
			      width="180">
			    </el-table-column>
				<el-table-column
				  prop="url"
				  label="图片"
				  width="180">
				  <template slot-scope="scope">
				  	<img class="bannerimg"  :src="$url+'file/readFile/'+scope.row.url" alt="">
				  </template>
				</el-table-column>
			    <el-table-column
			      prop="createUser"
			      label="发布人">
			    </el-table-column>
				<el-table-column
				  prop="createTime"
				  label="发布时间"
				  width="180">
				</el-table-column>	
				<el-table-column
				  prop="status"
				  label="广告状态"
				  width="180">
				  <template slot-scope="scope">
				  	<p>{{scope.row.status==0?'下架':'上架'}}</p>
				  </template>
				</el-table-column>		
				<el-table-column
				  prop="outShelfTime"
				  label="下架时间"
				  width="180">
				</el-table-column>	
				<el-table-column
				  prop=""
				  label="操作"
				  width="240">
				 <template slot-scope="scope">
					  <div class="tablebtns">
						  <el-button type="text" @click="editBanner(scope.row)">编辑</el-button>
						  <!-- <el-button type="text">查看详情</el-button> -->
						  <el-button type="text"  @click="changeBanner(scope.row)">{{scope.row.status==0?'上架':'下架'}}</el-button>
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
					page:1,
					size:10,
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
				this.$router.push({name:'banner'})
			},			
			editBanner(row){
				this.$router.push({name:'banner',query:{id:row.id}})
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
				this.$axios.post(this.$url+"mbanner/list",this.searchForm).then(res=>{
					if(res.code==100){
						this.tableData=res.info.rows
						this.total=res.info.total
					}
				})
			},
			changeBanner(row){
				this.$confirm('是否要'+(row.status==0?'上架':'下架')+'广告图：'+row.name+'?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					this.$axios.post(this.$url+'mbanner/shelf',{
						id:row.id,
						shelf:row.status==0?1:0
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
					message: '取消成功！'
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
	.table{
		margin-top: 20px;
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
	.bannerimg{
		width: 200px;
	}
</style>
