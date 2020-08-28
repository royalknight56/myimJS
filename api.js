/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-28 15:57:53
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 23:24:22
 */
/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-27 21:21:05
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 16:28:57
 */
var mysqlCon = require('./mysql');
var com = require('./com')
mysqlCon.testConnection(function (ifcon) {
    if (ifcon) {
        console.log('Mysql Connect success √');
    } else {
        console.log('failed');
    };
})
function auth(right, token, account) {
    return new Promise((resolve, reject) => {
        mysqlCon.ifHaveAuth(right, token, account).then(
            (result) => {
                if (result) {
                    resolve(true)
                } else {
                    reject(false)
                }
            }
        )
    })
}

var api = {
    buttonget: {
        type: 'GET',
        data: function (obj, res) {
            com.RES(res, { key: 'succ' })
        }
    },
    login: {
        type: 'POST',
        data: async function (obj, res) {
            function genToken() {
                var ar = '1234567890abcdefghijklmnopqrstuvwxyz'
                var re = ''
                for (let i = 0; i < 30; i++) {
                    re += ar[parseInt(Math.random() * 30)]
                }
                return re;
            }
            var value = await mysqlCon.ifLoginSuccess(obj.account, obj.password).catch((e) => {
                com.RES(res, { iflogin: 'no' })
            })
            if (value) {
                var token = genToken();
                mysqlCon.setToken(obj.account, token)
                com.RES(res, { iflogin: 'yes', token: token, account: obj.account })
            } else {
                com.RES(res, { iflogin: 'no' })
            }
        }
    },
    getFriend: {
        type: 'GET',
        data: async function (obj, res) {
            try {
                await auth('getFriend', obj.token, obj.account);
                var value = await mysqlCon.getFriend(obj.account);
                com.RES(res, value)
            } catch{
                com.RES(res, {
                    state: 'false'
                })
            }
        }
    },
    getMessageWith: {
        type: 'GET',
        data: async function (obj, res) {
            try {
                await auth('getFriend', obj.token, obj.account)
                var value = await mysqlCon.getMessageWith(obj.account, obj.withWho);
                com.RES(res, value)
            } catch{
                com.RES(res, {
                    state: 'false'
                })
            }
        }
    },
    addFriend: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await auth('getFriend', obj.token, obj.account)
                var value = await mysqlCon.addFriend(obj.account, obj.withWho);
                com.RES(res, {
                    state:true
                })
            } catch{
                com.RES(res, {
                    state: false
                })
            }
        }
    },
    deleteFriend: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await auth('getFriend', obj.token, obj.account)
                var value = await mysqlCon.deleteFriend(obj.account, obj.withWho);
                com.RES(res, {
                    state:true
                })
            } catch{
                com.RES(res, {
                    state: false
                })
            }
        }
    },
}
module.exports = api;