/**
 * @fileName:regAndLogin.js
 * @Desc: 路由转发注册、登入、登出
 * @method: post
 * @param:router
 * @return:
 * @author JK_Lu
 * @date 2019/12/06 16:15:19
 */
const express =  require('express');

const router = express.Router();

//引入regAndLogin.js
const RegAndLogin = require('../api/regAndLogin');
//POST部分
//路由post注册界面
router.post('/register',RegAndLogin.registered);
//路由post注册成功界面
router.post('/registerSuccess',RegAndLogin.registerSuccess);
//路由post登录界面
router.post('/login',RegAndLogin.login);
//路由post登出界面
router.post('/logout',RegAndLogin.logout);
//路由post找回密码界面
router.post('/findPsw',RegAndLogin.findPsw);
//路由post找回密码成功界面
router.post('/findPswSuccess',RegAndLogin.findPswSuccess)

//GET部分
//路由get登录界面
router.get('/login', function(req, res, next) {
    res.render('login', {message:'',user:req.session.user});
});
router.get('/',function (req, res, next) {
    res.render('login',{message:'',user:req.session.user})
})
//路由get注册界面
router.get('/register', function(req, res, next) {
    res.render('register',{message:''});
});
//路由get注册成功界面
router.get('/registerSuccess',function (req,res,next) {
    res.render('registerSuccess');
})
//路由get找回密码界面
router.get('/findPsw', function(req, res, next) {
    res.render('findPsw',{message:''});
});
//路由get找回密码成功界面
router.get('/findPswSuccess',function (req,res,next) {
    res.render('findPswSuccess');
})

//路由get个人资料界面
router.get('/personalInfo',function (req,res,next) {
    res.render('personalInfo',{user:req.session.user});
})
module.exports = router;