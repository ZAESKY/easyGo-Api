const express = require('express')
const router = express.Router()

//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
//导入文章的验证模块
const { add_article_schema ,delete_schema,get_article_schema,update_article_schema} = require('../schema/article')

const article_handler = require('../router_handler/articles')

//导入解析formdata格式表单数据的包
const multer = require('multer')

//导入处理路径的模块
const path = require('path')

//创建multer的实例对象，通过dest 属性指定文件的存放路径
const upload_file = multer({dest:path.join(__dirname,'../upload/')})


//发布新文章
router.post('/add',upload_file.single('cover_img'),expressJoi(add_article_schema),article_handler.addArticle)

//获取新文章
router.get('/list',article_handler.getArticle)

//添加地址
router.post('/address',article_handler.postAddAddress)

//添加订单
router.post('/orders',article_handler.addGoodsOrder)

//添加评价
router.post('/comment',article_handler.addGoodsComment)

//获取评价
router.get('/comment/:id',article_handler.getGoodsComment)

//搜索
router.get('/goods',article_handler.getGoodsByKeyWords)


//根据ID获取地址
router.get('/address/:id',article_handler.getAddress)


//删除文章
router.get('/delete/:id',expressJoi(delete_schema),article_handler.deleteById)

//删除地址
router.get('/deleteaddr/:id',article_handler.deleteAddrById)


//根据id查找查询文章
router.get('/:id',expressJoi(get_article_schema),article_handler.getArticleById)

//更新文章
router.post('/edit',upload_file.single('cover_img'),expressJoi(update_article_schema),article_handler.editArticle)
module.exports = router