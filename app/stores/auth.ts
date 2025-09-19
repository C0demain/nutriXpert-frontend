import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: useCookie('token').value,
        userId: useCookie('userId').value
    }),
    getters: {
        isLoggedIn: (state) => !!state.token
    },
    actions: {
        logout(){
            useCookie('token').value = null
            useCookie('userId').value = null
            this.token = null
            this.userId = null
        },
        setToken(token: string){
            useCookie('token').value = token
            this.token = token
        },
        setUserId(userId: string){
            useCookie('userId').value = userId
            this.userId = userId
        }
    },
})