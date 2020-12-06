import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	  dictionaries:null
  },
  mutations: {
	  // 更改state的值，actions  =>commit
	changeInfo(state,info){
		state.dictionaries=info
	}
  },
  actions: {
	 // 视图 dispathch过来
	changeInfo(context,info){
		context.commit("changeInfo",info)
	}
  },
  modules: {
  }
})
