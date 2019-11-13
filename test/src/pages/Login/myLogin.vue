<template>
<div class="containers">
  <div class="login_box">
       <div class="text_title">
            <p>系统登录</p>
        </div>
    <form class="login_form">
       
      <div class="phoneNum">
        <label>
          账号
          <span>*</span>
        </label>
        <input type="tel" maxlength="11" placeholder="请输入手机号码" v-model="phone"  />
      </div>
      <div class="codeside">
        <label>
          验证码
          <span>*</span>
        </label>
        <input type="tel" maxlength="8" placeholder="请输入验证码" v-model="captcha" @input="checkCaptcha" />
        <img class="yzcode" src="api/captcha" alt="captcha" @click="getCaptcha" ref="captcha" />
      </div>

      <div class="codeside">
        <label>
          短信验证码
          <span>*</span>
        </label>
        <input type="tel" maxlength="8" placeholder="请输入短信验证码" v-model="code" />
        <!-- <button  class="get_code" >获取验证码</button> -->
        <v-btn
          class="get_code"
          color="#2886c8"
          @click.prevent="getCode"
          :disabled="!isalert"
          :class="{right_phone: isalert && rightPhone}"
        >{{codeTime? `已发送(${codeTime}s)` : '获取验证码'}}</v-btn>
      </div>
      <div class="other_login">
        <span class="tiptext">{{tiptitle}}</span>
        <v-btn class="wx_btn" depressed flat color="white" @click="wechatHandleClick('wechat')">
          <img
            src="../../assets/wx.png"
            alt
            style="width:24px;height:18px;margin-right:3px;vertical-align:middle;"
          />
          <span style="color:#333;">微信</span>
        </v-btn>
      </div>
      <div class="login_btn">
        <v-btn color="#2886c8" class="loginBtn" @click="login">登录</v-btn>
      </div>
    </form>

    <v-alert type="error" v-if="isalert">{{alertText}}</v-alert>
  </div>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode' //解析token
import axios from "axios";
export default {
  data() {
    return {
      userInfo: {},
      isShow: false,
      loginWay: true, // true为短信登陆，false为密码登陆
      codeTime: 0, // 验证码倒计时
      showPwd: false, // 是否显示密码
      phone: "", // 手机号
      code: "", // 短信验证码
      name: "", // 用户名
      pwd: "", // 密码
      captcha: "", // 图形验证码
      alertText: "", // 提示文本
      alertShow: false, // 是否显示提示框
      confirmcode: "",
      tiptitle: "",
      alertText: "",
      isalert:false,
    };
  },

  mounted() {
    this.getCaptcha();
  },
  computed: {
    rightPhone() {
      this.tiptitle=''
      // 手机号正则验证
      var rightPhone=/^1[3-9]\d{9}$/.test(this.phone);
      return rightPhone 
    }
  },
  methods: {
    checkCaptcha() {
      var params = {
        captcha: this.captcha 
      };
      axios.post("/api/login_captcha", params).then(result => {
        this.tiptitle='';
        this.isalert=false;
        console.log(result); 
        if( result.data.msg=='验证码错误'){
        this.tiptitle = result.data.msg;
        }else{
           if(this.rightPhone){
             this.isalert=true;
        }
        }
           
      });
    },
    getCaptcha() {
      // 每次指定的src不同
      this.$refs.captcha.src = "api/captcha?time=" + Date.now();
    },
    getCode() {
      // 如果当前没有计时器
      if (this.codeTime == 0) {
        // 发送ajax请求(向指定手机号发送验证码)
        axios
          .get("api/getCode", {
            params: {
              phone: this.phone
            }
          })
          .then(result => {
            const data = result.data;
            if (data.mes) {
              this.tiptitle=''
              this.isalert = true;
             this.tiptitle = "对不起，您不是当前用户";
            } else if (data.tel) {
                      // 启动倒计时
           this.codeTime = 60;
                this.intervalId = setInterval(() => {
          this.codeTime--;
          if (this.codeTime == 0) {
            clearInterval(this.intervalId);
          }
        }, 1000);
              alert("欢迎");
            }
          });
      }
    },
   wechatHandleClick(thirdpart){
       let params={
      redirect_uri:'http://localhost/#/conctWchat'
    }
      axios.get('api/getQrCode',{params}).then(res=>{
        console.log(res.data.url)
        var url = res.data.url;
        location.href=url;
        // openWindow(url, thirdpart, 540, 540)
      })
    },
    login() {
      if (this.phone == "" || this.code == "" || this.captcha == "") {
        this.tiptitle=''
        this.tiptitle = "内容不能为空";
      } else {
        var userInfo = {
          tel: this.phone
        };
        this.$store.dispatch("getUserInfo", userInfo);
        var params = {
          phone: this.phone,
          code: this.code,
          captcha: this.captcha
        };
        axios.post("api/login_code", params).then(res => {
          if (res.data.code == 0) {
            if (this.codeTime) {
              clearInterval(this.intervalId);
              this.codeTime = 0;
              this.isShow = true;
            }
            
             const decode = jwt_decode(res.data.token);
            localStorage.setItem("eletoken",res.data.token)
             localStorage.setItem("tel",decode.phone)
               //解析token
            //输入验证码成功跳转到首页；
            this.$router.replace('/personal?id=1')
          } else if (res.data.code == 1) {
            this.tiptitle=''
            this.tiptitle = "短信验证码错误";
            clearInterval(this.intervalId);
            this.codeTime = 0;
          }
        });
      }
    }
  }
};
</script>
<style lang="" scoped>
.containers{
    width:100%;
    height:100%;
    background:rgba(40, 134, 200, 0.3);
}
.text_title{
   background: #e0e1e2;
   height:50px;
   line-height:50px;
   color:#333;
}
.text_title p{
 width:100%;
 text-align: center;
 line-height:50px;
 font-weight:500;
 font-size:20px;
}
.login_box {
  width: 640px;
  height: 400px;
  /* border: 1px solid red; */
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background:white;
  padding:0 0 20px 0px;
}
.login_box form {
  /* border:1px solid black; */
  text-align: left;
  font-size: 18px;
  color: #333;
  padding: 40px 0 0 20px;
}
.login_form .phoneNum,
.codeside {
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.login_form label {
  display: inline-block;
  width: 103px;
  font-size: 18px;
  color: #333;
}
.login_form label span {
  color: red;
  font-size: 18px;
}
.login_form input {
  width: 78%;
  height: 100%;
  border: 1px solid gray;
  text-indent: 15px;
  font-size: 16px;
  outline-color: #2886c8;
  border-radius: 5px;
}
.login_form .codeside {
  margin-bottom: 0;
  margin-top: 20px;
}
.codeside img {
  float: right;
  margin-right: 30px;
}
.login_form .codeside input {
  width: 55%;
  margin-right: 20px;
}
.get_code {
  width: 110px;
  height: 40px;
  line-height: 40px;
  background: #2886c8;
  color: #fff;
  border-radius: 10px;
  font-size: 16px;
}
.login_btn {
  width: 80%;
  margin: auto;
  height: 40px;
}
.loginBtn {
  width: 100%;
  height: 100%;
  line-height: 40px;
  color: white;
  font-size: 16px;
}
.wx_btn {
  float: right;
}
.other_login {
  width: 100%;
  padding-right: 40px;
  color: #333 !important;
  overflow: hidden;
}
.tiptext {
  color: red !important;
  line-height: 40px;
  font-size: 16px;
  text-align: center;
  width: 81%;
  display: inline-block;
  padding-left: 40px;
}
.wx_btn image {
  width: 30px;
  height: 20px;
}
.yzcode {
  display: inline-block;
  width: 110px;
  height: 40px;
  /* background:#e0e1e2; */
  border-radius: 5px;
  margin-left: 7 px;
  font-size: px;
}
.right_phone {
  color: white;
}
</style>