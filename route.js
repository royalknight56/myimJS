/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-27 22:15:35
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 19:16:19
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
    eachBefore:function(next,errPage){
        next();
        return true
    }
}
module.exports=route;