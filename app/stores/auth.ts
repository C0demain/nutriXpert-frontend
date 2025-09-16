import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({token: useCookie('token').value}),
    getters: {
        isLoggedIn: (state) => !!state.token
    },
    actions: {
        logout(){
            useCookie('token').value = null
            this.token = null
        },
        setToken(token: string){
            useCookie('token').value = token
            this.token = token
        }
    },
})