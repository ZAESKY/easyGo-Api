const joi = require('joi')

//定义标题、分类ID、内容、发布状态的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('发布','草稿').required()
const price = joi.string().required()
const pub_date = joi.string().required()

//id的校验规则
const id = joi.string().required()

//验证规则对象 - 发布文章
exports.add_article_schema = {
  body:{
    title,
    cate_id,
    content,
    state,
    price,
    pub_date,
  },
}

exports.delete_schema = {
  params:{
    id,
  }
}

exports.get_article_schema = {
  params:{
    id,
  }
}



exports.update_article_schema = {
  body:{
    id,
    title,
    content,
    price
  },
}
