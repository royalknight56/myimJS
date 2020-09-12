/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 16:41:16
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-09-06 22:53:32
 */ 
import Layout from '@/views/layout'

export default [
  // 主页
  {
    path: '/', 
    redirect: '/home'
  },
  {
    path: '/center',
    component: Layout,
    children: [
      {
        path: '',
        name: 'center',
        meta: { title: 'center', icon: 'deploy' },
        component: () => import( '../views/center'),
        children:[
          {
            path: '/chat',
            name: 'chat',
            meta: { title: 'chat', icon: 'deploy' },
            component: () => import( '../views/chat')
          },
          {
            path: '/page',
            name: 'center2',
            meta: { title: 'center2', icon: 'deploy' },
            component: () => import( '../views/center2')
          }
        ]
      },
    ]
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        meta: { title: 'home', icon: 'deploy' },
        component: () => import( '../views/home')
      }
    ]
  },
  {
    path: '/home2',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home2',
        meta: { title: 'home2', icon: 'deploy' },
        component: () => import( '../views/home2')
      }
    ]
  },
  
]
