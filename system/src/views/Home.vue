<template>
  <div class="home">
	<el-container>
	  <el-header>
		<el-menu
		  :default-active="activeIndex2"
		  class="el-menu-demo cl"
		  mode="horizontal"
		  @select="handleSelect"
		  background-color="#545c64"
		  text-color="#fff"
		  active-text-color="#ffd04b">
		  <h3>人力资源后台管理系统</h3>
		  <el-menu-item v-for="(item,index) in header" 
		  :index="item.index"
		  >{{item.title}}</el-menu-item>
		</el-menu> 
	  </el-header>
	  <el-container>
	    <el-aside width="200px">
			<div class="userinfo cl">
				<div class="txbox">
					<img src="../assets/img/tx.jpg" alt="">
				</div>
				<div class="info">
					<p>{{userInfo.name}}</p>
					<span @click="logOut()">退出</span>
				</div>
			</div>
			<div class="nav">
				<div :style="navIndex[1]=='1'?'background:#ccc;':''" @click="goAdd(navList[0])">
					<img v-if="navIndex[1]=='1'" src="../assets/img/san.png" alt="">
					{{navList[0].title}}
				</div>
				<p :style="navIndex[1]=='2'?'background:#ccc;':''" @click="goAdd(navList[1])">{{navList[1].title}}</p>
			</div>
		</el-aside>
	    <el-main>
			<router-view/>
		</el-main>
	  </el-container>
	</el-container>
  </div>
</template>

<script>
export default {
  data(){
    return{
      isLogin:true,
	  userInfo:{},
	  activeIndex2:'1',
	  navIndex:'11',
	  navList:[],
	  // header:[],
	  headerEnt:[
		  {
			index:'1',
			path:'enterpriseIndex',
			title:'企业管理',
			children:[{
				path:'enterpriseIndex',
				index:'11',
				title:'企业管理',
			},{
				path:'enterprise',
				index:'12',
				title:'新增企业', 
			}]
		  },
		  {
			index:'2',
			path:'postIndex',
			title:'岗位管理',
			children:[{
				 path:'postIndex',
				 index:'21',
				 title:'岗位管理',
			},{
				path:'post',
				index:'22',
				title:'新增岗位', 
			}]
		  }
	  ],
	  header:[
		  {
			  index:'1',
			  path:'enterpriseIndex',
			  title:'企业管理',
			  children:[{
				  path:'enterpriseIndex',
				  index:'11',
				  title:'企业管理',
			  },{
				 path:'enterprise',
				 index:'12',
				 title:'新增企业', 
			  }]
		  },
		  {
			index:'2',
			path:'postIndex',
			title:'岗位管理',
			children:[{
				 path:'postIndex',
				 index:'21',
				 title:'岗位管理',
			},{
				path:'post',
				index:'22',
				title:'新增岗位', 
			}]
		  },
		  {
			index:'3',
			path:'jurisdictionIndex',
			title:'权限管理',
			children:[{
				 path:'jurisdictionIndex',
				 index:'31',
				 title:'权限管理',
			},{
				path:'jurisdiction',
				index:'32',
				title:'新增管理员', 
			}]
		  },
		  {
			index:'4',
			path:'areaIndex',
			title:'区域管理',
			children:[{
				 path:'areaIndex',
				 index:'41',
				 title:'区域管理',
			},{
				path:'area',
				index:'42',
				title:'新增区域', 
			}]
		  },
		  {
			index:'5',
			path:'bannerIndex',
			title:'广告管理',
			children:[{
				 path:'bannerIndex',
				 index:'51',
				 title:'广告管理',
			},{
				path:'banner',
				index:'52',
				title:'新增广告', 
			}]
		  },
		  {
			index:'6',
			path:'dictionariesIndex',
			title:'字典管理',
			children:[{
				 path:'dictionariesIndex',
				 index:'51',
				 title:'字典管理',
			},{
				path:'dictionaries',
				index:'52',
				title:'新增字典', 
			}]
		  }
	  ]
    }
  },
  created(){
	if(sessionStorage.navIndex){
		this.handleSelect(sessionStorage.navIndex)
	}else{
		this.handleSelect('1')
	}
    if(!this.isLogin){
    }
	let userInfo=sessionStorage.userInfo
	if(userInfo){
		this.userInfo=JSON.parse(userInfo)
		if(this.userInfo.role!=1){
			this.header=this.header.slice(0, 2)
		}
	}else{
		this.$router.push({name:"login"})
	}
	this.getTypeList()
  },
  methods:{
	handleSelect(index,indexpath){
		this.activeIndex2=index
		this.navList=this.header[index-1].children
		sessionStorage.navIndex=index
		if(sessionStorage.routerIndex&&!indexpath){
			// console.log("12111")
			this.navIndex=sessionStorage.routerIndex
		}else{
			this.navIndex=index+'1'
			this.$router.push({name:this.navList[0].path})
		}
		
	},
	goAdd(nav){
		this.navIndex=nav.index
		this.$router.push({name:nav.path})
		sessionStorage.routerIndex=this.navIndex
	},		
	getTypeList(){
		this.$axios.post(this.$url+'mDict/getType').then(res=>{
			if(res.code==100){
				// 获取字典信息存到store里面
				this.$store.dispatch("changeInfo",res.info)
			}
		})
	},
	logOut(){
		sessionStorage.userInfo=''
		this.$router.push({name:'login'})
	},
  }, 
  beforeRouteUpdate (to, from, next) {
    // console.log("路由监听")
    // console.log(form)
    let urlName=to.name
	if(urlName.indexOf('Index')==-1&&!to.query.id){
		this.navIndex=this.activeIndex2+'2'
	}
	next()
  }
}
</script>
<style lang="scss">
	.home{
		min-width: 900px;
	}
.el-header{
	padding:0 !important;
	h3{
		color: rgb(255, 208, 75);
		float: left;
		line-height: 60px;
		padding: 0 10px;
		letter-spacing: 4px;
		font-size: 20px;
	}
	.el-dropdown{
		color: #fff;
		float: right;
		margin-right: 20px;
		.el-dropdown-link{
			line-height: 60px;
		}
	}
}
.el-aside{
	background-color: #eee;
	height: 100%;
}
.userinfo{
	padding: 20px;
	padding-right: 0;
	height: 60px;
	border-bottom: 1px solid #eee;
	div{
		float: left;
	}
	.txbox{
		width: 70px;
		height: 70px;
		border-radius: 50%;
		overflow: hidden;
		img{
			width: 100%;
			height: 100%;
		}
	}
	.info{
		width: 100px;
		padding-left:10px;
		p{
			line-height: 40px;
		}
		span{
			color: #666;
			font-size: 14px;
		}
	}
}
.nav{
	text-align: center;
	div{
		line-height: 50px;
		font-size: 16px;
		border-bottom: 1px solid #ccc;
		border-top: 1px solid #ccc;
		position: relative;
		overflow: hidden;
		img{
			position: absolute;
			top: 0;
			bottom: 0;
			right: -10px;
			margin: auto;
		}
	}
	p{
		margin-top: 10px;
		line-height: 30px;
		font-size: 14px;
	}
}
</style>

