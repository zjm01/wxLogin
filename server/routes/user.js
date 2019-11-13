var express = require('express');//加载模块

var router = express.Router();//引用router

var request = require('request');
var querystring = require('querystring');
//引入微信授权
var wechat = require('wechat');
var OAuth = require('wechat-oauth');
var wxAuth = require('./wxAuth');
//引用数据模块
var mongoose = require('mongoose');
var Users = require('../models/users')

var settoken = require('../config/token_vertify.js');
//验证码
var svgCaptcha = require('svg-captcha');
var session = require('express-session');
//连接数据库
mongoose.connect('mongodb://localhost:27017/eportal', {useNewUrlParser: true})

//下面就进行判断，（连接成功，连接失败，连接断开）

mongoose.connection.on('connected', function () {

console.log("连接成功");

})

mongoose.connection.on('error', function () {

console.log("连接失败");

})

mongoose.connection.on('disconnected', function () {

console.log("断开连接");
});
function randomCode(length) {
    var chars = ['0','1','2','3','4','5','6','7','8','9'];
    var result = ""; //统一改名: alt + shift + R
    for(var i = 0; i < length ; i ++) {
        var index = Math.ceil(Math.random()*9);
        result += chars[index];
    }
    return result;
}
var smsCode='123456';
router.get('/getCode',function(req, res, next){
    var phone=req.param('phone');
    var code=randomCode(7);
    Users.find({ 'tel': phone }, function (err, docs) {
        if(err){
            console.log("哈哈出错啦")
        }else{
            if(docs.length){
             // var queryData = querystring.stringify({
    //     "mobile": phone,  // 接受短信的用户手机号码
    //     "tpl_id": "173165",  // 您申请的短信模板ID，根据实际情况修改
    //     "tpl_value":`#code#=${code}`,  // 您设置的模板变量，根据实际情况修改
    //     "key": "80658292f6b8f1bcb053eb6eba45d1a2",  // 应用APPKEY(应用详细页查询)
    // });
    // var queryUrl = 'http://v.juhe.cn/sms/send?'+queryData;
    // request(queryUrl, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         console.log(body) // 打印接口返回内容
    //  smsCode=code
    //         var jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
    //         console.log(jsonObj)
    //     } else {
    //         console.log('请求异常');
    //     }
    // })  
    res.send({tel:docs[0].tel})
        }else{
            res.send({mes:"不好意思，您暂不是用户"})
        }
    }
    });   
});
//验证图片验证码
router.post("/login_captcha",function(req,res,next){
     var captcha=req.body.captcha ;
     if(captcha!=req.session.codes){
        return res.json({
            status:503,
            msg:"验证码错误"
        })
     }else{
        return res.json({
            status:200,
            msg:""
        })
     }
})
router.post('/login_code', function (req, res, next) {
    var phone = req.body.phone;
    var code = req.body.code;
    var captcha=req.body.captcha ;
    if (smsCode!=code) {
        return res.send({
            code: 1, 
            msg: '短信验证码错误'
        });
      }else{
        settoken.setToken(phone).then((data)=>{
            return res.json({ 
                token: 'Bearer '+data,
                code: 0, 
                data: 
                {_id: 2,
                phone: phone
                }
                 });
        })
      }
    
})
//验证码登录后没有绑定微信，点击微信绑定的时候调用此接口
//验证码登录后没有绑定微信，点击微信绑定的时候调用此接口
router.post('/getToken',function(req,res,next){
    var phone=req.body.phone;
    var url=req.body.url;
    var reurl=req.body.reurl;
    //获取token
    var options = {
        url: url,
        method: 'GET'
  };
  function callback(error, response, data) {
      if(error){
          console.log("出错啦")
      }else{
         var access_token=JSON.parse(response.body).access_token;
          var openid=JSON.parse(response.body).openid;
          var uri=`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
          var options = {
            url: uri,
            method: 'GET'
      };
      function cal(err,ress){
          if(err){
              console.log(err)
          }else{  
            var data={
                tel:phone,
                openid: JSON.parse(ress.body).openid,
                nickname: JSON.parse(ress.body).nickname,
                sex: JSON.parse(ress.body).sex,
                headimgurl: JSON.parse(ress.body).headimgurl
               } 
           Users.updateOne({"tel":phone},data,function(err,res){
               if(err){
                   console.log(err)
               }else{
               }
           })
          
    return res.send(Object.assign({tel:phone},JSON.parse(ress.body))); 
          }
      }
      request(options, cal);
      }
}
 request(options, callback);
 
})
//判断是否有权限扫码
router.post('/isAuth',function(req,res,next){
    var url=req.body.url;
    var reurl=req.body.reurl;
    //获取token
    var options = {
        url: url,
        method: 'GET'
  };
  function callback(error, response, data) {
      if(error){
          console.log("出错啦")
      }else{
         var access_token=JSON.parse(response.body).access_token;
          var openid=JSON.parse(response.body).openid;
          var uri=`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
          var options = {
            url: uri,
            method: 'GET'
      };
      function cal(err,ress){
          if(err){
              console.log(err)
          }else{  
            var openid=JSON.parse(ress.body).openid;
             
    return JSON.parse(ress.body)
          }
      }
      Users.findOne({openid:openid}, function(err, doc) {
        if(err){
            console.log(err)
        }else{
           
            if(doc){
                console.log(doc)
                request(options, cal);
                return res.send( {
                    status:"200",
                    msg:"老用户登录成功",
                    result:doc
                   
                }) 
            }else{
                return res.send({
                    status: '201',
                    msg: '请使用验证码登录绑定微信',
                    result:{}
                }) 
            }
  
        }

    })
     
      }
}
 request(options, callback);
 
})
//获取用户信息
router.get('/userInfo',function(req,res){
    var phone=req.param('phone');
    Users.find({ 'tel': phone },function(err,docs){
        if(err){
            console.log('错误')
        }else{
            console.log(docs[0])
            res.send({data:docs[0]})

        }
    })
})
router.get('/getQrCode',wxAuth.getCode);
router.get('/getAccess',wxAuth.getAccessToken)
router.get('/getUserInfo',wxAuth.getUserInfo)
/*
  一次性图形验证码
   */
  router.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.create({
      ignoreChars: '0o1l',
      noise: 2,
      color: true
    });
    // codes = captcha.text.toLowerCase();
    req.session.codes=captcha.text.toLowerCase();
    res.type('svg');
    res.send(captcha.data)
  });
module.exports = router;
//暴露路由
