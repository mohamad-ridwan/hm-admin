'use client'

import { ChangeEvent, useState, useEffect, useMemo } from "react"
import { authStore } from "lib/useZustand/auth"
import { StaticImageData } from "next/image"
import { getImgValue } from "lib/firebase/getImgValue"
import { navigationStore } from "lib/useZustand/navigation"
import { AlertsT, PopupSettings } from "lib/types/TableT.type"
import { mailRegex } from "lib/regex/mailRegex"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { API } from "lib/api"
import { SubmitEditProfileT } from "lib/types/InputT.type"
import { AuthRequiredError } from "lib/errorHandling/exceptions"
import { uploadImg } from "lib/firebase/uploadImg"
import { getDownloadURL, ref } from "firebase/storage"
import { storage } from "lib/firebase/firebase"

type InputEditProfile = {
    name: string, email: string
}

export function UseProfile() {
    const [imgProfile, setImgProfile] = useState<null | File>(null)
    const [inputValueProfile, setInputValueProfile] = useState<InputEditProfile>({
        name: '',
        email: '',
    })
    const [errInputValueProfile, setErrInputValueProfile] = useState<InputEditProfile>({
        name: '',
        email: ''
    })
    const [onModalSettings, setOnModalSettings] = useState<PopupSettings>({} as PopupSettings)
    const [imgStringUrl, setImgStringUrl] = useState<string>('')
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [triggerErr, setTriggerErr] = useState<boolean>(false)

    const { user, loadingAuth } = authStore()
    const { setOnAlerts } = navigationStore()

    if (triggerErr) {
        new AuthRequiredError('A server error occurred. please try again')
    }

    function getUser(): void {
        if (user.user?.id) {
            setInputValueProfile({
                name: user.user.name,
                email: user.user.email
            })
            setImgStringUrl(user.user.image)
        }
    }

    useEffect(() => {
        getUser()
    }, [loadingAuth, user])

    const isOnUpdate = useMemo(() => {
        const {
            name,
        } = inputValueProfile
        if (
            name === user.user?.name &&
            imgStringUrl === user.user?.image
        ) {
            return false
        }
        return true
    }, [inputValueProfile, imgStringUrl])

    function clickOpenImage(): void {
        document.getElementById('inputImg')?.click()
    }

    function getImgFile(e: ChangeEvent<HTMLInputElement>): void {
        const files = e.target.files
        getImgValue(files)
            .then(res => {
                setImgStringUrl(res.url)

                setImgProfile(res.files)
            })
            .catch(err => {
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

    function changeInput(e: ChangeEvent<HTMLInputElement>): void {
        setInputValueProfile({
            ...inputValueProfile,
            [e.target.name]: e.target.value
        })
        setErrInputValueProfile({
            ...errInputValueProfile,
            [e.target.name]: ''
        })
    }

    function submitUpdateProfile(): void {
        if (
            !loadingSubmit &&
            validateSubmit()
        ) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'Update your profile?',
                classIcon: 'text-font-color-2',
                iconPopup: faPencil,
                actionsData: [
                    {
                        nameBtn: 'Save',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmUpdateProfile(),
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.6rem',
                            marginTop: '0.5rem'
                        }
                    },
                    {
                        nameBtn: 'Cancel',
                        classBtn: 'bg-white border-none',
                        classLoading: 'hidden',
                        clickBtn: () => setOnModalSettings({} as PopupSettings),
                        styleBtn: {
                            padding: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057'
                        }
                    }
                ]
            })
        }
    }

    function validateSubmit(): string | undefined {
        let err = {} as InputEditProfile
        const {
            name,
            email
        } = inputValueProfile
        if (
            name === user.user?.name &&
            imgStringUrl === user.user.image
        ) {
            return
        }
        if (!name.trim()) {
            err.name = 'Must be required'
        }
        if (!email.trim()) {
            err.email = 'Must be required'
        } else if (!mailRegex.test(email)) {
            err.email = 'Invalid e-mail address'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputValueProfile(err)
            return
        }

        return 'success'
    }

    function confirmUpdateProfile(): void {
        if (typeof user.user?.id !== 'string') {
            setOnAlerts({
                onAlert: true,
                title: 'There is an error',
                desc: 'Adminid not found. please re-login'
            })
            setTimeout(() => {
                setOnAlerts({} as AlertsT)
            }, 3000);
            return
        }
        setLoadingSubmit(true)
        if (
            imgStringUrl === user.user.image ||
            imgStringUrl.length === 0
        ) {
            pushUpdateAPI()
        } else if (
            imgStringUrl.length > 0 &&
            imgProfile !== null
        ) {
            uploadImg(
                'images',
                `${imgProfile.name}-${new Date().getTime()}`,
                imgProfile
            )
                .then(snapshot => {
                    return getDownloadURL(ref(storage, snapshot.metadata.fullPath))
                })
                .then(urlImg => {
                    pushUpdateAPI(urlImg)
                })
                .catch(err => setTriggerErr(true))
        }
        setOnModalSettings({} as PopupSettings)
    }

    function pushUpdateAPI(urlImg?: string):void{
        API().APIPutAdmin(
            user.user?.id as string,
            dataSubmitEditProfile(urlImg)
        )
            .then(res => {
                setOnAlerts({
                    onAlert: true,
                    title: 'Update successfully',
                    desc: 'Your profile has been updated'
                })
                setTimeout(() => {
                    setOnAlerts({} as AlertsT)
                }, 3000);
                window.location.reload()
            })
            .catch(err => setTriggerErr(true))
    }

    function dataSubmitEditProfile(newUploadImg?: string): SubmitEditProfileT {
        const { name } = inputValueProfile

        const checkImg = imgStringUrl === user.user?.image || imgStringUrl.length === 0 ? imgStringUrl : newUploadImg

        return {
            name,
            image: checkImg as string,
            password: user.user?.password as string
        }
    }

    function deleteImg(): void {
        setImgProfile(null)
        setImgStringUrl('')
    }

    return {
        clickOpenImage,
        getImgFile,
        inputValueProfile,
        errInputValueProfile,
        changeInput,
        submitUpdateProfile,
        deleteImg,
        imgStringUrl,
        isOnUpdate,
        loadingSubmit,
        onModalSettings
    }
}