export default defineNuxtPlugin((nuxtApp) => {
    const authStore = useAuthStore()
    const api = $fetch.create({
        baseURL: 'http://localhost:8080',
        onRequest({options}){
            if(authStore.isLoggedIn){
                options.headers.set('Authorization', `Bearer ${authStore.token}`)
            }
        },
        onResponseError({response}){
            if(response.status === 401){
                navigateTo('/login')
            }
        }
    })

    return {
        provide: {
            api
        }
    }
})
