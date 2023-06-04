//这是文章分类的路由模块
const express = require('express')
const router = express.Router()

//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')

//导入文章分类的验证模块
const { add_cates_schema ,delete_cate_schema, get_cate_schema, update_cate_schema} = require('../schema/artcates')

// 导入路由处理模块
const artCateRouter_handler = require('../router_handler/artcates')

//获取文章分类数据的路由
router.get('/cates',artCateRouter_handler.getArtCates)

//增加文章分类的路由
router.post('/addcates', expressJoi(add_cates_schema),artCateRouter_handler.addArtCates)

//根据ID删除文章分类的路由
router.get('/deletecate/:id',expressJoi(delete_cate_schema),artCateRouter_handler.deleteCateByid)

//根据ID获取文章分类的路由
router.get('/cates/:id',expressJoi(get_cate_schema),artCateRouter_handler.getArtCateByid)

//根据ID获取文章分类下所有文章的路由
router.get('/catesatc/:id',expressJoi(get_cate_schema),artCateRouter_handler.getArtCateByAtcid)

//更新文章分类的路由
router.post('/updatecate',expressJoi(update_cate_schema),artCateRouter_handler.updateCateByid)
module.exports = router