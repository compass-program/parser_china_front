import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'main',
            component: () => import('../views/mainPage.vue')
        },
        {
            path: '/auth',
            name: 'auth',
            component: () => import('../views/authPage.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('../views/adminPage.vue'),
            children: [
                {
                    path: 'users',
                    name: 'users',
                    component: () => import('../views/admin/usersPage.vue')
                },
                {
                    path: 'sessions',
                    name: 'sessions',
                    component: () => import('../views/admin/sessionsPage.vue')
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    const accessToken = sessionStorage.getItem('accessToken')
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (!accessToken && to.name !== 'auth') {
        next('/auth')
    } else if (isAdmin !== 'true' && to.fullPath.startsWith('/admin')) {
        next('/')
    } else {
        next()
    }
})

export default router
