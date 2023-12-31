'use client'

import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { useSwr } from "lib/useFetch/useSwr"
import { endpoint } from "lib/api/endpoint"
import { DataOptionT, DataTableContentT } from "lib/types/FilterT"
import { createDateFormat } from "lib/formats/createDateFormat"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"
import { DataTableResultT, HeadDataTableT } from "lib/types/TableT.type"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { ConfirmationPatientsT, DrugCounterT, PatientFinishTreatmentT, PatientRegistrationT, RoomTreatmentT } from "lib/types/PatientT.types"
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat"
import { AuthRequiredError } from "lib/errorHandling/exceptions"

export function FilterTable() {
    const [head] = useState<HeadDataTableT>([
        {
            name: 'Patient Name'
        },
        {
            name: 'Room Name'
        },
        {
            name: 'Queue Number'
        },
        {
            name: 'Appointment Date'
        },
        {
            name: 'Treatment Hours'
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
        {
            name: 'Action'
        }
    ])
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [searchText, setSearchText] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(false)
    const [selectDate, setSelectDate] = useState<Date | undefined>()
    const [dataFilterRoom, setDataFilterRoom] = useState<DataOptionT>([])
    const [indexActiveTableMenu, setIndexActiveTableMenu] = useState<number | null>(null)
    const [getLastPage, setGetLastPage] = useState<number>(1)
    const [chooseOnSortDate, setChooseOnSortDate] = useState<{
        id: string
        title: string
    }>({
        id: 'Sort By',
        title: 'Sort By'
    })
    const [chooseFilterByRoom, setChooseFilterByRoom] = useState<{
        id: string
        title: string
    }>({
        id: 'Filter By Room',
        title: 'Filter By Room'
    })
    const [chooseFilterByDate, setChooseFilterByDate] = useState<{
        id: string
        title: string
    }>({
        id: 'Filter By',
        title: 'Filter By'
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
            id: 'Confirmation Date',
            title: 'Confirmation Date',
        },
        {
            id: 'Date of Birth',
            title: 'Date of Birth',
        },
    ])

    const {
        // pushTriggedErr,
        dataService,
        // dataPatientRegis,
        // dataConfirmationPatients,
        // dataFinishTreatment,
        // dataDrugCounter,
        dataRooms,
        loadDataService,
    } = ServicingHours({})

    const pageSize: number = 5
    const { data: tableDataConfirm, error: errDataTable, isLoading: loadingDataTable } = useSwr(endpoint.getDataTableConfirmPatient(
        searchText,
        chooseFilterByRoom.title,
        chooseFilterByDate.title,
        selectDate ? `${selectDate}` : '',
        chooseOnSortDate.title,
        currentPage,
        pageSize
    ))
    const resultDataTable: DataTableResultT = tableDataConfirm as DataTableResultT

    if (
        !loadingDataTable &&
        errDataTable
    ) {
        throw new AuthRequiredError('A server error occurred. occurs when retrieving confirmation data resources')
    }

    // function findDataRegistration(
    //     dataPatientRegis: PatientRegistrationT[] | undefined,
    //     dataConfirmationPatients: ConfirmationPatientsT[] | undefined,
    //     dataDrugCounter: DrugCounterT[] | undefined,
    //     dataFinishTreatment: PatientFinishTreatmentT[] | undefined,
    //     room: RoomTreatmentT[] | undefined
    // ): void {
    //     if (
    //         !loadDataService &&
    //         Array.isArray(dataPatientRegis) &&
    //         dataPatientRegis.length > 0
    //     ) {
    //         const findConfirmPatient = dataConfirmationPatients?.filter(patient => {
    //             // patient registration
    //             const findPatientRegistration = dataPatientRegis?.find(patientRegis =>
    //                 patientRegis.id === patient.patientId
    //             )
    //             // patient in counter
    //             const findPatientInCounter = dataDrugCounter?.find(counterP =>
    //                 counterP.patientId === patient.patientId
    //             )
    //             // patient at finish treatment
    //             const findPatientFT = dataFinishTreatment?.find((patientFT) => patientFT.patientId === patient.patientId)

    //             return !findPatientFT && !findPatientInCounter && findPatientRegistration
    //         })

    //         const setPatientRegistration = async (): Promise<PatientRegistrationT[]> => {
    //             const newPatientRegistration: PatientRegistrationT[] = []
    //             let count: number = 0
    //             if (Array.isArray(findConfirmPatient) && findConfirmPatient.length > 0) {
    //                 findConfirmPatient.forEach(patientConf => {
    //                     count = count + 1
    //                     const findPatient = dataPatientRegis.find(patientRegis => patientRegis.id === patientConf.patientId)
    //                     if (findPatient) {
    //                         newPatientRegistration.push(findPatient as PatientRegistrationT)
    //                     }
    //                 })
    //             }

    //             return await new Promise((resolve, reject) => {
    //                 if (
    //                     Array.isArray(findConfirmPatient) &&
    //                     count === findConfirmPatient.length
    //                 ) {
    //                     resolve(newPatientRegistration)
    //                 } else if (
    //                     Array.isArray(findConfirmPatient) &&
    //                     count === findConfirmPatient.length &&
    //                     newPatientRegistration.length === 0
    //                 ) {
    //                     reject([])
    //                 }
    //             })
    //         }

    //         setPatientRegistration()
    //             .then(res => {
    //                 generateDataTable(res, room)
    //             })
    //             .catch(noData => {
    //                 setDataColumns([])
    //             })
    //     } else if (
    //         !loadDataService &&
    //         Array.isArray(dataPatientRegis) &&
    //         dataPatientRegis.length === 0
    //     ) {
    //         setDataColumns([])
    //     }
    // }

    // function generateDataTable(
    //     res: PatientRegistrationT[],
    //     room?: RoomTreatmentT[] | undefined
    // ): void {
    //     if (res.length > 0) {
    //         const getDataColumns: DataTableContentT[] = res.map(patient => {
    //             // patient already on confirm
    //             const findPatientOnConfirm = dataConfirmationPatients?.find((patientConfirm) => patientConfirm.patientId === patient.id)

    //             // get room treatment of patient
    //             const findRoomOfPatient = room?.find(roomData => roomData.id === findPatientOnConfirm?.roomInfo?.roomId)

    //             return {
    //                 id: patient.id,
    //                 data: [
    //                     {
    //                         name: patient.patientName
    //                     },
    //                     {
    //                         name: findRoomOfPatient?.room as string,
    //                         fontWeightName: 'bold',
    //                         filterRoom: true
    //                     },
    //                     {
    //                         name: findPatientOnConfirm?.roomInfo?.queueNumber as string,
    //                         colorName: '#ff296d',
    //                         fontWeightName: 'bold'
    //                     },
    //                     {
    //                         firstDesc: createDateNormalFormat(patient.appointmentDate),
    //                         color: '#288bbc',
    //                         colorName: '#777',
    //                         marginBottom: '4.5px',
    //                         fontSize: '12px',
    //                         filterBy: 'Appointment Date',
    //                         queueNumber: findPatientOnConfirm?.roomInfo?.queueNumber,
    //                         confirmHour: findPatientOnConfirm?.dateConfirmInfo?.confirmHour,
    //                         name: patient.appointmentDate,
    //                     },
    //                     {
    //                         name: findPatientOnConfirm?.dateConfirmInfo?.treatmentHours as string
    //                     },
    //                     {
    //                         firstDesc: createDateNormalFormat(findPatientOnConfirm?.dateConfirmInfo?.dateConfirm as string),
    //                         colorName: '#777',
    //                         marginBottom: '4.5px',
    //                         fontSize: '12px',
    //                         filterBy: 'Confirmation Date',
    //                         confirmHour: findPatientOnConfirm?.dateConfirmInfo?.confirmHour,
    //                         name: findPatientOnConfirm?.dateConfirmInfo?.dateConfirm as string,
    //                     },
    //                     {
    //                         name: findPatientOnConfirm?.dateConfirmInfo?.confirmHour as string
    //                     },
    //                     {
    //                         name: patient.emailAddress
    //                     },
    //                     {
    //                         firstDesc: createDateNormalFormat(patient.dateOfBirth),
    //                         colorName: '#777',
    //                         marginBottom: '4.5px',
    //                         fontSize: '12px',
    //                         filterBy: 'Date of Birth',
    //                         name: patient.dateOfBirth,
    //                     },
    //                     {
    //                         name: patient.phone
    //                     },
    //                     {
    //                         name: ''
    //                     }
    //                 ]
    //             }
    //         })
    //         setDataColumns(getDataColumns)
    //     } else {
    //         setDataColumns([])
    //     }
    // }

    function getFilterRooms(): void {
        const roomActive = dataRooms?.filter(room => room?.roomActive === 'Active')
        const rooms = roomActive?.map(room => (
            {
                id: room.room,
                title: `${room.room} - (${room?.roomType})`
            }
        ))
        if (
            Array.isArray(rooms) &&
            rooms.length > 0
        ) setDataFilterRoom([
            {
                id: 'Filter By Room',
                title: 'Filter By Room'
            },
            ...rooms
        ])
    }

    function loadDataTable(): void {
        if (
            !loadingDataTable &&
            tableDataConfirm
        ) {
            const result: DataTableResultT = tableDataConfirm as DataTableResultT
            setDataColumns(result.data)
            setGetLastPage(result.pagination.lastPage)
        }
    }

    useEffect(() => {
        loadDataTable()
    }, [tableDataConfirm])

    useEffect(() => {
        // findDataRegistration(
        //     dataPatientRegis,
        //     dataConfirmationPatients,
        //     dataDrugCounter,
        //     dataFinishTreatment,
        //     dataRooms
        // )

        if (
            Array.isArray(dataRooms) &&
            dataRooms?.length > 0
        ) {
            getFilterRooms()
        }
    }, [loadDataService, dataService])

    const handleSearchText = (e?: ChangeEvent<HTMLInputElement>): void => {
        setSearchText(e?.target.value as string)
    }

    useMemo(() => {
        setCurrentPage(1)
    }, [searchText])

    const handleInputDate = (e?: Date | ChangeEvent<HTMLInputElement>): void => {
        setSelectDate(e as Date)
        setCurrentPage(1)
        setChooseOnSortDate({
            id: 'Sort By',
            title: 'Sort By'
        })
    }

    const handleFilterByRoom = (): void => {
        const selectEl = document.getElementById('filterRoom') as HTMLSelectElement
        const id = selectEl?.options[selectEl.selectedIndex].value
        if (id) {
            setChooseFilterByRoom({
                id,
                title: id
            })

            setChooseOnSortDate({
                id: 'Sort By',
                title: 'Sort By'
            })

            setChooseFilterByDate({
                id: 'Filter By',
                title: 'Filter By'
            })

            setDisplayOnCalendar(false)
            setSelectDate(undefined)
            setCurrentPage(1)

            const selectEl = document.getElementById('filterDateTable') as HTMLSelectElement
            if (selectEl) selectEl.selectedIndex = 0
        }
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

    // filter by room
    // function filterByRoom(): DataTableContentT[] {
    //     if (dataColumns.length > 0 && chooseFilterByRoom.id !== 'Filter By Room') {
    //         const findPatientByRoom = dataColumns.filter(patient => {
    //             const getRoom = patient.data.find(data => data.name === chooseFilterByRoom.id)

    //             return getRoom
    //         })

    //         return findPatientByRoom
    //     } else {
    //         return dataColumns
    //     }
    // }
    // const resultFilterByRoom: DataTableContentT[] = filterByRoom()

    // filter by date
    // function onFilterByDate(): DataTableContentT[] {
    //     if (selectDate) {
    //         const findPatient = resultFilterByRoom.filter(patient => {
    //             const getData = patient.data.filter(data =>
    //                 data.filterBy === chooseFilterByDate.id &&
    //                 data.name === createDateFormat(selectDate)
    //             )

    //             return getData.length > 0
    //         })

    //         return findPatient
    //     } else {
    //         return resultFilterByRoom
    //     }
    // }

    // function filterByDate(): DataTableContentT[] {
    //     if (resultFilterByRoom.length > 0 && chooseFilterByDate.id !== 'Filter By') {
    //         return onFilterByDate()
    //     } else {
    //         return resultFilterByRoom
    //     }
    // }
    // const resultFilterByDate = filterByDate()

    // sort by Appointment
    // function sortByUpAppointment(): DataTableContentT[] {
    //     const sortPatient = dataColumns.sort((p1, p2) => {
    //         const findAppointment1 = p1.data.find(data => data.filterBy === 'Appointment Date')
    //         const findAppointment2 = p2.data.find(data => data.filterBy === 'Appointment Date')

    //         const getDateApp1 = findAppointment1?.name
    //         const getDateApp2 = findAppointment2?.name

    //         const getConfirmHour1 = findAppointment1?.confirmHour
    //         const getConfirmHour2 = findAppointment2?.confirmHour

    //         return (new Date(`${getDateApp2} ${getConfirmHour2}`).valueOf()) - (new Date(`${getDateApp1} ${getConfirmHour1}`).valueOf())
    //     })

    //     return sortPatient
    // }

    // function sortByDownAppointment(): DataTableContentT[] {
    //     const sortPatient = dataColumns.sort((p1, p2) => {
    //         const findAppointment1 = p1.data.find(data => data.filterBy === 'Appointment Date')
    //         const findAppointment2 = p2.data.find(data => data.filterBy === 'Appointment Date')

    //         const getDateApp1 = findAppointment1?.name
    //         const getDateApp2 = findAppointment2?.name

    //         const getConfirmHour1 = findAppointment1?.confirmHour
    //         const getConfirmHour2 = findAppointment2?.confirmHour

    //         return (new Date(`${getDateApp1} ${getConfirmHour1}`).valueOf()) - (new Date(`${getDateApp2} ${getConfirmHour2}`).valueOf())
    //     })

    //     return sortPatient
    // }

    // function sortByAppointmentDate(): DataTableContentT[] | undefined {
    //     if (chooseFilterByDate.id === 'Appointment Date' && chooseOnSortDate.id === 'Sort By Down') {
    //         return sortByDownAppointment()
    //     } else if (chooseFilterByDate.id === 'Appointment Date' && chooseOnSortDate.id === 'Sort By Up') {
    //         return sortByUpAppointment()
    //     }
    // }

    // const resultSortByAppointmentDate: DataTableContentT[] | undefined = sortByAppointmentDate()

    // sort by confirmation date
    // function sortByUpConfirmDate(): DataTableContentT[] {
    //     const sortPatient = dataColumns.sort((p1, p2) => {
    //         const findConfirmDate1 = p1.data.find(data => data.filterBy === 'Confirmation Date')
    //         const findConfirmDate2 = p2.data.find(data => data.filterBy === 'Confirmation Date')

    //         const getDateConfirm1 = findConfirmDate1?.name
    //         const getDateConfirm2 = findConfirmDate2?.name

    //         const getConfirmHour1 = findConfirmDate1?.confirmHour?.split('-')[0]
    //         const getConfirmHour2 = findConfirmDate2?.confirmHour?.split('-')[0]

    //         return (new Date(`${getDateConfirm2} ${getConfirmHour2}`).valueOf()) - (new Date(`${getDateConfirm1} ${getConfirmHour1}`).valueOf())
    //     })

    //     return sortPatient
    // }

    // function sortByDownConfirmDate(): DataTableContentT[] {
    //     const sortPatient = dataColumns.sort((p1, p2) => {
    //         const findConfirmDate1 = p1.data.find(data => data.filterBy === 'Confirmation Date')
    //         const findConfirmDate2 = p2.data.find(data => data.filterBy === 'Confirmation Date')

    //         const getDateConfirm1 = findConfirmDate1?.name
    //         const getDateConfirm2 = findConfirmDate2?.name

    //         const getConfirmHour1 = findConfirmDate1?.confirmHour?.split('-')[0]
    //         const getConfirmHour2 = findConfirmDate2?.confirmHour?.split('-')[0]

    //         return (new Date(`${getDateConfirm1} ${getConfirmHour1}`).valueOf()) - (new Date(`${getDateConfirm2} ${getConfirmHour2}`).valueOf())
    //     })

    //     return sortPatient
    // }

    // function sortByConfirmationDate(): DataTableContentT[] | undefined {
    //     if (chooseFilterByDate.id === 'Confirmation Date' && chooseOnSortDate.id === 'Sort By Down') {
    //         return sortByDownConfirmDate()
    //     } else if (chooseFilterByDate.id === 'Confirmation Date' && chooseOnSortDate.id === 'Sort By Up') {
    //         return sortByUpConfirmDate()
    //     }
    // }
    // const resultSortByConfirmationDate: DataTableContentT[] | undefined = sortByConfirmationDate()

    // sort by date of birth
    // function sortByUpDateOfBirth(): DataTableContentT[] {
    //     const sortPatient = dataColumns.sort((p1, p2) => {
    //         const findDateOfBirth1 = p1.data.find(data => data.filterBy === 'Date of Birth')
    //         const findDateOfBirth2 = p2.data.find(data => data.filterBy === 'Date of Birth')

    //         const getDateOfBirth1: string = findDateOfBirth1?.name as string
    //         const getDateOfBirth2: string = findDateOfBirth2?.name as string

    //         return (new Date(getDateOfBirth2).valueOf()) - (new Date(getDateOfBirth1).valueOf())
    //     })

    //     return sortPatient
    // }

    // function sortByDownDateOfBirth(): DataTableContentT[] {
    //     const sortPatient = dataColumns.sort((p1, p2) => {
    //         const findDateOfBirth1 = p1.data.find(data => data.filterBy === 'Date of Birth')
    //         const findDateOfBirth2 = p2.data.find(data => data.filterBy === 'Date of Birth')

    //         const getDateOfBirth1: string = findDateOfBirth1?.name as string
    //         const getDateOfBirth2: string = findDateOfBirth2?.name as string

    //         return (new Date(getDateOfBirth1).valueOf()) - (new Date(getDateOfBirth2).valueOf())
    //     })

    //     return sortPatient
    // }

    // function sortByDateOfBirth(): DataTableContentT[] | undefined {
    //     if (chooseFilterByDate.id === 'Date of Birth' && chooseOnSortDate.id === 'Sort By Down') {
    //         return sortByDownDateOfBirth()
    //     } else if (chooseFilterByDate.id === 'Date of Birth' && chooseOnSortDate.id === 'Sort By Up') {
    //         return sortByUpDateOfBirth()
    //     }
    // }
    // const resultSortByDateOfBirth: DataTableContentT[] | undefined = sortByDateOfBirth()

    // function getFilterText(
    //     dataFilter: DataTableContentT[]
    // ): DataTableContentT[] {
    //     const filter = dataFilter.filter(patient => {
    //         const findItem = patient.data.find(data =>
    //             data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()) ||
    //             data?.firstDesc?.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase())
    //         )

    //         return findItem
    //     })
    //     return filter
    // }

    // filter on search text
    // const getSort: DataTableContentT[] =
    //     Array.isArray(resultSortByAppointmentDate) &&
    //         resultSortByAppointmentDate.length > 0
    //         ? resultSortByAppointmentDate :
    //         Array.isArray(resultSortByConfirmationDate) &&
    //             resultSortByConfirmationDate.length > 0 ?
    //             resultSortByConfirmationDate :
    //             Array.isArray(resultSortByDateOfBirth) &&
    //                 resultSortByDateOfBirth.length > 0 ?
    //                 resultSortByDateOfBirth : dataColumns

    // const currentTableData = useMemo((): DataTableContentT[] => {
    //     const firstPageIndex = (currentPage - 1) * pageSize
    //     const lastPageIndex = firstPageIndex + pageSize
    //     return filterText.slice(firstPageIndex, lastPageIndex)
    // }, [dataColumns, currentPage])

    // const lastPage: number = resultDataTable?.pagination?.lastPage ?? 1
    const lastPage: number = getLastPage
    const maxLength: number = 7

    const handleSortCategory = (): void => {
        const selectEl = document.getElementById('sortDateTable') as HTMLSelectElement
        const id = selectEl.options[selectEl.selectedIndex].value
        if (id) {
            setChooseOnSortDate({
                id: id,
                title: id
            })
        }
    }

    function clickColumnMenu(index: number): void {
        if (index === indexActiveTableMenu) {
            setIndexActiveTableMenu(null)
        } else {
            setIndexActiveTableMenu(index)
        }
    }

    return {
        head,
        searchText,
        setSearchText,
        handleSearchText,
        currentPage,
        setCurrentPage,
        displayOnCalendar,
        selectDate,
        setSelectDate,
        handleInputDate,
        dataFilterRoom,
        handleFilterByRoom,
        setChooseFilterByRoom,
        chooseFilterByDate,
        setChooseFilterByDate,
        filterBy,
        handleFilterDate,
        dataColumns,
        lastPage,
        maxLength,
        dataSortDate,
        handleSortCategory,
        indexActiveTableMenu,
        clickColumnMenu,
        setIndexActiveTableMenu,
        loadingDataTable
    }
}