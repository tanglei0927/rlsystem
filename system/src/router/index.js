import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import EnterpriseIndex from "../views/enterprise/index.vue"

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[
      {//企业管理
        path:"/",
        name:'enterpriseIndex',
        component:EnterpriseIndex
      },
      {
		path:'/enterprise',
		name:'enterprise',
		component:()=>import("../views/enterprise/info.vue")
	  },
	  {//岗位管理
	    path:"/postIndex",
	    name:'postIndex',
	    component:()=>import("../views/post/index.vue")
	  },
	  {
		path:'/post',
		name:'post',
		component:()=>import("../views/post/info.vue")
	  },
	  {//权限管理
	    path:"/jurisdictionIndex",
	    name:'jurisdictionIndex',
	    component:()=>import("../views/jurisdiction/index.vue")
	  },
	  {
	  		path:'/jurisdiction',
	  		name:'jurisdiction',
	  		component:()=>import("../views/jurisdiction/info.vue")
	  },
	  {//区域管理
	    path:"/areaIndex",
	    name:'areaIndex',
	    component:()=>import("../views/area/index.vue")
	  },
	  {
		path:'/area',
		name:'area',
		component:()=>import("../views/area/info.vue")
	  },
	  {//广告
	    path:"/bannerIndex",
	    name:'bannerIndex',
	    component:()=>import("../views/banner/index.vue")
	  },
	  {
	  		path:'/banner',
	  		name:'banner',
	  		component:()=>import("../views/banner/info.vue")
	  },
	  {//字典
	    path:"/dictionariesIndex",
	    name:'dictionariesIndex',
	    component:()=>import("../views/dictionaries/index.vue")
	  },
	  {
		path:'/dictionaries',
		name:'dictionaries',
		component:()=>import("../views/dictionaries/info.vue")
	  }
    ]
  },{
	  path:'/login',
	  name:'login',
	  component:()=>import("../views/login.vue")
  }
]

const router = new VueRouter({
  // mode: 'hsas',
  base: process.env.BASE_URL,
  routes
})

export default router
