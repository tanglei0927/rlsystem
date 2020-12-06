// const baseUrl='http://192.168.0.105:3326/' 
const baseUrl='https://humanresource.runfkj.com/'
// const baseUrl='http://zhixiang.runfkj.com/'

const http={}
const headers={}
http.reqUrl=baseUrl
http.httpReq=(url,data)=>{	
	return uni.request({
		url:baseUrl+url,
		method:'GET',
		data:data,
		header:headers,		
	}).then(res=>{
		return res[1].data
	}).catch(parmas=>{
		uni.showToast({
			icon:'none',
			title:JSON.stringify(parmas),
			success:(res)=>{				
				
			}
		})
	})
}

http.get=(url,data)=>{
	var token=''
	var userInfo=uni.getStorageSync('userinfo')
	if(userInfo){		
		userInfo=JSON.parse(userInfo)
		token=userInfo.token		
	}
	data['token']=token
	return uni.request({
		url:baseUrl+url,
		method:'GET',
		data:data,
		header:headers,		
	}).then(res=>{
		return res[1].data
	}).catch(parmas=>{
	})
}
http.post=(url,data,type)=>{
	// var token=''
	var userInfo=uni.getStorageSync('userinfo')
	if(userInfo){
		userInfo=JSON.parse(userInfo)
	}
	if(type){
		headers['Content-type']=type
	}else{
		headers['Content-type']="application/x-www-form-urlencoded"
	}
	return uni.request({
		url:baseUrl+url,
		method:'POST',
		data:data,
		header:headers,		
	}).then(res=>{
		// console.log('token响应拦截11111')
		return res[1].data
	}).catch(parmas=>{
		// console.log('token响应拦截22222')
		// console.log(parmas)
	})
}

//解析时间
http.timeJx=(createTime)=>{
        let time = new Date();
        time.setTime(createTime);
        var timeStr="";
        timeStr=time.getFullYear()+"-"+(time.getMonth()+1<10?"0"+(time.getMonth()+1):(time.getMonth()+1))
        timeStr+="-"+(time.getDate()<10?"0"+time.getDate():time.getDate())+" ";
        return timeStr
}

export default http