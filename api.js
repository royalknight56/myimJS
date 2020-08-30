/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-28 15:57:53
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-30 18:21:24
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
var wsArr = require('./websocket')

var fs = require("fs");
mysqlCon.testConnection(function (ifcon) {
    if (ifcon) {
        console.log('Mysql Connect success √');
    } else {
        console.log('failed');
    };
})
function genToken() {
    var ar = '1234567890abcdefghijklmnopqrstuvwxyz'
    var re = ''
    for (let i = 0; i < 30; i++) {
        re += ar[parseInt(Math.random() * 30)]
    }
    return re;
}
var api = {
    buttonget: {
        type: 'GET',
        data: function (obj, res) {
            com.RES(res, { key: 'succ' })
        }
    },
    getOnlineUser:{
        type: 'GET',
        data: function (obj, res) {
            if(obj.account=='admin'&&obj.password=='qq451582108'){
                com.RES(res, { onlineNumber:wsArr.length  })
            }
        }
    },
    login: {
        type: 'POST',
        data: async function (obj, res) {
            var value = await mysqlCon.ifLoginSuccess(obj.account, obj.password).catch((e) => {
                com.RES(res, { iflogin: 'no' })
            })
            if (value.result) {
                var token = genToken();
                mysqlCon.setToken(obj.account, token)
                if (value.state == 'offline') {
                    mysqlCon.setState(obj.account, 'online')
                }
                com.RES(res, { iflogin: 'yes', token: token, account: obj.account })
            } else {
                com.RES(res, { iflogin: 'no' })
            }
        }
    },
    autoLogin: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(1, obj.token, obj.account);
                var token = genToken();
                mysqlCon.setToken(obj.account, token)
                mysqlCon.setState(obj.account, 'online')
                com.RES(res, { state: true, token: token, account: obj.account })
            } catch{
                com.RES(res, { state: false })
            }
        }
    },
    register:{
        type:'POST',
        data: async function (obj, res) {
            try {
                var token = genToken();
                await mysqlCon.putUser (obj.account,obj.password,obj.username,token)
                com.RES(res, { state: true, token: token, account: obj.account })
            } catch{
                com.RES(res, { state: false })
            }
        }
    },
    getFriend: {
        type: 'GET',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(1, obj.token, obj.account);
                var value = await mysqlCon.getFriend(obj.account);
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
                await mysqlCon.ifHaveAuth(1, obj.token, obj.account);
                var value = await mysqlCon.getFriendReq(obj.account);
                for(let i=0;i<value.length;i++){
                    value[i].from=value[i].own
                    value[i].to=value[i].beowned
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
                await mysqlCon.ifHaveAuth(1, obj.token, obj.account)
                var value = await mysqlCon.getMessageWith(obj.account, obj.withWho);
                for(let i=0;i<value.length;i++){
                    value[i].message=JSON.parse(value[i].message);
                }
                com.RES(res, value)
            } catch{
                com.RES(res, [])
            }
        }
    },
    addFriend: {
        type: 'POST',
        data: async function (obj, res) {
            if(obj.account==obj.withWho){
                com.RES(res, {
                    state: false
                })
                return 0
            }
            try {
                await mysqlCon.ifHaveAuth(1, obj.token, obj.account)
                await mysqlCon.addFriend(obj.account, obj.withWho);
                var accept = wsArr.find(element => element.account == obj.withWho);
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
    sendImg:{
        type:'POST',
        data:async function(obj,res){
            try {
                await mysqlCon.ifHaveAuth(1, obj.token, obj.account)
                var token=genToken()
                fs.writeFile(`./dist/img/${token}.png`, obj.message.img, "binary", (error) => {
                    console.log(error)
                })
                obj.message.img=`img/${token}.png`
                obj.token='';
                var time=new Date();
                time=time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()+' '+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()
                mysqlCon.putMessage(obj.account,obj.account,obj.to,JSON.stringify(obj.message),time)
                mysqlCon.putMessage(obj.to,obj.account,obj.to,JSON.stringify(obj.message),time)

                var accept = wsArr.find(element => element.account == obj.account);
                if (accept) {
                    accept.send(JSON.stringify(obj))
                }
                accept = wsArr.find(element => element.account == obj.to);
                if (accept) {
                    accept.send(JSON.stringify(obj))
                }
                com.RES(res, { state: true })

            }catch{
                com.RES(res, { state: false })
            }
        }
    },
    acceptFriend: {
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(1, obj.token, obj.account)
                var value = await mysqlCon.getPenddingFriend(obj.account);
                if (value.find(element => element.beowned == obj.account)) {
                    mysqlCon.setPendding(obj.from, obj.account, 'accept')
                    mysqlCon.putFriend(obj.account,obj.from,'accept')
                }
                var accept = wsArr.find(element => element.account == obj.from);
                if (accept) {
                    accept.send(JSON.stringify({
                        type: 'system',
                        system: {
                            type: 'friendUpdate'
                        }
                    }))
                }
                accept = wsArr.find(element => element.account == obj.account);
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
                await mysqlCon.ifHaveAuth(1, obj.token, obj.account)
                await mysqlCon.setPendding(obj.from, obj.account, 'reject')
                await mysqlCon.putFriend(obj.account,obj.from,'reject')
                var accept = wsArr.find(element => element.account == obj.from);
                if (accept) {
                    accept.send(JSON.stringify({
                        type: 'system',
                        system: {
                            type: 'friendUpdate'
                        }
                    }))
                }
                accept = wsArr.find(element => element.account == obj.account);
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
                await mysqlCon.ifHaveAuth(1, obj.token, obj.account)
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
    confirmFriend:{
        type: 'POST',
        data: async function (obj, res) {
            try {
                await mysqlCon.ifHaveAuth(1, obj.token, obj.account)
                if(obj.account==obj.from||obj.account==obj.to){
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
    }
}
module.exports = api;