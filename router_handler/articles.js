//导入处理路径的path核心模块
const { date } = require('joi')
const path = require('path')
const db = require('../db/index')
const mysql = require('mysql')



exports.addArticle = (req,res) => {

  if(!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')

  //表单数据合法、继续后面的流程
  const articleInfo = {
    //标题、内容、状态、所属的分类ID
    ...req.body,
    //文章封面在服务器的存放路径
    cover_img:path.join(req.file.filename),
    //文章发布时间
    pub_date:req.body.pub_date,
    //价格
    price:req.body.price,
    //文章作者的ID
    author_id:req.user.id,
  }
  //定义发布文章sql语句
  const sql = `insert into goods set ?`
  db.query(sql,articleInfo,(err,results) => {
    //执行sql语句失败
    if(err) return res.cc(err)
    //执行sql语句成功，但是影响行数不等于1
    if(results.affectedRows !== 1) return res.cc('发布文章失败！')

    //发布文章成功
    res.cc('发布文章成功！',0)
  })

}


// ---------------插入订单----------------
exports.addGoodsOrder = (req,res) => {
  // console.log(req.body);
  // console.log('-------------------');
  // console.log(req.file);
  // res.send('OK')
  //表单数据合法、继续后面的流程
  const goodsOrderInfo = {
    //标题、内容、状态、所属的分类ID
    ...req.body,
    buyer_id:req.user.id
    
  }
  //定义插入订单sql语句
  const sql = `insert into orders set ?`
  db.query(sql,goodsOrderInfo,(err,results) => {
    //执行sql语句失败
    if(err) return res.cc(err)
    //执行sql语句成功，但是影响行数不等于1
    if(results.affectedRows !== 1) return res.cc('插入订单失败！')
    res.cc('插入订单成功！',0)
  })
  //插入订单成功
  const sql2 = `update users set credits = ? where id = ?`
  db.query(sql2,[req.body.cost_price,req.user.id],(err2,results2) => {
    if(err2) return res.cc(err2)
  //执行sql语句成功，但是影响行数不等于1
  if(results2.affectedRows !== 1) return res.cc('更新积分失败！')
  })
}

//---------------------获取所有评价内容---------------------
exports.getGoodsComment = (req,res) => {
  //定义sql语句
  const sqlStr = `SELECT reviews.*,users.username FROM reviews,goods,users where reviews.product_id = goods.id and reviews.buyer_id = users.id and product_id = ?`
     db.query(sqlStr,req.params.id,(err,results) => {
        // 1.执行sql语句失败
        if(err) return res.cc(err)
        //3.将用户信息响应给客户端
        res.send({
          status:0,
          message:'获取商品评价信息成功！',
          data:results
        })
     })
  }

//--------------------搜索商品的函数----------------------------
exports.getGoodsByKeyWords = (req,res) =>{
  let {keywords} = req.query
  //定义sql语句
  const sql = 'select * from goods where 1 = 1 AND CONCAT(id,title,content,cover_img,pub_date,state,is_delete,cate_id,author_id,price) LIKE ' + mysql.escape("%"+keywords+"%")
  let sqlArr = [keywords]
  //执行sql语句
  db.query(sql,sqlArr,(err,results) => {
    if(err) return res.cc(err)
    //把数据响应给客户端
    res.send({
      status:0,
      message:'搜索商品成成功！',
      data:results, 
    })
  })
}

// ---------------插入评价----------------
exports.addGoodsComment = (req,res) => {
  //表单数据合法、继续后面的流程
  const goodsComment = {
    //标题、内容、状态、所属的分类ID
    ...req.body,
    buyer_id:req.user.id
  }
  //定义插入订单sql语句
  const sql = `insert into reviews set ?`
  db.query(sql,goodsComment,(err,results) => {
    //执行sql语句失败
    if(err) return res.cc(err)
    //执行sql语句成功，但是影响行数不等于1
    if(results.affectedRows !== 1) return res.cc('添加评论失败！')
    res.cc('添加评论成功！',0)
  })
}

//--------------------查找所有文章--------------------------
exports.getArticle = (req,res) => {
  const sql = `select * from goods where is_delete = 0 order by id desc`
  db.query(sql,(err,results) => {
    // 1.执行sql语句失败
    if(err) return res.cc(err)

    // 2.执行SQL语句成功
    res.send({
      status:0,
      message:'获取文章列表成功！',
      data:results,
    })
  })
}

//------------------根据id删除文章---------------------
exports.deleteById = (req,res) => {
  const sql = `update goods set is_delete = 1 where id = ?`
  db.query(sql,req.params.id,(err,results) => {
    //执行sql语句失败
    if(err) return res.cc(err)
    //sql语句执行成功 ，但是影响行数不等于1
    if(results.affectedRows !== 1) return res.cc('删除文章失败！')

    //删除文章分类成功
    res.cc('删除文章成功！',0)
  })
}

//---------------根据ID获取文章----------------------
exports.getArticleById = (req,res) => {
  const sql = `SELECT goods.*,users.username from goods,users where goods.author_id = users.id and goods.id = ?`

  db.query(sql,req.params.id,(err,results) => {
    //执行sql语句失败
    if(err) return res.cc(err)

    //sql成功执行，影响行数不为1
    if(results.length !== 1) return res.cc('获取文章数据失败！')

    //把数据响应给客户端
    res.send({
      success:true,
      status:0,
      message:'获取文章数据成功！',
      data:results[0],
    })
  })
}

//-------添加地址处理函数-------------
exports.postAddAddress = (req,res) => {
  //接受请求体内容
  const userAddressInfo = {
    ...req.body,
    buyer_id:req.user.id
  }
//定义插入新用户的SQL语句
const sql = 'insert into addresses set ?'
db.query(sql,userAddressInfo,(err,results)=>{
  //判断sql语句是否执行成功
  if(err) return res.send({status:1,message:err.message})
  //判断影响行数是否为1
  if (results.affectedRows !== 1) {
    return res.send({status:1,message:'添加地址失败，请稍后再试！'})
  }
  //注册成功
  return res.send({status:0,message:'添加成功！'})
})
}

//--------------------获取用户地址--------------------------
exports.getAddress = (req,res) => {
  const sql = `select * from addresses where buyer_id = ?`
  db.query(sql,req.user.id,(err,results) => {
    // 1.执行sql语句失败
    if(err) return res.cc(err)
    // 2.执行SQL语句成功
    res.send({
      status:0,
      message:'获取地址列表成功！',
      data:results,
    })
  })
}

//------------------根据id删除地址---------------------
exports.deleteAddrById = (req,res) => {
  const sql = `delete from addresses where id = ?`
  db.query(sql,req.params.id,(err,results) => {
    //执行sql语句失败
    if(err) return res.cc(err)
    //sql语句执行成功 ，但是影响行数不等于1
    if(results.affectedRows !== 1) return res.cc('删除地址失败！')
    //删除文章分类成功
    res.cc('删除地址成功！',0)
  })
}

//----------编辑商品--------------
exports.editArticle = (req,res) => {
  //先查询有没有这个文章有没有相同的标题
  const sql = `select * from goods where id != ? and title = ?`
  //执行查重操作
  db.query(sql,[req.body.id,req.body.title],(err,results) => {
    if(err) return res.cc(err)
    if(results[0]){
      return res.cc('商品标题不能重复！')
    }

    //证明数据都是合法的，可以进行后续业务逻辑的处理
    //处理文章的信息对象
    const articleInfo = {
      //标题、内容、发布状态、所属分类的ID
      ...req.body,
      author_id:req.user.id,
    }
    const sql = `update goods set ? where id = ?`
    db.query(sql,[articleInfo,req.body.id],(err,results) => {
      if(err) return res.cc(err)
      if(results.affectedRows !== 1) return res.cc('编辑文章失败！')
      res.cc('编辑文章成功！',0)
    })
  })
}



