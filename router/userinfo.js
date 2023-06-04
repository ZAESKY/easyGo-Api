//获取用户信息的路由
const express = require('express')
//调用路由方法
const router = express.Router()

//导入用户信息处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')

//导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema ,update_avatar_schema} = require('../schema/user')

//获取用户信息
router.get('/allusers',userinfo_handler.getAllUsers)

//获取用户信息
router.get('/userinfo',userinfo_handler.getUserInfo)

//获取用户订单信息
router.get('/userorderinfo',userinfo_handler.getUserOrderInfo)

//获取用户订单信息数量
router.get('/userordernuminfo',userinfo_handler.getUserOrderNumInfo)

//获取用户评价信息数量
router.get('/userreviewsnuminfo',userinfo_handler.getUserReviewsNumInfo)

//获取ID查找用户信息
router.get('/:id',userinfo_handler.getUserById)

//根据ID删除用户信息
router.get('/delete/:id',userinfo_handler.deleteUserById)

//修改用户信息
router.post('/userinfo',expressJoi(update_userinfo_schema),userinfo_handler.updateUserInfo)

//修改用户订单信息
router.post('/updateorders',userinfo_handler.updateOrdersInfo)

//修改用户订单信息
router.post('/updateorders2',userinfo_handler.updateOrdersInfo2)


//重置密码
router.post('/updatepwd',expressJoi(update_password_schema),userinfo_handler.updatePassword)

//更换头像的路由
router.post('/update/avatar', expressJoi(update_avatar_schema),userinfo_handler.updateAvatar)
module.exports = router