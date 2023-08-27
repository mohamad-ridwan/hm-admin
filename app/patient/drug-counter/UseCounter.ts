'use client'

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import ServicingHours from "lib/dataInformation/ServicingHours"
import { DataOptionT } from "lib/types/FilterT"
import { createDateFormat } from "lib/formats/createDateFormat"
import { DrugCounterT } from "lib/types/PatientT.types"
import { spaceString } from "lib/regex/spaceString"
import { AlertsT, PopupSettings } from "lib/types/TableT.type"
import { faForward } from "@fortawesome/free-solid-svg-icons"
import { API } from "lib/api"
import { SubmitConfirmDrugCounterT } from "lib/types/InputT.type"
import { navigationStore } from "lib/useZustand/navigation"

type ErrType = {
    toPage: string
    counter: string
}

export function UseCounter() {
    const [currentCounter, setCurrentCounter] = useState<{
        id: string
        title: string
    }>({
        id: 'Choose Counter',
        title: 'Choose Counter'
    })
    const [currentToPage, setCurrentToPage] = useState<{
        id: string
        title: string
    }>({
        id: 'Select Go To',
        title: 'Select Go To'
    })
    const [currentPatientCall, setCurrentPatientCall] = useState<{
        documentId: string | null
        patientId: string | null
        queueNumber: number
    }>({
        documentId: null,
        patientId: null,
        queueNumber: 0
    })
    const [errSelectToPage, setErrSelectToPage] = useState<ErrType>({} as ErrType)
    const [onPopupSetting, setOnPopupSetting] = useState<PopupSettings>({} as PopupSettings)
    const [loadingPassPatient, setLoadingPassPatient] = useState<boolean>(false)
    const [optionsCounter, setOptionsCounter] = useState<DataOptionT>([
        {
            id: 'Choose Counter',
            title: 'Choose Counter'
        }
    ])
    const [viewScanner, setViewScanner] = useState<boolean>(false)
    const [optionsGoTo, setOptionsGoTo] = useState<DataOptionT>([
        {
            id: 'Select Go To',
            title: 'Select Go To'
        },
        {
            id: 'Waiting Patient',
            title: 'Waiting Patient'
        },
        {
            id: 'Already Confirmed',
            title: 'Already Confirmed'
        },
        {
            id: 'Expired Patient',
            title: 'Expired Patient'
        },
    ])
    const [optionsTotalPatient, setOptionsTotalPatient] = useState<{ title: string, total: number | string }[]>([
        {
            title: 'Total Patient Waiting Today',
            total: 0
        },
        {
            title: 'Has been Confirmed Today',
            total: 0
        },
        {
            title: 'Total Expired Progress',
            total: 0
        },
    ])

    const {
        dataLoket,
        dataDrugCounter,
        dataFinishTreatment,
        pushTriggedErr
    } = ServicingHours()

    const { setOnAlerts } = navigationStore()

    const router = useRouter()

    function loadDataCounter(): void {
        if (
            Array.isArray(dataLoket) &&
            dataLoket.length > 0
        ) {
            const counterActive = dataLoket.filter(counter=>counter?.roomActive === 'Active')
            const newCounter = counterActive.map(counter => ({
                id: counter.loketName,
                title: `${counter.loketName} - (${counter?.counterType})`
            }))
            setOptionsCounter([
                {
                    id: 'Choose Counter',
                    title: 'Choose Counter'
                },
                ...newCounter
            ])
        }
    }

    useEffect(() => {
        loadDataCounter()
    }, [dataLoket])

    function getPatientsAtCounter(): void {
        patientsAtCounter()

        if (currentCounter.id === 'Choose Counter') {
            setOptionsTotalPatient([
                {
                    title: 'Total Patient Waiting Today',
                    total: 0
                },
                {
                    title: 'Has been Confirmed Today',
                    total: 0
                },
                {
                    title: 'Total Expired Progress',
                    total: 0
                },
            ])
        }
    }

    useEffect(() => {
        getPatientsAtCounter()
    }, [currentCounter, dataDrugCounter, dataFinishTreatment])

    function patientsAtCounter(): void {
        setOptionsTotalPatient([
            {
                title: 'Total Patient Waiting Today',
                total: `${patientWaitingToday().length} ${checkPatientWaiting()}`
            },
            {
                title: 'Has been Confirmed Today',
                total: patientConfirmedToday().length
            },
            {
                title: 'Total Expired Progress',
                total: patientExpired().length
            },
        ])
    }

    function checkPatientWaiting(): string {
        if (patientWaitingToday().length > 0) {
            const patientNotCallYet = patientWaitingToday().filter(patient => !patient.isConfirm?.isSkipped)
            const patientSkipped = patientWaitingToday().filter(patient => patient.isConfirm?.isSkipped)

            if (patientSkipped.length > 0) {
                return `(${patientNotCallYet.length} Haven't been called, ${patientSkipped.length} Patient passed)`
            }
            return ''
        }

        return ''
    }

    function patientWaitingToday(): DrugCounterT[] {
        const patient = dataDrugCounter?.filter(patient => {
            const checkCounter = dataLoket?.find(loket =>
                loket.id === patient.loketInfo.loketId
            )?.loketName === currentCounter.id

            const checkFinishTreatment = dataFinishTreatment?.find(finishP =>
                finishP?.patientId === patient?.patientId
            )
            const checkSubmitDate = patient?.submissionDate?.submissionDate === createDateFormat(new Date())

            return checkCounter && !checkFinishTreatment && checkSubmitDate
        })
        setTimeout(() => {
            if (Array.isArray(patient)) {
                findCurrentQueueNumber(patient)
            }
        }, 0)
        if (!Array.isArray(patient)) {
            return []
        }

        return patient
    }

    function findCurrentQueueNumber(
        patient: DrugCounterT[]
    ): void {
        if (patient.length > 0) {
            const patientNotCallYet = patient.filter(patientData => !patientData.isConfirm?.isSkipped)
            if (patientNotCallYet.length > 0) {
                const sort = patientNotCallYet.sort((a, b) =>
                    Number(a.queueNumber) - Number(b.queueNumber)
                )
                const firstPatient = sort[0]
                setCurrentPatientCall({
                    documentId: firstPatient.id,
                    patientId: firstPatient.patientId,
                    queueNumber: Number(firstPatient.queueNumber)
                })

                return
            } else {
                setCurrentPatientCall({
                    documentId: null,
                    patientId: null,
                    queueNumber: 0
                })
                return
            }
        }

        setCurrentPatientCall({
            documentId: null,
            patientId: null,
            queueNumber: 0
        })
    }

    function patientConfirmedToday(): DrugCounterT[] {
        const patientConfirm = dataDrugCounter?.filter(patient => {
            const checkCounter = dataLoket?.find(loket =>
                loket.id === patient.loketInfo.loketId
            )?.loketName === currentCounter.id

            const checkFinishTreatment = dataFinishTreatment?.find(finishP =>
                finishP?.patientId === patient?.patientId &&
                !finishP?.isCanceled
            )
            const checkSubmitDate = patient?.submissionDate?.submissionDate === createDateFormat(new Date())

            return checkCounter && checkFinishTreatment && checkSubmitDate
        })
        if (!Array.isArray(patientConfirm)) {
            return []
        }

        return patientConfirm
    }

    function patientExpired(): DrugCounterT[] {
        const patientExpired = dataDrugCounter?.filter(patient => {
            const checkCounter = dataLoket?.find(loket =>
                loket.id === patient.loketInfo.loketId
            )?.loketName === currentCounter.id

            const checkFinishTreatment = dataFinishTreatment?.find(finishP =>
                finishP?.patientId === patient?.patientId
            )
            const checkSubmitDate = patient?.submissionDate?.submissionDate < createDateFormat(new Date())

            return checkCounter && !checkFinishTreatment && checkSubmitDate
        })
        if (!Array.isArray(patientExpired)) {
            return []
        }

        return patientExpired
    }

    // handle choose counter
    function handleCounter(): void {
        const elem = document.getElementById('counter') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        setCurrentCounter({
            id: value,
            title: value
        })
    }

    // handle go to page
    function handleGoTo(): void {
        const elem = document.getElementById('goToPage') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        setCurrentToPage({
            id: value,
            title: value
        })
    }

    function clickViewPage(): void {
        let err = {} as ErrType

        if (currentCounter.id === 'Choose Counter') {
            err.counter = 'Choose First'
        }
        if (currentToPage.id === 'Select Go To') {
            err.toPage = 'Choose First'
        }

        if (Object.keys(err).length !== 0) {
            setErrSelectToPage(err)
            return
        }
        router.push(`drug-counter/${currentCounter.id}/${currentToPage.id.replace(spaceString, '-').toLowerCase()}`)
    }

    // QR scanner actions
    function onScanner(): void {
        setViewScanner(!viewScanner)
    }

    function onDecode(
        result: string
    ): void {
        window.open(result)
    }

    function onError(
        error: Error
    ): void {
        pushTriggedErr(error.message)
    }

    function clickPassPatient(): void {
        if (loadingPassPatient === false) {
            setOnPopupSetting({
                clickClose: () => setOnPopupSetting({} as PopupSettings),
                title: 'Pass Patient?',
                classIcon: 'text-font-color-2',
                iconPopup: faForward,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmPassPatient(),
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
                        clickBtn: () => setOnPopupSetting({} as PopupSettings),
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057',
                        }
                    }
                ]
            })
        }
    }

    function confirmPassPatient(): void {
        const patientCounter = dataDrugCounter?.find(patient => patient.patientId === currentPatientCall.patientId)
        if (!patientCounter) {
            pushTriggedErr(`No patient found with id : ${currentPatientCall.patientId}`)
        }

        setOnPopupSetting({} as PopupSettings)
        setLoadingPassPatient(true)

        API().APIPutPatientData(
            'drug-counter',
            currentPatientCall.documentId as string,
            dataSubmitPassPatient(patientCounter as DrugCounterT)
        )
            .then(res => {
                setLoadingPassPatient(false)
                setOnAlerts({
                    onAlert: true,
                    title: 'Successful to pass the patient',
                    desc: 'Patient has passed'
                })
                setTimeout(() => {
                    setOnAlerts({} as AlertsT)
                }, 3000);
                window.location.reload()
            })
            .catch(err => pushTriggedErr('A server error occurred. Occurs when passing a patient'))
    }

    function dataSubmitPassPatient(patientCounter: DrugCounterT): SubmitConfirmDrugCounterT {
        const {
            patientId,
            loketInfo,
            message,
            adminInfo,
            submissionDate,
            queueNumber
        } = patientCounter as DrugCounterT

        const data: SubmitConfirmDrugCounterT = {
            patientId,
            loketInfo,
            message,
            adminInfo,
            submissionDate,
            queueNumber,
            isConfirm: {
                confirmState: false,
                isSkipped: true
            }
        }

        return data
    }
    
    return {
        optionsCounter,
        optionsGoTo,
        optionsTotalPatient,
        handleCounter,
        handleGoTo,
        errSelectToPage,
        clickViewPage,
        viewScanner,
        onScanner,
        onDecode,
        onError,
        clickPassPatient,
        onPopupSetting,
        currentPatientCall,
        loadingPassPatient
    }
}