//路由处理函数模块

//导入数据库模块
const db = require('../db/index')

//-----------------获取文章分类的函数-----------------------
exports.getArtCates = (req,res) => {
  //定义查询分类列表数据的SQL语句
  const sql = `select * from goods_cate where is_delete = 0 order by id asc`
  //调用db.query()执行SQL语句
  db.query(sql,(err,results) => {
    if(err) return res.cc(err)
    res.send({
      status:0,
      message:'获取文章成功！',
      data:results,
    })
  })
}
//------------------------------------------------------

//----------------------增加分类的函数-----------------------
exports.addArtCates = (req,res) =>{
  //1.定义查重的sql语句
  const sql = `select * from goods_cate where name = ? or alias = ?`
  //2.执行查重的sql语句
  db.query(sql,[req.body.name,req.body.alias],(err,results) => {
  //3.判断是否执行sql语句失败
  if(err) return res.cc(err)

  //4.1 判断数据的 length
  //第一种情况：分类名称被占用与分类别名被占用
  if(results.length === 2) return res.cc('分类名称与分类别名被占用，请更换后重试！')
  //第二种情况：同一条数据里面的分类名称和别名被占用
  if(results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
  return res.cc('分类名称与分类别名被占用，请更换后重试！')
  //第三种情况：分类名称被占用
  if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
  if(results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

  //定义插入数据库语句
  const sql = `insert into goods_cate set ?`
  //调用db.query执行新增文章分类的sql语句
  db.query(sql,req.body,(err,results) => {
    //sql语句执行失败
    if(err) return res.cc(err)
    //sql影响行数不为1
    if(results.affectedRows !== 1) return res.cc('新增文章分类失败！')

    //新增成功
    res.cc('新增成功！',0)
  })
  })
  // res.send('ok')
}
//--------------------------------------------------------------

//----------------------删除分类的函数----------------------
exports.deleteCateByid =(req,res) => {
  //定义sql语句
  const sql = `update goods_cate set is_delete = 1 where id = ?`
  //调用db.query()执行sql语句
  db.query(sql,req.params.id,(err,results) => {
    if(err) return res.cc(err)
    if(results.affectedRows !== 1) return res.cc('删除文章分类失败！')
    res.cc('删除文章分类成功！',0)
  }) 
}

//--------------------根据ID获取文章分类的函数----------------------------
exports.getArtCateByid = (req,res) =>{
  //定义sql语句
  const sql = `select * from goods_cate where id = ?`
  //执行sql语句
  db.query(sql,req.params.id,(err,results) => {
    if(err) return res.cc(err)
    if(results.length !== 1) return res.cc('获取文章失败！')
    //把数据响应给客户端
    res.send({
      status:0,
      message:'获取文章数据成功！',
      data:results[0], 
    })
  })
}

//--------------------根据ID获取文章分类下所有文章的函数----------------------------
exports.getArtCateByAtcid = (req,res) =>{
  //定义sql语句
  const sql = `select * from goods where cate_id = ? and is_delete != 1`
  //执行sql语句
  db.query(sql,req.params.id,(err,results) => {
    if(err) return res.cc(err)
    //把数据响应给客户端
    res.send({
      status:0,
      message:'获取文章数据成功！',
      data:results, 
    })
  })
}
//-------------------根据id更新文章分类------------------------
exports.updateCateByid = (req,res) => {
  const sql = `select * from goods_cate where id <> ? and (name = ? or alias = ?)`
  db.query(sql,[req.body.id,req.body.name,req.body.alias],(err,results) => {
    //执行sql语句失败
    if(err) return res.cc(err)
    //判断分类名称 和 分类别名 是否被占用
    //第一种情况：分类名称被占用与分类别名被占用
  if(results.length === 2) return res.cc('分类名称与分类别名被占用，请更换后重试！')
  //第二种情况：同一条数据里面的分类名称和别名被占用
  if(results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
  return res.cc('分类名称与分类别名被占用，请更换后重试！')
  //第三种情况：分类名称被占用
  if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
  if(results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
  
  //TODO 更新文章分类
  const sql = `update goods_cate set ? where Id = ?`
  db.query(sql,[req.body,req.body.id],(err,results) => {
    //执行sql语句失败
    if(err) return res.cc(err)
    if(results.affectedRows !== 1) return res.cc('更新文章失败！')
    //更新文章分类成功
    res.cc('更新文章分类成功！',0)
  })
  })
}