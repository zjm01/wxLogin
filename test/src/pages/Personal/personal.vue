<template>
    <div>
<!-- <form action="/profile" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" />
  <input type="submit" value="Submit">
</form> -->
      <img :src="userInfo.headimgurl" alt="">
      fghjkl
        <button v-show="isShow" @click="wechatHandleClick('wechat')">微信绑定</button>
        <button @click="goOut">注销登录</button>
      </div>
</template>
<script>
import axios from 'axios'
  import {mapState,mapActions} from 'vuex'
export default {
    data(){
        return{
            isShow:true,
            userInfo:{}
        }
    },
    created(){ 
        this.hide()
    },
    mounted(){
      this.getUser()
    },
    methods:{
      getUser(){
        if(this.$route.fullPath.indexOf("id") != -1){
           var id= this.$route.fullPath.split("?")[1].split('=')[0];
        }
        if(this.$route.fullPath.indexOf("auth") != -1){
          var auth= this.$route.fullPath.split("?")[1].split('=')[0];
        }
         if(this.$route.fullPath.indexOf("wx") != -1){
          var wx= this.$route.fullPath.split("?")[1].split('=')[0];
        }
        if(id=='id'&&localStorage.getItem('tel')){// id是从首页进来
          axios.get('api/userInfo',{params:{
        phone:localStorage.getItem('tel')
        }
        }).then(res=>{
        if(res.data.data.openid){
          this.isShow=false
          this.$store.dispatch('getUserInfo',res.data.data)
          localStorage.setItem("userInfo",res.data.data)
           this.userInfo=res.data.data;
        }
        })
        }else if(auth=='auth'){
          //微信扫码登录
          var openid=localStorage.getItem('openid');
          var headimgurl=localStorage.getItem('headimgurl');
          var userInfo={
            openid,
            headimgurl
           }
          this.userInfo=userInfo
          this.isShow=false

        }
        else if(wx=='wx'){
          //微信绑定
        var access_token= localStorage.getItem('access_token')
       var openid=localStorage.getItem('openid')
       var tel=localStorage.getItem('tel')
       console.log("access",access_token)
      var  params={
            access_token :access_token ,
            openid :openid,
            tel:tel
          }
          console.log(params)
        axios.get('api/getUserInfo',{
          params
        }).then(res=>{
          console.log("909890")
          console.log(res.data.result)
          this.userInfo=res.data.result;
           this.isShow=false;
        })
        }else{
          if(localStorage.getItem('openid') && localStorage.getItem('headimgurl')){
            var openid=localStorage.getItem('openid');
          var headimgurl=localStorage.getItem('headimgurl');
          var userInfo={
            openid,
            headimgurl
           }
          this.userInfo=userInfo
          this.isShow=false

          }else if(localStorage.getItem('userinfo')){
            this.userInfo=localStorage.getItem('userinfo')
              this.isShow=false;
          }

        }
      },
        hide(){
        },
        goOut(){
           var storage = window.localStorage;
          storage.clear()
          this.$router.replace('/')
        },
         wechatHandleClick(thirdpart) {
        let params={
      redirect_uri:'http://localhost/#/authredirect'
    }
      axios.get('api/getQrCode',{params}).then(res=>{
        console.log(res.data.url)
        var url = res.data.url;
        location.href=url;
      })
    }   
    }
}

</script>

