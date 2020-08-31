/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-28 08:59:50
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-31 17:53:01
 */
var mysql = require('mysql');
var sql;
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qq451582108',
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
    setUnreadAdd: function (own, beoened) {
        return SQLexc(
            'UPDATE `nodechat`.`friend` SET `unread` = `unread`+1 WHERE (`own` = ?) and (`beowned` = ?);',
            [own,beoened]);
    },
    setUnreadZero: function (own, beoened) {
        return SQLexc(
            'UPDATE `nodechat`.`friend` SET `unread` = 0 WHERE (`own` = ?) and (`beowned` = ?);',
            [own,beoened]);
    },
    putUser: function (account,password,username,token,auth=5,type='com') {
        return SQLexc(
            "INSERT INTO `nodechat`.`user` (`id`, `account`, `password`, `username`, `type`, `token`, `auth`, `state`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
            [0,account,password, username,type,token,auth,'offline']);
    },
    putMessage: function (own,account, to, message, time) {
        return SQLexc(
            'INSERT INTO `nodechat`.`messages`(`id`, `own`, `from`, `to`, `message`, `time`) VALUES (?, ?, ?, ?, ?, ?);',
            [0, own, account, to, message, time]);
    },
    putFriend: function (own, beowned, pendding) {
        return SQLexc(
            'INSERT INTO `nodechat`.`friend` (`own`, `beowned`, `pendding`) VALUES (?,?,?);',
            [own, beowned, pendding]);
    },
    ifHaveAuth: function (right, token, account) {
        return SQLexc(
            'SELECT auth,account FROM user WHERE token=? and account=? and auth>=?',
            [token, account, right]);
    },
    getUser: function (account) {
        return SQLexc(
            "SELECT * FROM nodechat.user where account=?;",
            [account]);
    },
    getFriend: function (account) {
        return SQLexc(
            `SELECT account,username,type,pendding,state,unread
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
            `select * from
            (select * from messages 
            where own=? and 
            ((messages.from=? and messages.to=?) 
            or 
            (messages.from=? and messages.to=?))
            order by time desc limit 0,20) as a
            order by time`,
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