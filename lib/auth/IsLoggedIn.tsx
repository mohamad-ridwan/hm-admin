'use client'

import { endpoint } from "lib/api/endpoint"
import { useSwr } from "lib/useFetch/useSwr"
import { authStore, userIdAuthStore } from "lib/useZustand/auth"
import { sessionDateFormat } from "lib/formats/sessionDateFormat"
import { navigationStore } from "lib/useZustand/navigation"

type ObjString = { [key: string]: any }

export function IsLoggedIn() {
    const { data, error, isLoading } = useSwr(endpoint.getAdmin())
    const { userId, setUserId, loginSession, setLoginSession } = userIdAuthStore()
    const { setUser, setLoadingAuth } = authStore()
    const { setNotification } = navigationStore()

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
                        if (loginSession !== null) {
                            setNotification({
                                onNotif: true,
                                title: 'Your login session has expired',
                                desc: 'Your login session has expired. To gain access, please log in to gain access again'
                            })
                        }
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