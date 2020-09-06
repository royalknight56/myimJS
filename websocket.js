/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-28 15:57:53
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-09-06 12:14:12
 */
var ws = require("nodejs-websocket");
var mysqlCon = require('./mysql');
var fs = require("fs");
var conArr = {}
function genToken() {
    var ar = '1234567890abcdefghijklmnopqrstuvwxyz'
    var re = ''
    for (let i = 0; i < 30; i++) {
        re += ar[parseInt(Math.random() * 30)]
    }
    return re;
}
var server = ws.createServer(function (conn) {

    conn.on("text", async function (str) {
        var obj
        try {
            obj = JSON.parse(str);
        } catch{
            return
        }
        if (obj.type == 'auth') {
            mysqlCon.ifHaveAuth(1, obj.token, obj.account).then(
                (value) => {
                    if (value) {
                        conn.account = obj.account;
                        conArr[obj.account] = conn
                        conn.send(JSON.stringify({
                            type: 'state',
                            message: 'acc'
                        }))
                        mysqlCon.setState(obj.account, 'online')
                    } else {
                        conn.close()
                    }
                }
            ).catch((e) => {
                conn.close()
            })
        } else if (obj.type == 'message') {
            var time = new Date();
            time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
            if (obj.to && (obj.account != obj.to)) {
                await mysqlCon.ifHaveAuth(1, obj.token, obj.account).catch((e) => {
                    conn.close()
                })
                if (conArr[obj.to]) {
                    var accept = conArr[obj.to]
                    obj.time = time.toString();
                    obj.token = ""
                    accept.send(JSON.stringify(obj))
                }
                
                if (obj.message.type == 'img') {

                } else {
                    mysqlCon.putMessage(obj.account, obj.account, obj.to, JSON.stringify(obj.message), time)
                    mysqlCon.putMessage(obj.to, obj.account, obj.to, JSON.stringify(obj.message), time)
                    mysqlCon.setUnreadAdd(obj.to, obj.account);
                }
                //'9999-12-31 23:59:59'
            }
        } else if (obj.type == 'group') {
            if (obj.to && (obj.account != obj.to)) {
                await mysqlCon.ifHaveAuth(1, obj.token, obj.account).catch((e) => {
                    conn.close()
                })
                // mysqlCon.putMessage(obj.account, obj.account, obj.to, JSON.stringify(obj.message), time)

                var acArr = await mysqlCon.getCrowdAccount(obj.to)
                for (let i = 0; i < acArr.length; i++) {
                    if (conArr[acArr[i].own]) {
                        var accept = conArr[acArr[i].own]
                        var time = new Date();
                        time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
                        obj.time = time.toString();
                        obj.token = ""
                        accept.send(JSON.stringify(obj))
                    }
                    // mysqlCon.putMessage(acArr[i].account, obj.account, obj.to, JSON.stringify(obj.message), time)
                    
                    // mysqlCon.setUnreadAdd(obj.to, obj.account);
                }
                // if (obj.message.type == 'img') {

                // } else if (obj.message.type == 'txt') {
                    
                // }
                //'9999-12-31 23:59:59'
            }
        } else if (obj.type == 'system') {
            await mysqlCon.ifHaveAuth(1, obj.token, obj.account).catch((e) => {
                conn.close()
            })
            if (obj.system.type == 'tik') {

            }
        }

    })
    conn.on("close", function (code, reason) {
        mysqlCon.setState(conn.account, 'offline')
        if (conArr[conn.account]) {
            delete conArr[conn.account];
        }
        // var closeCon=conArr.findIndex(element => element.account==conn.account);
        // if(closeCon>=0){

        //     conArr.splice(closeCon, 1);
        // }
    });
    conn.on("error", function (code, reason) {
    });
}).listen(4517)
console.log("websocket running at ws://127.0.0.1:4517/")
module.exports = conArr