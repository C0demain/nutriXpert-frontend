import { defineStore } from "pinia";
import type { Role } from "~/types/Role";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: useCookie('token').value,
        userId: useCookie('userId').value,
        role: useCookie('role').value as Role | null | undefined
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
        isAdmin: (state) => !!state.role && state.role !== 'USER'
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
        },
        setRole(role: Role | undefined | null){
            useCookie('role').value = role
            this.role = role
        }
    },
})