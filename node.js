/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-08-27 18:11:03
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-30 15:58:13
 */
console.clear()
var http = require('http');
var fs = require("fs");
var url = require("url");
var api = require('./api');
var route = require('./route')
var wsserve = require('./websocket')
const querystring = require('querystring');
var multiparty = require('multiparty');
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
                if (request.headers['content-type'].split(';')[0] == 'application/json') {
                    post = JSON.parse(post);
                } else if (request.headers['content-type'].split(';')[0] == 'multipart/form-data') {

                    var bon=request.headers['content-type'].split(';')[1].split('=')[1]
                    var bonar=post.split(bon);

                    var ar={};
                    for(let i=0;i<bonar.length;i++){
                        if(bonar[i].search('Content-Disposition: form-data;')>=0){
                            var value=bonar[i].slice(bonar[i].search(/\r\n\r\n/g)+4)
                            value=value.slice(0,value.search(/--/i)-2)

                            var key=bonar[i].slice(bonar[i].search(/name=/g)+6);
                            key=key.slice(0,key.search(/"/i));

                            ar[key]=value
                        }
                    }
                    post=ar
                }
                var path = url.parse(request.url).pathname;
                var data = api[path.split('/')[1]].data(post, response);
            });

        } else if (request.method == "GET") {
            var par = querystring.parse(url.parse(request.url).query)

            var path = url.parse(request.url).pathname;
            var data = api[path.split('/')[1]].data(par, response);
        }


    } else {
        function errParg() {
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
        //处理页面请求
        var par = querystring.parse(url.parse(request.url).query)
        var path = url.parse(request.url).pathname;
        if (path.split('/')[1] == 'admin') {
            if (par.account == 'admin' && par.password == 'qq451582108') {
                fs.readFile(rootPath + '/admin.html', function (err, data) {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(data.toString());
                })
            }
        } else {
            errParg();
        }
    }

}).listen(4516);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:4516/');