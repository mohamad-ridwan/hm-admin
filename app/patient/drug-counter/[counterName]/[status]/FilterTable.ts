'use client'

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { notFound } from 'next/navigation'
import { DataOptionT, DataTableContentT } from "lib/types/FilterT"
import { HeadDataTableT } from "lib/types/TableT.type"
import ServicingHours from "lib/actions/ServicingHours"
import { DrugCounterT, InfoLoketT, PatientRegistrationT } from "lib/types/PatientT.types"
import { createDateFormat } from "lib/dates/createDateFormat"
import { createDateNormalFormat } from "lib/dates/createDateNormalFormat"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"

type ParamsProps = {
    params: {
        counterName: string
        status: string
    }
}

export function FilterTable({ params }: ParamsProps) {
    const currentDataStatus = useRef<PatientRegistrationT[]>([])
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [selectDate, setSelectDate] = useState<Date | undefined>()
    const [searchText, setSearchText] = useState<string>('')
    const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(false)
    const [currentFilterBy, setCurrentFilterBy] = useState<{
        id: string
        title: string
    }>({
        id: 'Filter By',
        title: 'Filter By'
    })
    const [currentSortBy, setCurrentSortBy] = useState<{
        id: string
        title: string
    }>({
        id: 'Sort By',
        title: 'Sort By'
    })
    const [head] = useState<HeadDataTableT>([
        {
            name: 'Patient Name'
        },
        {
            name: 'Queue Number'
        },
        {
            name: 'Status'
        },
        {
            name: 'Counter Name'
        },
        {
            name: 'Email'
        },
        {
            name: 'Phone'
        },
        {
            name: 'Date of Birth'
        },
        {
            name: 'Patient ID'
        }
    ])
    const [filterBy] = useState<DataOptionT>([
        {
            id: 'Filter By',
            title: 'Filter By',
        },
        {
            id: 'Date of Birth',
            title: 'Date of Birth',
        },
        {
            id: 'Queue Number',
            title: 'Queue Number',
        },
    ])
    const [dataSortByFilter] = useState<DataOptionT>([
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

    const {
        dataService,
        dataPatientRegis,
        dataDrugCounter,
        dataLoket,
        loadDataService,
    } = ServicingHours()

    const loket = dataLoket?.find(loket => loket?.loketName === params?.counterName)
    const statusURL: ['waiting-patient', 'already-confirmed', 'expired-patient'] = [
        'waiting-patient',
        'already-confirmed',
        'expired-patient'
    ]
    const checkStatusUrl = statusURL?.find(status => status === params?.status)

    if (!loadDataService && !loket) {
        notFound()
    }
    if (!checkStatusUrl) {
        notFound()
    }

    function findDataRegistration(
        dataPatientRegis: PatientRegistrationT[] | undefined,
        dataDrugCounter: DrugCounterT[] | undefined,
        dataLoket: InfoLoketT[] | undefined
    ): void {
        if (
            !loadDataService &&
            Array.isArray(dataPatientRegis) &&
            dataPatientRegis.length > 0
        ) {
            const patientWaiting = dataPatientRegis.filter((patient => {
                // patient counter
                const findPatientCounter = dataDrugCounter?.find(patientC =>
                    patientC?.patientId === patient.id &&
                    patientC?.loketInfo?.loketId === loket?.id &&
                    patientC?.isConfirm?.confirmState === false &&
                    patientC?.submissionDate?.submissionDate === createDateFormat(new Date())
                )
                return findPatientCounter
            }))
            const patientAlreadyConfirmed = dataPatientRegis.filter((patient => {
                const loket = dataLoket?.find(loket => loket.loketName === params.counterName)
                // patient counter
                const findPatientCounter = dataDrugCounter?.find(patientC =>
                    patientC?.patientId === patient.id &&
                    patientC?.loketInfo?.loketId === loket?.id &&
                    patientC?.isConfirm?.confirmState &&
                    patientC?.submissionDate?.submissionDate === createDateFormat(new Date())
                )
                return findPatientCounter
            }))

            const patientExpired = dataPatientRegis.filter((patient => {
                const loket = dataLoket?.find(loket => loket.loketName === params.counterName)
                // patient counter
                const findPatientCounter = dataDrugCounter?.find(patientC =>
                    patientC?.patientId === patient.id &&
                    patientC?.loketInfo?.loketId === loket?.id &&
                    patientC?.isConfirm?.confirmState === false &&
                    patientC?.submissionDate?.submissionDate < createDateFormat(new Date())
                )
                return findPatientCounter
            }))

            if (params.status === 'waiting-patient') {
                currentDataStatus.current = patientWaiting
            } else if (params.status === 'already-confirmed') {
                currentDataStatus.current = patientAlreadyConfirmed
            } else if (params.status === 'expired-patient') {
                currentDataStatus.current = patientExpired
            }

            if (currentDataStatus.current.length > 0) {
                const newData: DataTableContentT[] = []
                const getDataColumns = (): void => {
                    currentDataStatus.current.forEach(patient => {
                        const patientCounter = dataDrugCounter?.find(patientC => patientC.patientId === patient.id)
                        const status = params.status === 'waiting-patient' ? 'waiting' : params.status === 'already-confirmed' ? 'already confirmed' : params.status === 'expired-patient' ? 'expired' : 'null'
                        const colorStatus = status === 'waiting' ? '#FFA500' : status === 'already confirmed' ? '#288bbc' : status === 'expired' ? '#ff296d' : '#000'

                        const dataRegis: DataTableContentT = {
                            id: patient.id,
                            data: [
                                {
                                    name: patient.patientName
                                },
                                {
                                    name: patientCounter?.queueNumber as string,
                                    filterBy: 'Queue Number'
                                },
                                {
                                    name: status.toUpperCase(),
                                    colorName: colorStatus,
                                    fontWeightName: 'bold'
                                },
                                {
                                    name: params.counterName
                                },
                                {
                                    name: patient.emailAddress
                                },
                                {
                                    name: patient.phone
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
                                    name: patient.id
                                },
                            ]
                        }

                        newData.push(dataRegis)
                    })
                }

                getDataColumns()
                if (newData.length === currentDataStatus.current.length) {
                    setDataColumns(newData)
                }
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
            dataDrugCounter,
            dataLoket,
        )
    }, [loadDataService, dataService])

    // filter by
    // filter date
    const filterByDate =
        currentFilterBy.id === 'Date of Birth' &&
            dataColumns.length > 0 ? dataColumns.filter(patient => {
                if (selectDate) {
                    const findDate = patient.data.find(data => data?.filterBy === 'Date of Birth')
                    const checkDate = findDate?.name === createDateFormat(selectDate)
                    return checkDate
                }
                return dataColumns
            }) : []

    // filter queue number
    const filterQueueNumber =
        currentFilterBy.id === 'Queue Number' &&
            dataColumns.length > 0 ? dataColumns.filter(patient => {
                const findQueue = patient.data.find(data => data?.filterBy === 'Queue Number')

                return findQueue
            }) : dataColumns

    function sortByUp(): DataTableContentT[] {
        if (
            currentFilterBy.id === 'Date of Birth' &&
            currentSortBy.id === 'Sort By Up'
        ) {
            const sort = filterByDate.sort((a, b) => {
                const findDateA = a.data.find(data => data?.filterBy === 'Date of Birth')
                const findDateB = b.data.find(data => data?.filterBy === 'Date of Birth')
                const checkDate = (new Date(findDateB?.name as string)).valueOf() - (new Date(findDateA?.name as string)).valueOf()
                return checkDate
            })
            return sort
        } else if (
            currentFilterBy.id === 'Queue Number' &&
            currentSortBy.id === 'Sort By Up'
        ) {
            const sort = filterQueueNumber.sort((a, b) => {
                const findQueueA = a.data.find(data => data?.filterBy === 'Queue Number')
                const findQueueB = b.data.find(data => data?.filterBy === 'Queue Number')
                const checkQueue = Number(findQueueB?.name) - Number(findQueueA?.name)
                return checkQueue
            })
            return sort
        }

        return []
    }

    function sortByDown(): DataTableContentT[] {
        if (
            currentFilterBy.id === 'Date of Birth' &&
            currentSortBy.id === 'Sort By Down'
        ) {
            const sort = filterByDate.sort((a, b) => {
                const findDateA = a.data.find(data => data?.filterBy === 'Date of Birth')
                const findDateB = b.data.find(data => data?.filterBy === 'Date of Birth')
                const checkDate = (new Date(findDateA?.name as string)).valueOf() - (new Date(findDateB?.name as string)).valueOf()
                return checkDate
            })
            return sort
        } else if (
            currentFilterBy.id === 'Queue Number' &&
            currentSortBy.id === 'Sort By Down'
        ) {
            const sort = filterQueueNumber.sort((a, b) => {
                const findQueueA = a.data.find(data => data?.filterBy === 'Queue Number')
                const findQueueB = b.data.find(data => data?.filterBy === 'Queue Number')
                const checkQueue = Number(findQueueA?.name) - Number(findQueueB?.name)
                return checkQueue
            })
            return sort
        }

        return []
    }

    function resultFilterBy(): DataTableContentT[] {
        if (
            currentFilterBy.id === 'Date of Birth' &&
            currentSortBy.id === 'Sort By'
        ) {
            return filterByDate
        }
        if (
            currentFilterBy.id !== 'Filter By' &&
            currentSortBy.id !== 'Sort By'
        ) {
            if (currentSortBy.id === 'Sort By Up') {
                return sortByUp()
            } else if (currentSortBy.id === 'Sort By Down') {
                return sortByDown()
            }
        }

        return dataColumns
    }

    const filterText = resultFilterBy().filter(patient => {
        const findItem = patient.data.filter(data => data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))

        return findItem.length > 0
    })

    const pageSize: number = 5
    const currentTableData = useMemo((): DataTableContentT[] => {
        const firstPageIndex = (currentPage - 1) * pageSize
        const lastPageIndex = firstPageIndex + pageSize
        return filterText.slice(firstPageIndex, lastPageIndex)
    }, [filterText, currentPage])

    const changeTableStyle = (dataColumnsBody: DataTableContentT[]):void => {
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

    const lastPage: number = filterText.length < 5 ? 1 : Math.ceil(filterText.length / pageSize)
    const maxLength: number = 7

    const handleSearchText = (e?: ChangeEvent<HTMLInputElement>): void => {
        setSearchText(e?.target.value as string)
    }

    const handleInputDate = (e?: Date | ChangeEvent<HTMLInputElement>): void => {
        setSelectDate(e as Date)
        setCurrentPage(1)
    }

    function closeSearch(): void {
        setCurrentPage(1)
        setSearchText('')
    }

    function closeDate(): void {
        setCurrentPage(1)
        setSelectDate(undefined)
    }

    function handleFilterBy(): void {
        const elem = document.getElementById('filterBy') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        setCurrentFilterBy({
            id: value,
            title: value
        })
        setCurrentSortBy({
            id: 'Sort By',
            title: 'Sort By'
        })

        if (value === 'Date of Birth') {
            setDisplayOnCalendar(true)
        } else {
            setDisplayOnCalendar(false)
        }

        defaultCtgOptions()
    }

    const defaultCtgOptions = ():void=>{
        const elem = document.getElementById('sortByFilter') as HTMLSelectElement
        if(elem){
            elem.selectedIndex = 0
        }
    }

    function handleSortCategory(): void {
        const elem = document.getElementById('sortByFilter') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        setCurrentSortBy({
            id: value,
            title: value
        })
    }

    return {
        head,
        currentPage,
        setCurrentPage,
        lastPage,
        maxLength,
        currentTableData,
        searchText,
        handleSearchText,
        closeSearch,
        displayOnCalendar,
        selectDate,
        closeDate,
        handleInputDate,
        filterBy,
        handleFilterBy,
        currentFilterBy,
        dataSortByFilter,
        handleSortCategory
    }
}