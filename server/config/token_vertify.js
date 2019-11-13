var jwt = require('jsonwebtoken');
var signkey = 'mes_qdhd_mobile_xhykjyxgs';

exports.setToken = function(phone){
	return new Promise((resolve,reject)=>{
		const token = jwt.sign({
		  phone:phone
		},signkey,{ expiresIn:'0.001h' });
		resolve(token);
	})
}

exports.verToken = function(token){
	return new Promise((resolve,reject)=>{
		var info = jwt.verify(token.split(' ')[1],signkey);
		resolve(info);
	})
}
