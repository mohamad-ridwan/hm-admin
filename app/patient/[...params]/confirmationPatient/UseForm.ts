'use client'

import { useEffect, useState } from "react"
import { DataOptionT } from "lib/types/FilterT"
import ServicingHours from "lib/actions/ServicingHours"

export function UseForm() {
    const [value, setValue] = useState<string>('')
    const [counterOptions, setCounterOptions] = useState<DataOptionT>([
        {
            id: 'Select Counter',
            title: 'Select Counter'
        }
    ])

    const {
        loadDataService,
        dataLoket
    } = ServicingHours()

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

    return {
        counterOptions,
        value,
        setValue
    }
}