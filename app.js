//导入express模块
const express = require('express')
//创建web实例
const app = express()

//导入并配置跨域cors中间件
const cors = require('cors')
// 注册为全局件
app.use(cors())

//配置解析表单数据的问题
app.use(express.urlencoded({extended:false}))


//一定在路由之前，封装res.cc函数
app.use((req,res,next) => {
  //status默认值为1，表示失败
  //err的值可以是一个错误对象，也可以是一个错误的描述字符串
  res.cc = function(err,status = 1){
    res.send({
      status,
      message:err instanceof Error ? err.message : err
    })
  }
  next()
})

//一定要在路由之前配置解析Token的中间件
const { expressjwt: expressJWT } = require('express-jwt')
const config = require('./config/config')

//注册全局中间件
app.use(expressJWT({secret:config.jwtSecretKey, algorithms: ['HS256']}).unless({path:[/^\/api/]}))

//---------------------用户模块-----------------------------
//导入并使用用户路由
const userRouter = require('./router/user')
app.use('/api',userRouter)
//导入并使用用户信息模块
const userinfoRouter = require('./router/userinfo')
app.use('/my',userinfoRouter)
//----------------------------------------------------------


//-------------------文章模块-------------------------------
const artCateRouter = require('./router/artcates')
app.use('/my/article',artCateRouter)
//----------------------------------------------------------

//-------------------发布文章模块---------------------------
const articleRouter = require('./router/articles')
app.use('/my/article',articleRouter)

//托管静态文件资源
app.use('./upload/',express.static('./upload/'))

const joi = require('@hapi/joi')
//定义错误级别的中间件
app.use((err,req,res,next) => {
  //验证失败导致的错误
  if(err instanceof joi.ValidationError) return res.cc(err)
  //身份认证失败后的错误
  if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  //未知的错误
  res.cc(err)
})

//启动服务器
app.listen(80,() => {
console.log('服务已启动！http://127.0.0.1')
})