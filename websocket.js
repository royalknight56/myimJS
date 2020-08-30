/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-28 15:57:53
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-29 21:44:52
 */
var ws = require("nodejs-websocket");
var mysqlCon = require('./mysql');
var conArr=[]
var server = ws.createServer(function(conn){
    
    conn.on("text",async function (str) {
        var obj
        try{
            obj=JSON.parse(str);
            
        }catch{
            return 
        }
        if(obj.type=='auth'){
            mysqlCon.ifHaveAuth(1,obj.token,obj.account).then(
                (value)=>{
                    if(value){
                        conn.account=obj.account;
                        conArr.push(conn)
                        console.log('在线人数'+conArr.length)
                        conn.send(JSON.stringify({
                            type:'state',
                            message:'acc'
                        }))
                    }else{
                        conn.close()
                    }
                }
            ).catch((e)=>{
                conn.close()
            })
        }else if(obj.type=='message'){
            if(obj.to){
                await mysqlCon.ifHaveAuth(1,obj.token,obj.account).catch((e)=>{
                    conn.close()
                })
                var accept=conArr.find(element => element.account==obj.to);
                var time=new Date();
                time=time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()+' '+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()
                if(accept){
                    obj.time=time.toString();
                    accept.send(JSON.stringify(obj))
                }else{
                    console.log('null')
                }
                //'9999-12-31 23:59:59'
                mysqlCon.putMessage(obj.account,obj.to,obj.message,time)
            }
        }else if(obj.type=='system'){
            await mysqlCon.ifHaveAuth(1,obj.token,obj.account).catch((e)=>{
                conn.close()
            })
            if(obj.system.type=='tik'){

            }
        }

    })
    conn.on("close", function (code, reason) {
        mysqlCon.setState(conn.account,'offline')
        var closeCon=conArr.findIndex(element => element.account==conn.account);
        if(closeCon>=0){
            conArr.splice(closeCon, 1);
        }
    });
    conn.on("error", function (code, reason) {
    });
}).listen(4517)
console.log("websocket running at ws://127.0.0.1:4517/")
module.exports=conArr