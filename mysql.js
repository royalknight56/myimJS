/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-28 08:59:50
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 15:00:40
 */
var mysql = require('mysql');
var authLevel = require('./authLevel');
var sql;
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'nodechat'
});

connection.connect();

sql = {
    testConnection: function (contest) {
        connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
            if (error) {
                console.log(error)
                contest(false)
                return false;
            }
            if (results[0].solution == '2') {
                contest(true)
                return true;
            }
        });
    },
    ifLoginSuccess: function (account, password) {
        return new Promise(
            (resolve, reject) => {
                var addSql = 'SELECT password FROM user WHERE account=?';
                var addSql_Params = [account];
                connection.query(addSql, addSql_Params, function (error, results, fields) {
                    if (error) {
                        reject()
                    }
                    if (results[0]) {
                        if (results[0].password == password) {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    } else {
                        resolve(false)
                    }

                });
            }
        )
    },
    setToken: function (account, token) {
        var addSql = 'UPDATE `nodechat`.`user` SET `token` = ? WHERE (`account` = ?);';
        var addSql_Params = [token,account];
        connection.query(addSql, addSql_Params, function (error, results, fields) {
            if (error) {

            }
        });
    },
    ifHaveAuth: function (afterSlash, token) {
        return new Promise(
            (resolve, reject) => {
                var addSql = 'SELECT auth FROM user WHERE token=?';
                var addSql_Params = [token];
                connection.query(addSql, addSql_Params, function (error, results, fields) {
                    if (error) {
                        reject()
                    }
                    if (results[0]) {
                        if (authLevel[results[0].auth].includes(afterSlash)) {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    } else {
                        resolve(false)
                    }

                });
            }
        )
    }
}

module.exports = sql