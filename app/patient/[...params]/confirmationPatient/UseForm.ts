'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from 'next/navigation'
import { DataOptionT } from "lib/types/FilterT"
import ServicingHours from "lib/actions/ServicingHours"
import { InputDrugCounterT, SubmitDrugCounterT } from "lib/types/InputT.type"
import { PopupSetting } from "lib/types/TableT.type"
import { faCircleCheck, faDownload, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { authStore } from "lib/useZustand/auth"
import { createDateFormat } from "lib/dates/createDateFormat"
import { createHourFormat } from "lib/dates/createHourFormat"
import { API } from "lib/api"
import { sendEmail } from "lib/emailJS/sendEmail"

export function UseForm() {
    const [onPopupSetting, setOnPopupSetting] = useState<PopupSetting>({} as PopupSetting)
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

    const {
        loadDataService,
        dataLoket,
        dataDrugCounter,
        dataPatientRegis,
        pushTriggedErr
    } = ServicingHours()

    const { user } = authStore()

    const router = useRouter()
    const params = useParams()
    const patientId = params?.params?.split('/')[4]
    const patientName = params?.params?.split('/')[3]

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
        if (loadingSubmit === false) {
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

            setOnPopupSetting({
                title: 'Confirm patient?',
                classIcon: 'text-font-color-2',
                classBtnNext: 'hover:bg-white',
                iconPopup: faCircleCheck,
                nameBtnNext: 'Yes',
                patientId: '',
                categoryAction: 'confirm-patient'
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

        setOnPopupSetting({} as PopupSetting)
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

    function cancelPopupFormConfirm(): void {
        setOnPopupSetting({} as PopupSetting)
    }

    function clickDownload(): void {
        setOnPopupSetting({
            title: 'Download Pdf?',
            classIcon: 'text-font-color-2',
            classBtnNext: 'hover:bg-white',
            iconPopup: faDownload,
            nameBtnNext: 'Yes',
            patientId: '',
            categoryAction: 'download-pdf'
        })
    }

    function confirmForDownloadPdf(): void {
        window.open(`/patient-registration-information/${patientId}/${patientName}/download/pdf`)
        setOnPopupSetting({} as PopupSetting)
    }

    function clickSend(): void {
        if(loadingSendEmail === false){
            setOnPopupSetting({
                title: 'Send confirmation to patient email?',
                classIcon: 'text-font-color-2',
                classBtnNext: 'hover:bg-white',
                iconPopup: faEnvelope,
                nameBtnNext: 'Yes',
                patientId: '',
                categoryAction: 'send-email'
            })
        }
    }

    async function confirmSendEmail(): Promise<void> {
        setOnPopupSetting({} as PopupSetting)
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
        .then(res=>{
            alert('Successfully sent confirmation message')
            setLoadingSendEmail(false)
        })
        .catch(err=>pushTriggedErr('a server error occurred. error while sending confirmation message to patient email. (emailJS error)'))
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

    return {
        counterOptions,
        value,
        setValue,
        submitForm,
        errInput,
        confirmSubmitForm,
        handleCounter,
        loadingSubmit,
        onPopupSetting,
        cancelPopupFormConfirm,
        clickDownload,
        confirmForDownloadPdf,
        clickSend,
        confirmSendEmail,
        loadingSendEmail
    }
}