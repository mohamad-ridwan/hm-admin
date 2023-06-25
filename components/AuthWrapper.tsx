'use client'

import { authStore} from "lib/useZustand/auth"
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
    // auth
    const { loadingAuth, user } = authStore()
    // navigation
    const { isNotFound } = navigationStore()

    const router = useRouter()
    const pathname = usePathname()

    function redirectPage(): void {
        if (isNotFound === false) {
            if (user.user === null &&
                loadingAuth === false &&
                !pathname.includes('forgot-password') &&
                !pathname.includes('register')
                ) {
                router.push('/login')

                return
            }else if(pathname === '/login' && user.user?.id){
                router.push('/')

                return
            }else if(pathname === '/register' && user.user?.id){
                router.push('/')

                return
            }
        }
    }

    useEffect(() => {
        redirectPage()
    }, [isNotFound, user, loadingAuth])

    return children
}