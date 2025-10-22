export default defineNuxtRouteMiddleware((to, from) => {
    if(to.path.startsWith('/admin') && useCookie('role').value !== 'ADMIN'){
        return navigateTo('/chat', {redirectCode: 403 })
    }
})