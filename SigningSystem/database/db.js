const mysql = require('mysql');
const config = require('../config.js');

//创建数据库对象
const db = mysql.createConnection({
    host:config.host,
    user:config.user,
    port:config.port,
    password:config.password,
    database:config.database
});

//调用连接数据库
db.connect(function (err) {
    if(err){
        console.log("连接数据库失败！");
        throw(err);
    }else{
        console.log("连接数据库成功！");
    }
});

module.exports = db;