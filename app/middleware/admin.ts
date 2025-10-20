export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    if(to.path.startsWith('/admin') && !authStore.isAdmin){
        return navigateTo('/chat', {redirectCode: 403 })
    }
})