export default defineNuxtPlugin((nuxtApp) => {
    const aiApi = $fetch.create({
        baseURL: 'http://localhost:8000'
    })

    return {
        provide: {
            aiApi
        }
    }
})
