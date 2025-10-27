export default defineNuxtRouteMiddleware((to, from) => {
    console.log('auth', to)
    if(to.path === '/login' && !!useCookie('token').value){
        return navigateTo(useCookie('role').value === 'ADMIN' ? '/admin/users': '/')
    }

    if(to.path !== '/login' && !useCookie('token').value){
        return navigateTo('/login')
    }
})