'use client'

import { useState, useEffect, ChangeEvent } from "react"
import { useRouter, useParams } from 'next/navigation'
import { useSwr } from "lib/useFetch/useSwr"
import { API } from "lib/api"
import { faKey } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Template from "app/template"
import ProtectContainer from "components/protect/ProtectContainer"
import { AdminT } from "lib/types/AdminT.types"
import { endpoint } from "lib/api/endpoint"
import LoadingSpinner from "components/LoadingSpinner"
import InputContainer from "components/input/InputContainer"
import Input from "components/input/Input"
import ErrorInput from "components/input/ErrorInput"
import Button from "components/Button"
import { BackToLogin } from "components/protect/BackToLogin"

type InputPasswordT = {
    password: string
    confirmPassword: string
}

export default function CreateNewPasswordPage() {
    const [loading, setLoading] = useState<boolean>(true)
    const [admin, setAdmin] = useState<AdminT | null>(null)
    const [inputPassword, setInputPassword] = useState<InputPasswordT>({
        password: '',
        confirmPassword: ''
    })
    const [errMsg, setErrMsg] = useState<InputPasswordT>({} as InputPasswordT)
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)

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
        } else if (
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
                setAdmin(findAdmin)
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

    function handleInput(e: ChangeEvent<HTMLInputElement>): void {
        setInputPassword({
            ...inputPassword,
            [e.target.name]: e.target.value
        })
        setErrMsg({
            ...errMsg,
            [e.target.name]: ''
        })
    }

    function handleSubmit(): void {
        if (loadingSubmit === false) {
            let err: InputPasswordT = {} as InputPasswordT

            if (!inputPassword.password.trim()) {
                err.password = 'Must be required'
            } else if (inputPassword.password.length < 8) {
                err.password = 'Must be at least 8 characters.'
            }
            if (!inputPassword.confirmPassword.trim()) {
                err.confirmPassword = 'Must be required'
            } else if (inputPassword.confirmPassword !== inputPassword.password) {
                err.confirmPassword = 'Invalid password confirmation'
            }

            if (Object.keys(err).length === 0 && window.confirm('Reset your password?')) {
                setLoadingSubmit(true)
                pushToUpdateAdmin()
            } else {
                setErrMsg(err)
            }
        }
    }

    function pushToUpdateAdmin(): void {
        const data: {
            name: string
            image: string
            password: string
        } = {
            name: admin?.name as string,
            image: admin?.image as string,
            password: inputPassword.password
        }

        API().APIPutAdmin(admin?.id, data)
            .then((res: any) => {
                if (res?.data) {
                    createTokenBlackList()
                } else {
                    alert('a server error occurred\nPlease try again later')
                    console.log(res)
                    setLoadingSubmit(false)
                }
            })
            .catch((err: any) => {
                alert('a server error occurred\nPlease try again later')
                console.log(err)
                setLoadingSubmit(false)
            })
    }

    function createTokenBlackList(): void {
        const dataToken: {
            id: string
            token: string
        } = {
            id: `${new Date().getTime()}`,
            token: params?.token
        }

        API().APIPostBlackListJWT(dataToken)
            .then((res: any) => {
                if (res?.data) {
                    router.push(`/forgot-password/create-new-password/has-been-successfully/${params?.token}`)
                } else {
                    alert('a server error occurred\nPlease try again later')
                    console.log(res)
                    setLoadingSubmit(false)
                }
            })
            .catch((err: any) => {
                alert('a server error occurred\nPlease try again later')
                console.log(err)
                setLoadingSubmit(false)
            })
    }

    return (
        <Template
            key={5}
            isNavigateOff={true}
            title="Set New Password | Hospice Medical Admin"
            description="mengatur ulang kata sandi pada akun admin hospice medical"
        >
            <ProtectContainer
                icon={<FontAwesomeIcon icon={faKey} />}
                title="Set new password"
                desc="Your new password must be different to previously used passwords"
            >
                {loading && (
                    <div className="flex flex-col justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-white">
                        <LoadingSpinner />
                        <span className="text-font-color-2 font-bold mt-4">Please wait a moment</span>
                    </div>
                )}
                <InputContainer
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                >
                    <Input
                        type="password"
                        placeholder="Enter your password"
                        nameInput="password"
                        valueInput={inputPassword.password}
                        changeInput={handleInput}
                        styles={{
                            marginTop: '2rem'
                        }}
                    />
                    <ErrorInput
                        error={errMsg.password}
                    />
                    <Input
                        type="password"
                        placeholder="Confirm your password"
                        nameInput="confirmPassword"
                        valueInput={inputPassword.confirmPassword}
                        changeInput={handleInput}
                    />
                    <ErrorInput
                        error={errMsg.confirmPassword}
                    />

                    <Button
                        nameBtn="RESET PASSWORD"
                        classBtn={loadingSubmit ? 'mt-8 hover:text-white hover:bg-color-default cursor-default' : 'mt-8 hover:bg-white'}
                        disabled={loadingSubmit ? true : false}
                        classLoading={loadingSubmit ? '' : 'hidden'}
                        clickBtn={handleSubmit}
                    />
                </InputContainer>

                <BackToLogin href="/login" />
            </ProtectContainer>
        </Template>
    )
}