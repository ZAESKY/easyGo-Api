//创建一个数据库连接模块
//导入数据库模块
const mysql = require('mysql')

//创建连接池
const db = mysql.createPool({
  host:'127.0.0.1',
  user:'root',
  password:'',
  database:'mydb'
})

module.exports = db