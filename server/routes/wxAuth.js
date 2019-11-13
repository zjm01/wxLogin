//微信公众号的appId和appSecret配置文件
var Users = require('../models/users')
const request = require('request')
const Host = 'http://example.com'
// exports.getCode = (req, res, next) => {
//     if (req.cookies && req.cookies.openid) {
//         next();
//     } else {
//         console.log(req)
//         let back_url = escape(req.query.back_url);
//         console.log(req.query.back_url)
//         let redirect_url = `http://mall.yizhenjia.com/wxAuth/getUserInfo?back_url=${back_url}`;
//         let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect `;
//         console.log(url);
//         res.redirect(url);
//     }
// }
exports.getCode = (req, res, next) => {
    if (req.cookies && req.cookies.openid) {
        next();
    } else {
        let appid='wx3761a5c916a37844';
        if(req.query.redirect_uri =='http://localhost/#/conctWchat'){
            let redirect_uri  = encodeURIComponent(req.query.redirect_uri );
            let  url = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_login#wechat_redirect';
        console.log(url);
        res.send({url:url}) 
        }else{
        let redirect_uri  = encodeURIComponent(req.query.redirect_uri );
        // const redirect_uri = encodeURIComponent('http://localhost/#/authredirect') 
        let  url = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_login#wechat_redirect';
        console.log(url);
        res.send({url:url})
        }
    }
}
// exports.getAccessToken = (req, res, next) => {
//     console.log('====accessToken')
//     // console.log(req.query)
//     let code = req.query.code;
//     let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code `;
//     request(url, (error, response, body) => {
//         let result = JSON.parse(body);
//         console.log(result)
//         req.access_token = result.access_token;
//         req.openid = result.openid;
//         next();
//     });
// }
exports.getAccessToken = (req, res, next) => {
    let APPID='wx3761a5c916a37844';
   let SECRET='331af64db81e91104147434bc80157f5'
    console.log('====accessToken')
    let code = req.query.code;
    console.log(code);
    var url=`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${SECRET}&code=${code}&grant_type=authorization_code`
    request(url, (error, response, body) => {
        let result = JSON.parse(body);
        console.log(result)
        req.access_token = result.access_token;
        req.openid = result.openid;
        res.send(result)
    });
}
// exports.getUserInfo = (req, res, next) => {
//     console.log('====getUserInfo')
//     let access_token = req.access_token;
//     let openid = req.openid;
//     let url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN `
//     request(url, (error, response, body) => {
//         console.log(body)
//         let result = JSON.parse(body);
//         res.cookie("openid", result.openid, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
//         res.cookie("unionid", result.unionid, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
//         res.cookie("nickname", result.nickname, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
//         res.cookie("headimgurl", result.headimgurl, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
//         next();
//     });
// }
exports.getUserInfo = (req, res, next) => {
    console.log('====getUserInfo')
    var tel=req.query.tel;
    let access_token = req.query.access_token;
    let openid = req.query.openid;
    console.log(req.query.access_token)
    var url=`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
    request(url, (error, response, body) => {
        let result = JSON.parse(body);
        console.log(result)
        var data={
            tel:tel,
            openid: result.openid,
            nickname: result.nickname,
            sex: result.sex,
            headimgurl: result.headimgurl,
            unionid :result.unionid,
           } 
       Users.updateOne({"tel":tel},data,function(err,doc){
           if(err){
               console.log(err)
           }else{
            res.send({result:result})
           }
       })
        // console.log(body)
        
        // next();
    });
}