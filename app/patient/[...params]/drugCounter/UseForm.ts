'use client'

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DataOptionT } from "lib/types/FilterT"
import { ErrInputEditConfirmPatientCounter, InputConfirmDrugCounterT, InputEditConfirmPatientCounter, SubmitConfirmDrugCounterT, SubmitEditFinishTreatmentT, SubmitFinishedTreatmentT } from "lib/types/InputT.type"
import { PopupSettings } from "lib/types/TableT.type"
import { faBan, faCircleCheck, faDownload, faPencil } from "@fortawesome/free-solid-svg-icons"
import { UsePatientData } from "lib/dataInformation/UsePatientData"
import { createDateFormat } from "lib/formats/createDateFormat"
import { createHourFormat } from "lib/formats/createHourFormat"
import { authStore } from "lib/useZustand/auth"
import { API } from "lib/api"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { DrugCounterT, PatientFinishTreatmentT } from "lib/types/PatientT.types"

type ErrorInput = {
    paymentMethod: string
    bpjsNumber: string
    totalCost: string
    message: string
}

type Props = {
    params: string
    setOnModalSettings: Dispatch<SetStateAction<PopupSettings>>
}

export function UseForm({
    params,
    setOnModalSettings,
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
    const [loadingCancelTreatment, setLoadingCancelTreatment] = useState<boolean>(false)
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
    const [inputMsgCancelPatient, setInputMsgCancelPatient] = useState<string>('')
    const [inputValueEditCounterConfirmP, setInputValueEditCounterConfirmP] = useState<InputEditConfirmPatientCounter>({
        dateConfirm: '',
        confirmHour: '',
        adminEmail: '',
        paymentMethod: null,
        bpjsNumber: '',
        totalCost: '',
        message: ''
    })
    const [idEditCounterConfirmP, setIdEditCounterConfirmP] = useState<string | null>(null)
    const [loadingIdSubmitEditCounterConfirmP, setLoadingIdSubmitEditCounterConfirmP] = useState<string[]>([])
    const [onPopupEditCounterConfirmP, setOnPopupEditCounterConfirmP] = useState<boolean>(false)
    const [errInputEditCounterConfirmP, setErrInputEditCounterConfirmP] = useState<ErrInputEditConfirmPatientCounter>({} as ErrInputEditConfirmPatientCounter)
    const [namePatientEditCounterConfP, setNamePatientEditCounterConfP] = useState<string | null>(null)
    const [valueMsgEditCounterConfP, setValueMsgEditCounterConfP] = useState<string>('')
    const [optionsAdminEmailEditCounterConfP, setOptionsAdminEmailEditCounterConfP] = useState<DataOptionT>([
        {
            id: 'Select Email',
            title: 'Select Email'
        }
    ])
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

    const {
        loadGetDataAdmin,
        dataDrugCounter,
        dataFinishTreatment,
        dataAdmin
    } = ServicingHours()

    const { user } = authStore()
    const router = useRouter()

    useEffect(() => {
        setInputForm({
            ...inputForm,
            message: value
        })
    }, [value])

    function handlePayment(): void {
        const elem = document.getElementById('paymentMethodTransac') as HTMLSelectElement
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
            validateForm()
        ) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'Confirm Payment?',
                classIcon: 'text-font-color-2',
                iconPopup: faCircleCheck,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmSubmit(),
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
                            marginRight: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057',
                        }
                    },
                ]
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
        setOnModalSettings({} as PopupSettings)

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
            queueNumber,
            isConfirm
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
                isSkipped: typeof isConfirm?.isSkipped !== 'undefined' ? isConfirm.isSkipped : false,
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

    function clickDownloadPdf(): void {
        clickMenu()
        setOnModalSettings({
            clickClose: () => setOnModalSettings({} as PopupSettings),
            title: 'Download Queue Number PDF?',
            classIcon: 'text-font-color-2',
            iconPopup: faDownload,
            actionsData: [
                {
                    nameBtn: 'Yes',
                    classBtn: 'hover:bg-white',
                    classLoading: 'hidden',
                    clickBtn: () => confirmDownloadPdf(),
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
                        marginRight: '0.5rem',
                        marginTop: '0.5rem',
                        color: '#495057',
                    }
                },
            ]
        })
        // setOnPopupSetting({
        //     title: 'Download Queue Number PDF?',
        //     classIcon: 'text-font-color-2',
        //     classBtnNext: 'hover:bg-white',
        //     iconPopup: faDownload,
        //     nameBtnNext: 'Yes',
        //     patientId: '',
        //     categoryAction: 'download-queue-number-pdf'
        // })
    }

    function confirmDownloadPdf(): void {
        setOnModalSettings({} as PopupSettings)
        window.open(`/patient-registration-information/${params[4]}/${params[3]}/drug-counter/download/pdf`)
    }

    function clickCancelTreatment(): void {
        if (loadingCancelTreatment === false) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'Cancel Treatment',
                classIcon: 'text-font-color-2',
                iconPopup: faBan,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => clickYesForCancelTreatment(),
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
                            marginRight: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057',
                        }
                    },
                ]
            })
            // setOnPopupSetting({
            //     title: 'Cancel Treatment',
            //     classIcon: 'text-font-color-2',
            //     classBtnNext: 'hover:bg-white',
            //     iconPopup: faBan,
            //     nameBtnNext: 'Yes',
            //     patientId: '',
            //     categoryAction: 'cancel-treatment'
            // })
            setIsActiveMenu(false)
        }
    }

    function clickYesForCancelTreatment(): void {
        setOnMsgCancelTreatment(true)
    }

    function cancelOnMsgCancelPatient(): void {
        setOnMsgCancelTreatment(false)
    }

    function handleCancelMsg(e?: ChangeEvent<HTMLInputElement>): void {
        setInputMsgCancelPatient(e?.target.value as string)
    }

    function submitCancelTreatment(): void {
        if (inputMsgCancelPatient.length > 0) {
            setOnMsgCancelTreatment(false)
            setOnModalSettings({} as PopupSettings)
            const data: SubmitFinishedTreatmentT = {
                patientId: params[4],
                confirmedTime: {
                    dateConfirm: createDateFormat(new Date()),
                    confirmHour: createHourFormat(new Date())
                },
                adminInfo: { adminId: user.user?.id as string },
                isCanceled: true,
                messageCancelled: inputMsgCancelPatient
            }
            API().APIPostPatientData(
                'finished-treatment',
                data,
            )
                .then(res => {
                    alert('Successfully cancel patient registration')
                    setLoadingCancelTreatment(false)
                })
                .catch(err => pushTriggedErr('A server error occurred while unregistering the patient. please try again'))
        }
    }

    function clickTreatmentResultPDF(): void {
        setIsActiveMenu(!isActiveMenu)
        setOnModalSettings({
            clickClose: () => setOnModalSettings({} as PopupSettings),
            title: 'Download Treatment Result PDF?',
            classIcon: 'text-font-color-2',
            iconPopup: faDownload,
            actionsData: [
                {
                    nameBtn: 'Yes',
                    classBtn: 'hover:bg-white',
                    classLoading: 'hidden',
                    clickBtn: () => confirmDownloadTRPdf(),
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
                        marginRight: '0.5rem',
                        marginTop: '0.5rem',
                        color: '#495057',
                    }
                },
            ]
        })
        // setOnPopupSetting({
        //     title: 'Download Treatment Result PDF?',
        //     classIcon: 'text-font-color-2',
        //     classBtnNext: 'hover:bg-white',
        //     iconPopup: faDownload,
        //     nameBtnNext: 'Yes',
        //     patientId: '',
        //     categoryAction: 'download-treatment-result-pdf'
        // })
    }

    function confirmDownloadTRPdf(): void {
        setOnModalSettings({} as PopupSettings)
        window.open(`/patient-registration-information/${params[4]}/${params[3]}/treatment-results/download/pdf`)
    }

    function clickDelete(): void {
        if (loadingDelete === false) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'Delete patient counter?',
                classIcon: 'text-font-color-2',
                iconPopup: faBan,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmDeletePatient(),
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
                            marginRight: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057',
                        }
                    },
                ]
            })
            setIsActiveMenu(false)
        }
    }

    function confirmDeletePatient(): void {
        setOnModalSettings({} as PopupSettings)
        API().APIDeletePatientData(
            'drug-counter',
            drugCounterPatient?.id,
            drugCounterPatient?.patientId
        )
            .then(res => {
                setLoadingDelete(false)
                alert('Successfully delete patient counter data')
                const currentRouteStr: string = params.slice(0, 5).toString()
                const newRoute = currentRouteStr.split(',').join('/')
                const urlOrigin = window.location.origin
                window.location.replace(`${urlOrigin}/patient/${newRoute}`)
            })
            .catch(err => pushTriggedErr('There was an error deleting patient counter data. please try again'))
    }

    function clickEditCounterConfirmP(
        patientId: string,
        patientName: string
    ): void {
        const findPatient = dataDrugCounter?.find(patient => patient.patientId === patientId)
        if (findPatient) {
            const {
                isConfirm
            } = findPatient

            const admin = dataAdmin?.find(admins => admins.id === isConfirm.adminInfo.adminId)

            setInputValueEditCounterConfirmP({
                dateConfirm: isConfirm.dateConfirm.dateConfirm,
                confirmHour: isConfirm.dateConfirm.confirmHour,
                adminEmail: admin?.email as string,
                paymentMethod: isConfirm.paymentInfo.paymentMethod,
                bpjsNumber: isConfirm.paymentInfo.bpjsNumber,
                totalCost: isConfirm.paymentInfo.totalCost,
                message: isConfirm.paymentInfo.message as string
            })
            setIdEditCounterConfirmP(patientId)
            setNamePatientEditCounterConfP(patientName)
            setOnPopupEditCounterConfirmP(true)
            setValueMsgEditCounterConfP(isConfirm.paymentInfo?.message as string)

            loadDataAdmin()
        } else {
            alert(`No counter patient found with id "${patientId}"`)
        }
    }

    function loadDataAdmin(): void {
        if (
            !loadGetDataAdmin &&
            Array.isArray(dataAdmin) &&
            dataAdmin.length > 0
        ) {
            const admins: DataOptionT = dataAdmin.map(admin => ({
                id: admin.email,
                title: admin.email
            }))
            setOptionsAdminEmailEditCounterConfP([
                {
                    id: 'Select Email',
                    title: 'Select Email'
                },
                ...admins
            ])
        } else if (
            !loadGetDataAdmin &&
            Array.isArray(dataAdmin) &&
            dataAdmin.length === 0
        ) {
            alert('Admin email not found')
        }
    }

    function changeIndexInputElem(
        index: number,
        idElement: 'adminEmail' | 'paymentMethod'
    ): void {
        const elem = document.getElementById(idElement) as HTMLSelectElement
        if (elem) {
            elem.selectedIndex = index
        }
    }

    useEffect(() => {
        if (optionsAdminEmailEditCounterConfP.length > 0) {
            const indexEmail = optionsAdminEmailEditCounterConfP.findIndex(item => item.id === inputValueEditCounterConfirmP.adminEmail)
            const indexPaymentMethod = paymentOptions.findIndex(item => item.id === inputValueEditCounterConfirmP.paymentMethod)
            changeIndexInputElem(indexEmail, 'adminEmail')
            changeIndexInputElem(indexPaymentMethod, 'paymentMethod')
        }
    }, [inputValueEditCounterConfirmP, optionsAdminEmailEditCounterConfP, paymentOptions])

    function closePopupEditConfirmPatientC(): void {
        setOnPopupEditCounterConfirmP(false)
    }

    function handleChangeDate(
        e: ChangeEvent<HTMLInputElement> | Date | undefined,
        inputName: "dateConfirm"
    ): void {
        setInputValueEditCounterConfirmP({
            ...inputValueEditCounterConfirmP,
            [inputName]: !e ? '' : `${createDateFormat(e as Date)}`
        })
        setErrInputEditCounterConfirmP({
            ...errInputEditCounterConfirmP,
            [inputName]: ''
        })
    }

    function changeEditConfirmPatientC(e: ChangeEvent<HTMLInputElement>): void {
        setInputValueEditCounterConfirmP({
            ...inputValueEditCounterConfirmP,
            [e.target.name]: e.target.value
        })
        setErrInputEditCounterConfirmP({
            ...errInputEditCounterConfirmP,
            [e.target.name]: ''
        })
    }

    useEffect(() => {
        setInputValueEditCounterConfirmP({
            ...inputValueEditCounterConfirmP,
            message: valueMsgEditCounterConfP
        })
        setErrInputEditCounterConfirmP({
            ...errInputEditCounterConfirmP,
            message: ''
        })
    }, [valueMsgEditCounterConfP])

    function handleSelectCounterConfirmP(
        idElement: "adminEmail" | 'paymentMethod',
        nameInput: "adminEmail" | 'paymentMethod'
    ): void {
        const elem = document.getElementById(idElement) as HTMLSelectElement
        const value = elem?.options[elem?.selectedIndex]?.value
        setInputValueEditCounterConfirmP({
            ...inputValueEditCounterConfirmP,
            [nameInput]: value
        })
        setErrInputEditCounterConfirmP({
            ...errInputEditCounterConfirmP,
            [nameInput]: ''
        })
    }

    function submitEditCounterConfirmP(): void {
        const findLoadingId = loadingIdSubmitEditCounterConfirmP.find(id => id === idEditCounterConfirmP)
        if (!findLoadingId && validateFormEditCounterConfirmP()) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `update confirmation data of "${namePatientEditCounterConfP}" patient counter?`,
                classIcon: 'text-color-default',
                iconPopup: faPencil,
                actionsData: [
                    {
                        nameBtn: 'Save',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmSubmitEditCounterConfirmP(),
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.5rem',
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
                            marginRight: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057',
                        }
                    },
                ]
            })
        }
    }

    function validateFormEditCounterConfirmP(): string | undefined {
        let err = {} as ErrInputEditConfirmPatientCounter
        if (!inputValueEditCounterConfirmP.dateConfirm.trim()) {
            err.dateConfirm = 'Must be required'
        }
        if (!inputValueEditCounterConfirmP.confirmHour.trim()) {
            err.confirmHour = 'Must be required'
        }
        if (
            !inputValueEditCounterConfirmP.adminEmail.trim() ||
            inputValueEditCounterConfirmP.adminEmail === 'Select Email'
        ) {
            err.adminEmail = 'Must be required'
        }
        if (
            !inputValueEditCounterConfirmP.paymentMethod?.trim() ||
            inputValueEditCounterConfirmP.paymentMethod === 'Select Payment Method'
        ) {
            err.paymentMethod = 'Must be required'
        }
        if (
            inputValueEditCounterConfirmP.paymentMethod === 'cash' &&
            !inputValueEditCounterConfirmP.totalCost.trim()
        ) {
            err.totalCost = 'Must be required'
        }
        if (
            inputValueEditCounterConfirmP.paymentMethod === 'BPJS' &&
            !inputValueEditCounterConfirmP.bpjsNumber.trim()
        ) {
            err.bpjsNumber = 'Must be required'
        }
        if (!inputValueEditCounterConfirmP.message.trim()) {
            err.message = 'Must be required'
        }

        if (Object.keys(err).length > 0) {
            setErrInputEditCounterConfirmP(err)
            return
        }
        return 'success'
    }

    function confirmSubmitEditCounterConfirmP(): void {
        setOnModalSettings({} as PopupSettings)
        setLoadingIdSubmitEditCounterConfirmP((current) => [idEditCounterConfirmP as string, ...current])
        const currentPatientC = dataDrugCounter?.find(patient => patient.patientId === idEditCounterConfirmP)

        if (currentPatientC) {
            API().APIPutPatientData(
                'drug-counter',
                currentPatientC?.id as string,
                dataUpdtCounterConfirmP(currentPatientC)
            )
                .then(res => {
                    const currentPatient = dataFinishTreatment?.find(patient => patient.patientId === idEditCounterConfirmP)

                    if (!currentPatient) {
                        pushTriggedErr(`No patient treatment data found with id "${idEditCounterConfirmP}"`)
                    }

                    return API().APIPutPatientData(
                        'finished-treatment',
                        currentPatient?.id as string,
                        dataUpdtFinishTreatment(currentPatient as PatientFinishTreatmentT)
                    )
                })
                .then(res => {
                    const removeIdLoading = loadingIdSubmitEditCounterConfirmP.filter(id => id !== res?.patientId)
                    setLoadingIdSubmitEditCounterConfirmP(removeIdLoading)
                    alert('Successfully updated patient counter confirmation data')
                })
                .catch(err => pushTriggedErr('A server error occurred. occurs when updating patient counter confirmation data. please try again'))
        } else {
            pushTriggedErr(`No patient counter found with id "${idEditCounterConfirmP}"`)
        }
    }

    function dataUpdtCounterConfirmP(
        counterPatient: DrugCounterT
    ): SubmitConfirmDrugCounterT {
        const {
            patientId,
            loketInfo,
            message,
            adminInfo,
            submissionDate,
            queueNumber,
            isConfirm
        } = counterPatient

        const admin = dataAdmin?.find(admins => admins.email === inputValueEditCounterConfirmP.adminEmail)

        return {
            patientId,
            loketInfo,
            message,
            adminInfo,
            submissionDate,
            queueNumber,
            isConfirm: {
                confirmState: isConfirm.confirmState,
                isSkipped: typeof isConfirm?.isSkipped !== 'undefined' ? isConfirm.isSkipped : false,
                dateConfirm: {
                    dateConfirm: inputValueEditCounterConfirmP.dateConfirm,
                    confirmHour: inputValueEditCounterConfirmP.confirmHour
                },
                adminInfo: { adminId: admin?.id as string },
                paymentInfo: {
                    paymentMethod: inputValueEditCounterConfirmP.paymentMethod as 'cash',
                    bpjsNumber: inputValueEditCounterConfirmP.paymentMethod === 'BPJS' ? inputValueEditCounterConfirmP.bpjsNumber : '',
                    totalCost: inputValueEditCounterConfirmP.paymentMethod === 'cash' ? inputValueEditCounterConfirmP.totalCost : '-',
                    message: inputValueEditCounterConfirmP.message
                }
            }
        }
    }

    function dataUpdtFinishTreatment(currentPatient: PatientFinishTreatmentT): SubmitEditFinishTreatmentT {
        const admin = dataAdmin?.find(admins => admins.email === inputValueEditCounterConfirmP.adminEmail)
        const {
            patientId,
            isCanceled,
            messageCancelled
        } = currentPatient
        return {
            patientId,
            confirmedTime: {
                dateConfirm: inputValueEditCounterConfirmP.dateConfirm,
                confirmHour: inputValueEditCounterConfirmP.confirmHour
            },
            adminInfo: { adminId: admin?.id as string },
            isCanceled,
            messageCancelled
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
        clickDownloadPdf,
        confirmDownloadPdf,
        clickCancelTreatment,
        loadingCancelTreatment,
        clickYesForCancelTreatment,
        onMsgCancelTreatment,
        cancelOnMsgCancelPatient,
        handleCancelMsg,
        inputMsgCancelPatient,
        submitCancelTreatment,
        clickTreatmentResultPDF,
        confirmDownloadTRPdf,
        setIsActiveMenu,
        clickDelete,
        loadingDelete,
        clickEditCounterConfirmP,
        inputValueEditCounterConfirmP,
        namePatientEditCounterConfP,
        errInputEditCounterConfirmP,
        optionsAdminEmailEditCounterConfP,
        valueMsgEditCounterConfP,
        setValueMsgEditCounterConfP,
        onPopupEditCounterConfirmP,
        closePopupEditConfirmPatientC,
        handleChangeDate,
        changeEditConfirmPatientC,
        handleSelectCounterConfirmP,
        submitEditCounterConfirmP,
        loadingIdSubmitEditCounterConfirmP,
        idEditCounterConfirmP
    }
}