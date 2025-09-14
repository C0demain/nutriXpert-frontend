export default defineNuxtPlugin((nuxtApp) => {
    const { token, isLoggedIn } = useAuthStore()
    const api = $fetch.create({
        baseURL: 'http://localhost:8080',
        onRequest({options}){
            if(isLoggedIn){
                options.headers.set('Authorization', `Bearer ${token}`)
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
