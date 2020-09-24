/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-09-24 19:25:21
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-09-24 20:16:32
 */

var mysqlCon = require('./mysql');
var multer = require('multer');

var express = require('express');
var app = express();

var bodyparser = require('body-parser');
var wsObj = require('./websocket')
var authLevel = require('./authLevel');
var fs = require("fs");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json())

// app.use(multer()); // for parsing multipart/form-data
const port = 4516//端口设置
var com = {
    RES: function (res, obj) {
        res.send(JSON.stringify(obj));
    }
}
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

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});//设置跨域
app.get('/', (req, res) => res.send('你好世界!'))

app.post('/login',
    async (req, res) => {
        var obj = req.body;
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
)
app.post('/autoLogin',
async (req, res) => {
        var obj = req.body;
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
        } catch {
            com.RES(res, { state: false })
        }
    }
)

app.post('/phonelogin',
async   (req, res) => {
        var obj = req.body;
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
        } catch {
            com.RES(res, { state: false })
        }
    })

app.post('/register',//注册接口
async (req, res) => {
        var obj = req.body;
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
        } catch {
            com.RES(res, { state: false })
        }
    })

app.get('/getFriend',//获取好友列表
async  (req, res) => {
        var obj = req.query;
        try {
            await mysqlCon.ifHaveAuth(authLevel['getFriend'], obj.token, obj.account);
            var value = await mysqlCon.getFriend(obj.account);
            com.RES(res, value)
        } catch {
            com.RES(res, {
                state: 'false'
            })
        }

    })
app.get('/getFriendInfo',//获取好友信息
async (req, res) => {
        var obj = req.query;
        try {
            await mysqlCon.ifHaveAuth(authLevel['getFriendInfo'], obj.token, obj.account);
            var value = await mysqlCon.getUser(obj.withWho);
            value.password = "";
            value.token = "";
            value.auth = "";
            com.RES(res, value)
        } catch {
            com.RES(res, {
                state: 'false'
            })
        }
    })
app.get('/getCrowd',//获取群组列表
async(req, res) => {
        var obj = req.query;
        try {
            await mysqlCon.ifHaveAuth(authLevel['getCrowd'], obj.token, obj.account);
            var value = await mysqlCon.getCrowd(obj.account);
            com.RES(res, value)
        } catch {
            com.RES(res, {
                state: 'false'
            })
        }

    })
app.get('/getFriendRequest',//获得好友请求
async (req, res) => {
        var obj = req.query;
        try {
            await mysqlCon.ifHaveAuth(authLevel['getFriendRequest'], obj.token, obj.account);
            var value = await mysqlCon.getFriendReq(obj.account);
            for (let i = 0; i < value.length; i++) {
                value[i].from = value[i].own
                value[i].to = value[i].beowned
            }
            com.RES(res, value)
        } catch {
            com.RES(res, [])
        }

    })
app.get('/getMessageWith',//获得聊天记录信息
async (req, res) => {
        var obj = req.query;
        try {
            await mysqlCon.ifHaveAuth(authLevel['getMessageWith'], obj.token, obj.account)
            var value = await mysqlCon.getMessageWith(obj.account, obj.withWho)
            for (let i = 0; i < value.length; i++) {
                value[i].message = JSON.parse(value[i].message);
            }
            com.RES(res, value)
            mysqlCon.setUnreadZero(obj.account, obj.withWho);
        } catch {
            com.RES(res, [])
        }

    })
app.post('/readMessageWith',//标记已读
async (req, res) => {
        var obj = req.body;
        try {
            await mysqlCon.ifHaveAuth(authLevel['readMessageWith'], obj.token, obj.account)
            mysqlCon.setUnreadZero(obj.account, obj.withWho);
        } catch{
            com.RES(res, [])
        }
    })
app.post('/addFriend',//添加好友
async (req, res) => {
        var obj = req.body;
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
    })
    app.post('/addCrowd',//添加群组
    async (req, res) => {
        var obj = req.body;
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
    })
    app.post('/createCrowd',//创建群组
    async (req, res) => {
        var obj = req.body;
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
    })
    app.post('/sendImg',//发送图片
    async (req, res) => {
        var obj = req.body;
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
    })
    app.post('/sendCrowdImg',//Todo:发送群组图片
    async (req, res) => {
        var obj = req.body;
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

    })
    app.post('/setLogo',//设置logo
    async (req, res) => {
        var obj = req.body;
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

    })
    app.post('/acceptFriend',//接受好友请求
    async (req, res) => {
        var obj = req.body;
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
    })
    app.post('/rejectFriend',//拒绝好友请求
    async (req, res) => {
        var obj = req.body;
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

    })
    app.post('/deleteFriend',//删除好友
    async (req, res) => {
        var obj = req.body;
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

    })
    app.post('/deleteCrowd',//删除群组
    async (req, res) => {
        var obj = req.body;
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

    })
    app.post('/confirmFriend',//确认好友请求
    async (req, res) => {
        var obj = req.body;
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

    })
    app.get('/getSystemMessage',
    async (req, res) => {
        var obj = req.query;
        try {
            var value = await mysqlCon.getSystemAlert();
            com.RES(res, value)
        } catch{
            com.RES(res, [])
        }
    })
app.listen(port, () => console.log(`Example app listening on port ${port}!`))