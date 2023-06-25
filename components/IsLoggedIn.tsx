'use client'

import { ReactNode, useEffect } from "react"
import { endpoint } from "lib/api/endpoint"
import { useSwr } from "lib/useFetch/useSwr"
import { authStore, userIdAuthStore } from "lib/useZustand/auth"

type IsLoggedInProps = {
    children: ReactNode
}
type ObjString = { [key: string]: any }

export function IsLoggedIn({
    children,
}: IsLoggedInProps) {
    const { data, error, isLoading } = useSwr(endpoint.getAdmin())
    const { userId } = userIdAuthStore()
    const { setUser, setLoadingAuth } = authStore()

    function findAdmin() {
        if (
            typeof isLoading === 'boolean' &&
            !isLoading &&
            typeof data === 'object'
        ) {
            const newData: ObjString = {}
            newData.data = data

            setTimeout(() => {
                if (Array.isArray(newData.data?.data) && newData.data.data.length > 0) {
                    const findUser = newData.data.data.find((admin: ObjString) => admin.id === userId && admin.isVerification)
                    if (!findUser) {
                        setUser({user: null})
                        setLoadingAuth(false)
                    } else {
                        setUser({user: findUser})
                        setLoadingAuth(false)
                    }
                } else {
                    console.log('no one the admin found it')
                    setUser({user: null})
                    setLoadingAuth(false)
                }
            }, 0)
        } else if (isLoading === false && error) {
            alert('Error occurred while fetching admin data')
            setLoadingAuth(false)
        }
    }

    useEffect(() => {
        findAdmin()
    }, [data, error, userId])

    return children
}