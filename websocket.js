var ws = require("nodejs-websocket");
var mysqlCon = require('./mysql');

var server = ws.createServer(function(conn){
    conn.on("text", function (str) {
        var obj
        try{
            obj=JSON.parse(str);
            
        }catch{
            return 
        }
        if(obj.type=='auth'){
            mysqlCon.ifHaveAuth('chat',obj.token).then(
                (value)=>{
                    if(value){
                        console.log('有chat权限')
                    }else{
                        console.log('无chat权限')
                        conn.close()
                    }
                }
            )
        }
    })
    conn.on("close", function (code, reason) {
    });
    conn.on("error", function (code, reason) {
    });
}).listen(8001)
console.log("websocket success  √")
console.log("ws://127.0.0.1:8001/")
module.exports=server