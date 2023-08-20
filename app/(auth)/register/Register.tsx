'use client'

import { ChangeEvent, useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { ref, getDownloadURL } from 'firebase/storage'
import { StaticImageData } from "next/image"
import ImageInput from "components/input/ImageInput"
import InputContainer from "components/input/InputContainer"
import Button from "components/Button"
import Input from "components/input/Input"
import ErrorInput from "components/input/ErrorInput"
import { mailRegex } from "lib/regex/mailRegex"
import { API } from "lib/api"
import { storage } from "lib/firebase/firebase"
import { uploadImg } from "lib/firebase/uploadImg"
import { sendEmail } from "lib/emailJS/sendEmail"
import Link from "next/link"
import { getImgValue } from "lib/firebase/getImgValue"
import { navigationStore } from "lib/useZustand/navigation"
import { AlertsT } from "lib/types/TableT.type"
import { userImg } from "lib/firebase/firstlogo"

type InputT = {
    name: string
    email: string
    password: string
    confirmPassword: string
    image: string | StaticImageData
}

type DataAccountAdmin = {
    id: string
    name: string
    email: string
    password: string
    image: string
}

type DataTokenType = {
    token: string,
    date: string
}

export function Register() {
    const [input, setInput] = useState<InputT>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        image: userImg
    })
    const [imgFile, setImgFile] = useState<File | null>(null)
    const [errInputMsg, setErrInputMsg] = useState<{ [key: string]: string }>({})
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [urlOrigin, setUrlOrigin] = useState<string | null>(null)

    const {setOnAlerts} = navigationStore()

    const router = useRouter()

    useEffect(() => {
        const urlOrigin = window.location.origin
        setUrlOrigin(urlOrigin)
    }, [])

    function clickImg(): void {
        document.getElementById('inputImg')?.click()
    }

    function changeInputImg(e: ChangeEvent<HTMLInputElement>): void {
        const files = e.target.files
        getImgValue(files)
        .then(res=>{
            setInput({
                ...input,
                image: res.url
            })

            setImgFile(res.files)
        })
        .catch(err=>{
            setOnAlerts({
                onAlert: true,
                title: 'There is an error',
                desc: err
            })
            setTimeout(() => {
                setOnAlerts({} as AlertsT)
            }, 3000);
        })
    }

    function deleteImg(): void {
        setInput({
            ...input,
            image: userImg
        })
        setImgFile(null)
    }

    function changeInput(e: ChangeEvent<HTMLInputElement>): void {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })

        setErrInputMsg({
            ...errInputMsg,
            [e.target.name]: ''
        })
    }

    const handleSubmit = async (): Promise<{ message: string } | undefined> => {
        let err: { [key: string]: string } = {}

        if (!input.name.trim()) {
            err.name = 'Must be required'
        }
        if (!input.email.trim()) {
            err.email = 'Must be required'
        } else if (!mailRegex.test(input.email)) {
            err.email = 'Invalid email address'
        }
        if (!input.password.trim()) {
            err.password = 'Must be required'
        }
        if (!input.confirmPassword.trim()) {
            err.confirmPassword = 'Must be required'
        } else if (input.confirmPassword !== input.password) {
            err.confirmPassword = 'Invalid password confirmation'
        }

        return new Promise<{ message: string }>((resolve, reject) => {
            if (Object.keys(err).length === 0) {
                resolve({ message: 'can be submitted' })
            } else {
                reject({ message: `can't be submitted` })
                setErrInputMsg(err)
            }
        })
    }

    function confirmSubmit(): void {
        if (loadingSubmit === false) {
            handleSubmit()
                .then(res => {
                    if (window.confirm('Register account?')) {
                        setLoadingSubmit(true)
                        validateAccount()
                    }
                })
                .catch(err => {
                    setLoadingSubmit(false)
                    console.log(err)
                })
        }
    }

    function validateAccount(): void {
        const { name, email, password } = input
        const data: DataAccountAdmin = {
            id: `${new Date().getTime()}`,
            name,
            email,
            password,
            image: ''
        }
        API().APIGetAdmin()
            .then((res: any) => {
                if (res?.data) {
                    const dataAdmin: { [key: string]: string | number | boolean }[] = res.data
                    if (Array.isArray(dataAdmin) && dataAdmin.length > 0) {
                        const isAdminAvailable: {
                            [key: string]: any
                        } | undefined = dataAdmin.find(admin =>
                            admin.email === data.email &&
                            admin.isVerification
                        )
                        const isAdminNotVerifYet: {
                            [key: string]: any
                        } | undefined = dataAdmin.find(admin =>
                            admin.email === data.email &&
                            admin.isVerification === false
                        )

                        if (isAdminAvailable?.id) {
                            alert('Account already registered')
                            setLoadingSubmit(false)
                            return
                        }

                        if (isAdminNotVerifYet?.id) {
                            data.id = isAdminNotVerifYet.id
                            isAccountWithImg(data, pushImgToFirebase, true)
                        } else {
                            isAccountWithImg(data, pushImgToFirebase)
                        }
                    } else {
                        isAccountWithImg(data, pushImgToFirebase)
                    }
                } else {
                    alert('There was an error registering the admin account')
                    setLoadingSubmit(false)
                    console.log(res)
                }
            })
            .catch((err: any) => {
                alert('There was an error registering the admin account')
                setLoadingSubmit(false)
                console.log(err)
            })
    }

    function isAccountWithImg(
        data: DataAccountAdmin,
        uploadImg: () => Promise<string | null>,
        isUpdateAdmin?: boolean
    ): void {
        const dataAdmin = data
        const dataUserUpdate:{
            name: string
            image: string
            password: string
        } = {
            name: data.name,
            image: '',
            password: data.password
          }

        uploadImg()
            .then(responUrl => {
                if (responUrl !== null) {
                    dataAdmin.image = responUrl
                    if (typeof isUpdateAdmin === 'boolean' && isUpdateAdmin === true) {
                        dataUserUpdate.image = responUrl
                        updateAdminVerif(data.id, dataUserUpdate, (dataUpdate)=>{
                            postVerification(dataUpdate)
                        })
                    } else {
                        postAccountToAdmin(dataAdmin)
                    }
                } else {
                    if (typeof isUpdateAdmin === 'boolean' && isUpdateAdmin === true) {
                        updateAdminVerif(data.id, dataUserUpdate, (dataUpdate)=>{
                            postVerification(dataUpdate)
                        })
                    } else {
                        postAccountToAdmin(dataAdmin)
                    }
                }
            })
            .catch(err => {
                alert('a server error has occurred')
                setLoadingSubmit(false)
                console.log(err)
            })
    }

    async function pushImgToFirebase(): Promise<null | string> {
        return await new Promise((resolve, reject) => {
            if (imgFile === null) {
                resolve(null)
            } else {
                uploadImg(
                    'images',
                    `${imgFile.name}-${new Date().getTime()}`,
                    imgFile,
                )
                    .then(snapshot => {
                        getDownloadURL(ref(storage, snapshot.metadata.fullPath))
                            .then(urlImg => {
                                resolve(urlImg)
                            })
                            .catch(err => reject('an error occurred while downloading the image file from firebase storage'))
                    })
                    .catch(err => reject('an error occurred while uploading image to firebase storage'))
            }
        })
    }

    function postAccountToAdmin(data: DataAccountAdmin): void {
        API().APIPostAdmin(data)
            .then((res: any) => {
                postVerification(data)
            })
            .catch((err: any) => {
                alert('a server error has occurred')
                setLoadingSubmit(false)
                console.log(err)
            })
    }

    function updateAdminVerif(
        id: string,
        dataUpdate: {
            name: string
            image: string
            password: string
        },
        success: (data: DataAccountAdmin) => void
    ): void {
        API().APIPutAdmin(id, dataUpdate)
            .then((res: any) => {
                if (res?.data) {
                    success(res.data)
                } else {
                    alert('There was an error in admin registration. it might happen because during account update and verification update')
                    console.log(res)
                    setLoadingSubmit(false)
                }
            })
            .catch((err: any) => {
                alert('There was an error in admin registration. it might happen because during account update and verification update')
                setLoadingSubmit(false)
            })
    }

    function postVerification(data: DataAccountAdmin): void {
        const ranCode1 = Math.floor(Math.random() * 9)
        const ranCode2 = Math.floor(Math.random() * 9)
        const ranCode3 = Math.floor(Math.random() * 9)
        const ranCode4 = Math.floor(Math.random() * 9)
        const token = `${ranCode1}${ranCode2}${ranCode3}${ranCode4}`

        const date = new Date()
        const nowHours = new Date().getHours()
        const getTimeExpired = nowHours < 23 ? nowHours + 1 : 0
        date.setHours(getTimeExpired)
        const newDate = new Date().getTime()

        checkUserTokenFirst(
            data,
            (userToken) => {
                // any user for verification
                // still not verification yet
                const dataToken: DataTokenType = {
                    token: token,
                    date: `${date}`
                }
                updateVerification(data, dataToken)
            },
            () => {
                // no user token is for verification
                const dataToken: DataTokenType & { newDate: string } = {
                    newDate: `${newDate}`,
                    token: token,
                    date: `${date}`
                }
                pushToVerification(data, dataToken)
            }
        )
    }

    function checkUserTokenFirst(
        data: { [key: string]: any },
        userAny: (findToken: { [key: string]: any }) => void,
        userEmpty: () => void
    ) {
        API().APIGetVerification()
            .then((res: any) => {
                if (res?.data) {
                    const dataVerif: { [key: string]: any }[] = res.data

                    const findToken = dataVerif.find(token => token?.userId === data.id)

                    if (findToken?.userId) {
                        userAny(findToken)
                    } else {
                        userEmpty()
                    }
                } else {
                    alert('an error occurred while fetching verification data')
                    setLoadingSubmit(false)
                    console.log(res)
                }
            })
            .catch((err: any) => {
                alert('an error occurred while fetching verification data')
                setLoadingSubmit(false)
                console.log(err)
            })
    }

    function pushToVerification(
        data: DataAccountAdmin,
        dataToken: DataTokenType & { newDate: string }
    ): void {
        const { newDate, token, date } = dataToken
        const dataPost: {
            id: string
            userId: string
            verification: {
                token: string
                date: string
            }
        } = {
            id: newDate,
            userId: data.id,
            verification: {
                token: token,
                date: date
            }
        }

        API().APIPostVerification(dataPost)
            .then((res: any) => {
                sendCodeToEmailAdmin(data, token)
            })
            .catch((err: any) => {
                alert('an error occurred while fetching verification data')
                setLoadingSubmit(false)
                console.log(err)
            })
    }

    function sendCodeToEmailAdmin(data: DataAccountAdmin, token: string): void {
        const dataSend: {
            url: string
            from_name: string
            to_name: string
            to_email: string
            code: string
        } = {
            url: `${urlOrigin}/register/verification/${data.id}`,
            from_name: 'Admin Hospice Medical',
            to_name: data.name,
            to_email: data.email,
            code: token,
        }

        sendEmail(
            process.env.NEXT_PUBLIC_SERVICE_ID as string,
            process.env.NEXT_PUBLIC_TEMPLATE_ID as string,
            dataSend,
            process.env.NEXT_PUBLIC_PUBLIC_KEY as string
        )
            .then(responEmail => {
                setLoadingSubmit(false)
                setInput({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    image: userImg
                })
                setImgFile(null)

                router.push(`register/verification/${data.id}`)
            })
            .catch(err => {
                alert('an error occurred while sending message with emailjs')
                setLoadingSubmit(false)
            })
    }

    function updateVerification(
        data: DataAccountAdmin,
        dataToken: DataTokenType
    ): void {
        const { token, date } = dataToken

        const dataVerification: { verification: DataTokenType } = {
            verification: {
                token: token,
                date: date
            }
        }

        API().APIPutVerification(data.id, dataVerification)
            .then((res: any) => {
                if (res?.data) {
                    sendCodeToEmailAdmin(data, token)
                } else {
                    alert('There was an error registering the admin account. may occur with token verification update error')
                    setLoadingSubmit(false)
                    console.log(res)
                }
            })
            .catch((err: any) => {
                setLoadingSubmit(false)
                alert('There was an error registering the admin account. may occur with token verification update error')
            })
    }

    return (
        <InputContainer
            tag="div"
            className="flex flex-col w-full"
        >
            <ImageInput
                src={input.image}
                nameInput="image"
                clickImg={(e) => {
                    e?.stopPropagation()
                    clickImg()
                }}
                changeInput={changeInputImg}
            />
            {typeof input.image !== 'object' && (
                <div
                    className="flex justify-center"
                >
                    <Button
                        nameBtn="DELETE"
                        clickBtn={deleteImg}
                        classBtn="text-[0.55rem] rounded-sm hover:bg-pink-old hover:text-white hover:border-pink-old"
                        classLoading="hidden"
                        styleBtn={{
                            padding: '0.4rem',
                            marginTop: '0.5rem',
                        }}
                    />
                </div>
            )}

            <Input
                type="text"
                nameInput="name"
                placeholder="Enter your name"
                changeInput={changeInput}
                valueInput={input.name}
                styles={{
                    marginTop: '1rem'
                }}
            />
            <ErrorInput
                error={errInputMsg?.name}
            />
            <Input
                type="email"
                nameInput="email"
                placeholder="Enter email address"
                changeInput={changeInput}
                valueInput={input.email}
            />
            <ErrorInput
                error={errInputMsg?.email}
            />
            <Input
                type="password"
                nameInput="password"
                placeholder="Enter your password"
                changeInput={changeInput}
                valueInput={input.password}
            />
            <ErrorInput
                error={errInputMsg?.password}
            />
            <Input
                type="password"
                nameInput="confirmPassword"
                placeholder="Enter your confirm password"
                changeInput={changeInput}
                valueInput={input.confirmPassword}
            />
            <ErrorInput
                error={errInputMsg?.confirmPassword}
            />
            <Button
                nameBtn="REGISTER"
                clickBtn={confirmSubmit}
                classBtn={loadingSubmit ? 'hover:text-white hover:bg-color-default cursor-default' : 'hover:bg-white'}
                classLoading={loadingSubmit ? 'flex' : 'hidden'}
                styleBtn={{
                    marginTop: '1rem'
                }}
            />
            <div className='flex flex-wrap justify-center mt-9'>
                <span className='text-center text-[0.8rem] text-font-color-2'>
                    Already have an account?
                </span>

                <Link href='/login' className='text-color-default text-[0.8rem] ml-1'>
                    Login Now
                </Link>
            </div>
        </InputContainer>
    )
}