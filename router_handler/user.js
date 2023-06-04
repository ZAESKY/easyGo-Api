//处理函数封装

//导入mysql模块
const db = require('../db/index')

//导入密码加密bcryptjs模块
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config/config')

//注册处理函数
exports.reguser = (req,res) => {
  //接受请求体内容
  const userinfo = req.body

  //定义sql语句
  const sqlStr = 'select * from users where username = ?'

  //执行查询用户名的SQL
  //这里的返回属性和post的返回属性一定要区分开
  db.query(sqlStr,userinfo.username,(err,results) => {
    if (err) {
      return res.send({status:1,message:err.message})
    }
    if (results.length > 0) {
      return res.send({status:1,message:'用户名已被占用，请更换！'})
    }
    userinfo.password = bcryptjs.hashSync(userinfo.password,10)
    

    //定义插入新用户的SQL语句
    const sql = 'insert into users set ?'
    db.query(sql,{username:userinfo.username,register_at:userinfo.register_at,user_type:userinfo.user_type,email:userinfo.email,password:userinfo.password},(err,results)=>{
      //判断sql语句是否执行成功
      if(err) return res.send({status:1,message:err.message})
      //判断影响行数是否为1
      if (results.affectedRows !== 1) {
        return res.send({status:1,message:'注册用户失败，请稍后再试！'})
      }
      //注册成功
      return res.send('注册成功！')
    })
  }) 
}



//登录处理函数
exports.login = (req,res) => {
  //接收请求体数据
  const userinfo = req.body

  //定义sql语句
  const sqlStr = 'select * from users where username = ?'
  //执行sql语句，根据用户名查询用户信息
  db.query(sqlStr,userinfo.username,(err,results) => {
    //执行失败时
    if(err) return res.cc(err)
    //执行sql语句成功，但是获取到的数据条数不等于1
    if(results.length !== 1) return res.cc('登录失败！请检查账号密码！')
    //判断密码是否正确
    const compareResult = bcryptjs.compareSync(userinfo.password,results[0].password)
    if(!compareResult) return res.cc('登录失败！')
    //更新最后登录时间
    const sqlStr2 = 'update users set last_login = ? where username = ?'
    let params = [userinfo.last_login,userinfo.username]
    db.query(sqlStr2,params,(err,results) => {
      if (err) {
        console.log("更新失败" + err.message);
        return;
    }
    console.log('更新成功');
    })
    // 在服务器端生成token
    const user = {...results[0],password:'',user_pic:''}
    //对用户信息进行加密，生成token
    const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn : config.expiresIn})
    // console.log(tokenStr);
    //判断成功
    return res.send({
      status:0,
      message:'登录成功！',
      token:'Bearer ' + tokenStr,
      cuserinfo:results
    })
  })
}