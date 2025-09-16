export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()
    if(to.path === '/login' && authStore.isLoggedIn){
        return navigateTo('/')
    }

    if(to.path !== '/login' && !authStore.isLoggedIn){
        return navigateTo('/login')
    }
})