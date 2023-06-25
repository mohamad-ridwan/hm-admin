'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserT } from 'lib/types/ZustandT.types'
import { cookieAdminId } from 'lib/useCookie/cookieAdminId'

type StateAuthStore = {
    loadingAuth: boolean
    user: UserT
}

type ActionAuthStore = StateAuthStore & {
    setUser: (userData: UserT) => void
    setLoadingAuth: (param: boolean) => void
}

type AuthStore = ActionAuthStore

type StateUserIdAuthStore = {
    userId: string | null
}

type ActionLoadingAuthStore = StateUserIdAuthStore & {
    setUserId: (id: string | null)=>void
}

type UserIdStore = ActionLoadingAuthStore

export const userIdAuthStore = create<UserIdStore>()(
    persist((set, get) => ({
        userId: null,
        setUserId: (id: string | null)=>set({userId: id})
    }), {
        name: cookieAdminId
    })
)

export const authStore = create<AuthStore>()((set) => ({
    loadingAuth: true,
    user: {
        user: null
    },
    setUser: (userData: UserT) => set(({ user: userData })),
    setLoadingAuth: (param: boolean) => set({ loadingAuth: param })
}))