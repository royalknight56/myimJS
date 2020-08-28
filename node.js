/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-27 18:11:03
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 22:24:58
 */
var http = require('http');
var fs = require("fs");
var url = require("url");
var api = require('./api');
var route = require('./route')
var wsserve=require('./websocket')
const querystring = require('querystring');

var iconPath = 'home/JS.png'
var rootPath = 'home'

http.createServer(function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    var afterSlash = url.parse(request.url).pathname.slice(1);
    if (request.url == '/favicon.ico') {
        //图标请求
        response.setHeader("Content-Type", 'image/x-icon');
        //格式必须为 binary 否则会出错
        var content = fs.readFileSync(iconPath, "binary");
        response.writeHead(200, "Ok");
        response.write(content, "binary"); //格式必须为 binary，否则会出错
        response.end();
    } else if (api[afterSlash] != undefined && api[afterSlash].type == request.method) {
        //处理API请求
        if (request.method == "POST") {
            // 定义了一个post变量，用于暂存请求体的信息
            var post = '';
            request.on('data', function (chunk) {
                post += chunk.toString();
            });
            request.on('end', function () {
                post = JSON.parse(post);
                var path = url.parse(request.url).pathname;
                var data = api[path.split('/')[1]].data(post,response);
            });

        } else if (request.method == "GET") {
            var par = querystring.parse(url.parse(request.url).query)

            var path = url.parse(request.url).pathname;
            var data = api[path.split('/')[1]].data(par,response);
        }


    } else {
        //处理页面请求
        function errParg(){
            fs.readFile(rootPath + '/news.html', function (err, data) {
                if (err) {//没有home/index
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end("sorry");
                    return -1;
                }
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data.toString());
            })
        }
        errParg();
    }

}).listen(8080);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8080/');