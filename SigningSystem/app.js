const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const regAndLogin = require('./routes/regAndLogin');

const app = express();

const session_options = {
  secret:'SigningSystem',           //cookie签名
  cookie:{maxAge:1000*60*60*24*30}, //有效期：30天
  resave: false,                    //
  saveUninitialized: true           //是否自动初始化
}
//cookie数据加密
app.use(session(session_options));

//设置视图文件夹的位置
app.set('views', path.join(__dirname, 'views'));
//设置项目使用ejs模板引擎
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//使用日志文件记录中间件
app.use(logger('dev'));

//使用bodyParser中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//使用coolieParser中间件
app.use(cookieParser());

//使用express默认的static中间件设置静态资源文件夹的位置
app.use(express.static(path.join(__dirname, 'public')));

//使用路由regAndLogin
app.use('/', regAndLogin);

// catch 404 and forward to error handler
//处理404错误
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //设置本地错误信息仅在开发环境中提供
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //渲染错误请求页面
  res.status(err.status || 500);
  res.render('error');
});

//监听3000端口
app.listen(3000,function(){
    console.log('listening port 3000');
});

module.exports = app;
