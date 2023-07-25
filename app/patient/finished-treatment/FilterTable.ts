'use client'

import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { HeadDataTableT } from "lib/types/TableT.type"
import { DataOptionT, DataTableContentT } from "lib/types/FilterT"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { ConfirmationPatientsT, DrugCounterT, PatientFinishTreatmentT, PatientRegistrationT } from "lib/types/PatientT.types"
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat"
import { createDateFormat } from "lib/formats/createDateFormat"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"

export function FilterTable() {
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [searchText, setSearchText] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(false)
    const [selectDate, setSelectDate] = useState<Date | undefined>()
    const [currentFilterBy, setCurrentFilterBy] = useState<string>('Filter By')
    const [currentSortBy, setCurrentSortBy] = useState<string>('Sort By')
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
            id: 'Canceled',
            title: 'Canceled',
        },
        {
            id: 'Confirmation Date',
            title: 'Confirmation Date',
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
        dataFinishTreatment: PatientFinishTreatmentT[] | undefined,
        dataConfirmationPatients: ConfirmationPatientsT[] | undefined,
        dataDrugCounter: DrugCounterT[] | undefined,
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

                    // find url to patient detail
                    const confirmPatient = dataConfirmationPatients?.find(confirmPatient =>
                        confirmPatient.patientId === patient.id
                    )
                    const counterPatient = dataDrugCounter?.find(counterP =>
                        counterP.patientId === patient.id
                    )
                    const currentCounter = dataLoket?.find(counter=>counter.id === counterPatient?.loketInfo?.loketId)
                    const patientName = patient.patientName?.replace(specialCharacter, '')?.replace(spaceString, '')
                    const confirmPatientUrl = `/patient/patient-registration/personal-data/${confirmPatient ? 'confirmed' : 'not-yet-confirmed'}/${patientName}/${patient.id}`
                    const confirmAndCounterUrl = `${confirmPatientUrl}/counter/${currentCounter?.loketName}/${counterPatient?.isConfirm?.confirmState ? 'confirmed' : 'not-yet-confirmed'}/${counterPatient?.queueNumber}`

                    const currentURL: string = !counterPatient ? confirmPatientUrl : confirmAndCounterUrl

                    return {
                        id: patient.id,
                        url: currentURL,
                        data: [
                            {
                                name: patient.patientName
                            },
                            {
                                colorName: statusColor,
                                fontWeightName: 'bold',
                                filterBy: status,
                                clock: `${patientFT?.confirmedTime?.dateConfirm as string} ${patientFT?.confirmedTime?.confirmHour as string}`,
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
            dataFinishTreatment,
            dataConfirmationPatients,
            dataDrugCounter,
        )
    }, [loadDataService, dataService])

    // filter table
    // filter completed
    function filterStatus(
        statusFilter: 'Completed' | 'Canceled'
    ): DataTableContentT[] {
        if (currentFilterBy === statusFilter) {
            if (selectDate) {
                const completed = dataColumns.filter(patient => {
                    const filterBy = patient.data.find(data =>
                        data.filterBy === statusFilter
                    )
                    const checkTime = Date.parse(createDateFormat(new Date((filterBy?.clock as string)))) === Date.parse(createDateFormat(selectDate))
                    return checkTime
                })

                return completed
            } else {
                const completed = dataColumns.filter(patient => {
                    const filterBy = patient.data.find(data => data.filterBy === statusFilter)
                    return filterBy
                })
                return completed
            }
        }

        return []
    }

    // result filter status
    const resultFilterStatus = filterStatus(currentFilterBy as 'Completed')

    // sort by status
    function sortByStatus(
        statusFilter: 'Completed' | 'Canceled'
    ): DataTableContentT[] {
        if (
            currentFilterBy === statusFilter &&
            currentSortBy !== 'Sort By'
        ) {
            if (currentSortBy === 'Sort By Up') {
                return sortUpStatus(statusFilter)
            } else if (currentSortBy === 'Sort By Down') {
                return sortDownStatus(statusFilter)
            }
        } else if (
            currentFilterBy === statusFilter &&
            currentSortBy === 'Sort By'
        ) {
            return resultFilterStatus
        }

        return []
    }
    // sort up (status)
    function sortUpStatus(
        statusFilter: 'Completed' | 'Canceled'
    ): DataTableContentT[] {
        const sort = resultFilterStatus.sort((a, b) => {
            const dateB = b.data.find(data =>
                data.filterBy === statusFilter
            )
            const dateA = a.data.find(data =>
                data.filterBy === statusFilter
            )
            const compareDate = (new Date(dateB?.clock as string)).valueOf() - (new Date(dateA?.clock as string)).valueOf()
            return compareDate
        })

        return sort
    }
    // sort down (status)
    function sortDownStatus(
        statusFilter: 'Completed' | 'Canceled'
    ): DataTableContentT[] {
        const sort = resultFilterStatus.sort((a, b) => {
            const dateA = a.data.find(data =>
                data.filterBy === statusFilter
            )
            const dateB = b.data.find(data =>
                data.filterBy === statusFilter
            )
            const compareDate = (new Date(dateA?.clock as string)).valueOf() - (new Date(dateB?.clock as string)).valueOf()
            return compareDate
        })

        return sort
    }

    const resultSortByStatus = sortByStatus(currentFilterBy as 'Completed')

    // filter by confirmation date (only)
    function filterConfirmationDate(): DataTableContentT[] {
        if (currentFilterBy === 'Confirmation Date') {
            if (selectDate) {
                const confirmDate = dataColumns.filter(patient => {
                    const filterBy = patient.data.find(data => data.filterBy === 'Confirmation Date')
                    const checkTime = Date.parse(filterBy?.name as string) === Date.parse(createDateFormat(selectDate))
                    return checkTime
                })
                return confirmDate
            } else {
                const confirmDate = dataColumns.filter(patient => {
                    const filterBy = patient.data.find(data => data.filterBy === 'Confirmation Date')
                    return filterBy
                })
                return confirmDate
            }
        }

        return []
    }

    const resultFilterConfirmDate = filterConfirmationDate()

    // sort by confirmation date (only)
    function sortByConfirmDate(): DataTableContentT[] {
        if (
            currentFilterBy === 'Confirmation Date' &&
            currentSortBy !== 'Sort By'
        ) {
            if (currentSortBy === 'Sort By Up') {
                return sortUpConfirmDate()
            } else if (currentSortBy === 'Sort By Down') {
                return sortDownConfirmDate()
            }
        } else if (
            currentFilterBy === 'Confirmation Date' &&
            currentSortBy === 'Sort By'
        ) {
            return resultFilterConfirmDate
        }

        return []
    }

    // sort up confirmation date (only)
    function sortUpConfirmDate(): DataTableContentT[] {
        const sort = resultFilterConfirmDate.sort((a, b) => {
            const filterB = b.data.find(data => data.filterBy === 'Confirmation Date')
            const filterA = a.data.find(data => data.filterBy === 'Confirmation Date')
            const compareDate =
                (new Date(`${filterB?.name} ${filterB?.clock}`)).valueOf() -
                (new Date(`${filterA?.name} ${filterA?.clock}`)).valueOf()
            return compareDate
        })

        return sort
    }
    // sort down confirmation date (only)
    function sortDownConfirmDate(): DataTableContentT[] {
        const sort = resultFilterConfirmDate.sort((a, b) => {
            const filterA = a.data.find(data => data.filterBy === 'Confirmation Date')
            const filterB = b.data.find(data => data.filterBy === 'Confirmation Date')
            const compareDate =
                (new Date(`${filterA?.name} ${filterA?.clock}`)).valueOf() -
                (new Date(`${filterB?.name} ${filterB?.clock}`)).valueOf()
            return compareDate
        })

        return sort
    }

    const resultSortByConfirmDate = sortByConfirmDate()

    function filterText(): DataTableContentT[] {
        if (
            currentFilterBy === 'Completed' ||
            currentFilterBy === 'Canceled'
        ) {
            const search = resultSortByStatus.filter(patient => {
                const name = patient.data.find(data =>
                    data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()) ||
                    data?.firstDesc?.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase())
                )
                return name
            })
            return search
        } else if (
            currentFilterBy === 'Confirmation Date'
        ) {
            const search = resultSortByConfirmDate.filter(patient => {
                const name = patient.data.find(data =>
                    data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()) ||
                    data?.firstDesc?.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase())
                )
                return name
            })
            return search
        }

        const search = dataColumns.filter(patient => {
            const name = patient.data.find(data =>
                data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()) ||
                data?.firstDesc?.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase())
            )
            return name
        })
        return search
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [searchText])

    const pageSize: number = 5
    const currentTableData = useMemo((): DataTableContentT[] => {
        const firstPageIndex = (currentPage - 1) * pageSize
        const lastPageIndex = firstPageIndex + pageSize
        return filterText().slice(firstPageIndex, lastPageIndex)
    }, [filterText(), currentPage])

    const lastPage: number = filterText().length < 5 ? 1 : Math.ceil(filterText().length / pageSize)
    const maxLength: number = 7

    const changeTableStyle = (dataColumnsBody: DataTableContentT[]): void => {
        if (dataColumnsBody?.length > 0) {
            let elementTData = document.getElementById('tData00') as HTMLElement
            if (elementTData !== null) {
                for (let i = 0; i < dataColumnsBody?.length; i++) {
                    elementTData = document.getElementById(`tData${i}0`) as HTMLElement
                    if (elementTData?.style) {
                        elementTData = document.getElementById(`tData${i}4`) as HTMLElement
                        elementTData.style.overflowX = 'auto'
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (currentTableData.length > 0) {
            changeTableStyle(currentTableData)
        }
    }, [currentPage, currentTableData])

    const handleSearchText = (e?: ChangeEvent<HTMLInputElement>): void => {
        setSearchText(e?.target.value as string)
        setCurrentPage(1)
    }

    function closeSearch(): void {
        setCurrentPage(1)
        setSearchText('')
    }

    function handleFilterBy(): void {
        const elem = document.getElementById('filterBy') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        setCurrentFilterBy(value)

        if (value !== 'Filter By') {
            setDisplayOnCalendar(true)
            return
        }

        setSelectDate(undefined)
        setCurrentPage(1)
        return setDisplayOnCalendar(false)
    }

    function handleSort(): void {
        const elem = document.getElementById('sortBy') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        setCurrentSortBy(value)
    }

    const handleInputDate = (e?: Date | ChangeEvent<HTMLInputElement>): void => {
        setSelectDate(e as Date)
        setCurrentPage(1)
    }

    function closeSearchDate(): void {
        setCurrentPage(1)
        setSelectDate(undefined)
    }

    return {
        head,
        handleSearchText,
        closeSearch,
        searchText,
        filterBy,
        handleFilterBy,
        sortOptions,
        handleSort,
        currentFilterBy,
        selectDate,
        displayOnCalendar,
        handleInputDate,
        closeSearchDate,
        currentTableData,
        lastPage,
        maxLength,
        currentPage,
        setCurrentPage,
    }
}