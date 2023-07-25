'use client'

import { endpoint } from "lib/api/endpoint"
import { useSwr } from "lib/useFetch/useSwr"
import { authStore, userIdAuthStore } from "lib/useZustand/auth"
import { sessionDateFormat } from "lib/formats/sessionDateFormat"

type ObjString = { [key: string]: any }

export function IsLoggedIn() {
    const { data, error, isLoading } = useSwr(endpoint.getAdmin())
    const { userId, setUserId, loginSession, setLoginSession } = userIdAuthStore()
    const { setUser, setLoadingAuth } = authStore()

    function findAdmin(): void {
        if (
            !isLoading &&
            typeof data === 'object'
        ) {
            const newData: ObjString = {}
            newData.data = data
            const isLoginExpired = loginSession !== null ? new Date(loginSession).valueOf() > sessionDateFormat(0).valueOf() ? true : false : false

            const notLoggedIn = () => {
                setUser({ user: null })
                setUserId(null)
                setLoginSession(null)
                setLoadingAuth(false)
            }

            setTimeout(() => {
                if (Array.isArray(newData.data?.data) && newData.data.data.length > 0) {
                    const findUser = newData.data.data.find((admin: ObjString) => admin.id === userId && admin.isVerification)
                    if (!findUser) {
                        notLoggedIn()
                    } else if (isLoginExpired) {
                        setUser({ user: findUser })
                        setLoadingAuth(false)
                    } else {
                        notLoggedIn()
                    }
                } else {
                    console.log('no one the admin found it')
                    notLoggedIn()
                }
            }, 0)
        } else if (isLoading === false && error) {
            setLoadingAuth(false)
        }
    }

    return {
        findAdmin
    }
}