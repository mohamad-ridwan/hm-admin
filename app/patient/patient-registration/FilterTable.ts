'use client'

import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { DataOnDataTableContentT, DataOptionT, DataTableContentT } from "lib/types/FilterT"
import { createDateFormat } from "lib/formats/createDateFormat"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT } from "lib/types/PatientT.types"
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat"
import { HeadDataTableT } from "lib/types/TableT.type"

export function FilterTable() {
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [selectDate, setSelectDate] = useState<Date | undefined>()
    const [searchText, setSearchText] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(false)
    const [indexActiveColumnMenu, setIndexActiveColumnMenu] = useState<number | null>(null)
    const [chooseFilterByDate, setChooseFilterByDate] = useState<{
        id: string
        title: string
    }>({
        id: 'Filter By',
        title: 'Filter By'
    })
    const [chooseOnSortDate, setChooseOnSortDate] = useState<{
        id: string
        title: string
    }>({
        id: 'Sort By',
        title: 'Sort By'
    })
    const [dataSortDate] = useState<DataOptionT>([
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
    const [filterBy] = useState<DataOptionT>([
        {
            id: 'Filter By',
            title: 'Filter By',
        },
        {
            id: 'Appointment Date',
            title: 'Appointment Date',
        },
        {
            id: 'Submission Date',
            title: 'Submission Date',
        },
        {
            id: 'Date of Birth',
            title: 'Date of Birth',
        },
    ])
    const [head] = useState<HeadDataTableT>([
        {
            name: 'Patient Name'
        },
        {
            name: 'Appointment Date'
        },
        {
            name: 'Submission Date'
        },
        {
            name: 'Hours Submitted'
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
        {
            name: 'Action'
        },
    ])

    const {
        dataService,
        dataPatientRegis,
        dataConfirmationPatients,
        dataFinishTreatment,
        loadDataService,
    } = ServicingHours({})

    function findDataRegistration(
        dataPatientRegis: PatientRegistrationT[] | undefined,
        dataConfirmationPatients: ConfirmationPatientsT[] | undefined,
        dataFinishTreatment: PatientFinishTreatmentT[] | undefined
    ): void {
        if (
            !loadDataService &&
            Array.isArray(dataPatientRegis) &&
            dataPatientRegis.length > 0
        ) {
            const findRegistration = dataPatientRegis.filter((patient => {
                // patient already on confirm
                const findPatientOnConfirm = dataConfirmationPatients?.find((patientConfirm) => patientConfirm.patientId === patient.id)
                // patient at finish treatment
                const findPatientFT = dataFinishTreatment?.find((patientFT) => patientFT.patientId === patient.id)

                return !findPatientOnConfirm && !findPatientFT
            }))

            if (findRegistration.length > 0) {
                const registration:DataTableContentT[] = findRegistration.map((patient, idx)=>{
                    return{
                        id: patient.id,
                        data: [
                            {
                                name: patient.patientName
                            },
                            {
                                firstDesc: createDateNormalFormat(patient.appointmentDate),
                                color: '#ff296d',
                                colorName: '#777',
                                marginBottom: '4.5px',
                                fontSize: '12px',
                                filterBy: 'Appointment Date',
                                clock: patient.submissionDate.clock,
                                name: patient.appointmentDate,
                            },
                            {
                                firstDesc: createDateNormalFormat(patient.submissionDate.submissionDate),
                                colorName: '#777',
                                marginBottom: '4.5px',
                                fontSize: '12px',
                                filterBy: 'Submission Date',
                                clock: patient.submissionDate.clock,
                                name: patient.submissionDate.submissionDate,
                            },
                            {
                                name: patient.submissionDate.clock
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
                                name: patient.dateOfBirth,
                            },
                            {
                                name: patient.phone
                            },
                            {
                                name: ''
                            }
                        ]
                    }
                })
                setDataColumns(registration)
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
            dataConfirmationPatients,
            dataFinishTreatment
        )
    }, [loadDataService, dataService])

    // filter table
    // filter by date
    const filterByDate: DataTableContentT[] = dataColumns?.length > 0 ? dataColumns.filter(patient => {
        function onFilterDate(): DataOnDataTableContentT[] | undefined {
            if (selectDate) {
                const findDate = patient.data.filter(data =>
                    data.filterBy?.toLowerCase() === chooseFilterByDate.id.toLowerCase() &&
                    data.name === createDateFormat(selectDate))
                return findDate
            } else if (chooseFilterByDate.id !== 'Filter By') {
                const findDate = patient.data.filter(data =>
                    data.filterBy?.toLowerCase() === chooseFilterByDate.id.toLowerCase())
                return findDate
            }
        }

        const findDate = onFilterDate()

        return Array.isArray(findDate) && findDate.length > 0
    }) : []

    const checkFilterByDate = (): DataTableContentT[] => {
        if (chooseFilterByDate.id !== 'Filter By') {
            return filterByDate
        }

        return dataColumns
    }

    // sort by up
    const sortByUp = (
        onClock: boolean,
    ) => {
        const sort = filterByDate.sort((p1, p2) => {
            const getSort: number = (new Date(getSortDateAfterFilterByDate(p1, p2, chooseFilterByDate.id.toLowerCase(), onClock).dateTwo)).valueOf() - (new Date(getSortDateAfterFilterByDate(p1, p2, chooseFilterByDate.id.toLowerCase(), onClock).dateOne)).valueOf()

            return getSort
        })
        return sort
    }

    // sort by down
    const sortByDown = (
        onClock: boolean,
    ) => {
        const sort = filterByDate.sort((p1, p2) => {
            const getSort: number = (new Date(getSortDateAfterFilterByDate(p1, p2, chooseFilterByDate.id.toLowerCase(), onClock).dateOne)).valueOf() - (new Date(getSortDateAfterFilterByDate(p1, p2, chooseFilterByDate.id.toLowerCase(), onClock).dateTwo)).valueOf()

            return getSort
        })
        return sort
    }

    // sort after filter by date
    const sortDate = chooseOnSortDate.id === 'Sort By Up' && filterByDate?.length > 0 ? sortByUp(
        chooseFilterByDate.id !== 'Filter by' && chooseFilterByDate.id !== 'Submission Date' ? false : true
    ) : chooseOnSortDate.id === 'Sort By Down' && filterByDate?.length > 0 ? sortByDown(
        chooseFilterByDate.id !== 'Filter by' && chooseFilterByDate.id !== 'Submission Date' ? false : true
    ) : []

    function getSortDateAfterFilterByDate(
        p1: DataTableContentT,
        p2: DataTableContentT,
        chooseFilterByDate: string,
        onClock: boolean
    ): {
        dateOne: string
        dateTwo: string
    } {
        const findDateOnSelectDateP1: DataOnDataTableContentT | undefined = p1.data.find(data =>
            data?.filterBy?.toLowerCase() === chooseFilterByDate
        )
        const findDateOnSelectDateP2: DataOnDataTableContentT | undefined = p2.data.find(data =>
            data?.filterBy?.toLowerCase() === chooseFilterByDate
        )

        if (onClock) {
            const dateOne: string = `${findDateOnSelectDateP1?.name} ${findDateOnSelectDateP1?.clock}`
            const dateTwo: string = `${findDateOnSelectDateP2?.name} ${findDateOnSelectDateP2?.clock}`

            return { dateOne, dateTwo }
        } else {
            const dateOne: string = `${findDateOnSelectDateP1?.name}`
            const dateTwo: string = `${findDateOnSelectDateP2?.name}`

            return { dateOne, dateTwo }
        }
    }

    const checkSortSubmissionDate = (): DataTableContentT[] => {
        if (chooseOnSortDate.id !== 'Sort By') {
            return sortDate
        }

        return checkFilterByDate()
    }

    // filter on search text
    const filterText: DataTableContentT[] = checkSortSubmissionDate().length > 0 ? checkSortSubmissionDate().filter(patient => {
        const findItem = patient.data.filter(data => 
            data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()) ||
            data?.firstDesc?.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase())
            )

        return findItem.length > 0
    }) : []

    const pageSize: number = 5

    const currentTableData = useMemo((): DataTableContentT[] => {
        const firstPageIndex = (currentPage - 1) * pageSize
        const lastPageIndex = firstPageIndex + pageSize
        return filterText.slice(firstPageIndex, lastPageIndex)
    }, [filterText, currentPage])

    const handleSearchText = (e?: ChangeEvent<HTMLInputElement>): void => {
        setSearchText(e?.target.value as string)
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [searchText])

    const handleInputDate = (e?: Date | ChangeEvent<HTMLInputElement>): void => {
        setSelectDate(e as Date)
        setCurrentPage(1)
    }

    const handleFilterDate = (): void => {
        const selectEl = document.getElementById('filterDateTable') as HTMLSelectElement
        const id = selectEl?.options[selectEl.selectedIndex].value
        if (id) {
            if (id !== 'Filter By') {
                setDisplayOnCalendar(true)
            } else {
                setDisplayOnCalendar(false)
                setSelectDate(undefined)
            }

            if (id === 'Filter By') {
                setChooseOnSortDate({
                    id: 'Sort By',
                    title: 'Sort By'
                })
            }

            setChooseFilterByDate({
                id: id,
                title: id
            })
        }
    }

    const handleSortCategory = () => {
        const selectEl = document.getElementById('sortDateTable') as HTMLSelectElement
        const id = selectEl.options[selectEl.selectedIndex].value
        if (id) {
            setChooseOnSortDate({
                id: id,
                title: id
            })
        }
    }

    const lastPage: number = filterText.length < 5 ? 1 : Math.ceil(filterText.length / pageSize)
    const maxLength: number = 7

    function clickColumnMenu(index: number):void{
        if(index === indexActiveColumnMenu){
            setIndexActiveColumnMenu(null)
        }else{
            setIndexActiveColumnMenu(index)
        }
    }

    return {
        head,
        searchText,
        setSearchText,
        handleSearchText,
        setCurrentPage,
        currentPage,
        displayOnCalendar,
        setDisplayOnCalendar,
        handleInputDate,
        selectDate,
        setSelectDate,
        handleFilterDate,
        chooseFilterByDate,
        currentTableData,
        dataSortDate,
        handleSortCategory,
        lastPage,
        maxLength,
        findDataRegistration,
        filterBy,
        clickColumnMenu,
        indexActiveColumnMenu,
        setIndexActiveColumnMenu
    }
}