import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: useCookie('token').value,
        userId: useCookie('userId').value,
        role: useCookie('role').value
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
        isAdmin: (state) => !!state.role && state.role !== 'USER'
    },
    actions: {
        logout(){
            useCookie('token').value = null
            useCookie('userId').value = null
            useCookie('role').value = null
            this.token = null
            this.userId = null
            this.role = null
        },
        setToken(token: string){
            useCookie('token').value = token
            this.token = token
        },
        setUserId(userId: string){
            useCookie('userId').value = userId
            this.userId = userId
        },
        setRole(role: string){
            useCookie('role').value = role
            this.role = role
        }
    },
})