<template>
  <div>
    ghj
  </div>
</template>

<script>
import axios from 'axios'
  export default {
    name: 'authredirect',
    created() {
      // 锚点模式无法使用，须针对锚点改写
      // const hash = window.location.search.slice(1)
      // window.opener.location.href = window.location.origin + '/login' + hash
       const hash = window.location.hash.slice(14)
    //  window.opener.location.href ='http://localhost/#/personal' + hash
    if(location.href.indexOf("?")!=-1){
       var code=location.href.split("?")[1];
    code=code.split('=')[1];
    code=code.split("&")[0];
    }
    if(localStorage.getItem('code') && localStorage.getItem('code')==code){
      this.$router.replace('/personal')
    }else{
 localStorage.setItem('code',code);
   axios.get('api/getAccess',{
        params:{
          code:code
        }
      }).then(res=>{
        var data=res.data
        console.log(res)
        localStorage.setItem("access_token",data.access_token);
        localStorage.setItem('unionid',data.unionid)
        localStorage.setItem('openid',data.openid)
        this.$router.replace('/personal?wx=1')
      })
    }
    console.log(code)
       window.close()
    }
  }
</script>
