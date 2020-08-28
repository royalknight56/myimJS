/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-16 15:16:49
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-07-16 15:27:43
 */ 
import axios from 'axios'

const server = axios.create({
  baseURL: process.env.VUE_APP_API
})

/**
 * 请求拦截器
 */
server.interceptors.request.use(function (config) {
  console.log(config)
  return config
}, function (error) {
  return Promise.reject(error)
})

/**
 * 响应拦截器
 */
server.interceptors.response.use(({ data, headers }) => {
  console.log(data,headers)
}, error => {
  return Promise.reject(error)
})

export default server
