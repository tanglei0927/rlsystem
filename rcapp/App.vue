<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@charset "utf-8";
	/********** 初始化样式 ***********/
	body,p,h1,h2,h3,h4,h5,h6,ul,ol,dl,dd,input,textarea{padding: 0;margin: 0;}
	body{background-color: #f4f4f4;}
	a{text-decoration: none;color: inherit;}
	li{list-style: none;}
	img{vertical-align: middle;border: 0;}
	input,textarea{outline: none;background: none;}
	/* input,textarea,select{color: inherit;font-size: inherit;font-family: inherit;} */
	textarea{resize:none;}
	input[type="button"],input[type="submit"],input[type="reset"]{cursor: pointer;}
	/************** 公共样式 ****************/
	html{font-family: "微软雅黑","宋体",Arial;font-size: 12px;color: #000;}
	.w{width: 1170px;margin-left: auto;margin-right: auto;}
	.sl{white-space: nowrap;overflow: hidden;text-overflow:ellipsis;}
	.cl:after{content: "";display: block;clear: both;height:0;overflow:hidden;visibility: hidden;}
	.cl{zoom: 1;}
	/* a:hover{color: #52c9c3;} */
	button::after{
		border: 0;
	}
</style>
