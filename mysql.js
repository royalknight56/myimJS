/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-28 08:59:50
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 23:32:25
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
                    if (results) {
                        if (results[0]) {
                            if (results[0].password == password) {
                                resolve(true)
                            } else {
                                resolve(false)
                            }
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
        var addSql_Params = [token, account];
        connection.query(addSql, addSql_Params, function (error, results, fields) {
            if (error) {

            }
        });
    },
    ifHaveAuth: function (right, token, account) {
        return new Promise(
            (resolve, reject) => {
                var addSql = 'SELECT auth,account FROM user WHERE token=?';
                var addSql_Params = [token];
                connection.query(addSql, addSql_Params, function (error, results, fields) {
                    if (error) {
                        reject()
                    }
                    if (results[0]) {
                        if (authLevel[results[0].auth].includes(right) && results[0].account == account) {
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
    getFriend: function (account) {
        return new Promise(
            (resolve, reject) => {
                var addSql = `SELECT account,username,type FROM friend 
                            JOIN user
                            ON user.account = friend.beowned
                            WHERE own=?`;
                var addSql_Params = [account];
                connection.query(addSql, addSql_Params, function (error, results, fields) {
                    if (error) {
                        reject()
                    }
                    if (results) {

                        resolve(results)
                    } else {
                        resolve(false)
                    }

                });
            }
        )
    },
    getMessageWith: function (account, withWho) {
        return new Promise(
            (resolve, reject) => {
                var addSql = `select * from message 
                where own=? and 
                ((message.from=? and message.to=?) 
                or 
                (message.from=? and message.to=?))`;
                var addSql_Params = [account, account, withWho, withWho, account];
                connection.query(addSql, addSql_Params, function (error, results, fields) {
                    if (error) {
                        reject()
                    }
                    if (results) {
                        resolve(results)
                    } else {
                        resolve(false)
                    }

                });
            }
        )
    },
    addFriend: async function (account, withWho) {
        return new Promise(
            (resolve, reject) => {
                var addSql = `
                    SELECT * FROM user
                    where account=?;`
                    ;
                var addSql_Params = [withWho];
                connection.query(addSql, addSql_Params, function (error, results, fields) {
                    if (error) {
                        reject()
                    }
                    if (results[0]) {
                        var addSql = `
                            INSERT INTO friend (own, beowned) 
                            VALUES (?, ?);`
                            ;
                        var addSql_Params = [account, withWho];
                        connection.query(addSql, addSql_Params, function (error, results, fields) {
                            if (error) {
                                reject()
                            }else{
                                resolve(results)
                            }
                        });
                    } else {
                        reject(false)
                    }

                });
            }
        )
    },
    deleteFriend: async function (account, withWho) {
        return new Promise(
            (resolve, reject) => {
                var addSql = `
                    SELECT * FROM friend
                    where own=? and beowned=?;`
                    ;
                var addSql_Params = [account,withWho];
                connection.query(addSql, addSql_Params, function (error, results, fields) {
                    if (error) {
                        reject()
                    }

                    if (results[0]) {
                        var addSql = `
                        DELETE FROM friend
                        WHERE (own = ?) and (beowned = ?);
                        `
                        ;
                        var addSql_Params = [account, withWho];
                        connection.query(addSql, addSql_Params, function (error, results, fields) {
                            if (error) {
                                reject()
                            }else{
                                resolve(results)
                            }
                        });
                    } else {
                        reject(false)
                    }

                });
            }
        )
    },
}

module.exports = sql