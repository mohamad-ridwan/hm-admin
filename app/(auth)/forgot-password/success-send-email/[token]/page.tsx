'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSwr } from 'lib/useFetch/useSwr'
import { API } from 'lib/api';
import { endpoint } from "lib/api/endpoint";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Template from "app/template";
import ProtectContainer from "components/protect/ProtectContainer";
import { AdminT } from 'lib/types/AdminT.types';
import Button from 'components/Button';
import { BackToLogin } from 'components/protect/BackToLogin';
import LoadingSpinner from 'components/LoadingSpinner';

export default function SuccessSendEmailPage() {
    const [emailAdmin, setEmailAdmin] = useState<string>('')
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
                router.push(`/forgot-password/create-new-password/has-been-successfully/${params?.token}`)
            } else {
                getAdmin(userId)
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
        } else if(
            loadingBlackListJWTAPI === false &&
            Array.isArray(dataBlackList)
        ) {
            getAdmin(userId)
        }
    }

    function getAdmin(userId: string): void {
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

            if (findAdmin) {
                setEmailAdmin(findAdmin.email)
                setLoading(false)
            } else {
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

    function openEmail(url: string): void {
        window.open(url)
    }

    return (
        <Template
            key={5}
            isNavigateOff={true}
            title="Success Send Email | Hospice Medical Admin"
            description="sukses mengirim email pada lupa password untuk mereset password pada akun admin hospice medical"
        >
            <ProtectContainer
                icon={<FontAwesomeIcon icon={faEnvelope} />}
                title="Please check your email"
                desc={`We sent a password reset link to`}
                adminEmail={emailAdmin}
            >
                {loading && (
                    <div className="flex flex-col justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-white">
                        <LoadingSpinner />
                        <span className="text-font-color-2 font-bold mt-4">Please wait a moment</span>
                    </div>
                )}
                <Button
                    nameBtn="OPEN EMAIL"
                    classBtn='mt-8 hover:bg-white w-full'
                    classLoading='hidden'
                    clickBtn={() => openEmail('https://mail.google.com')}
                />
                <BackToLogin href="/login" />
            </ProtectContainer>
        </Template>
    )
}