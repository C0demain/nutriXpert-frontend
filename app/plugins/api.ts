export default defineNuxtPlugin((nuxtApp) => {
    const authStore = useAuthStore()
    const api = $fetch.create({
        baseURL: 'http://localhost:8080',
        onRequest({options, request}){
            if(authStore.isLoggedIn && !request.toString().startsWith('/auth')){
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
