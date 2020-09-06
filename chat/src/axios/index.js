/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-16 15:16:49
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-30 23:26:33
 */ 
import axios from 'axios'

const server = axios.create({
  baseURL: process.env.VUE_APP_API
})

/**
 * 请求拦截器
 */
server.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

/**
 * 响应拦截器
 */
server.interceptors.response.use(({ data, headers }) => {
  data;
  headers
}, error => {
  return Promise.reject(error)
})

export default server
