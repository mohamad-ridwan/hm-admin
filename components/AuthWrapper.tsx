'use client'

import { authStore, userIdAuthStore} from "lib/useZustand/auth"
import { ReactNode, useEffect } from "react"
import { useRouter, usePathname } from 'next/navigation'
import { navigationStore } from "lib/useZustand/navigation"

type AuthProps = {
    children: ReactNode
}

export function AuthWrapper({
    children
}: AuthProps) {
    // zustand store
    const { loginSession } = userIdAuthStore()
    // auth
    const { loadingAuth, user } = authStore()
    // navigation
    const { isNotFound } = navigationStore()

    const router = useRouter()
    const pathname = usePathname()

    function redirectPage(): void {
        if (isNotFound === false && user) {
            if (
                loadingAuth === false &&
                user.user === null &&
                !loginSession &&
                !pathname.includes('forgot-password') &&
                !pathname.includes('register')
                ) {
                router.push('/login')

                return
            }else if(
                pathname === '/login' && 
                user.user?.id &&
                loginSession
                ){
                router.push('/')

                return
            }else if(
                pathname === '/register' && 
                user.user?.id &&
                loginSession
                ){
                router.push('/')

                return
            }
        }
    }

    useEffect(() => {
        redirectPage()
    }, [user, loginSession, isNotFound, loadingAuth])

    return children
}