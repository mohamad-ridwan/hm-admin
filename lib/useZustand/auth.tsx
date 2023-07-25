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
    loginSession: Date | null
}

type ActionLoadingAuthStore = StateUserIdAuthStore & {
    setUserId: (id: string | null)=>void
    setLoginSession: (date: Date | null)=>void
}

type UserIdStore = ActionLoadingAuthStore

export const userIdAuthStore = create<UserIdStore>()(
    persist((set, get) => ({
        userId: null,
        loginSession: null,
        setUserId: (id)=>set({userId: id}),
        setLoginSession: (date)=>set({loginSession: date})
    }), {
        name: cookieAdminId
    })
)

export const authStore = create<AuthStore>()((set) => ({
    loadingAuth: true,
    user: {
        user: null
    },
    setUser: (userData) => set(({ user: userData })),
    setLoadingAuth: (param) => set({ loadingAuth: param })
}))