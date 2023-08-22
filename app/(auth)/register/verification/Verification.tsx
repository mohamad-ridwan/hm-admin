'use client'

import { ChangeEvent, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { API } from "lib/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import Input from "components/input/Input"
import InputContainer from "components/input/InputContainer"
import { BackToLogin } from "../../BackToLogin"
import ErrorInput from "components/input/ErrorInput"
import { AdminT, VerificationDataResultT } from "lib/types/AdminT.types"
import LoadingSpinner from "components/LoadingSpinner"
import Link from "next/link"
import Button from "components/Button"
import { navigationStore } from "lib/useZustand/navigation"
import { AlertsT } from "lib/types/TableT.type"
import { AuthRequiredError } from "lib/errorHandling/exceptions"

export function Verification({
    adminData
}: { adminData: AdminT | undefined }) {
    const [tokenInput, setTokenInput] = useState<string | null>(null)
    const [errInputMessage, setErrInputMessage] = useState<string>('')
    const [msgLoadingVerification, setMsgLoadingVerification] = useState<string | null>('Please wait a moment')
    const [loading, setLoading] = useState<boolean>(true)
    const [success, setSuccess] = useState<boolean>(false)
    const [triggerErr, setTriggerErr] = useState<{onTrigger: boolean, message: string}>({
        onTrigger: false,
        message: ''
    })

    const {setOnAlerts} = navigationStore()

    if(triggerErr.onTrigger){
        throw new AuthRequiredError(triggerErr.message)
    }

    const router = useRouter()

    function checkAccount() {
        if (typeof adminData === 'undefined') {
            setOnAlerts({
                onAlert: true,
                title: 'Account not found or Token is expired',
                desc: 'Please re-verify'
            })
            setTimeout(() => {
                setOnAlerts({} as AlertsT)
            }, 3000)
            router.push('/register')
        }else if(typeof adminData === 'object' && adminData.id){
            setLoading(false)
            setMsgLoadingVerification(null)
        }
    }

    useEffect(() => {
        checkAccount()
    }, [adminData])

    function autoSubmit(): void {
        if (tokenInput?.length === 4) {
            setLoading(true)
            setMsgLoadingVerification('Waiting for verification')

            API().APIGetVerification()
                .then((res: any) => {
                    const result: VerificationDataResultT[] | undefined | null = res?.data ? res.data : null
                    if (Array.isArray(result) && result.length > 0) {
                        const findAdminVerif = result.find(admin => admin.verification?.token === tokenInput)
                        const dateVerification: string | undefined | null = findAdminVerif?.userId ? findAdminVerif.verification?.date as string | undefined : null

                        if (typeof dateVerification === 'string') {
                            const isNotExpiredToken: boolean = `${new Date()}` < dateVerification
                            if (isNotExpiredToken) {
                                updateAdminIsVerification()
                            } else {
                                setOnAlerts({
                                    onAlert: true,
                                    title: 'Token is expired',
                                    desc: 'Please re-register'
                                })
                                setTimeout(() => {
                                    setOnAlerts({} as AlertsT)
                                }, 3000)
                                router.push('/register')
                            }
                        } else {
                            setOnAlerts({
                                onAlert: true,
                                title: 'Invalid tokens!',
                                desc: 'Please re-register'
                            })
                            setTimeout(() => {
                                setOnAlerts({} as AlertsT)
                            }, 3000)
                            setLoading(false)
                            setMsgLoadingVerification(null)
                        }
                    } else {
                        setOnAlerts({
                            onAlert: true,
                            title: 'Invalid tokens or Token is expired!',
                            desc: 'Please re-register'
                        })
                        setTimeout(() => {
                            setOnAlerts({} as AlertsT)
                        }, 3000)
                        router.push('/register')
                    }
                })
                .catch((err: any) => {
                    setTriggerErr({
                        onTrigger: true,
                        message: 'A server error occurred. Please try again'
                    })
                })
        }
    }

    useEffect(() => {
        autoSubmit()
    }, [tokenInput])

    function updateAdminIsVerification(): void {
        API().APIPutAdminVerification(adminData?.id as string, { isVerification: true })
            .then((res: any) => {
                if (res?.data) {
                    return res
                } else {
                    setTriggerErr({
                        onTrigger: true,
                        message: 'A server error occurred. Please try again'
                    })
                }
            })
            .then((res: any) => {
                deleteExpiredVerification()
            })
            .catch((err: any) => {
                setTriggerErr({
                    onTrigger: true,
                    message: 'A server error occurred. Please try again'
                })
            })
    }

    function deleteExpiredVerification(): void {
        API().APIDeleteVerification(adminData?.id as string)
            .then((res: any) => {
                if (res?.data) {
                    setLoading(false)
                    setSuccess(true)
                    setMsgLoadingVerification('Successful Verification')
                } else {
                    setTriggerErr({
                        onTrigger: true,
                        message: 'A server error occurred. Happens because the "data" property is missing'
                    })
                }
            })
            .catch((err: any) => {
                setTriggerErr({
                    onTrigger: true,
                    message: 'A server error occurred. Please try again'
                })
            })
    }

    function changeInput(e: ChangeEvent<HTMLInputElement>) {
        setTokenInput(e.target.value)
        setErrInputMessage('')
    }

    function submit() {
        if (tokenInput?.length !== 4) {
            setErrInputMessage('Maximum 4 digit code')
            return
        }
        autoSubmit()
    }

    return (
        <>
            {loading && (
                <div className="flex flex-col justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-white">
                    <LoadingSpinner />
                    <span className="text-font-color-2 font-bold mt-4">{msgLoadingVerification}</span>
                </div>
            )}
            {success && (
                <div className="flex flex-col justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-white">
                    <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-color-default text-5xl"
                    />
                    <span className="text-font-color-2 font-bold mt-4">{msgLoadingVerification}</span>
                    <Link href='/login'>
                        <Button
                            nameBtn="BACK TO LOG IN"
                            classBtn="px-9 mt-8 hover:bg-white text-color-default"
                            classLoading="hidden"
                        />
                    </Link>
                </div>
            )}

            <InputContainer
                tag='form'
                onSubmit={(e) => {
                    e.preventDefault()
                    submit()
                }}
                className="flex flex-col w-full"
            >
                <Input
                    type="text"
                    placeholder="4 digit code"
                    maxLength={4}
                    nameInput="token"
                    changeInput={changeInput}
                    styles={{
                        marginTop: '2rem'
                    }}
                />
                <ErrorInput error={errInputMessage} />
            </InputContainer>

            <BackToLogin href="/login" />
        </>
    )
}