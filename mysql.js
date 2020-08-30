/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-28 08:59:50
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-29 20:32:41
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
function SQLexc(sql, par, callback) {
    return new Promise(
        (resolve, reject) => {
            connection.query(sql, par, function (error, results, fields) {
                if (error) {
                    reject()
                }
                if (results) {
                    if (results.length != 0) {
                        resolve(results)
                    } else {
                        reject()
                    }
                } else {
                    reject(false)
                }
            });
        }
    )
}
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
    setToken: function (account, token) {
        var addSql = 'UPDATE `nodechat`.`user` SET `token` = ? WHERE (`account` = ?);';
        var addSql_Params = [token, account];
        connection.query(addSql, addSql_Params, function (error, results, fields) {
            if (error) {

            }
        });
    },
    setState: function (account, state) {
        var addSql = 'UPDATE `nodechat`.`user` SET `state` = ? WHERE (`account` = ?);';
        var addSql_Params = [state, account];
        connection.query(addSql, addSql_Params, function (error, results, fields) {
            if (error) {

            }
        });
    },
    setPendding: function (own, beoened, pendding) {
        return SQLexc(
            'UPDATE `nodechat`.`friend` SET `pendding` = ? WHERE (`own` = ?) and (`beowned` = ?);',
            [pendding, own, beoened]);
    },
    putMessage: function (account, to, message, time) {
        var addSql = 'INSERT INTO `nodechat`.`messages`(`id`, `own`, `from`, `to`, `message`, `time`) VALUES (?, ?, ?, ?, ?, ?);';
        var addSql_Params = [0, account, account, to, message, time];

        connection.query(addSql, addSql_Params, function (error, results, fields) {
            if (error) {
                console.log(error)
            }
        });
    },
    putFriend: function (own, beowned, pendding) {
        return SQLexc(
            'INSERT INTO `nodechat`.`friend` (`own`, `beowned`, `pendding`) VALUES (?,?,?);',
            [own, beowned, pendding]);
    },
    ifHaveAuth: function (right, token, account) {
        return SQLexc(
            'SELECT auth,account FROM user WHERE token=? and account=? and auth>?',
            [token, account, right]);
    },
    getFriend: function (account) {
        return SQLexc(
            `SELECT account,username,type,pendding
                            FROM friend 
                            JOIN user
                            ON user.account = friend.beowned
                            WHERE own=? and pendding='accept'`,
            [account]);
    },
    getPenddingFriend: function (account) {
        return SQLexc(
            `SELECT *
            FROM friend
            WHERE beowned=? and pendding='pendding'`,
            [account]);
    },
    getFriendReq: function (account) {
        return SQLexc(
            `SELECT *
            FROM friend
            WHERE beowned=? and pendding!='accept'
            UNION
            SELECT *
            FROM friend
            WHERE own=? and pendding!='accept'
            `,
            [account, account]);
    },
    getMessageWith: function (account, withWho) {
        return SQLexc(
            `select * from messages 
                where own=? and 
                ((messages.from=? and messages.to=?) 
                or 
                (messages.from=? and messages.to=?))`,
            [account, account, withWho, withWho, account]);
    },
    deleteFriend: async function (account, withWho) {
        return SQLexc(
            `
            DELETE FROM friend
            WHERE (own = ?) and (beowned = ?);
            `,
            [account, withWho]);
    },
    ifLoginSuccess: function (account, password) {
        return new Promise(
            (resolve, reject) => {
                var addSql = 'SELECT password,state FROM user WHERE account=?';
                var addSql_Params = [account];
                connection.query(addSql, addSql_Params, function (error, results, fields) {
                    if (error) {
                        reject()
                    }
                    if (results) {
                        if (results[0]) {
                            if (results[0].password == password) {
                                resolve({
                                    result: true,
                                    state: results[0].state
                                })
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
                            INSERT INTO friend (own, beowned,pendding) 
                            VALUES (?, ?,'pendding');`
                            ;
                        var addSql_Params = [account, withWho];
                        connection.query(addSql, addSql_Params, function (error, results, fields) {
                            if (error) {
                                reject()
                            } else {
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