'use client'

import { ChangeEvent, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { API } from "lib/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import Input from "components/input/Input"
import InputContainer from "components/input/InputContainer"
import { BackToLogin } from "./BackToLogin"
import ErrorInput from "components/input/ErrorInput"
import { AdminT, VerificationDataResultT } from "lib/types/AdminT.types"
import LoadingSpinner from "components/LoadingSpinner"
import Link from "next/link"
import Button from "components/Button"

export function Verification({
    adminData
}: { adminData: AdminT | undefined }) {
    const [tokenInput, setTokenInput] = useState<string | null>(null)
    const [errInputMessage, setErrInputMessage] = useState<string>('')
    const [msgLoadingVerification, setMsgLoadingVerification] = useState<string | null>('Please wait a moment')
    const [loading, setLoading] = useState<boolean>(true)
    const [success, setSuccess] = useState<boolean>(false)

    const router = useRouter()

    function checkAccount() {
        if (typeof adminData === 'undefined') {
            alert('Account not found or Token is expired')
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
                                alert('Token is expired\nPlease re-register')
                                router.push('/register')
                            }
                        } else {
                            alert('Invalid tokens!')
                            setLoading(false)
                            setMsgLoadingVerification(null)
                        }
                    } else {
                        alert('Invalid tokens or Token is expired!')
                        router.push('/register')
                    }
                })
                .catch((err: any) => {
                    alert('a server error occurred\nPlease try again later')
                    setMsgLoadingVerification(null)
                    setLoading(false)
                    console.log(err)
                })
        }
    }

    useEffect(() => {
        autoSubmit()
    }, [tokenInput])

    function updateAdminIsVerification(): void {
        API().APIPutAdminVerification(adminData?.id, { isVerification: true })
            .then((res: any) => {
                if (res?.data) {
                    return res
                } else {
                    alert('a server error occurred\nPlease try again later')
                    window.location.reload()
                }
            })
            .then((res: any) => {
                deleteExpiredVerification()
            })
            .catch((err: any) => {
                alert('a server error occurred\nPlease try again later')
                setLoading(false)
                setMsgLoadingVerification(null)
                console.log(err)
            })
    }

    function deleteExpiredVerification(): void {
        API().APIDeleteVerification(adminData?.id)
            .then((res: any) => {
                if (res?.data) {
                    setLoading(false)
                    setSuccess(true)
                    setMsgLoadingVerification('Successful Verification')
                } else {
                    alert('a server error occurred\nhappens because the "data" property is missing')
                    setLoading(false)
                    setMsgLoadingVerification(null)
                    console.log(res)
                }
            })
            .catch((err: any) => {
                alert('a server error occurred\nPlease try again later')
                setLoading(false)
                setMsgLoadingVerification(null)
                console.log(err)
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