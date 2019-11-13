import axios from 'axios'
//请求拦截
axios.interceptors.request.use(config=>{
    var eletoken=localStorage.getItem('eletoken');
    if(eletoken){
        config.headers.authorization=eletoken
    }
    return config;
},error=>{
    return Promise.reject(error)
})
//响应拦截
axios.interceptors.response.use(response=>{
    return response

},error=>{
    const msg= error.response;
    if(msg){
        localStorage.removeItem("eltoken")
        this.$router.push("/");   
    }
    return Promise.reject(error)
})
export default axios