<template>
	<div>
		<h1 class="cl">字典列表
		 <el-button type="primary" @click="goAdd()">添加字典</el-button>
		</h1>
		<div class="search cl">
			<el-select class="typeselect" v-model="searchForm.typeCode" placeholder="请选择字典类型">
			  <el-option v-for="(item,index) in typeList" :label="item.name" :value="item.typeCode"></el-option>
			</el-select>
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
			      prop="dictName"
			      label="名称"
			      width="180">
			    </el-table-column>
				<el-table-column
				  prop="createUser"
				  label="发布人"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="createTime"
				  label="发布时间"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="updateUser"
				  label="修改人"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="updateTime"
				  label="修改时间"
				  width="180">
				</el-table-column>
				<!-- <el-table-column
				  prop="isDelete"
				  label="是否可用"
				  width="180">
				  <template slot-scope="scope">
					  <p>{{scope.row.isDelete=='0'?'不可用':'可用'}}</p>
				  </template>
				</el-table-column>		 -->
				<el-table-column
				  prop="name"
				  label="操作"
				  width="240">
				  <template slot-scope="scope">
					  <div class="tablebtns">
						  <el-button type="text" @click="editInfo(scope.row)">编辑</el-button>
						  <!-- <el-button type="text">查看详情</el-button> -->
						  <el-button type="text" @click="deleteDic(scope.row)">删除</el-button>
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
					isDelete:'',
					page:1,
					size:10,
				},
				tableData:[],
				total:null,
				SelectAll:false,
				typeList:[]
			}
		},
		mounted(){
			this.init()
			let typelist=[]
			this.typeList=[]
			setTimeout(()=>{
				typelist=this.$store.state.dictionaries
				typelist.forEach((item,index)=>{
					// item.typeCode!="01"&&item.typeCode!="02"&&
					if(item.typeCode!="03"){
						this.typeList.push(item)
					}
				})
			},2000)
		},
		methods:{
			goAdd(){
				this.$router.push({name:'dictionaries'})
			},
			editInfo(row){
				this.$router.push({name:'dictionaries',query:{
					id:row.id
				},params:{
					typeCode:row.typeCode,
					dictName:row.dictName,
					parentCode:row.parentCode
				}})
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
				this.$axios.post(this.$url+"mDict/list",this.searchForm).then(res=>{
					if(res.code==100){
						this.tableData=res.info.rows
						this.total=res.info.total
					}
				})
			},
			deleteDic(row){
				// 删除
				this.$confirm('是否要删除字典：'+row.dictName+'?', '提示', {
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
		.el-select:first-child{
			width: 180px;
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
