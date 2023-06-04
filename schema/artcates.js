//新增表单数据的验证规则
const joi = require('joi')

//定义分类名称和分类别名的校验规则
const name = joi.string().required()

const alias = joi.string().alphanum().required()

//id的校验规则
const id = joi.number().integer().min(1).required()



//校验规则对象
exports.add_cates_schema = {
  body:{
    name,
    alias,
  }
}

//删除分类的校验对象
exports.delete_cate_schema = {
  params:{
    id,
  },
}

exports.get_cate_schema = {
  params:{
    id,
  },
}

exports.update_cate_schema = {
  body:{
    id,
    name,
    alias,
  },
}


