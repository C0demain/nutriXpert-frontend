export default defineNuxtRouteMiddleware((to, from) => {
    const {isLoggedIn} = useAuthStore()
    if(to.path === '/login' && isLoggedIn){
        return navigateTo('/')
    }

    if(to.path !== '/login' && !isLoggedIn){
        return navigateTo('/login')
    }
})