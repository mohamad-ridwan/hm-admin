'use client'

import { useEffect, useMemo, useState } from "react"
import { useRouter } from 'next/navigation'
import ServicingHours from "lib/actions/ServicingHours"
import { DataOptionT } from "lib/types/FilterT"
import { createDateFormat } from "lib/dates/createDateFormat"
import { DrugCounterT } from "lib/types/PatientT.types"
import { spaceString } from "lib/regex/spaceString"

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
    const [errSelectToPage, setErrSelectToPage] = useState<ErrType>({} as ErrType)
    const [optionsCounter, setOptionsCounter] = useState<DataOptionT>([
        {
            id: 'Choose Counter',
            title: 'Choose Counter'
        }
    ])
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
    const [optionsTotalPatient, setOptionsTotalPatient] = useState<{ title: string, total: number }[]>([
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
        dataFinishTreatment
    } = ServicingHours()

    const router = useRouter()

    function loadDataCounter(): void {
        if (
            Array.isArray(dataLoket) &&
            dataLoket.length > 0
        ) {
            const newCounter = dataLoket.map(counter => ({
                id: counter.loketName,
                title: counter.loketName
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

    const getPatientsAtCounter = useMemo(() => {
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
    }, [currentCounter])

    function patientsAtCounter(): void {
        setOptionsTotalPatient([
            {
                title: 'Total Patient Waiting Today',
                total: patientWaitingToday().length
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
        if (!Array.isArray(patient)) {
            return []
        }

        return patient
    }

    function patientConfirmedToday():DrugCounterT[]{
        const patientConfirm = dataDrugCounter?.filter(patient => {
            const checkCounter = dataLoket?.find(loket =>
                loket.id === patient.loketInfo.loketId
            )?.loketName === currentCounter.id

            const checkFinishTreatment = dataFinishTreatment?.find(finishP =>
                finishP?.patientId === patient?.patientId
            )
            const checkSubmitDate = patient?.submissionDate?.submissionDate === createDateFormat(new Date())

            return checkCounter && checkFinishTreatment && checkSubmitDate
        })
        if(!Array.isArray(patientConfirm)){
            return []
        }

        return patientConfirm
    }

    function patientExpired():DrugCounterT[]{
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
        if(!Array.isArray(patientExpired)){
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

        return getPatientsAtCounter
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

        if(currentCounter.id === 'Choose Counter'){
            err.counter = 'Choose First'
        }
        if(currentToPage.id === 'Select Go To'){
            err.toPage = 'Choose First'
        }

        if(Object.keys(err).length !== 0){
            setErrSelectToPage(err)
            return
        }
        router.push(`drug-counter/${currentCounter.id}/${currentToPage.id.replace(spaceString, '-').toLowerCase()}`)
    }

    return {
        optionsCounter,
        optionsGoTo,
        optionsTotalPatient,
        handleCounter,
        handleGoTo,
        errSelectToPage,
        clickViewPage
    }
}