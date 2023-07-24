'use client'

import { ChangeEvent, useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DataOptionT } from "lib/types/FilterT"
import { InputConfirmDrugCounterT, SubmitConfirmDrugCounterT, SubmitFinishedTreatmentT } from "lib/types/InputT.type"
import { PopupSetting } from "lib/types/TableT.type"
import { faBan, faCircleCheck, faDownload } from "@fortawesome/free-solid-svg-icons"
import { UsePatientData } from "lib/actions/dataInformation/UsePatientData"
import { createDateFormat } from "lib/dates/createDateFormat"
import { createHourFormat } from "lib/dates/createHourFormat"
import { authStore } from "lib/useZustand/auth"
import { API } from "lib/api"

type ErrorInput = {
    paymentMethod: string
    bpjsNumber: string
    totalCost: string
    message: string
}

type Props = {
    params: string
}

export function UseForm({
    params
}: Props) {
    const [value, setValue] = useState<string>('')
    const [inputForm, setInputForm] = useState<InputConfirmDrugCounterT>({
        paymentMethod: 'Select Payment Method',
        bpjsNumber: '',
        totalCost: '',
        message: ''
    })
    const [errInput, setErrInput] = useState<ErrorInput>({} as ErrorInput)
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [isActiveMenu, setIsActiveMenu] = useState<boolean>(false)
    const [onMsgCancelTreatment, setOnMsgCancelTreatment] = useState<boolean>(false)
    const [onPopupSetting, setOnPopupSetting] = useState<PopupSetting>({} as PopupSetting)
    const [loadingCancelTreatment, setLoadingCancelTreatment] = useState<boolean>(false)
    const [inputMsgCancelPatient, setInputMsgCancelPatient] = useState<string>('')
    const [paymentOptions, setPaymentOptions] = useState<DataOptionT>([
        {
            id: 'Select Payment Method',
            title: 'Select Payment Method'
        },
        {
            id: 'cash',
            title: 'cash'
        },
        {
            id: 'BPJS',
            title: 'BPJS'
        },
    ])

    const {
        drugCounterPatient,
        pushTriggedErr,
    } = UsePatientData({ params })

    const { user } = authStore()
    const router = useRouter()

    useEffect(() => {
        setInputForm({
            ...inputForm,
            message: value
        })
    }, [value])

    function handlePayment(): void {
        const elem = document.getElementById('paymentMethod') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        if (
            value === 'cash' ||
            value === 'BPJS' ||
            value === 'Select Payment Method'
        ) {
            setInputForm({
                ...inputForm,
                paymentMethod: value
            })
        }
    }

    function handleInputTxt(e?: ChangeEvent<HTMLInputElement>): void {
        if (typeof e !== 'undefined') {
            setInputForm({
                ...inputForm,
                [e.target.name]: e?.target.value
            })
        }
    }

    function submitForm(e?: MouseEvent): void {
        if (
            loadingSubmit === false &&
            validateForm() &&
            typeof setOnPopupSetting !== 'undefined'
        ) {
            setOnPopupSetting({
                title: 'Confirm Payment?',
                classIcon: 'text-font-color-2',
                classBtnNext: 'hover:bg-white',
                iconPopup: faCircleCheck,
                nameBtnNext: 'Yes',
                patientId: '',
                categoryAction: 'confirm-payment'
            })
        }
        e?.preventDefault()
    }

    function validateForm(): string | undefined {
        let err = {} as ErrorInput

        if (!inputForm.message.trim()) {
            err.message = 'Must be required'
        }
        if (inputForm.paymentMethod === 'Select Payment Method') {
            err.paymentMethod = 'Choose First'
        } else if (
            inputForm.paymentMethod === 'cash' &&
            !inputForm.totalCost.trim()
        ) {
            err.totalCost = 'Must be required'
        } else if (
            inputForm.paymentMethod === 'BPJS' &&
            !inputForm.bpjsNumber.trim()
        ) {
            err.bpjsNumber = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInput(err)
            return
        }

        return 'success'
    }

    const newRoute = `/patient/${params[0]}/${params[1]}/${params[2]}/${params[3]}/${params[4]}/${params[5]}/${params[6]}/confirmed/${drugCounterPatient?.queueNumber}`

    function confirmSubmit(): void {
        setLoadingSubmit(true)
        if (typeof setOnPopupSetting !== 'undefined') {
            setOnPopupSetting({} as PopupSetting)
        }

        API().APIPutPatientData(
            'drug-counter',
            drugCounterPatient?.id,
            dataConfirmCounter()
        )
            .then(res => {
                return API().APIPostPatientData(
                    'finished-treatment',
                    dataConfirmFinishTreatment()
                )
            })
            .then(res => {
                router.push(newRoute)
                alert('Successful confirmation')
                setLoadingSubmit(false)
            })
            .catch(err => pushTriggedErr('There was an error confirming payment. please try again'))
    }

    function dataConfirmCounter(): SubmitConfirmDrugCounterT {
        const {
            patientId,
            loketInfo,
            message,
            adminInfo,
            submissionDate,
            queueNumber
        } = drugCounterPatient
        const {
            paymentMethod,
            bpjsNumber,
            totalCost,
            message: msgConfirm
        } = inputForm
        const data: SubmitConfirmDrugCounterT = {
            patientId,
            loketInfo,
            message,
            adminInfo,
            submissionDate,
            queueNumber,
            isConfirm: {
                confirmState: true,
                dateConfirm: {
                    dateConfirm: createDateFormat(new Date()),
                    confirmHour: createHourFormat(new Date())
                },
                adminInfo: { adminId: user.user?.id as string },
                paymentInfo: {
                    paymentMethod: paymentMethod as 'cash',
                    bpjsNumber,
                    totalCost,
                    message: msgConfirm
                }
            }
        }

        return data
    }

    function dataConfirmFinishTreatment(): SubmitFinishedTreatmentT {
        const data: SubmitFinishedTreatmentT = {
            patientId: drugCounterPatient?.patientId,
            confirmedTime: {
                dateConfirm: createDateFormat(new Date()),
                confirmHour: createHourFormat(new Date())
            },
            adminInfo: { adminId: user.user?.id as string },
            isCanceled: false,
            messageCancelled: ''
        }

        return data
    }

    function clickMenu(): void {
        setIsActiveMenu(!isActiveMenu)
    }

    function cancelPopupSetting(): void {
        setOnPopupSetting({} as PopupSetting)
    }

    function clickDownloadPdf(): void {
        setIsActiveMenu(!isActiveMenu)
        setOnPopupSetting({
            title: 'Download PDF?',
            classIcon: 'text-font-color-2',
            classBtnNext: 'hover:bg-white',
            iconPopup: faDownload,
            nameBtnNext: 'Yes',
            patientId: '',
            categoryAction: 'download-pdf'
        })
    }

    function confirmDownloadPdf(): void {
        setOnPopupSetting({} as PopupSetting)
        window.open(`/patient-registration-information/${params[4]}/${params[3]}/drug-counter/download/pdf`)
    }

    function clickCancelTreatment(): void {
        if (loadingCancelTreatment === false) {
            setOnPopupSetting({
                title: 'Cancel Treatment',
                classIcon: 'text-font-color-2',
                classBtnNext: 'hover:bg-white',
                iconPopup: faBan,
                nameBtnNext: 'Yes',
                patientId: '',
                categoryAction: 'cancel-treatment'
            })
            setIsActiveMenu(false)
        }
    }

    function clickYesForCancelTreatment():void{
        setOnMsgCancelTreatment(true)
    }

    function cancelOnMsgCancelPatient():void{
        setOnMsgCancelTreatment(false)
    }

    function handleCancelMsg(e?: ChangeEvent<HTMLInputElement>):void{
        setInputMsgCancelPatient(e?.target.value as string)
    }

    function submitCancelTreatment():void{
        if(inputMsgCancelPatient.length > 0){
            setOnMsgCancelTreatment(false)
            setOnPopupSetting({} as PopupSetting)
            const data: SubmitFinishedTreatmentT = {
                patientId: params[4],
                confirmedTime: {
                    dateConfirm: createDateFormat(new Date()),
                    confirmHour: createHourFormat(new Date())
                },
                adminInfo: {adminId: user.user?.id as string},
                isCanceled: true,
                messageCancelled: inputMsgCancelPatient
            }
            API().APIPostPatientData(
                'finished-treatment',
                data,
            )
            .then(res=>{
                alert('Successfully cancel patient registration')
                setLoadingCancelTreatment(false)
            })
            .catch(err=>pushTriggedErr('A server error occurred while unregistering the patient. please try again'))
        }
    }

    return {
        value,
        setValue,
        errInput,
        paymentOptions,
        handlePayment,
        inputForm,
        handleInputTxt,
        submitForm,
        loadingSubmit,
        confirmSubmit,
        isActiveMenu,
        clickMenu,
        onPopupSetting,
        cancelPopupSetting,
        clickDownloadPdf,
        confirmDownloadPdf,
        clickCancelTreatment,
        loadingCancelTreatment,
        clickYesForCancelTreatment,
        onMsgCancelTreatment,
        cancelOnMsgCancelPatient,
        handleCancelMsg,
        inputMsgCancelPatient,
        submitCancelTreatment
    }
}