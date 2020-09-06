/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-28 15:57:53
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-09-06 15:48:40
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
var wsObj = require('./websocket')
var authLevel = require('./authLevel');
var fs = require("fs");
mysqlCon.testConnection(function (ifcon) {//测试mysql连接，启动时会调用
    if (ifcon) {
        console.log('Mysql Connect success √');
    } else {
        console.log('failed');
    };
})
function genToken() {// 返回随机的30位token
    var ar = '1234567890abcdefghijklmnopqrstuvwxyz'
    var re = ''
    for (let i = 0; i < 30; i++) {
        re += ar[parseInt(Math.random() * 30)]
    }
    return re;
}
async function afterRegister(account) {
    var value = await mysqlCon.getAfter();
    for (let i = 0; i < value.length; i++) {
        if (value[i].type == 'add') {
            mysqlCon.putFriend(account, value[i].account, 'accept')
            mysqlCon.putFriend(value[i].account, account, 'accept')
        } else if (value[i].type == 'send') {
            var time = new Date();
            time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
            mysqlCon.putMessage(account, value[i].account, account, value[i].message, time)
        }
    }

}
var api = {//api接口对象
    testget: {//测试get接口
        type: 'GET',
        data: function (obj, res) {
            com.RES(res, { key: 'succ' })
        }
    },
    getOnlineUser: {//获取在线用户数
        type: 'GET',
        data: function (obj, res) {
            if (obj.account == 'admin' && obj.password == 'qq451582108') {
                com.RES(res, { onlineNumber: Object.keys(wsObj).length })
            }
        }
    },
    login: {//登录接口
        type: 'POST',
        data: async function (obj, res) {
            var value = await mysqlCon.ifLoginSuccess(obj.account, obj.password).catch((e) => {
                com.RES(res, { iflogin: 'no' })
            })
            if (value.result) {
                var token = genToken();
                mysqlCon.setToken(obj.account, token)
                var user = await mysqlCon.getUser(obj.account)
                user = user[0]
                var retobj =
                {
                    iflogin: 'yes',
                    token: token,
                    account: obj.account,
                    username: user.username,
                    type: user.type,
                    auth: user.auth,
                    logo: user.logo
                }
                com.RES(res, retobj)
            } else {
                com.RES(res, { iflogin: 'no' })
            }
        }
    },
    autoLogin: {//token登录接口
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['autoLogin'], obj.token, obj.account);
                var token = genToken();
                mysqlCon.setToken(obj.account, token)
                var user = await mysqlCon.getUser(obj.account)
                user = user[0]
                com.RES(res, {
                    state: true,
                    token: token,
                    account:
                        obj.account,
                    username: user.username,
                    type: user.type,
                    auth: user.auth,
                    logo: user.logo
                })
            } catch{
                com.RES(res, { state: false })
            }
        }
    },
    phonelogin: {//临时账号登录
        type: 'POST',
        data: async function (obj, res) {
            try {
                var token = genToken();
                var account = genToken();
                var password = genToken();
                await mysqlCon.putUser(account, password, '临时账号', token, 3, 'test')
                var user = await mysqlCon.getUser(account)
                mysqlCon.putFriend(account, 'gx', 'accept')
                mysqlCon.putFriend('gx', account, 'accept')
                user = user[0]
                com.RES(res, {
                    state: true, iflogin: 'yes',
                    token: token,
                    account: account,
                    username: user.username,
                    type: user.type,
                    auth: user.auth,
                    logo: 'img/defult.png'
                })
            } catch{
                com.RES(res, { state: false })
            }
        }
    },
    register: {//注册接口
        type: 'POST',
        data: async function (obj, res) {
            try {
                if (obj.account) {
                    var token = genToken();
                    await mysqlCon.putUser(obj.account, obj.password, obj.username, token)
                    com.RES(res, {
                        state: true, token: token, account: obj.account, username: obj.username,
                        logo: 'img/defult.png'
                    })
                    afterRegister(obj.account)
                } else {
                    com.RES(res, { state: false })
                }
            } catch{
                com.RES(res, { state: false })
            }
        }
    },
    getFriend: {//获取好友列表
        type: 'GET',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['getFriend'], obj.token, obj.account);
                var value = await mysqlCon.getFriend(obj.account);
                com.RES(res, value)
            } catch{
                com.RES(res, {
                    state: 'false'
                })
            }
        }
    },
    getFriendInfo: {//获取好友列表
        type: 'GET',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['getFriendInfo'], obj.token, obj.account);
                var value = await mysqlCon.getUser(obj.withWho);
                value.password = "";
                value.token = "";
                value.auth = "";
                com.RES(res, value)
            } catch{
                com.RES(res, {
                    state: 'false'
                })
            }
        }
    },
    getCrowd: {//获取群组列表
        type: 'GET',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['getCrowd'], obj.token, obj.account);
                var value = await mysqlCon.getCrowd(obj.account);
                com.RES(res, value)
            } catch{
                com.RES(res, {
                    state: 'false'
                })
            }
        }
    },
    getFriendRequest: {
        type: 'GET',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['getFriendRequest'], obj.token, obj.account);
                var value = await mysqlCon.getFriendReq(obj.account);
                for (let i = 0; i < value.length; i++) {
                    value[i].from = value[i].own
                    value[i].to = value[i].beowned
                }
                com.RES(res, value)
            } catch{
                com.RES(res, [])
            }
        }
    },
    getMessageWith: {
        type: 'GET',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['getMessageWith'], obj.token, obj.account)
                var value = await mysqlCon.getMessageWith(obj.account, obj.withWho)
                for (let i = 0; i < value.length; i++) {
                    value[i].message = JSON.parse(value[i].message);
                }
                com.RES(res, value)
                mysqlCon.setUnreadZero(obj.account, obj.withWho);
            } catch{
                com.RES(res, [])
            }
        }
    },
    readMessageWith: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['readMessageWith'], obj.token, obj.account)
                mysqlCon.setUnreadZero(obj.account, obj.withWho);
            } catch{
                com.RES(res, [])
            }
        }
    },
    addFriend: {
        type: 'POST',
        data: async function (obj, res) {
            if (obj.account == obj.withWho) {
                com.RES(res, {
                    state: false
                })
                return 0
            }
            try {
                await mysqlCon.ifHaveAuth(authLevel['addFriend'], obj.token, obj.account)
                await mysqlCon.addFriend(obj.account, obj.withWho);
                var accept = wsObj[obj.withWho];
                if (accept) {
                    accept.send(JSON.stringify({
                        type: 'system',
                        system: {
                            type: 'friendUpdate',
                        }
                    }))
                }
                com.RES(res, {
                    state: true
                })
            } catch{
                com.RES(res, {
                    state: false
                })
            }
        }
    },
    addCrowd: {
        type: 'POST',
        data: async function (obj, res) {
            if (obj.account == obj.withWho) {
                com.RES(res, {
                    state: false
                })
                return 0
            }
            try {
                await mysqlCon.ifHaveAuth(authLevel['addCrowd'], obj.token, obj.account)
                var cro = await mysqlCon.getCrowdUser(obj.withWho);
                if (cro.length == 0) {
                    com.RES(res, {
                        state: false
                    })
                } else {
                    await mysqlCon.putCrowd(obj.account, obj.withWho);
                    var accept = wsObj[obj.account];
                    if (accept) {
                        accept.send(JSON.stringify({
                            type: 'system',
                            system: {
                                type: 'friendUpdate',
                            }
                        }))
                    }
                    com.RES(res, {
                        state: true
                    })
                }
            } catch{
                com.RES(res, {
                    state: false
                })
            }
        }
    },
    createCrowd: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                if (obj.crowdAccount) {
                    await mysqlCon.ifHaveAuth(authLevel['createCrowd'], obj.token, obj.account)
                    await mysqlCon.putCrowdUser(obj.crowdAccount, obj.crowdName, obj.account)
                    await mysqlCon.putCrowd(obj.account, obj.crowdAccount, 'mas');
                    var accept = wsObj[obj.account];
                    if (accept) {
                        accept.send(JSON.stringify({
                            type: 'system',
                            system: {
                                type: 'friendUpdate',
                            }
                        }))
                    }
                    com.RES(res, {
                        state: true
                    })
                } else {
                    com.RES(res, {
                        state: false
                    })
                }
            } catch{
                com.RES(res, {
                    state: false
                })
            }
        }
    },
    sendImg: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['sendImg'], obj.token, obj.account)
                var token = genToken()
                fs.writeFile(`./dist/img/${token}.png`, obj.message.img, "binary", (error) => {
                    console.log(error)
                })
                obj.message.img = `img/${token}.png`
                obj.token = '';
                var time = new Date();
                time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
                obj.time = time
                mysqlCon.putMessage(obj.account, obj.account, obj.to, JSON.stringify(obj.message), time)
                mysqlCon.putMessage(obj.to, obj.account, obj.to, JSON.stringify(obj.message), time)
                mysqlCon.setUnreadAdd(obj.to, obj.account);

                var accept = wsObj[obj.account];
                if (accept) {
                    accept.send(JSON.stringify(obj))
                }
                accept = wsObj[obj.to];
                if (accept) {
                    accept.send(JSON.stringify(obj))
                }
                com.RES(res, { state: true })

            } catch{
                com.RES(res, { state: false })
            }
        }
    },
    sendCrowdImg: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['sendImg'], obj.token, obj.account)
                var token = genToken()
                fs.writeFile(`./dist/img/${token}.png`, obj.message.img, "binary", (error) => {
                    console.log(error)
                })
                obj.message.img = `img/${token}.png`
                obj.token = '';
                var time = new Date();
                time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
                obj.time = time

                wsobj[obj.account].send(JSON.stringify(obj))
                var acArr = await mysqlCon.getCrowdAccount(obj.to)
                for (let i = 0; i < acArr.length; i++) {
                    if (wsobj[acArr[i]]) {
                        wsobj[acArr[i]].send(JSON.stringify(obj))
                    }
                }
                com.RES(res, { state: true })

            } catch{
                com.RES(res, { state: false })
            }
        }
    },
    setLogo: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['sendImg'], obj.token, obj.account)
                var token = genToken()
                fs.writeFile(`./dist/img/${token}.png`, obj.message.img, "binary", (error) => {
                    console.log(error)
                })
                mysqlCon.setLogo(obj.account, `img/${token}.png`)
                com.RES(res, { state: true, logo: `img/${token}.png` })
            } catch{
                com.RES(res, { state: false })
            }
        }
    },
    acceptFriend: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['acceptFriend'], obj.token, obj.account)
                var value = await mysqlCon.getPenddingFriend(obj.account);
                if (value.find(element => element.beowned == obj.account)) {
                    mysqlCon.setPendding(obj.from, obj.account, 'accept')
                    mysqlCon.putFriend(obj.account, obj.from, 'accept')
                }
                var accept = wsObj[obj.from];
                if (accept) {
                    accept.send(JSON.stringify({
                        type: 'system',
                        system: {
                            type: 'friendUpdate'
                        }
                    }))
                }
                accept = wsObj[obj.account];
                if (accept) {
                    accept.send(JSON.stringify({
                        type: 'system',
                        system: {
                            type: 'friendUpdate'
                        }
                    }))
                }
                com.RES(res, { state: true })
            } catch{
                com.RES(res, { state: false })
            }
        }
    },
    rejectFriend: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['rejectFriend'], obj.token, obj.account)
                await mysqlCon.setPendding(obj.from, obj.account, 'reject')
                await mysqlCon.putFriend(obj.account, obj.from, 'reject')
                var accept = wsObj[obj.from];
                if (accept) {
                    accept.send(JSON.stringify({
                        type: 'system',
                        system: {
                            type: 'friendUpdate'
                        }
                    }))
                }
                accept = wsObj[obj.account];
                if (accept) {
                    accept.send(JSON.stringify({
                        type: 'system',
                        system: {
                            type: 'friendUpdate'
                        }
                    }))
                }
                com.RES(res, { state: true })
            } catch{
                com.RES(res, { state: false })
            }
        }
    },
    deleteFriend: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['deleteFriend'], obj.token, obj.account)
                await mysqlCon.deleteFriend(obj.account, obj.withWho);
                await mysqlCon.deleteFriend(obj.withWho, obj.account);
                com.RES(res, {
                    state: true
                })
            } catch{
                com.RES(res, {
                    state: false
                })
            }
        }
    },
    deleteCrowd: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['deleteFriend'], obj.token, obj.account)
                await mysqlCon.deleteCrowd(obj.account, obj.withWho);
                com.RES(res, {
                    state: true
                })
            } catch{
                com.RES(res, {
                    state: false
                })
            }
        }
    },
    confirmFriend: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(authLevel['confirmFriend'], obj.token, obj.account)
                if (obj.account == obj.from || obj.account == obj.to) {
                    await mysqlCon.deleteFriend(obj.from, obj.to);
                }
                com.RES(res, {
                    state: true
                })
            } catch{
                com.RES(res, {
                    state: false
                })
            }
        }
    },
    getSystemMessage: {
        type: 'GET',
        data: async function (obj, res) {
            try {
                var value = await mysqlCon.getSystemAlert();
                com.RES(res, value)
            } catch{
                com.RES(res, [])
            }
        }
    },
}
module.exports = api;