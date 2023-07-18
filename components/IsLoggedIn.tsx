'use client'

import { ReactNode, useEffect } from "react"
import { endpoint } from "lib/api/endpoint"
import { useSwr } from "lib/useFetch/useSwr"
import { authStore, userIdAuthStore } from "lib/useZustand/auth"
import { AuthRequiredError } from "lib/errorHandling/exceptions"
import ServicingHours from "lib/actions/ServicingHours"

type IsLoggedInProps = {
    children: ReactNode
}

type ObjString = { [key: string]: any }

export function IsLoggedIn({
    children,
}: IsLoggedInProps) {
    const { data, error, isLoading } = useSwr(endpoint.getAdmin())
    const { userId, setUserId } = userIdAuthStore()
    const { setUser, setLoadingAuth } = authStore()

    function findAdmin(): void {
        if (!isLoading &&
            typeof data === 'object'
        ) {
            const newData: ObjString = {}
            newData.data = data

            setTimeout(() => {
                if (Array.isArray(newData.data?.data) && newData.data.data.length > 0) {
                    const findUser = newData.data.data.find((admin: ObjString) => admin.id === userId && admin.isVerification)
                    if (!findUser) {
                        setUser({user: null})
                        setUserId(null)
                        setLoadingAuth(false)
                    } else {
                        setUser({user: findUser})
                        setLoadingAuth(false)
                    }
                } else {
                    console.log('no one the admin found it')
                    setUser({user: null})
                    setUserId(null)
                    setLoadingAuth(false)
                }
            }, 0)
        } else if (isLoading === false && error) {
            setLoadingAuth(false)
        }
    }

    useEffect(() => {
        findAdmin()
    }, [data, error, userId])

    return children
}