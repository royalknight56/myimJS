/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-27 21:21:05
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 15:12:23
 */
var mysqlCon = require('./mysql');
mysqlCon.testConnection(function (ifcon) {
    if (ifcon) {
        console.log('Mysql Connect success √');
    } else {
        console.log('failed');
    };
})


var api = {
    buttonget: {
        type: 'GET',
        data: function (obj, res) {
            res.writeHead(200, {
                'Content-Type': 'application/json',
            });
            res.write(JSON.stringify({ key: 'succ' }));
            res.end();
            // return JSON.stringify({ key: 'succ' })
        }
    },
    button: {
        type: 'POST',
        data: function (obj,res) {
            res.writeHead(200, {
                'Content-Type': 'application/json',
            });
            res.write(JSON.stringify({ key: 'postsucc' }));
            res.end();
            // return JSON.stringify({ key: 'postsucc' })
        }
    },
    login: {
        type: 'POST',
        data: function (obj,res) {
            mysqlCon.ifLoginSuccess(obj.account, obj.password).then(
                (value) => {
                    if (value) {
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                        });
                        function genToken(){
                            var ar='1234567890abcdefghijklmnopqrstuvwxyz'
                            var re=''
                            for(let i=0;i<30;i++){
                                re+=ar[parseInt(Math.random()*30)]
                            }
                            return re;
                        }
                        var token=genToken();
                        mysqlCon.setToken(obj.account,token)
                        res.write(JSON.stringify({ iflogin: 'yes' ,token:token}));
                        res.end();
                        console.log('login')
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                        });
                        res.write(JSON.stringify({ iflogin: 'no' }));
                        res.end();
                        console.log('cantlogin')
                    }
                }
            )
            return JSON.stringify({ key: 'login' })
        }
    }
}
module.exports = api;