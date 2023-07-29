'use client'

import { ReactNode, useEffect } from "react"
import { setHead } from "lib/SetHead"
import { navigationStore } from "lib/useZustand/navigation"
import { AuthWrapper } from "lib/auth/AuthWrapper"
import { authStore, userIdAuthStore } from "lib/useZustand/auth"
import { IsLoggedIn } from "lib/auth/IsLoggedIn"
import { endpoint } from "lib/api/endpoint"
import { useSwr } from "lib/useFetch/useSwr"

type DefaultProps = {
    isNavigateOff?: boolean
    className?: string
    children: ReactNode
}

type HeadProps = DefaultProps & {
    title?: string
    description?: string
}

type TemplateProps = HeadProps

export default function Template({
    isNavigateOff,
    className,
    children,
    title,
    description
}: TemplateProps) {
    const { data, error } = useSwr(endpoint.getAdmin())

    const {
        findAdmin
    } = IsLoggedIn()
    const {
        redirectPage
    } = AuthWrapper()

    const { loginSession, userId } = userIdAuthStore()
    const { loadingAuth, user } = authStore()
    const { isNotFound, setNavigate } = navigationStore()

    useEffect(() => {
        if (typeof title === 'string') {
            setHead({
                title: title,
                description: description as string
            })
        }
        if (isNavigateOff) {
            setTimeout(() => {
                setNavigate(false)
            }, 50)
        } else if (typeof isNavigateOff === 'undefined') {
            setNavigate(true)
        }
    }, [])

    useEffect(() => {
        redirectPage()
    }, [user, loginSession, isNotFound, loadingAuth])

    useEffect(() => {
        findAdmin()
    }, [data, error, userId, loginSession])

    return <div className={className}>{children}</div>
}