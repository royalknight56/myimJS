/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-27 18:11:03
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 15:47:11
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
                // response.writeHead(200, {
                //     'Content-Type': 'application/json',
                // });
                // response.write(data);
                // response.end();
            });

        } else if (request.method == "GET") {
            var par = querystring.parse(url.parse(request.url).query)

            var path = url.parse(request.url).pathname;
            var data = api[path.split('/')[1]].data(par,response);

            // response.writeHead(200, {
            //     'Content-Type': 'application/json',
            // });
            // response.write(data);
            // response.end();
        }


    } else {
        //处理页面请求
        function next(){
            var path = route['/' + afterSlash].path
            // console.log('打开资源:' + path);
            fs.readFile(path, function (err, data) {
                if (err) {//home中没有对应文件
                    fs.readFile(rootPath + '/index.html', function (err, data) {
                        if (err) {//没有home/index
                            response.writeHead(200, { 'Content-Type': 'text/html' });
                            response.end("sorry");
                            return -1;
                        }
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.end(data.toString());
                    })
                    return -1;
                }
                // console.log(data.toString());
                response.writeHead(200, { 'Content-Type': 'text/html' });
                // 发送响应数据
                response.end(data.toString());
            });
        }
        function errParg(){
            fs.readFile(rootPath + '/index.html', function (err, data) {
                if (err) {//没有home/index
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end("sorry");
                    return -1;
                }
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data.toString());
            })
        }
        var par = querystring.parse(url.parse(request.url).query)
        if (route['/' + afterSlash]) {
            route.eachBefore(afterSlash,par,next,errParg)
        } else {
            errParg();
            return -1;
        }
    }

}).listen(8080);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8080/');