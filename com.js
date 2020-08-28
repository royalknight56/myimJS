var com={
    RES:function(res,obj){
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
        });

        res.write(JSON.stringify(obj));
        res.end();
    }
}
module.exports=com;