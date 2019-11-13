<!--
 * @Author: your name
 * @Date: 2019-08-20 17:35:10
 * @LastEditTime: 2019-11-12 23:37:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /my-login/test/src/pages/Login/login.vue
 -->
<template>
  <div class="login">
    <div class>
      <button @click="wechatHandleClick('wechat')">微信登录</button>
    </div>
    <form>
      <div class="tel">
        <input type="tel" maxlength="11" placeholder="手机号" v-model="phone" />
        <button
          :disabled="!rightPhone"
          class="get_verification"
          @click.prevent="getCode"
          :class="{right_phone: rightPhone}"
        >{{codeTime? `已发送(${codeTime}s)` : '获取验证码'}}</button>
      </div>
      <section class="login_verification">
        <input type="tel" maxlength="8" placeholder="验证码" v-model="code" />
      </section>
      <div class="submit">
        <div class="login_submit" @click="login">登录</div>
      </div>
    </form>
  </div>
</template>
<script>
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
      alertShow: false // 是否显示提示框
    };
  },
  mounted() {
    console.log(location.href);
  },

  computed: {
    rightPhone() {
      // 手机号正则验证
      return /^1[3-9]\d{9}$/.test(this.phone);
    }
  },
  methods: {
    getCode() {
      // 如果当前没有计时器
      if (this.codeTime == 0) {
        // 启动倒计时
        this.codeTime = 30;

        this.intervalId = setInterval(() => {
          this.codeTime--;
          if (this.codeTime == 0) {
            clearInterval(this.intervalId);
          }
        }, 1000);
        // 发送ajax请求(向指定手机号发送验证码)
        axios
          .get("api/getCode", {
            params: {
              phone: this.phone
            }
          })
          .then(result => {
            const data = result.data;
            console.log(data);
            if (data.mes) {
              alert("对不起，您不是当前用户");
            } else if (data.tel) {
              alert("欢迎");
            }
          });
      }
    },
    wechatHandleClick(thirdpart) {
      //  const appid = 'wxedf2e99a170c875d'
      const appid = "wxb62c96085ab3b307";
      // const redirect_uri = encodeURIComponent('http://127.0.0.1:8080/#/login') // 該路徑有針對錨點改寫，要注意
      //  const url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_base#wechat_redirect'
      const redirect_uri = encodeURIComponent(
        "odoo.belstar.com.cn/#/conctWchat"
      ); // 該路徑有針對錨點改寫，要注意
      const url =
        "https://open.weixin.qq.com/connect/qrconnect?appid=" +
        appid +
        "&redirect_uri=" +
        redirect_uri +
        "&response_type=code&scope=snsapi_login#wechat_redirect";
        console.log(url)
            openWindow(url, thirdpart, 540, 540);
    },

    login() {
      var userInfo = {
        tel: this.phone
      };
      this.$store.dispatch("getUserInfo", userInfo);
      var params = {
        phone: this.phone,
        code: this.code
      };
      axios.post("api/login_code", params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          if (this.codeTime) {
            clearInterval(this.intervalId);
            this.codeTime = 0;
            this.isShow = true;
          }
          //输入验证码成功跳转到首页；
          this.$router.replace("/personal");
        } else if (res.data.code == 1) {
          alert("验证码不正确");
          clearInterval(this.intervalId);
          this.codeTime = 0;
        }
      });
    }
  }
};
</script>

<style scoped>
.login {
  padding-top: 60px;
  width: 30%;
  margin: 0 auto;
  background: #fff;
}

form input {
  width: 100%;
  height: 100%;
  padding-left: 10px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: 0;
  font: 400 14px Arial;
}
.tel {
  position: relative;
  margin-top: 16px;
  height: 48px;
  font-size: 14px;
  background: #fff;
}
.get_verification {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border: 0;
  color: #ccc;
  font-size: 14px;
  background: transparent;
}
.login_verification {
  margin-top: 16px;
  height: 48px;
  font-size: 14px;
  background: #fff;
}
.submit {
  display: block;
  width: 100%;
  height: 42px;
  margin-top: 30px;
  border-radius: 4px;
  background: #4cd96f;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 42px;
  border: none;
}
.right_phone {
  color: black;
}
</style>


