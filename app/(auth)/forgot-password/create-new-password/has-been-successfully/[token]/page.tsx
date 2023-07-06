'use client'

import { useState, useEffect } from 'react'
import {useRouter, useParams} from 'next/navigation'
import { useSwr } from 'lib/useFetch/useSwr'
import { endpoint } from 'lib/api/endpoint'
import { API } from 'lib/api'
import Link from 'next/link'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Template from 'app/template'
import ProtectContainer from 'components/views/auth/ProtectContainer'
import Button from 'components/Button'
import { AdminT } from 'lib/types/AdminT.types'
import LoadingSpinner from 'components/LoadingSpinner'

export default function SuccessPasswordReset() {
    const [loading, setLoading] = useState<boolean>(true)

    const router = useRouter()
    const params = useParams()

    // swr fetching data
    // black list jwt
    const { data: dataBlackListJWTAPI, error: errBlackListJWTAPI, isLoading: loadingBlackListJWTAPI } = useSwr(endpoint.getBlackListJWT())
    // admin
    const { data: dataAdmin, error: errDataAdmin, isLoading: loadingDataAdmin } = useSwr(endpoint.getAdmin())

    function getJwtToken(): void {
        if (params?.token) {
            API().APIGetJwtTokenVerif(params.token)
                .then((res: any) => {
                    if (res?.error !== null) {
                        alert(res.error)
                        router.push('/login')
                    } else {
                        checkBlackListToken(res?.data?.userData?.id as string)
                    }
                })
                .catch((err: any) => {
                    alert('a server error occurred\nPlease try again later')
                    console.log(err)
                    router.push('/login')
                })
        }
    }

    useEffect(() => {
        getJwtToken()
    }, [params, dataBlackListJWTAPI, dataAdmin])

    async function checkBlackListToken(userId: string): Promise<any> {
        let dataBlackList: { [key: string]: any }[] | { [key: string]: any } | undefined | null = {}
        dataBlackList = typeof dataBlackListJWTAPI === 'object' ? dataBlackListJWTAPI : undefined
        dataBlackList = await dataBlackList?.data

        if (
            loadingBlackListJWTAPI === false &&
            Array.isArray(dataBlackList) &&
            dataBlackList.length > 0
        ) {
            const findBlackList = dataBlackList.find(token => token?.token === params?.token)

            if (findBlackList) {
                getAdmin(userId, true)
            } else {
                getAdmin(userId, false)
            }
        } else if (
            loadingBlackListJWTAPI === false &&
            !Array.isArray(dataBlackList)
        ) {
            alert('a server error occurred\nPlease try again later')
            setTimeout(() => {
                router.push('/login')
                console.log(errBlackListJWTAPI)
            }, 0)
        } else if (
            loadingBlackListJWTAPI === false &&
            Array.isArray(dataBlackList)
        ) {
            getAdmin(userId, false)
        }
    }

    function getAdmin(userId: string, isTokenBlackList: boolean): void {
        let newDataAdmin: { [key: string]: any }[] | { [key: string]: any } | undefined | null = {}
        newDataAdmin = dataAdmin as {}
        newDataAdmin = newDataAdmin?.data
        if (
            loadingDataAdmin === false &&
            Array.isArray(newDataAdmin) &&
            newDataAdmin.length > 0
        ) {
            const findAdmin: AdminT | undefined = newDataAdmin.find(admin =>
                admin?.id === userId && admin?.isVerification
            )

            if (findAdmin && isTokenBlackList) {
                setLoading(false)
            } else if(findAdmin && !isTokenBlackList){
                router.push(`/forgot-password/success-send-email/${params?.token}`)
            }else {
                alert('User not found!')
                router.push('/login')
            }
        } else if (newDataAdmin?.length === 0) {
            alert('User not found!')
            router.push('/login')
        } else {
            alert('a server error occurred\nPlease try again later')
            setTimeout(() => {
                router.push('/login')
                console.log(errDataAdmin)
            }, 0)
        }
    }

    return (
        <Template
            key={6}
            isNavigateOff={true}
            title="Success Password Reset | Hospice Medical Admin"
            description="berhasil reset password akun admin hospice medical"
        >
            <ProtectContainer
                icon={<FontAwesomeIcon icon={faCheck} />}
                classIcon='bg-green-success-young text-green-success border-border-success'
                title="Password Reset"
                desc="Your password has been successfully reset. Click below to log in magically."
            >
                {loading && (
                    <div className="flex flex-col justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-white">
                        <LoadingSpinner />
                        <span className="text-font-color-2 font-bold mt-4">Please wait a moment</span>
                    </div>
                )}

                <Link href='/login'>
                    <Button
                        nameBtn="BACK TO LOG IN"
                        classBtn='mt-8 w-full hover:bg-white'
                        classLoading='hidden'
                    />
                </Link>
            </ProtectContainer>
        </Template>
    )
}