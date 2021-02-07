var mysql = require('mysql');
var config = require('../config/default.js')

var pool = mysql.createPool({
    host: config.database.HOST,
    port: config.database.PORT,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    insecureAuth: config.database.INSECUREAUTH,
});

let query = (sql, values) => {
    console.log(query)
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            console.log(err)
            if (err) {
                console.log('失败', err)
                reject(err)
            } else {
                console.log('连接成功')
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}

module.exports = query;