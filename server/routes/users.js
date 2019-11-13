var express = require('express');
var multer  = require('multer')
var router = express.Router();//引用router
var upload = multer({ dest: 'uploads/' })
 
// var app = express()
var router = express.Router();

/* GET users listing. */
router.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})

 
module.exports = router;
