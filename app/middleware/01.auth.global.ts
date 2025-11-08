export default defineNuxtRouteMiddleware((to, from) => {
    if(to.path === '/login' && !!useCookie('token').value){
        return navigateTo(useCookie('role').value === 'ADMIN' ? '/admin/users': '/')
    }

    if(to.path !== '/login' && !useCookie('token').value){
        return navigateTo({path: '/login', query: {redirectUrl: from.path} })
    }
})