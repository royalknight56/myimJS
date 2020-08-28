/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-27 22:15:35
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 14:57:32
 */
var mysqlCon = require('./mysql');
var route={
    '/' :{
        path:'home/index.html',
        auth:function(){
            return true;
        }
    },
    '/test':{
        path:'home/test.html',
        auth:function(obj){
            return true;

        }
    },
    '/news':{
        path:'home/news.html',
        auth:function(obj){
            return true;
        }
    },
    '/chat':{
        path:'home/chat.html',
        auth:function(obj){
            return true;
        }
    },
    eachBefore:function(afterSlash,par,next,errPage){
        mysqlCon.ifHaveAuth(afterSlash,par.token).then(
            (value)=>{
                if(value){
                    next();
                }else{
                    errPage()
                }
            }
        );
        return true
    }
}
module.exports=route;