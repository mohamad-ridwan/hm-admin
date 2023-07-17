'use client'

import { ChangeEvent, useEffect, useState } from "react"
import { HeadDataTableT } from "lib/types/TableT.type"
import { DataOptionT, DataTableContentT } from "lib/types/FilterT"
import ServicingHours from "lib/actions/ServicingHours"
import { PatientFinishTreatmentT, PatientRegistrationT } from "lib/types/PatientT.types"
import { createDateNormalFormat } from "lib/dates/createDateNormalFormat"

export function FilterTable() {
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [searchText, setSearchText] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [currentStatus, setCurrentStatus] = useState<string>('Status')
    const [currentFilterBy, setCurrentFilterBy] = useState<string>('Filter By')
    const [currentSortBy, setCurrentSortBy] = useState<string>('Sort By')
    const [statusOptions] = useState<DataOptionT>([
        {
            id: 'Status',
            title: 'Status',
        },
        {
            id: 'Completed',
            title: 'Completed',
        },
        {
            id: 'Canceled',
            title: 'Canceled',
        },
    ])
    const [filterBy] = useState<DataOptionT>([
        {
            id: 'Filter By',
            title: 'Filter By',
        },
        {
            id: 'Completed',
            title: 'Completed',
        },
        {
            id: 'Confirmation Date',
            title: 'Confirmation Date',
        },
        {
            id: 'Date of Birth',
            title: 'Date of Birth',
        },
    ])
    const [sortOptions] = useState<DataOptionT>([
        {
            id: 'Sort By',
            title: 'Sort By'
        },
        {
            id: 'Sort By Up',
            title: 'Sort By Up'
        },
        {
            id: 'Sort By Down',
            title: 'Sort By Down'
        },
    ])
    const [head] = useState<HeadDataTableT>([
        {
            name: 'Patient Name'
        },
        {
            name: 'Status'
        },
        {
            name: 'Confirmation Date'
        },
        {
            name: 'Confirmation Hour'
        },
        {
            name: 'Email'
        },
        {
            name: 'Date of Birth'
        },
        {
            name: 'Phone'
        },
    ])

    const {
        dataService,
        dataPatientRegis,
        dataConfirmationPatients,
        dataDrugCounter,
        dataFinishTreatment,
        dataLoket,
        loadDataService,
    } = ServicingHours()

    function findDataRegistration(
        dataPatientRegis: PatientRegistrationT[] | undefined,
        dataFinishTreatment: PatientFinishTreatmentT[] | undefined
    ): void {
        if (
            !loadDataService &&
            Array.isArray(dataPatientRegis) &&
            dataPatientRegis.length > 0
        ) {
            const findRegistration = dataPatientRegis.filter(patient => {
                const findPatientFT = dataFinishTreatment?.find(patientFT =>
                    patientFT.patientId === patient.id
                )

                return findPatientFT
            })

            if (findRegistration.length > 0) {
                const newPatient: DataTableContentT[] = findRegistration.map(patient => {
                    const patientFT = dataFinishTreatment?.find(patientFT =>
                        patientFT.patientId === patient.id
                    )
                    const status: 'Canceled' | 'Completed' = patientFT?.isCanceled ? 'Canceled' : 'Completed'
                    const statusColor = status === 'Completed' ? '#288bbc' : '#ff296d'

                    return {
                        id: patient.id,
                        data: [
                            {
                                name: patient.patientName
                            },
                            {
                                colorName: statusColor,
                                fontWeightName: 'bold',
                                name: status.toUpperCase()
                            },
                            {
                                firstDesc: createDateNormalFormat(patientFT?.confirmedTime?.dateConfirm as string),
                                colorName: '#777',
                                marginBottom: '4.5px',
                                fontSize: '12px',
                                filterBy: 'Confirmation Date',
                                clock: patientFT?.confirmedTime?.confirmHour as string,
                                name: patientFT?.confirmedTime?.dateConfirm as string
                            },
                            {
                                name: patientFT?.confirmedTime?.confirmHour as string
                            },
                            {
                                name: patient.emailAddress
                            },
                            {
                                firstDesc: createDateNormalFormat(patient.dateOfBirth),
                                colorName: '#777',
                                marginBottom: '4.5px',
                                fontSize: '12px',
                                filterBy: 'Date of Birth',
                                name: patient.dateOfBirth
                            },
                            {
                                name: patient.phone
                            },
                        ]
                    }
                })
                setDataColumns(newPatient)
            } else {
                setDataColumns([])
            }
        } else if (
            !loadDataService &&
            Array.isArray(dataPatientRegis) &&
            dataPatientRegis.length === 0
        ) {
            setDataColumns([])
        }
    }

    useEffect(() => {
        findDataRegistration(
            dataPatientRegis,
            dataFinishTreatment
        )
    }, [loadDataService, dataService])

    const handleSearchText = (e?: ChangeEvent<HTMLInputElement>): void => {
        setSearchText(e?.target.value as string)
        setCurrentPage(1)
    }

    function closeSearch(): void {
        setCurrentPage(1)
        setSearchText('')
    }

    function handleStatus():void{
        const elem = document.getElementById('statusFilter') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        setCurrentStatus(value)
    }

    function handleFilterBy():void{
        const elem = document.getElementById('filterBy') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        setCurrentFilterBy(value)
    }

    function handleSort():void{
        const elem = document.getElementById('sortBy') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        setCurrentSortBy(value)
    }

    return {
        head,
        dataColumns,
        handleSearchText,
        closeSearch,
        searchText,
        statusOptions,
        filterBy,
        handleStatus,
        handleFilterBy,
        sortOptions,
        handleSort,
        currentFilterBy
    }
}