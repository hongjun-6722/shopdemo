import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/views/Index'
import Mycenter from '@/views/Mycenter'
import Contents from '@/views/IndexContents'

Vue.use(Router)

const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

var menu = {}

var constantRouter = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    redirect:'/contents',
    children:[{
      name:'contents',
      path:'contents',
      component: Contents,
    },{
      path:'menu/:id',
      name:'menu',
      component:Mycenter,
      props:true,
    },
  ]
  },
  {
    path:'/Mycenter',
    name:'Mycenter',
    component:Mycenter
  },
]

export default new Router({
  mode: 'history',
  routes: constantRouter
})
