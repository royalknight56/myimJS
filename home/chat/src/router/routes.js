/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 16:41:16
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-07-16 15:00:28
 */ 
import Layout from '@/views/layout'

export default [
  // 主页
  {
    path: '/', 
    redirect: '/center'
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
            path: '',
            name: 'center1',
            meta: { title: 'center1', icon: 'deploy' },
            component: () => import( '../views/center1')
          },
          {
            path: 'center2',
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
  
]
