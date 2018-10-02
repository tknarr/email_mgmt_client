import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Users from '@/components/Users'
import Routes from '@/components/Routes'
import Domains from '@/components/Domains'
import VPasswd from '@/components/VPasswd'
import ChangePassword from '@/components/ChangePassword'
import SystemAliases from '@/components/SystemAliases'
import store from '@/store'

Vue.use(Router)

const unauthenticatedPages = ['/', '/login']
const userPages = ['/home']

export const router = new Router({
    base: process.env.ROUTER_BASE,
    mode: 'history',
    routes: [
        {path: '/home', name: 'Home', component: Home},
        {path: '/login', name: 'Login', component: Login},
        {path: '/users', name: 'Users', component: Users},
        {path: '/routes', name: 'Routes', component: Routes},
        {path: '/domains', name: 'Domains', component: Domains},
        {path: '/passwd', name: 'VPasswd', component: VPasswd},
        {path: '/aliases', name: 'SystemAliases', component: SystemAliases},
        {path: '/change_password', name: 'ChangePassword', component: ChangePassword},

        // Unknown paths redirect to the home page, which will bounce to the
        // login page if not logged in.
        {path: '*', redirect: '/home'},
    ],
})

router.beforeEach((to, from, next) => {
    const loginRequired = !unauthenticatedPages.includes(to.path)
    const loggedIn = store.state.account.status.loggedIn
    if (loginRequired && !loggedIn) {
        return next('/login')
    }

    const adminRequired = loginRequired && !userPages.includes(to.path)
    const isAdmin = store.state.account.status.admin
    if (adminRequired && !isAdmin) {
        return next('/home')
    }

    next()
})
