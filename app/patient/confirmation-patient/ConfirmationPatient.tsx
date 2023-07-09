'use client'

import { CSSProperties, ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT, RoomTreatmentT } from 'lib/types/PatientT.types'
import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { TableHead } from "components/table/TableHead"
import { HeadDataTableT } from 'lib/types/TableT.type'
import { TableFilter } from 'components/table/TableFilter'
import { InputSearch } from 'components/input/InputSearch'
import { faBan, faCalendarDays, faMagnifyingGlass, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { InputSelect } from 'components/input/InputSelect'
import { DataOptionT, DataTableContentT } from 'lib/types/FilterT'
import { specialCharacter } from 'lib/regex/specialCharacter'
import { spaceString } from 'lib/regex/spaceString'
import { monthNames } from 'lib/namesOfCalendar/monthNames'
import { renderCustomHeader } from 'lib/datePicker/renderCustomHeader'
import Pagination from 'components/pagination/Pagination'
import { dayNamesEng } from 'lib/namesOfCalendar/dayNamesEng'
import { dayNamesInd } from 'lib/namesOfCalendar/dayNamesInd'
import { monthNamesInd } from 'lib/namesOfCalendar/monthNamesInd'
import { TableColumns } from 'components/table/TableColumns'
import { TableData } from 'components/table/TableData'
import { ContainerPopup } from 'components/popup/ContainerPopup'
import { FormPopup } from 'components/popup/FormPopup'
import { TitleInput } from 'components/input/TitleInput'
import Input from 'components/input/Input'
import ErrorInput from 'components/input/ErrorInput'
import { SettingPopup } from 'components/popup/SettingPopup'
import Button from 'components/Button'
import { InputEditConfirmPatientT, InputEditPatientRegistrationT, SubmitEditConfirmPatientT } from 'lib/types/InputT.type'
import { InputArea } from 'components/input/InputArea'
import { mailRegex } from 'lib/regex/mailRegex'
import { API } from 'lib/api'
import { createDateFormat } from 'lib/datePicker/createDateFormat'
import { AdminT } from 'lib/types/AdminT.types'
import { ProfileDoctorT } from 'lib/types/DoctorsT.types'
import { Toggle } from 'components/toggle/Toggle'
import ServicingHours from 'lib/actions/ServicingHours'
import { createHourFormat } from 'lib/datePicker/createHourFormat'
import { authStore } from 'lib/useZustand/auth'
import EditPatientRegistration from 'app/patient/patient-registration/EditPatientRegistration'
import EditPatientConfirmation from 'app/patient/confirmation-patient/EditPatientConfirmation'
import FormPatientRegistration from 'lib/actions/editPatient/FormPatientRegistration'
import FormPatientConfirmation from 'lib/actions/editPatient/FormPatientConfirmation'

export function ConfirmationPatient() {
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
            name: ''
        },
    ])
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [searchText, setSearchText] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(false)
    const [selectDate, setSelectDate] = useState<Date | undefined>()
    const [dataFilterRoom, setDataFilterRoom] = useState<DataOptionT>([])
    // action delete
    const [onPopupChooseDelete, setOnPopupChooseDelete] = useState<boolean>(false)
    const [idPatientToDelete, setIdPatientToDelete] = useState<string>('')
    const [loadingIdPatientsDelete, setLoadingIdPatientsDelete] = useState<string[]>([])
    const [idSuccessPatientsDelete, setIdSuccessPatientsDelete] = useState<string[]>([])
    const [namePatientToDelete, setNamePatientToDelete] = useState<string | null>(null)
    // end action delete
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
            id: 'Confirmation Date',
            title: 'Confirmation Date',
        },
        {
            id: 'Date of Birth',
            title: 'Date of Birth',
        },
    ])
    // swr fetching data
    // servicing hours
    const {
        pushTriggedErr,
        dataService,
        dataPatientRegis,
        dataConfirmationPatients,
        dataFinishTreatment,
        dataAdmin,
        dataRooms,
        loadDataService,
        doctors,
    } = ServicingHours()

    // Form edit patient registration
    const {
        clickEdit,
        onPopupEdit,
        loadingSubmitEdit,
        valueInputEditDetailPatient,
        clickClosePopupEdit,
        patientName,
        errEditInputDetailPatient,
        changeEditDetailPatient,
        changeDateEditDetailPatient,
        handleSubmitUpdate,
        setOnPopupEdit,
        idPatientToEdit,
        idLoadingEdit,
    } = FormPatientRegistration()

    // form edit confirm patient
    const {
        onPopupEditConfirmPatient,
        clickEditToConfirmPatient,
        valueInputEditConfirmPatient,
        nameEditConfirmPatient,
        errEditInputConfirmPatient,
        closePopupEditConfirmPatient,
        onPopupSettings,
        setOnPopupSettings,
        changeEditConfirmPatient,
        selectEmailAdmin,
        handleInputSelectConfirmPatient,
        changeDateConfirm,
        selectDoctorSpecialist,
        loadDataDoctor,
        loadDataRoom,
        selectDoctor,
        selectRoom,
        editActiveManualQueue,
        toggleChangeManualQueue,
        toggleSetAutoQueue,
        selectPresence,
        idWaitToSubmitConfirmPatient,
        idPatientToEditConfirmPatient,
        submitEditConfirmPatient,
        clickOnEditConfirmPatient
    } = FormPatientConfirmation()

    // zustand store
    const { user } = authStore()

    const router = useRouter()

    function findDataRegistration(
        dataPatientRegis: PatientRegistrationT[] | undefined,
        dataConfirmationPatients: ConfirmationPatientsT[] | undefined,
        dataFinishTreatment: PatientFinishTreatmentT[] | undefined,
        room: RoomTreatmentT[] | undefined
    ): void {
        if (
            !loadDataService &&
            Array.isArray(dataPatientRegis) &&
            dataPatientRegis.length > 0
        ) {
            const findConfirmPatient = dataConfirmationPatients?.filter(patient => {
                // patient registration
                const findPatientRegistration = dataPatientRegis?.find(patientRegis =>
                    patientRegis.id === patient.patientId && patient.roomInfo.presence === 'tidak hadir'
                )
                // patient at finish treatment
                const findPatientFT = dataFinishTreatment?.find((patientFT) => patientFT.patientId === patient.patientId)

                return findPatientRegistration && !findPatientFT
            })

            const setPatientRegistration = async (): Promise<PatientRegistrationT[]> => {
                const newPatientRegistration: PatientRegistrationT[] = []
                let count: number = 0
                if (Array.isArray(findConfirmPatient) && findConfirmPatient.length > 0) {
                    findConfirmPatient.forEach(patientConf => {
                        count = count + 1
                        const findPatient = dataPatientRegis.find(patientRegis => patientRegis.id === patientConf.patientId)
                        if (findPatient) {
                            newPatientRegistration.push(findPatient as PatientRegistrationT)
                        }
                    })
                }

                return await new Promise((resolve, reject) => {
                    if (
                        Array.isArray(findConfirmPatient) &&
                        count === findConfirmPatient.length
                    ) {
                        resolve(newPatientRegistration)
                    } else if (
                        Array.isArray(findConfirmPatient) &&
                        count === findConfirmPatient.length &&
                        newPatientRegistration.length === 0
                    ) {
                        reject([])
                    }
                })
            }

            setPatientRegistration()
                .then(res => {
                    generateDataTable(res, room)
                })
                .catch(noData => {
                    setDataColumns([])
                })
        } else if (
            !loadDataService &&
            Array.isArray(dataPatientRegis) &&
            dataPatientRegis.length === 0
        ) {
            setDataColumns([])
        }
    }

    function generateDataTable(
        res: PatientRegistrationT[],
        room?: RoomTreatmentT[] | undefined
    ): void {
        if (res.length > 0) {
            const newData: DataTableContentT[] = []
            const getDataColumns = (): void => {
                res.forEach(patient => {
                    // make a normal date
                    const makeNormalDate = ((date: string, dateOfBirth?: boolean): string => {
                        const getDate = `${new Date(date)}`
                        const findIdxDayNameOfAD = dayNamesEng.findIndex(day => day === getDate.split(' ')[0]?.toLowerCase())
                        const getNameOfAD = `${dayNamesInd[findIdxDayNameOfAD]?.substr(0, 1)?.toUpperCase()}${dayNamesInd[findIdxDayNameOfAD]?.substr(1, dayNamesInd[findIdxDayNameOfAD]?.length - 1)}`
                        const findIdxMonthOfAD = monthNames.findIndex(month => month.toLowerCase() === getDate.split(' ')[1]?.toLowerCase())
                        const getMonthOfAD = monthNamesInd[findIdxMonthOfAD]
                        const getDateOfAD = date?.split('/')[1]
                        const getYearOfAD = date?.split('/')[2]

                        return !dateOfBirth ? `${getMonthOfAD} ${getDateOfAD} ${getYearOfAD}, ${getNameOfAD}` : `${getMonthOfAD} ${getDateOfAD} ${getYearOfAD}`
                    })

                    // patient already on confirm
                    const findPatientOnConfirm = dataConfirmationPatients?.find((patientConfirm) => patientConfirm.patientId === patient.id)

                    // get room treatment of patient
                    const findRoomOfPatient = room?.find(roomData => roomData.id === findPatientOnConfirm?.roomInfo?.roomId)

                    const dataRegis: DataTableContentT = {
                        id: patient.id,
                        data: [
                            {
                                name: patient.patientName
                            },
                            {
                                name: findRoomOfPatient?.room as string,
                                colorName: '#ff296d',
                                fontWeightName: 'bold',
                                filterRoom: true
                            },
                            {
                                name: findPatientOnConfirm?.roomInfo?.queueNumber as string,
                                colorName: '#288bbc',
                                fontWeightName: 'bold'
                            },
                            {
                                firstDesc: makeNormalDate(patient.appointmentDate),
                                color: '#ff296d',
                                colorName: '#777',
                                marginBottom: '4.5px',
                                fontSize: '12px',
                                filterBy: 'Appointment Date',
                                queueNumber: findPatientOnConfirm?.roomInfo?.queueNumber,
                                treatmentHours: findPatientOnConfirm?.dateConfirmInfo?.treatmentHours,
                                name: patient.appointmentDate,
                            },
                            {
                                name: findPatientOnConfirm?.dateConfirmInfo?.treatmentHours as string
                            },
                            {
                                firstDesc: makeNormalDate(findPatientOnConfirm?.dateConfirmInfo?.dateConfirm as string),
                                color: '#006400',
                                colorName: '#777',
                                marginBottom: '4.5px',
                                fontSize: '12px',
                                filterBy: 'Confirmation Date',
                                confirmHour: findPatientOnConfirm?.dateConfirmInfo?.confirmHour,
                                name: findPatientOnConfirm?.dateConfirmInfo?.dateConfirm as string,
                            },
                            {
                                name: findPatientOnConfirm?.dateConfirmInfo?.confirmHour as string
                            },
                            {
                                name: patient.emailAddress
                            },
                            {
                                firstDesc: makeNormalDate(patient.dateOfBirth),
                                color: '#187bcd',
                                colorName: '#777',
                                marginBottom: '4.5px',
                                fontSize: '12px',
                                filterBy: 'Date of Birth',
                                name: patient.dateOfBirth,
                            },
                            {
                                name: patient.phone
                            },
                        ]
                    }

                    newData.push(dataRegis)
                })
            }

            getDataColumns()
            if (newData.length === res.length) {
                setDataColumns(newData)
            }
        } else {
            setDataColumns([])
        }
    }

    function getFilterRooms(): void {
        const data: DataOptionT = [
            {
                id: 'Filter By Room',
                title: 'Filter By Room'
            }
        ]
        let count: number = 0
        dataRooms?.forEach(room => {
            count = count + 1
            data.push({
                id: room.room,
                title: room.room
            })
        })

        if (count === dataRooms?.length) {
            setDataFilterRoom(data)
        }
    }

    useEffect(() => {
        findDataRegistration(
            dataPatientRegis,
            dataConfirmationPatients,
            dataFinishTreatment,
            dataRooms
        )

        if (
            Array.isArray(dataRooms) &&
            dataRooms?.length > 0
        ) {
            getFilterRooms()
        }
    }, [loadDataService, dataService])

    const makeFormatDate = (): string => {
        const getCurrentDate = `${selectDate}`.split(' ')
        const getCurrentMonth = monthNames.findIndex(month => month?.toLowerCase() === getCurrentDate[1]?.toLowerCase())
        const getNumberOfCurrentMonth = getCurrentMonth?.toString()?.length === 1 ? `0${getCurrentMonth + 1}` : `${getCurrentMonth + 1}`
        const dateNow = getCurrentDate[2]
        const yearsNow = getCurrentDate[3]
        const currentDate = `${getNumberOfCurrentMonth}/${dateNow}/${yearsNow}`

        return currentDate
    }

    // filter by room
    function filterByRoom(): DataTableContentT[] {
        if (dataColumns.length > 0 && chooseFilterByRoom.id !== 'Filter By Room') {
            const findPatientByRoom = dataColumns.filter(patient => {
                const getRoom = patient.data.find(data => data.name === chooseFilterByRoom.id)

                return getRoom
            })

            return findPatientByRoom
        } else {
            return dataColumns
        }
    }
    const resultFilterByRoom: DataTableContentT[] = filterByRoom()

    // filter by date
    function onFilterByDate(): DataTableContentT[] {
        if (selectDate) {
            const findPatient = resultFilterByRoom.filter(patient => {
                const getData = patient.data.filter(data =>
                    data.filterBy === chooseFilterByDate.id &&
                    data.name === makeFormatDate()
                )

                return getData.length > 0
            })

            return findPatient
        } else {
            return resultFilterByRoom
        }
    }

    function filterByDate(): DataTableContentT[] {
        if (resultFilterByRoom.length > 0 && chooseFilterByDate.id !== 'Filter By') {
            return onFilterByDate()
        } else {
            return resultFilterByRoom
        }
    }
    const resultFilterByDate = filterByDate()

    // sort by Appointment
    function sortByUpAppointment(): DataTableContentT[] {
        const sortPatient = resultFilterByDate.sort((p1, p2) => {
            const findAppointment1 = p1.data.find(data => data.filterBy === 'Appointment Date')
            const findAppointment2 = p2.data.find(data => data.filterBy === 'Appointment Date')

            const getDateApp1 = findAppointment1?.name
            const getDateApp2 = findAppointment2?.name

            const getTreamentHours1 = findAppointment1?.treatmentHours?.split('-')[0]
            const getTreamentHours2 = findAppointment2?.treatmentHours?.split('-')[0]

            return (new Date(`${getDateApp2} ${getTreamentHours2}`).valueOf()) - (new Date(`${getDateApp1} ${getTreamentHours1}`).valueOf())
        })

        return sortPatient
    }

    function sortByDownAppointment(): DataTableContentT[] {
        const sortPatient = resultFilterByDate.sort((p1, p2) => {
            const findAppointment1 = p1.data.find(data => data.filterBy === 'Appointment Date')
            const findAppointment2 = p2.data.find(data => data.filterBy === 'Appointment Date')

            const getDateApp1 = findAppointment1?.name
            const getDateApp2 = findAppointment2?.name

            const getTreamentHours1 = findAppointment1?.treatmentHours?.split('-')[0]
            const getTreamentHours2 = findAppointment2?.treatmentHours?.split('-')[0]

            return (new Date(`${getDateApp1} ${getTreamentHours1}`).valueOf()) - (new Date(`${getDateApp2} ${getTreamentHours2}`).valueOf())
        })

        return sortPatient
    }

    function sortByAppointmentDate(): DataTableContentT[] | undefined {
        if (chooseFilterByDate.id === 'Appointment Date' && chooseOnSortDate.id === 'Sort By Down') {
            return sortByDownAppointment()
        } else if (chooseFilterByDate.id === 'Appointment Date' && chooseOnSortDate.id === 'Sort By Up') {
            return sortByUpAppointment()
        }
    }
    const resultSortByAppointmentDate: DataTableContentT[] | undefined = sortByAppointmentDate()

    // sort by confirmation date
    function sortByUpConfirmDate(): DataTableContentT[] {
        const sortPatient = resultFilterByDate.sort((p1, p2) => {
            const findConfirmDate1 = p1.data.find(data => data.filterBy === 'Confirmation Date')
            const findConfirmDate2 = p2.data.find(data => data.filterBy === 'Confirmation Date')

            const getDateConfirm1 = findConfirmDate1?.name
            const getDateConfirm2 = findConfirmDate2?.name

            const getConfirmHour1 = findConfirmDate1?.confirmHour?.split('-')[0]
            const getConfirmHour2 = findConfirmDate2?.confirmHour?.split('-')[0]

            return (new Date(`${getDateConfirm2} ${getConfirmHour2}`).valueOf()) - (new Date(`${getDateConfirm1} ${getConfirmHour1}`).valueOf())
        })

        return sortPatient
    }

    function sortByDownConfirmDate(): DataTableContentT[] {
        const sortPatient = resultFilterByDate.sort((p1, p2) => {
            const findConfirmDate1 = p1.data.find(data => data.filterBy === 'Confirmation Date')
            const findConfirmDate2 = p2.data.find(data => data.filterBy === 'Confirmation Date')

            const getDateConfirm1 = findConfirmDate1?.name
            const getDateConfirm2 = findConfirmDate2?.name

            const getConfirmHour1 = findConfirmDate1?.confirmHour?.split('-')[0]
            const getConfirmHour2 = findConfirmDate2?.confirmHour?.split('-')[0]

            return (new Date(`${getDateConfirm1} ${getConfirmHour1}`).valueOf()) - (new Date(`${getDateConfirm2} ${getConfirmHour2}`).valueOf())
        })

        return sortPatient
    }

    function sortByConfirmationDate(): DataTableContentT[] | undefined {
        if (chooseFilterByDate.id === 'Confirmation Date' && chooseOnSortDate.id === 'Sort By Down') {
            return sortByDownConfirmDate()
        } else if (chooseFilterByDate.id === 'Confirmation Date' && chooseOnSortDate.id === 'Sort By Up') {
            return sortByUpConfirmDate()
        }
    }
    const resultSortByConfirmationDate: DataTableContentT[] | undefined = sortByConfirmationDate()

    // sort by date of birth
    function sortByUpDateOfBirth(): DataTableContentT[] {
        const sortPatient = resultFilterByDate.sort((p1, p2) => {
            const findDateOfBirth1 = p1.data.find(data => data.filterBy === 'Date of Birth')
            const findDateOfBirth2 = p2.data.find(data => data.filterBy === 'Date of Birth')

            const getDateOfBirth1: string = findDateOfBirth1?.name as string
            const getDateOfBirth2: string = findDateOfBirth2?.name as string

            return (new Date(getDateOfBirth2).valueOf()) - (new Date(getDateOfBirth1).valueOf())
        })

        return sortPatient
    }

    function sortByDownDateOfBirth(): DataTableContentT[] {
        const sortPatient = resultFilterByDate.sort((p1, p2) => {
            const findDateOfBirth1 = p1.data.find(data => data.filterBy === 'Date of Birth')
            const findDateOfBirth2 = p2.data.find(data => data.filterBy === 'Date of Birth')

            const getDateOfBirth1: string = findDateOfBirth1?.name as string
            const getDateOfBirth2: string = findDateOfBirth2?.name as string

            return (new Date(getDateOfBirth1).valueOf()) - (new Date(getDateOfBirth2).valueOf())
        })

        return sortPatient
    }

    function sortByDateOfBirth(): DataTableContentT[] | undefined {
        if (chooseFilterByDate.id === 'Date of Birth' && chooseOnSortDate.id === 'Sort By Down') {
            return sortByDownDateOfBirth()
        } else if (chooseFilterByDate.id === 'Date of Birth' && chooseOnSortDate.id === 'Sort By Up') {
            return sortByUpDateOfBirth()
        }
    }
    const resultSortByDateOfBirth: DataTableContentT[] | undefined = sortByDateOfBirth()

    function getFilterText(
        dataFilter: DataTableContentT[]
    ): DataTableContentT[] {
        const filter = dataFilter.filter(patient => {
            const findItem = patient.data.filter(data => data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))

            return findItem.length > 0
        })
        return filter
    }

    // filter on search text
    const filterText: DataTableContentT[] =
        Array.isArray(resultSortByAppointmentDate) &&
            resultSortByAppointmentDate.length > 0
            ? getFilterText(resultSortByAppointmentDate) :
            Array.isArray(resultSortByConfirmationDate) &&
                resultSortByConfirmationDate.length > 0 ?
                getFilterText(resultSortByConfirmationDate) :
                Array.isArray(resultSortByDateOfBirth) &&
                    resultSortByDateOfBirth.length > 0 ?
                    getFilterText(resultSortByDateOfBirth) :
                    resultFilterByDate.length > 0 ?
                        getFilterText(resultFilterByDate) : []


    const pageSize: number = 5

    const currentTableData = useMemo((): DataTableContentT[] => {
        const firstPageIndex = (currentPage - 1) * pageSize
        const lastPageIndex = firstPageIndex + pageSize
        return filterText.slice(firstPageIndex, lastPageIndex)
    }, [filterText, currentPage])

    const changeTableStyle = (dataColumnsBody: DataTableContentT[]) => {
        if (dataColumnsBody?.length > 0) {
            let elementTHead = document.getElementById('tHead0') as HTMLElement
            let elementTData = document.getElementById('tData00') as HTMLElement

            if (elementTHead !== null) {
                elementTHead = document.getElementById(`tHead0`) as HTMLElement
                elementTHead.style.width = 'calc(100%/7)'
                elementTHead = document.getElementById(`tHead1`) as HTMLElement
                elementTHead.style.width = 'calc(100%/7)'
                elementTHead = document.getElementById(`tHead2`) as HTMLElement
                elementTHead.style.width = 'calc(100%/8)'
                elementTHead = document.getElementById(`tHead3`) as HTMLElement
                elementTHead.style.width = 'calc(100%/7)'
                elementTHead = document.getElementById(`tHead4`) as HTMLElement
                elementTHead.style.width = 'calc(100%/7)'
                elementTHead = document.getElementById(`tHead5`) as HTMLElement
                elementTHead.style.width = 'calc(100%/7)'
                elementTHead = document.getElementById(`tHead6`) as HTMLElement
                elementTHead.style.width = 'calc(100%/6.5)'
                elementTHead = document.getElementById(`tHead7`) as HTMLElement
                elementTHead.style.width = 'calc(100%/6.5)'
                elementTHead = document.getElementById(`tHead8`) as HTMLElement
                elementTHead.style.width = 'calc(100%/7)'
                elementTHead = document.getElementById(`tHead9`) as HTMLElement
                elementTHead.style.width = 'calc(100%/8)'
                elementTHead = document.getElementById(`tHead10`) as HTMLElement
                elementTHead.style.width = 'calc(100%/12)'
            }
            if (elementTData !== null) {
                for (let i = 0; i < dataColumnsBody?.length; i++) {
                    elementTData = document.getElementById(`tData${i}0`) as HTMLElement
                    if (elementTData?.style) {
                        elementTData.style.width = 'calc(100%/7)'
                        elementTData = document.getElementById(`tData${i}1`) as HTMLElement
                        elementTData.style.width = 'calc(100%/7)'
                        elementTData = document.getElementById(`tData${i}2`) as HTMLElement
                        elementTData.style.width = 'calc(100%/9)'
                        elementTData = document.getElementById(`tData${i}3`) as HTMLElement
                        elementTData.style.width = 'calc(100%/7)'
                        elementTData = document.getElementById(`tData${i}4`) as HTMLElement
                        elementTData.style.width = 'calc(100%/7)'
                        elementTData = document.getElementById(`tData${i}5`) as HTMLElement
                        elementTData.style.width = 'calc(100%/7)'
                        elementTData = document.getElementById(`tData${i}6`) as HTMLElement
                        elementTData.style.width = 'calc(100%/6.8)'
                        elementTData = document.getElementById(`tData${i}7`) as HTMLElement
                        elementTData.style.width = 'calc(100%/6.5)'
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

    function toPage(path: string): void {
        router.push(path)
    }

    function closePopupSetting(): void {
        setOnPopupSettings(false)
    }

    function clickOnEditDetailPatient(): void {
        setOnPopupEdit(true)
        setOnPopupSettings(false)
    }

    // action delete
    function loadingDeleteIcon(): void {
        loadingIdPatientsDelete.forEach(id => {
            const loadingElement = document.getElementById(`loadDelete${id}`) as HTMLElement
            const iconDelete = document.getElementById(`iconDelete${id}`) as HTMLElement

            if (loadingElement && iconDelete) {
                loadingElement.style.display = 'flex'
                iconDelete.style.display = 'none'
            }
        })
    }

    useEffect(() => {
        if (loadingIdPatientsDelete.length > 0 && dataColumns.length > 0) {
            loadingDeleteIcon()
        }
    }, [loadingIdPatientsDelete, dataColumns])

    useEffect(() => {
        if (idSuccessPatientsDelete.length > 0 && dataColumns.length > 0) {
            let count: number = 0
            dataColumns.forEach(data => {
                const loadingElement = document.getElementById(`loadDelete${data.id}`) as HTMLElement
                const iconDelete = document.getElementById(`iconDelete${data.id}`) as HTMLElement

                if (loadingElement && iconDelete) {
                    loadingElement.style.display = 'none'
                    iconDelete.style.display = 'flex'
                }
            })

            if (count === dataColumns.length) {
                setTimeout(() => {
                    loadingDeleteIcon()
                }, 500);
            }
        }
    }, [idSuccessPatientsDelete, dataColumns])

    function closePopupChooseDelete() {
        setOnPopupChooseDelete(false)
    }

    function clickDeleteIcon(
        patientId: string,
        patientName: string
    ): void {
        const findId = loadingIdPatientsDelete.find(id => id === patientId)
        if (!findId) {
            setNamePatientToDelete(patientName)
            setIdPatientToDelete(patientId)
            setOnPopupChooseDelete(true)
        }
    }

    function deleteActionCallback(
        roleId: string,
        patientId: string,
        alertMessage?: string,
        errMessage?: string,
        endDeleted?: boolean,
        cb?: ()=>void
    ): void {
        API().APIDeletePatientData(
            roleId,
            patientId
        )
            .then(result => {
                if (endDeleted) {
                    if(typeof cb === 'function'){
                        cb()
                    }
                    setIdSuccessPatientsDelete((current) => [...current, idPatientToDelete])
                    alert(alertMessage)
                }
            })
            .catch(err => {
                setIdSuccessPatientsDelete((current) => [...current, idPatientToDelete])
                pushTriggedErr(errMessage as string)
            })
    }

    // click delete detail and confirm data
    function clickDeleteDetailAndConfirmData(): void {
        if (window.confirm(`Delete details and confirmation data from patient "${namePatientToDelete}"?`)) {
            setLoadingIdPatientsDelete((current) => [...current, idPatientToDelete])
            setOnPopupChooseDelete(false)

            const findIdConfirmData = dataConfirmationPatients?.find(patient => patient.patientId === idPatientToDelete)
            deleteActionCallback(
                'confirmation-patients',
                findIdConfirmData?.id as string,
                '',
                'There was an error deleting patient data details and confirmation',
                false,
                ()=>deleteActionCallback(
                    'patient-registration',
                    idPatientToDelete,
                    'delete successfully',
                    'There was an error deleting patient data details and confirmation',
                    true
                )
            )
        }
    }

    // delete confirmation data only
    function clickDeleteConfirmationData(): void {
        if (window.confirm(`Delete confirmation data from "${namePatientToDelete}" patient`)) {
            setLoadingIdPatientsDelete((current) => [...current, idPatientToDelete])
            setOnPopupChooseDelete(false)

            const findIdConfirmData = dataConfirmationPatients?.find(patient => patient.patientId === idPatientToDelete)
            
            deleteActionCallback(
                'confirmation-patients',
                findIdConfirmData?.id as string,
                'delete successfully',
                'There was an error deleting patient confirmation data',
                true
            )
        }
    }

    // cancel treatment
    function clickCancelTreatment(): void {
        if (window.confirm(`cancel the registration of patient ${namePatientToDelete}?`)) {
            setLoadingIdPatientsDelete((current) => [...current, idPatientToDelete])
            setOnPopupChooseDelete(false)

            const dataFinishTreatment = {
                patientId: idPatientToDelete,
                confirmedTime: {
                    dateConfirm: createDateFormat(new Date()),
                    confirmHour: createHourFormat(new Date())
                },
                adminInfo: { adminId: user.user?.id as string }
            }
            API().APIPostPatientData(
                'finished-treatment',
                dataFinishTreatment
            )
                .then(res => {
                    deleteActionCallback(
                        'confirmation-patients',
                        idPatientToDelete,
                        'Successfully cancel patient registration',
                        'There was an error deleting patient confirmation data',
                        true
                    )
                })
                .catch(err => {
                    pushTriggedErr('a server error occurred while adding data to the treatment is complete. please try again')
                })
        }
    }

    return (
        <>
            {/* popup edit patient detail / profile patient */}
            {onPopupEdit && (
                <EditPatientRegistration
                    loadingSubmitEdit={loadingSubmitEdit}
                    valueInputEditDetailPatient={valueInputEditDetailPatient}
                    patientName={patientName}
                    errEditInputDetailPatient={errEditInputDetailPatient}
                    clickClosePopupEdit={clickClosePopupEdit}
                    changeDateEditDetailPatient={changeDateEditDetailPatient}
                    changeEditDetailPatient={changeEditDetailPatient}
                    handleSubmitUpdate={handleSubmitUpdate}
                    idPatientToEdit={idPatientToEdit}
                    idLoadingEdit={idLoadingEdit}
                />
            )}
            {/* end popup edit detail patient */}

            {/* popup edit confirmation data */}
            {onPopupEditConfirmPatient && (
                <EditPatientConfirmation
                    valueInputEditConfirmPatient={valueInputEditConfirmPatient}
                    nameEditConfirmPatient={nameEditConfirmPatient}
                    errEditInputConfirmPatient={errEditInputConfirmPatient}
                    closePopupEditConfirmPatient={closePopupEditConfirmPatient}
                    changeEditConfirmPatient={changeEditConfirmPatient}
                    selectEmailAdmin={selectEmailAdmin}
                    handleInputSelectConfirmPatient={handleInputSelectConfirmPatient}
                    changeDateConfirm={changeDateConfirm}
                    selectDoctorSpecialist={selectDoctorSpecialist}
                    loadDataDoctor={loadDataDoctor}
                    loadDataRoom={loadDataRoom}
                    selectDoctor={selectDoctor}
                    selectRoom={selectRoom}
                    editActiveManualQueue={editActiveManualQueue}
                    toggleChangeManualQueue={toggleChangeManualQueue}
                    toggleSetAutoQueue={toggleSetAutoQueue}
                    selectPresence={selectPresence}
                    idWaitToSubmitConfirmPatient={idWaitToSubmitConfirmPatient}
                    idPatientToEditConfirmPatient={idPatientToEditConfirmPatient}
                    submitEditConfirmPatient={submitEditConfirmPatient}
                />
            )}
            {/* end popup edit confirmation patient */}

            {/* popup choose update */}
            {onPopupSettings && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={closePopupSetting}
                        title='What do you want to edit?'
                        classIcon='text-color-default'
                        iconPopup={faPenToSquare}
                    >
                        <Button
                            nameBtn="Edit patient detail"
                            classBtn='hover:bg-white'
                            classLoading='hidden'
                            clickBtn={clickOnEditDetailPatient}
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem'
                            }}
                        />
                        <Button
                            nameBtn="Edit confirmation data"
                            classBtn='bg-orange border-orange hover:border-orange hover:bg-white hover:text-orange'
                            classLoading='hidden'
                            clickBtn={clickOnEditConfirmPatient}
                            styleBtn={{
                                padding: '0.5rem',
                                marginTop: '0.5rem'
                            }}
                        />
                    </SettingPopup>
                </ContainerPopup>
            )}

            {/* popup choose delete */}
            {onPopupChooseDelete && (
                <ContainerPopup
                    className='flex justify-center overflow-y-auto'
                >
                    <SettingPopup
                        title='What do you want to delete?'
                        classIcon='text-red-default'
                        desc={`${namePatientToDelete} - patient`}
                        clickClose={closePopupChooseDelete}
                        iconPopup={faBan}
                    >
                        <Button
                            nameBtn="All data"
                            classBtn='bg-orange hover:bg-white border-orange hover:border-orange hover:text-orange'
                            classLoading='hidden'
                            clickBtn={clickDeleteDetailAndConfirmData}
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem'
                            }}
                        />
                        <Button
                            nameBtn="Confirmation data"
                            classBtn='bg-pink-old hover:bg-white border-pink-old hover:border-pink-old hover:text-pink-old'
                            classLoading='hidden'
                            clickBtn={clickDeleteConfirmationData}
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem'
                            }}
                        />
                        <Button
                            nameBtn="Cancel Treatment"
                            classBtn='bg-red hover:bg-white border-red-default hover:border-red-default hover:text-red-default'
                            classLoading='hidden'
                            clickBtn={clickCancelTreatment}
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem'
                            }}
                        />
                    </SettingPopup>
                </ContainerPopup>
            )}

            {/* table filter */}
            <TableFilter
                leftChild={
                    <>
                        <InputSearch
                            icon={faMagnifyingGlass}
                            classWrapp='mt-2'
                            placeHolder='Search Text'
                            onCloseSearch={searchText.length > 0}
                            valueText={searchText}
                            changeInput={handleSearchText}
                            clickCloseSearch={() => {
                                setCurrentPage(1)
                                setSearchText('')
                            }}
                        />
                        {displayOnCalendar && (
                            <InputSearch
                                icon={faCalendarDays}
                                classWrapp='mt-2'
                                placeHolder='Search Date'
                                placeholderText='Search Date'
                                onCalendar={true}
                                changeInput={handleInputDate}
                                selected={selectDate}
                                onCloseSearch={selectDate !== undefined}
                                renderCustomHeader={renderCustomHeader}
                                clickCloseSearch={() => {
                                    setCurrentPage(1)
                                    setSelectDate(undefined)
                                }}
                            />
                        )}
                    </>
                }
                rightChild={
                    <>
                        <InputSelect
                            id='filterRoom'
                            classWrapp='mt-2'
                            data={dataFilterRoom}
                            handleSelect={handleFilterByRoom}
                        />
                        <InputSelect
                            id='filterDateTable'
                            classWrapp='mt-2'
                            data={filterBy}
                            handleSelect={handleFilterDate}
                        />
                        {
                            chooseFilterByDate.id !== 'Filter By' &&
                            currentTableData.length > 0 &&
                            (
                                <InputSelect
                                    id='sortDateTable'
                                    classWrapp='mt-2'
                                    data={dataSortDate}
                                    handleSelect={handleSortCategory}
                                />
                            )
                        }
                    </>
                }
            />

            <ContainerTableBody>
                <TableBody
                    style={{
                        width: '1700px'
                    }}
                >
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {/* load data */}
                    {currentTableData.length > 0 ? currentTableData.map((patient, index) => {
                        const pathUrlToDataDetail = `/patient/patient-registration/personal-data/confirmed/${patient.data[0]?.name}/${patient.id}`

                        return (
                            <TableColumns
                                key={index}
                                idLoadingDelete={`loadDelete${patient.id}`}
                                idIconDelete={`iconDelete${patient.id}`}
                                clickBtn={() => toPage(pathUrlToDataDetail)}
                                clickEdit={(e) => {
                                    clickEdit(patient.id, patient.data[0]?.name)
                                    clickEditToConfirmPatient(patient.id, patient.data[0]?.name)
                                    setOnPopupSettings(true)
                                    e?.stopPropagation()
                                }}
                                clickDelete={(e) => {
                                    clickDeleteIcon(patient.id, patient.data[0]?.name)
                                    e?.stopPropagation()
                                }}
                            >
                                {patient.data.map((item, idx) => {
                                    return (
                                        <TableData
                                            key={idx}
                                            id={`tData${index}${idx}`}
                                            name={item.name}
                                            firstDesc={item?.firstDesc}
                                            styleFirstDesc={{
                                                color: item?.color,
                                                marginBottom: item?.marginBottom
                                            }}
                                            styleName={{
                                                fontSize: item?.fontSize,
                                                color: item?.colorName
                                            }}
                                        />
                                    )
                                })}
                            </TableColumns>
                        )
                    }) : (
                        <div
                            className='flex justify-center'
                        >
                            <p
                                className='p-8'
                            >No patient confirmation data</p>
                        </div>
                    )}
                </TableBody>
            </ContainerTableBody>

            <div
                className='flex justify-end mt-4'
            >
                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    maxLength={maxLength}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </>
    )
}