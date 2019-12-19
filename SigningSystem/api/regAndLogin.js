const db = require('../database/db.js');

/**
 * @fileName:regAndLogin.js
 * @Desc: 用户注册
 * @method: registered
 * @param: req,res,next
 * @return:
 * @author JK_Lu
 * @date 2019/12/04 21:00:50
 */
module.exports.registered = function(req,res,next){
    const userAccount  = req.body.userAccount;      //获取账号
    const userPassword = req.body.userPassword;     //获取密码
    const userName     = req.body.userName;         //获取名字
    const userJobNumber= req.body.userJobNumber;    //获取工号
    const userSex      = req.body.userSex;          //获取性别
    const userClassID  = req.body.userClassID;      //获取班级
    const userIdentity = req.body.userIdentity;     //管理员验证码

    //到数据库判断该用户是否已经注册过
    const queryUser = 'SELECT * FROM member WHERE mAccount=' + db.escape(userAccount);
    db.query(queryUser,function (err,rows,fields) {
        if(!userAccount){
            res.render('register',{message: '账户名为空！'});
            return;
        }
        if(err){
            console.log(err);
            //返回错误码：网络异常
            res.render('register',{message: '网络异常错误！'});
            return;
        }else if (rows[0]){
            //返回错误代码：该用户已存在
            res.render('register',{message: '账号已经存在！'});
            return;
        }else{
            //保存该条注册信息
            //管理员判断
            let isAdmin = 0;
            if(userIdentity === 'sysadmin'){
                isAdmin = 1;
            }else{
                isAdmin = 0;
            }
            const saveRegInfo = 'INSERT member SET mName='+db.escape(userName)
                                +',mAccount='+db.escape(userAccount)
                                +',mPassword='+db.escape(userPassword)
                                +',mClassID='+db.escape(userClassID)
                                +',mJobNumber='+db.escape(userJobNumber)
                                +',mSex='+db.escape(userSex)
                                +',mRegDate=NOW()'
                                +',isAdmin='+db.escape(isAdmin);
            //保存信息
            db.query(saveRegInfo,function (err,rows) {
                if (err){
                    console.log("保存注册信息失败！");
                    res.render('register',{message: '保存注册信息失败！'});
                    return;
                }else{
                    console.log("保存注册信息成功！");
                    res.redirect('/registerSuccess');
                }
            });
        }
    });
    //next();
}

/**
 * @fileName:regAndLogin.js
 * @Desc: 注册成功跳转界面
 * @method: registerSuccess
 * @param:
 * @return:
 * @author JK_Lu
 * @date 2019/12/11 17:36:32
 */
module.exports.registerSuccess = function(req,res,next){
    res.redirect('/');
}
/**
 * @fileName:regAndLogin.js
 * @Desc: 用户登录
 * @method: login
 * @param: req,res,next
 * @return:
 * @author JK_Lu
 * @date 2019/12/06 15:11:43
 */
module.exports.login = function (req,res,next) {
    const userAccount  = req.body.userAccount;      //获取账号
    const userPassword = req.body.userPassword;     //获取密码

    const queryUserAndPsw = 'SELECT * FROM member WHERE mAccount=' + db.escape(userAccount) + 'AND mPassword='+db.escape(userPassword);
    //查找是否存在该用户信息
    db.query(queryUserAndPsw,function (err,doc) {
        if(err){
            console.log(err);
            return;
        }
        if(!doc[0]){
            res.render('login', {message:'用户名或者密码错误'});
            return;
        }
        let user={
            userAccount:doc[0].mAccount,
            userPassword:doc[0].mPassword,
            userName:doc[0].mName,
            userClassID:doc[0].mClassID,
            userJobNumber:doc[0].mJobNumber,
            userSex:doc[0].mSex,
            userRegDate:doc[0].mRegDate,
            userIsAdmin:doc[0].isAdmin,
            userIsSuAdmin:doc[0].isSuAdmin
        }
        req.session.user = user;
        console.log(user);
        res.redirect('/personalInfo');//跳转index
    });
}

/**
 * @fileName:regAndLogin.js
 * @Desc: 找回密码
 * @method: findPsw
 * @param: req,res,next
 * @return:
 * @author JK_Lu
 * @date 2019/12/11 12:20:33
 */
module.exports.findPsw = function(req,res,next){
    const userAccount = req.body.userAccount;       //获取用户账号
    const userJobNumber = req.body.userJobNumber;   //获取用户工号
    const adminVerify = req.body.adminVerify;       //获取管理验证

    const queryUserAccount = 'SELECT * FROM member WHERE mAccount=' + db.escape(userAccount);
    const queryUserJobNumberAndUserAccount = 'SELECT mPassword FROM member WHERE mJobNumber=' + db.escape(userJobNumber) + 'AND mAccount=' + db.escape(userAccount);
    if(adminVerify === 'adminverify'){
        db.query(queryUserAccount,function (err,doc) {
            if(err){
                console.log(err);
                res.render('findPsw',{message:'1查询失败！'});
                return;
            }
            if(!doc[0]){
                res.render('findPsw',{message:'账户信息不存在！'});
                return;
            }else{
                db.query(queryUserJobNumberAndUserAccount,function (err,doc) {
                    console.log(doc[0]);
                    if(err){
                        console.log(err);
                        res.render('findPsw',{message:'2查询失败！'});
                        return;
                    }
                    if(!doc){
                        res.render('findPsw',{message:'工号/学号填写错误！'});
                        return;
                    }else{
                        //res.redirect('findPswSuccess',{msgAccount:userAccount,msgPassword:doc[0]});
                        res.render('findPswSuccess',{msgAccount:userAccount,msgPassword:doc[0].mPassword});
                    }
                })
            }

        })
    }else{
        res.render('findPsw',{message:'管理员验证码错误！'});
        return;
    }
}

/**
 * @fileName:regAndLogin.js
 * @Desc: 找回密码成功界面
 * @method: findPswSuccess
 * @param:
 * @return:
 * @author JK_Lu
 * @date 2019/12/11 18:29:26
 */
module.exports.findPswSuccess = function(req,res,next){
    res.redirect('/login');
}
/**
 * @fileName:regAndLogin.js
 * @Desc: 用户注销
 * @method: logout
 * @param: req,res,next
 * @return:
 * @author JK_Lu
 * @date 2019/12/06 15:17:20
 */
module.exports.logout = function (req,res,next) {
    req.session.user = null;
    res.redirect('/');
}

