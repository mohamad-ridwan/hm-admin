'use client'

import { ChangeEvent, useEffect, useState } from "react"
import { useParams, useRouter } from 'next/navigation'
import { DataOptionT } from "lib/types/FilterT"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { InputDrugCounterT, SubmitDrugCounterT, SubmitFinishedTreatmentT } from "lib/types/InputT.type"
import { PopupSettings } from "lib/types/TableT.type"
import { faBan, faCircleCheck, faDownload, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { authStore } from "lib/useZustand/auth"
import { createDateFormat } from "lib/formats/createDateFormat"
import { createHourFormat } from "lib/formats/createHourFormat"
import { API } from "lib/api"
import { sendEmail } from "lib/emailJS/sendEmail"
import { UsePatientData } from "lib/dataInformation/UsePatientData"
import { spaceString } from "lib/regex/spaceString"
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat"

type Props = {
    params: string
}

export function UseForm({
    params: paramsPersonal
}: Props) {
    const [onModalSettings, setOnModalSettings] = useState<PopupSettings>({} as PopupSettings)
    const [onMsgCancelTreatment, setOnMsgCancelTreatment] = useState<boolean>(false)
    const [value, setValue] = useState<string>('')
    const [currentCounter, setCurrentCounter] = useState<{
        id: string
        title: string
    }>({
        id: 'Select Counter',
        title: 'Select Counter'
    })
    const [counterOptions, setCounterOptions] = useState<DataOptionT>([
        {
            id: 'Select Counter',
            title: 'Select Counter'
        }
    ])
    const [errInput, setErrInput] = useState<InputDrugCounterT>({} as InputDrugCounterT)
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [loadingSendEmail, setLoadingSendEmail] = useState<boolean>(false)
    const [isMenuActive, setIsMenuActive] = useState<boolean>(false)
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
    const [loadingCancelTreatment, setLoadingCancelTreatment] = useState<boolean>(false)
    const [inputMsgCancelPatient, setInputMsgCancelPatient] = useState<string>('')

    const {
        loadDataService,
        dataLoket,
        dataDrugCounter,
        dataPatientRegis,
        pushTriggedErr,
        doctors
    } = ServicingHours()

    const {
        detailDataPatientRegis,
        dataConfirmPatient,
    } = UsePatientData({ params: paramsPersonal })

    const { user } = authStore()

    const router = useRouter()
    const params = useParams()
    const patientId = params?.params?.split('/')[4]
    const patientName = params?.params?.split('/')[3]

    const findCurrentDoctor = doctors?.find(doctor => doctor.id === dataConfirmPatient?.doctorInfo?.doctorId)

    const getAppointmentDate = createDateNormalFormat(detailDataPatientRegis?.appointmentDate)
    const dayOfAppointment = getAppointmentDate?.split(',')[1]?.replace(spaceString, '')
    const dateOfAppointment = getAppointmentDate?.split(',')[0]
    const doctorIsHoliday = findCurrentDoctor?.holidaySchedule?.find(date => date.date === createDateFormat(dateOfAppointment))
    const doctorIsOnCurrentDay = findCurrentDoctor?.doctorSchedule?.find(day => day.dayName.toLowerCase() === dayOfAppointment?.toLowerCase())
    const doctorIsAvailable = !doctorIsHoliday ? doctorIsOnCurrentDay ? true : false : false

    function loadCounter(): void {
        if (
            !loadDataService &&
            Array.isArray(dataLoket) &&
            dataLoket.length > 0
        ) {
            const getLoket = dataLoket.map(loket => ({
                id: loket.loketName,
                title: loket.loketName
            }))
            setCounterOptions([
                {
                    id: 'Select Counter',
                    title: 'Select Counter'
                },
                ...getLoket
            ])
        }
    }

    useEffect(() => {
        loadCounter()
    }, [loadDataService, dataLoket])

    function handleCounter(): void {
        const elem = document.getElementById('selectCounter') as HTMLSelectElement
        const value = elem?.options[elem?.selectedIndex].value
        if (value) {
            setCurrentCounter({
                id: value,
                title: value
            })
        }
    }

    function submitForm(): void {
        if (loadingSubmit === false && doctorIsAvailable) {
            let err = {} as InputDrugCounterT
            if (!value.trim()) {
                err.message = 'Must be required'
            }
            if (currentCounter.id === 'Select Counter') {
                err.loketName = 'Must be required'
            }

            if (Object.keys(err).length !== 0) {
                setErrInput(err)
                return
            }

            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'Confirm patient?',
                classIcon: 'text-font-color-2',
                iconPopup: faCircleCheck,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmSubmitForm(),
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
            setErrInput({} as InputDrugCounterT)
        }
    }

    function confirmSubmitForm(): void {
        setLoadingSubmit(true)
        API().APIPostPatientData(
            'drug-counter',
            dataSubmitToCounter()
        ).then(res => {
            setLoadingSubmit(false)
            alert('Successful confirmation')
            setTimeout(() => {
                router.push(`${patientId}/counter/${currentCounter.id}/not-yet-confirmed/${dataSubmitToCounter().queueNumber}`)
            }, 0);
        })
            .catch(err => pushTriggedErr('An error occurred when confirming the patient to the counter. please try again'))

        setOnModalSettings({} as PopupSettings)
    }

    function dataSubmitToCounter(): SubmitDrugCounterT {
        const loketId = dataLoket?.find(loket => loket?.loketName === currentCounter?.id)?.id

        const data: SubmitDrugCounterT = {
            patientId,
            loketInfo: { loketId: loketId as string },
            message: value,
            adminInfo: { adminId: user.user?.id as string },
            submissionDate: {
                submissionDate: createDateFormat(new Date()),
                submitHours: createHourFormat(new Date())
            },
            queueNumber: getQueueNumber()
        }

        return data
    }

    function getQueueNumber(): string {
        if (
            Array.isArray(dataDrugCounter) &&
            dataDrugCounter.length === 0
        ) {
            return '1'
        }

        const findCurrentDrugCounter = dataDrugCounter?.filter(counter => {
            const loketId = dataLoket?.find(loket => loket?.loketName === currentCounter?.id)?.id
            const currentId = counter.loketInfo.loketId === loketId

            const findCounterAtCurrentTime = counter.submissionDate.submissionDate === createDateFormat(new Date())

            return currentId && findCounterAtCurrentTime
        })

        const sortQueueNumber = findCurrentDrugCounter?.sort((a, b) =>
            Number(b.queueNumber) - Number(a.queueNumber)
        )

        if (
            Array.isArray(findCurrentDrugCounter) &&
            findCurrentDrugCounter?.length > 0 &&
            Array.isArray(sortQueueNumber)
        ) {
            return `${Number(sortQueueNumber[0]?.queueNumber) + 1}`
        } else {
            return '1'
        }
    }

    function clickDownload(): void {
        setOnModalSettings({
            clickClose: () => setOnModalSettings({} as PopupSettings),
            title: 'Download Pdf?',
            classIcon: 'text-font-color-2',
            iconPopup: faDownload,
            actionsData: [
                {
                    nameBtn: 'Yes',
                    classBtn: 'hover:bg-white',
                    classLoading: 'hidden',
                    clickBtn: () => confirmForDownloadPdf(),
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
        //     title: 'Download Pdf?',
        //     classIcon: 'text-font-color-2',
        //     classBtnNext: 'hover:bg-white',
        //     iconPopup: faDownload,
        //     nameBtnNext: 'Yes',
        //     patientId: '',
        //     categoryAction: 'download-pdf'
        // })
        clickMenu()
    }

    function confirmForDownloadPdf(): void {
        window.open(`/patient-registration-information/${patientId}/${patientName}/download/pdf`)
        setOnModalSettings({} as PopupSettings)
    }

    function clickSend(): void {
        if (loadingSendEmail === false) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'Send confirmation to patient email?',
                classIcon: 'text-font-color-2',
                iconPopup: faEnvelope,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmSendEmail(),
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
            //     title: 'Send confirmation to patient email?',
            //     classIcon: 'text-font-color-2',
            //     classBtnNext: 'hover:bg-white',
            //     iconPopup: faEnvelope,
            //     nameBtnNext: 'Yes',
            //     patientId: '',
            //     categoryAction: 'send-email'
            // })
            clickMenu()
        }
    }

    async function confirmSendEmail(): Promise<void> {
        setOnModalSettings({} as PopupSettings)
        setLoadingSendEmail(true)

        const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID_ADM as string
        const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID_KONFIRMASI_JP as string
        const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY_ADM as string

        await sendEmail(
            serviceId,
            templateId,
            dataSendEmail(),
            publicKey
        )
            .then(res => {
                alert('Successfully sent confirmation message')
                setLoadingSendEmail(false)
            })
            .catch(err => pushTriggedErr('a server error occurred. error while sending confirmation message to patient email. (emailJS error)'))
    }

    function dataSendEmail(): {
        to_email: string
        patient_name: string
        pdf_link_patient_treatment: string
    } {
        const patientRegis = dataPatientRegis?.find(patient => patient.id === patientId)

        const urlOrigin = window.location.origin
        const linkPDF = `${urlOrigin}/patient-registration-information/${patientId}/${patientName}/download/pdf`

        return {
            to_email: patientRegis?.emailAddress as string,
            patient_name: patientRegis?.patientName as string,
            pdf_link_patient_treatment: linkPDF
        }
    }

    function clickMenu(): void {
        setIsMenuActive(!isMenuActive)
    }

    function clickDelete(
        patientName: string,
        patientId: string,
        documentId: string
    ): void {
        if (loadingDelete === false) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `Delete confirmation data from "${patientName}" patient`,
                classIcon: 'text-font-color-2',
                iconPopup: faBan,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmDeletePatient(documentId, patientId),
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
            //     title: `Delete confirmation data from "${patientName}" patient`,
            //     classIcon: 'text-font-color-2',
            //     classBtnNext: 'hover:bg-white',
            //     iconPopup: faBan,
            //     nameBtnNext: 'Yes',
            //     patientId: patientId,
            //     categoryAction: 'delete-confirmation'
            // })
            clickMenu()
        }
    }

    function confirmDeletePatient(documentId: string, patientId: string): void {
        setLoadingDelete(true)
        setOnModalSettings({} as PopupSettings)
        API().APIDeletePatientData(
            'confirmation-patients',
            documentId,
            patientId
        )
            .then(res => {
                setLoadingDelete(false)
                const currentRoute = params?.params?.split('/')
                const newRoute = params?.params?.replace(currentRoute[2], 'not-yet-confirmed')
                const urlOrigin = window.location.origin
                window.location.replace(`${urlOrigin}/patient/${newRoute}`)
            })
            .catch(err => pushTriggedErr(`There was an error deleting patient confirmation data. Please try again`))
    }

    function clickCancelTreatment():void{
        clickMenu()
        if(loadingCancelTreatment === false){
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'Cancel Treatment?',
                classIcon: 'text-font-color-2',
                iconPopup: faBan,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () =>setOnMsgCancelTreatment(true),
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
                    },
                ]
            })
        }
    }

    function submitCancelTreatment():void{
        if(inputMsgCancelPatient.length > 0){
            setLoadingCancelTreatment(true)
            setOnMsgCancelTreatment(false)
            const data: SubmitFinishedTreatmentT = {
                patientId: patientId,
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

    function cancelOnMsgCancelPatient(): void {
        setOnMsgCancelTreatment(false)
    }

    function handleCancelMsg(e?: ChangeEvent<HTMLInputElement>): void {
        setInputMsgCancelPatient(e?.target.value as string)
    }

    return {
        counterOptions,
        value,
        setValue,
        submitForm,
        errInput,
        confirmSubmitForm,
        handleCounter,
        loadingSubmit,
        clickDownload,
        confirmForDownloadPdf,
        clickSend,
        confirmSendEmail,
        loadingSendEmail,
        clickMenu,
        isMenuActive,
        clickDelete,
        confirmDeletePatient,
        loadingDelete,
        setOnModalSettings,
        onModalSettings,
        loadingCancelTreatment,
        clickCancelTreatment,
        onMsgCancelTreatment,
        cancelOnMsgCancelPatient,
        handleCancelMsg,
        inputMsgCancelPatient,
        submitCancelTreatment,
        doctorIsAvailable
    }
}