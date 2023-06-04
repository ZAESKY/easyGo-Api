//获取用户信息的基本函数
//导入数据库模块
const db = require('../db/index')
//导入密码匹配模块
const bcrypt = require('bcryptjs')
//--------------------查找所有拥护--------------------------
exports.getAllUsers = (req,res) => {
  const sql = `select * from users order by id desc`
  db.query(sql,(err,results) => {
    // 1.执行sql语句失败
    if(err) return res.cc(err)

    // 2.执行SQL语句成功
    res.send({
      status:0,
      message:'获取用户列表成功！',
      data:results,
    })
  })
}
//------------------根据id删除用户---------------------
exports.deleteUserById = (req,res) => {
  const sql = `delete from users where id = ?`
  db.query(sql,req.params.id,(err,results) => {
    //执行sql语句失败
    if(err) return res.cc(err)
    //sql语句执行成功 ，但是影响行数不等于1
    if(results.affectedRows !== 1) return res.cc('删除用户失败！')

    //删除文章分类成功
    res.cc('删除用户成功！',0)
  })
}

//---------------根据ID获取用户信息----------------------
exports.getUserById = (req,res) => {
  const sql = `select * from users where id = ?`

  db.query(sql,req.params.id,(err,results) => {
    //执行sql语句失败
    if(err) return res.cc(err)

    //sql成功执行，影响行数不为1
    if(results.length !== 1) return res.cc('获取用户数据失败！')

    //把数据响应给客户端
    res.send({
      success:true,
      status:0,
      message:'获取用户数据成功！',
      data:results[0],
    })
  })
}
//---------------------获取用户模块---------------------
exports.getUserInfo = (req,res) => {
//定义sql语句
const sqlStr = 'select * from users where id = ?'
   db.query(sqlStr,req.user.id,(err,results) => {
      // 1.执行sql语句失败
      if(err) return res.cc(err)
      // 2.执行SQL语句成功，查询到的数据不为1
      if(results.length !== 1) return res.cc('获取用户信息失败！')

      //3.将用户信息响应给客户端
      res.send({
        status:0,
        message:'获取用户基本信息成功！',
        data:results[0]
      })
   })
  // res.send('OK')
}
//---------------------获取用户订单信息---------------------
exports.getUserOrderInfo = (req,res) => {
  //定义sql语句
  const sqlStr = `SELECT goods.title,goods.id,orders.*,users.id from goods,users,orders where goods.id = orders.product_id and users.id = orders.buyer_id and orders.buyer_id = ?`
     db.query(sqlStr,req.user.id,(err,results) => {
        // 1.执行sql语句失败
        if(err) return res.cc(err)
        //3.将用户信息响应给客户端
        res.send({
          status:0,
          message:'获取用户订单信息成功！',
          data:results
        })
     })
     
    // res.send('OK')
  }
//---------------------获取用户订单数量信息---------------------
exports.getUserOrderNumInfo = (req,res) => {
  //定义sql语句
  const sql2=`SELECT COUNT(*) as ordersnum from orders where orders.buyer_id = ?`
     db.query(sql2,req.user.id,(err,results) => {
        // 1.执行sql语句失败
        if(err) return res.cc(err)
        //3.将用户信息响应给客户端
        res.send({
          status:0,
          message:'获取用户订单信息成功！',
          data:results
        })
     })
  }

  //---------------------获取用户评论数量信息---------------------
exports.getUserReviewsNumInfo = (req,res) => {
  //定义sql语句
  const sql2=`SELECT COUNT(*) as reviewsnum from reviews where reviews.buyer_id = ?`
     db.query(sql2,req.user.id,(err,results) => {
        // 1.执行sql语句失败
        if(err) return res.cc(err)
        //3.将用户信息响应给客户端
        res.send({
          status:0,
          message:'获取用户评论信息成功！',
          data:results
        })
     })
  }
//---------------更新用户模块-----------------------
exports.updateUserInfo = (req,res) => {
  //定义sql语句
  const sqlStr = 'update users set ? where id = ?'
  //调用db.query()执行sql语句并传递参数
  db.query(sqlStr,[req.body,req.body.id],(err,results) => {
  //执行sql语句失败
  if(err) return res.cc(err)
  //执行sql成功，但是影响的行数不为1
  if(results.affectedRows !== 1) return res.cc('更新用户的基本信息失败！')
  //成功
  res.cc('更新用户信息成功！',0)
  })
}

//---------------更新用户订单状态模块（发货状态）-----------------------
exports.updateOrdersInfo = (req,res) => {
  //定义sql语句
  const sqlStr = 'update orders set status = 2 where oid = ?'
  //调用db.query()执行sql语句并传递参数
  db.query(sqlStr,req.body.oid,(err,results) => {
  //执行sql语句失败
  if(err) return res.cc(err)
  //执行sql成功，但是影响的行数不为1
  if(results.affectedRows !== 1) return res.cc('更新订单信息失败！')
  //成功
  res.cc('更新订单信息成功！',0)
  })
}

//---------------更新用户订单状态模块（确认收货状态）-----------------------
exports.updateOrdersInfo2 = (req,res) => {
  //定义sql语句
  const sqlStr = 'update orders set status = 0 where oid = ?'
  //调用db.query()执行sql语句并传递参数
  db.query(sqlStr,req.body.oid,(err,results) => {
  //执行sql语句失败
  if(err) return res.cc(err)
  //执行sql成功，但是影响的行数不为1
  if(results.affectedRows !== 1) return res.cc('更新订单信息失败！')
  //成功
  res.cc('更新订单信息成功！',0)
  })
}

//------------------重置用户密码------------------------
exports.updatePassword = (req,res) => {
  //定义sql语句
  const sqlStr = 'select * from users where id =?'
  //执行sql语句，查询用户是否存在
  db.query(sqlStr,req.user.id,(err,results) => {
    //执行sql语句失败
    if(err) return res.cc(err)
    //查询指定id的用户信息是否存在
    if(results.length !== 1) return res.cc('用户不存在！')
    //判断提交的旧密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd,results[0].password)
    if(!compareResult) return res.cc('旧密码错误')

    //更新数据库中的密码
    //定义更新用户密码的SQL语句
    const sql = 'update users set password = ? where id = ?'

    //对密码进行bcrypt加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd,10)

    //执行SQL语句，根据 id 更新用户密码
    db.query(sql,[newPwd,req.user.id],(err,results) => {
      //执行SQL执行失败
      if(err) return res.cc(err)

      //执行sql语句成功但是影响行数不为1
      if (results.affectedRows !== 1) {
        console.log(results);
        return res.cc('更新密码失败！')
      }

      //更新密码成功
      res.cc('更新密码成功',0)
      console.log(req.user);
    })
    // res.send('OK')
  })
  
}

//----------------更换头像-----------------------
exports.updateAvatar = (req,res) => {
  //定义更新的SQL语句
  const sql = `update users set user_pic = ? where id = ?`
  //2.调用db.query() 执行sql语句
  db.query(sql,[req.body.avatar,req.user.id],(err,results) => {
    //执行sql语句失败
    if(err) return res.cc(err)
    //影响行数不等于1
    if(results.affectedRows !== 1) return res.cc('更换头像失败！')
    //成功
    res.cc('更新成功！',0)
  })
  // res.send('ok')
}