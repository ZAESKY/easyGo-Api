const { application } = require('express')
const express = require('express')
const router = express.Router()

const userHandler = require('../router_handler/user')

// 1.导入验证数据的中间件
const expressJoi = require('@escook/express-joi')

//2.导入需要验证的对象
const{ reg_login_schema,reg_reg_schema} = require('../schema/user')

//注册新用户
router.post('/reguser',expressJoi(reg_reg_schema),userHandler.reguser)

router.post('/login',expressJoi(reg_login_schema),userHandler.login)

module.exports = router