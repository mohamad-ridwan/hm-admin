'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import InputContainer from "components/input/InputContainer"
import Input from 'components/input/Input'
import ErrorInput from 'components/input/ErrorInput'
import { mailRegex } from 'lib/regex/mailRegex'
import Button from 'components/Button'
import { BackToLogin } from '../BackToLogin'
import { AdminT } from 'lib/types/AdminT.types'
import { API } from 'lib/api'
import { sendEmail } from 'lib/emailJS/sendEmail'

type StateEmail = { email: string }

export function ForgotPassword() {
    const [urlOrigin, setUrlOrigin] = useState<string | null>(null)
    const [inputEmail, setInputEmail] = useState<string>('')
    const [errMsg, setErrMsg] = useState<StateEmail | null>(null)
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)

    const router = useRouter()

    useEffect(() => {
        const url: string = window.location.origin
        setUrlOrigin(url)
    }, [])

    function handleInput(e: ChangeEvent<HTMLInputElement>): void {
        setInputEmail(e.target.value)
        setErrMsg({ email: '' })
    }

    function handleSubmit(): void {
        if (loadingSubmit === false) {
            let err: StateEmail = {} as StateEmail

            if (!inputEmail.trim()) {
                err.email = 'Must be required'
            } else if (!mailRegex.test(inputEmail)) {
                err.email = 'Invalid email address'
            }

            if (!err.email) {
                setLoadingSubmit(true)
                checkEmailUser()
            } else {
                setErrMsg(err)
            }
        }
    }

    function checkEmailUser(): void {
        API().APIGetAdmin()
            .then((res: any) => {
                let dataAdmin: AdminT[] | undefined = undefined
                dataAdmin = res?.data
                if (Array.isArray(dataAdmin) && dataAdmin.length > 0) {
                    const findAdmin: AdminT | undefined = dataAdmin.find(admin =>
                        admin.email === inputEmail && admin.isVerification
                    )

                    if (typeof findAdmin === 'object' && findAdmin.id) {
                        createJwtToken(findAdmin.id, findAdmin.email)
                    } else {
                        alert('Unregistered account!')
                        setLoadingSubmit(false)
                    }
                } else {
                    alert('Unregistered account!')
                    setLoadingSubmit(false)
                }
            })
            .catch((err: any) => {
                alert('a server error occurred\nPlease try again later')
                console.log(err)
                setLoadingSubmit(false)
            })
    }

    function createJwtToken(userId: string, email: string): void {
        API().APIPostCreateJwtToken(userId)
            .then((res: any) => {
                if(res?.error === null){
                    const serviceId: string = process.env.NEXT_PUBLIC_SERVICE_ID_ADM as string
                    const templateId: string = process.env.NEXT_PUBLIC_TEMPLATE_ID_ADM as string
                    const publicKey: string = process.env.NEXT_PUBLIC_PUBLIC_KEY_ADM as string

                    const dataSend = {
                        to_email: email,
                        url: `${urlOrigin}/forgot-password/create-new-password/${res.token}`
                    }

                    sendEmail(
                        serviceId,
                        templateId,
                        dataSend,
                        publicKey
                    )
                    .then(resEmail=>{
                        router.push(`/forgot-password/success-send-email/${res.token}`)
                    })
                    .catch(err=>{
                        alert('a server error occurred\noccurs because when sending email')
                        console.log(err)
                        setLoadingSubmit(false)
                    })
                }else if(res?.error !== null){
                    alert(res.error)
                    setLoadingSubmit(false)
                    console.log(res)
                }
            })
            .catch((err: any) => {
                alert('a server error occurred\nPlease try again later')
                console.log(err)
                setLoadingSubmit(false)
            })
    }

    return (
        <InputContainer
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}
            className="flex flex-col w-full"
        >
            <Input
                type="text"
                placeholder="Enter email address"
                nameInput="email"
                valueInput={inputEmail}
                changeInput={handleInput}
                styles={{
                    marginTop: '2rem'
                }}
            />
            <ErrorInput
                error={errMsg?.email as string}
            />

            <Button
                nameBtn="RESET PASSWORD"
                classBtn={loadingSubmit ? 'mt-8 hover:text-white hover:bg-color-default cursor-default' : 'mt-8 hover:bg-white'}
                disabled={loadingSubmit ? true : false}
                classLoading={loadingSubmit ? '' : 'hidden'}
                clickBtn={handleSubmit}
            />

            <BackToLogin href="/login" />
        </InputContainer>
    )
}