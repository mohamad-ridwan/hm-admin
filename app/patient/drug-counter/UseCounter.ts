'use client'

import { useEffect, useState } from "react"
import ServicingHours from "lib/actions/ServicingHours"
import { DataOptionT } from "lib/types/FilterT"

export function UseCounter() {
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
    const [optionsTotalPatient, setOptionsTotalPatient] = useState<{title: string, total: number}[]>([
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
        dataLoket
    } = ServicingHours()

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

    return {
        optionsCounter,
        optionsGoTo,
        optionsTotalPatient
    }
}