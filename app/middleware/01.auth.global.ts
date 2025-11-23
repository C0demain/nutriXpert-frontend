export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('token').value
    const role = useCookie('role').value
    
    if(to.path === '/login' && !!token){
        return navigateTo(role === 'ADMIN' ? '/admin/users' : '/chat')
    }

    if(!['/login', '/register', '/'].includes(to.path) && !token){
        return navigateTo({path: '/login', query: {redirectUrl: from.path}})
    }
    
    if(to.path.startsWith('/admin') && role !== 'ADMIN'){
        return navigateTo('/chat')
    }
})