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
import { faCalendarDays, faGear, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { InputSelect } from 'components/input/InputSelect'
import { DataOnDataTableContentT, DataOptionT, DataTableContentT } from 'lib/types/FilterT'
import { specialCharacter } from 'lib/regex/specialCharacter'
import { spaceString } from 'lib/regex/spaceString'
import { monthNames } from 'lib/namesOfCalendar/monthNames'
import { renderCustomHeader } from 'lib/datePicker/renderCustomHeader'
import Pagination from 'components/pagination/Pagination'
import { useSwr } from 'lib/useFetch/useSwr'
import { endpoint } from 'lib/api/endpoint'
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
    const [onPopupSettings, setOnPopupSettings] = useState<boolean>(false)
    // action edit confirmation patient
    const [onPopupEditConfirmPatient, setOnPopupEditConfirmPatient] = useState<boolean>(false)
    const [nameEditConfirmPatient, setNameEditConfirmPatient] = useState<string>('')
    const [valueInputEditConfirmPatient, setValueInputEditConfirmPatient] = useState<InputEditConfirmPatientT>({
        patientId: '',
        emailAdmin: '',
        dateConfirm: '',
        confirmHour: '',
        treatmentHours: '',
        nameDoctor: '',
        doctorSpecialist: '',
        roomName: '',
        queueNumber: '',
        presence: ''
    })
    const [selectEmailAdmin, setSelectEmailAdmin] = useState<DataOptionT>([
        {
            id: 'Select Admin',
            title: 'Select Admin'
        }
    ])
    const [selectDoctorSpecialist, setSelectDoctorSpecialist] = useState<DataOptionT>([
        {
            id: 'Select Specialist',
            title: 'Select Specialist'
        }
    ])
    const [selectDoctor, setSelectDoctor] = useState<DataOptionT>([
        {
            id: 'Select Doctor',
            title: 'Select Doctor'
        }
    ])
    const [selectRoom, setSelectRoom] = useState<DataOptionT>([
        {
            id: 'Select Room',
            title: 'Select Room'
        }
    ])
    const [selectPresence, setSelectPresence] = useState<DataOptionT>([
        {
            id: 'Select Presence',
            title: 'Select Presence'
        },
        {
            id: 'tidak hadir',
            title: 'tidak hadir'
        },
        {
            id: 'hadir',
            title: 'hadir'
        }
    ])
    const [editActiveManualQueue, setEditActiveManualQueue] = useState<boolean>(true)
    const [editActiveAutoQueue, setEditActiveAutoQueue] = useState<boolean>(false)
    const [idPatientToEditConfirmPatient, setIdPatientToEditConfirmPatient] = useState<string | null>(null)
    const [idWaitToSubmitConfirmPatient, setIdWaitToSubmitConfirmPatient] = useState<string[]>([])
    const [idSubmitEditConfirmPatient, setIdSubmitEditConfirmPatient] = useState<string[]>([])
    const [errEditInputConfirmPatient, setErrEditInputConfirmPatient] = useState<InputEditConfirmPatientT>({} as InputEditConfirmPatientT)
    // end action edit confirmation patient
    // action edit detail patient
    const [onPopupEditPatientDetail, setOnPopupEditPatientDetail] = useState<boolean>(false)
    const [nameEditDetailPatient, setNameEditDetailPatient] = useState<string>('')
    const [idPatientToEditDetailPatient, setIdPatientToEditDetailPatient] = useState<string | null>(null)
    const [idSubmitEditDetailPatient, setIdSubmitEditDetailPatient] = useState<string[]>([])
    const [idWaitToSubmitEditDetailPatient, setIdWaitToSubmitEditDetailPatient] = useState<string[]>([])
    const [valueInputEditDetailPatient, setValueInputEditDetailPatient] = useState<InputEditPatientRegistrationT>({
        patientName: '',
        phone: '',
        emailAddress: '',
        dateOfBirth: '',
        appointmentDate: '',
        message: '',
        patientComplaints: '',
        submissionDate: '',
        clock: ''
    })
    const [errEditInputDetailPatient, setErrEditInputDetailPatient] = useState<InputEditPatientRegistrationT>({} as InputEditPatientRegistrationT)
    // end action edit detail patient
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

    const router = useRouter()

    // swr fetching data
    // servicing hours
    const { data: dataService, error: errDataService, isLoading: loadDataService } = useSwr(endpoint.getServicingHours(), { refreshInterval: 4000 })
    const newPatientRegistration: { [key: string]: any } | undefined = dataService as {}
    const getPatientRegistration: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientRegistrationT) => item?.id === 'patient-registration')
    const dataPatientRegis: PatientRegistrationT[] | undefined = getPatientRegistration?.data

    // confirmation patients
    const getConfirmationPatients: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: ConfirmationPatientsT) => item?.id === 'confirmation-patients')
    const dataConfirmationPatients: ConfirmationPatientsT[] | undefined = getConfirmationPatients?.data

    // finished treatment data
    const getFinishTreatment: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientFinishTreatmentT) => item?.id === 'finished-treatment')
    const dataFinishTreatment: PatientFinishTreatmentT[] | undefined = getFinishTreatment?.data

    // room
    const getRoomsTreatment: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: RoomTreatmentT) => item?.id === 'room')
    const dataRooms: RoomTreatmentT[] | undefined = getRoomsTreatment?.data

    // admin
    const { data: getDataAdmin, error: errGetDataAdmin, isLoading: loadGetDataAdmin } = useSwr(endpoint.getAdmin())
    const findDataAdmin: { [key: string]: any } | undefined = getDataAdmin as {}
    const dataAdmin: AdminT[] | undefined = findDataAdmin?.data

    // doctors
    const { data: getDataDoctors, error: errGetDataDoctors, isLoading: loadDataDoctors } = useSwr(endpoint.getDoctors())
    const newDataDoctor: { [key: string]: any } | undefined = getDataDoctors as {}
    const getDoctorDocument: { [key: string]: any } | undefined = newDataDoctor?.data?.find((data: { [key: string]: any }) => data?.id === 'doctor')
    const doctors: ProfileDoctorT[] | undefined = getDoctorDocument?.data

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
            const findRegistration = dataPatientRegis.filter((patient => {
                // patient already on confirm
                const findPatientOnConfirm = dataConfirmationPatients?.find((patientConfirm) => patientConfirm.patientId === patient.id)
                // patient at finish treatment
                const findPatientFT = dataFinishTreatment?.find((patientFT) => patientFT.patientId === patient.id)

                return findPatientOnConfirm && !findPatientFT
            }))

            if (findRegistration.length > 0) {
                const newData: DataTableContentT[] = []
                const getDataColumns = (): void => {
                    findRegistration.forEach(patient => {
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
                if (newData.length === findRegistration.length) {
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

    // action edit / delete
    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    // action edit detail patient
    function clickEditToDetailPatient(
        id: string,
        name: string,
    ): void {
        const findPatient = dataPatientRegis?.find(patient => patient.id === id)
        if (findPatient) {
            const {
                patientName,
                phone,
                emailAddress,
                dateOfBirth,
                appointmentDate,
                patientMessage,
                submissionDate
            } = findPatient

            setIdPatientToEditDetailPatient(findPatient?.id)
            setValueInputEditDetailPatient({
                patientName,
                phone,
                emailAddress,
                dateOfBirth,
                appointmentDate,
                message: patientMessage.message,
                patientComplaints: patientMessage.patientComplaints,
                submissionDate: submissionDate.submissionDate,
                clock: submissionDate.clock
            })
            setNameEditDetailPatient(name)
        } else {
            alert('an error occurred, please try again or reload the page')
        }
    }

    function closePopupEditPatientDetail(): void {
        setOnPopupEditPatientDetail(false)
    }

    function closePopupSetting(): void {
        setOnPopupSettings(false)
    }

    function changeEditDetailPatient(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setValueInputEditDetailPatient({
            ...valueInputEditDetailPatient,
            [e.target.name]: e.target.value
        })

        setErrEditInputDetailPatient({
            ...errEditInputDetailPatient,
            [e.target.name]: ''
        })
    }

    function changeDateEditDetailPatient(e: ChangeEvent<HTMLInputElement> | Date | undefined, inputName: string): void {
        setValueInputEditDetailPatient({
            ...valueInputEditDetailPatient,
            [inputName]: !e ? '' : `${e as Date}`
        })

        setErrEditInputDetailPatient({
            ...errEditInputDetailPatient,
            [inputName]: ''
        })
    }

    // submit update patient detail
    function submitEditDetailPatient(): void {
        const findIdWaitSubmitEditDetailPatient = idWaitToSubmitEditDetailPatient.find(id => id === idPatientToEditDetailPatient)

        if (!findIdWaitSubmitEditDetailPatient) {
            validateSubmitUpdate()
                .then(res => {
                    if (window.confirm(`update patient data from "${nameEditDetailPatient}"?`)) {
                        setErrEditInputDetailPatient({} as InputEditPatientRegistrationT)
                        pushToUpdateDetailPatient()
                    }
                })
        }
    }

    async function validateSubmitUpdate(): Promise<{ message: string }> {
        let err = {} as InputEditPatientRegistrationT

        if (!valueInputEditDetailPatient.patientName.trim()) {
            err.patientName = 'Must be required'
        }
        if (!valueInputEditDetailPatient.phone.trim()) {
            err.patientName = 'Must be required'
        }
        if (!valueInputEditDetailPatient.emailAddress.trim()) {
            err.emailAddress = 'Must be required'
        } else if (!mailRegex.test(valueInputEditDetailPatient.emailAddress)) {
            err.emailAddress = 'Invalid e-mail address'
        }
        if (!valueInputEditDetailPatient.dateOfBirth.trim()) {
            err.dateOfBirth = 'Must be required'
        }
        if (!valueInputEditDetailPatient.appointmentDate.trim()) {
            err.appointmentDate = 'Must be required'
        }
        if (!valueInputEditDetailPatient.message.trim()) {
            err.message = 'Must be required'
        }
        if (!valueInputEditDetailPatient.patientComplaints.trim()) {
            err.patientComplaints = 'Must be required'
        }
        if (!valueInputEditDetailPatient.submissionDate.trim()) {
            err.clock = 'Must be required'
        }

        return await new Promise((resolve, reject) => {
            if (Object.keys(err).length === 0) {
                resolve({ message: 'success' })
            } else {
                setErrEditInputDetailPatient(err)
            }
        })
    }

    // push to update patient data
    function pushToUpdateDetailPatient(): void {
        setIdWaitToSubmitEditDetailPatient((current) => [...current, idPatientToEditDetailPatient as string])
        const findIdSubmitEdit = idSubmitEditDetailPatient.find(id => id === idPatientToEditDetailPatient)
        if (!findIdSubmitEdit) {
            setIdSubmitEditDetailPatient((current) => [...current, idPatientToEditDetailPatient as string])
        }

        const {
            patientName,
            phone,
            emailAddress,
            dateOfBirth,
            appointmentDate,
            message,
            patientComplaints,
            submissionDate,
            clock
        } = valueInputEditDetailPatient

        const data = {
            patientName,
            phone,
            emailAddress,
            dateOfBirth: createDateFormat(dateOfBirth),
            appointmentDate: createDateFormat(appointmentDate),
            patientMessage: {
                message,
                patientComplaints
            },
            submissionDate: {
                submissionDate: createDateFormat(submissionDate),
                clock
            }
        }

        API().APIPutPatientData(
            'patient-registration',
            idPatientToEditDetailPatient as string,
            data
        )
            .then((res: any) => {
                alert(`Patient data from "${patientName}" updated successfully`)
                const findIdWaitSubmitDetailPatient = idWaitToSubmitEditDetailPatient.filter(id => {
                    const findIdSubmit = idSubmitEditDetailPatient.find(idWait => idWait === id)

                    return !findIdSubmit
                })

                setIdWaitToSubmitEditDetailPatient(findIdWaitSubmitDetailPatient)
            })
            .catch((err: any) => {
                alert('a server error occurred. please try again later')

                const findIdWaitSubmitDetailPatient = idWaitToSubmitEditDetailPatient.filter(id => id !== idPatientToEditDetailPatient)

                setIdWaitToSubmitEditDetailPatient(findIdWaitSubmitDetailPatient)
            })
    }
    // end action edit detail patient

    // action edit confirmation patient
    function loadDataAdmin(): void {
        if (Array.isArray(dataAdmin) && dataAdmin?.length > 0) {
            const newSelectAdmin = dataAdmin.map(admin => ({
                id: admin.email,
                title: admin.email
            }))

            setSelectEmailAdmin([
                {
                    id: 'Select Admin',
                    title: 'Select Admin'
                },
                ...newSelectAdmin
            ])
        } else {
            alert('no admin data found. please try again')
        }
    }

    function loadDataSpecialist(): void {
        if (Array.isArray(doctors) && doctors.length > 0) {
            let newDataSpecialist: { id: string, title: string }[] = []
            let count: number = 0
            doctors.forEach(data => {
                count = count + 1
                const checkSpecialist = newDataSpecialist.find(specialist => specialist.id === data.deskripsi)
                if (!checkSpecialist) {
                    newDataSpecialist.push({ id: data.deskripsi, title: data.deskripsi })
                }
            })

            if (count === doctors.length) {
                setSelectDoctorSpecialist([
                    {
                        id: 'Select Specialist',
                        title: 'Select Specialist'
                    },
                    ...newDataSpecialist
                ])
            }
        } else {
            alert(`no doctor's data found. please try again`)
        }
    }

    function loadDataDoctor(specialist: string, isActiveDoctor?: boolean): void {
        if (Array.isArray(doctors) && doctors.length > 0 && specialist) {
            const findDoctorSpecialist = doctors.filter(data => data.deskripsi === specialist)
            const getDoctors = findDoctorSpecialist.map(data => ({
                id: data.name,
                title: data.name
            }))

            setSelectDoctor([
                {
                    id: 'Select Doctor',
                    title: 'Select Doctor'
                },
                ...getDoctors
            ])

            if (isActiveDoctor) {
                const doctor = document.getElementById('selectDoctor') as HTMLSelectElement
                if (doctor) {
                    doctor.selectedIndex = 0
                }
                setValueInputEditConfirmPatient(current => ({
                    ...current,
                    nameDoctor: 'Select Doctor'
                }))
            }
        } else {
            alert(`no doctor's data found. please try again`)
        }
    }

    function loadDataRoom(isActiveRoom?: boolean): void {
        if (Array.isArray(dataRooms) && dataRooms.length > 0) {
            const findRoom: DataOptionT = dataRooms?.map(room => ({
                id: room.room,
                title: room.room
            }))

            setSelectRoom([
                {
                    id: 'Select Room',
                    title: 'Select Room'
                },
                ...findRoom
            ])

            if (isActiveRoom) {
                const room = document.getElementById('selectRoom') as HTMLSelectElement
                if (room) {
                    room.selectedIndex = 0
                }
                setValueInputEditConfirmPatient(current => ({
                    ...current,
                    roomName: 'Select Room'
                }))
            }
        } else {
            alert('medical room data not found. please try again')
        }
    }

    function clickEditToConfirmPatient(
        id: string,
        name: string
    ): void {
        const findPatient = dataConfirmationPatients?.find(patient => patient.patientId === id)
        if (findPatient) {
            const {
                patientId,
                adminInfo,
                dateConfirmInfo,
                doctorInfo,
                roomInfo
            } = findPatient
            setNameEditConfirmPatient(name)
            setIdPatientToEditConfirmPatient(findPatient?.patientId)

            // admin
            const findAdmin: AdminT | null | undefined = dataAdmin?.find(admin => admin?.id === adminInfo.adminId)
            // doctor
            const findDoctor: ProfileDoctorT | null | undefined = doctors?.find(doctor => doctor?.id === doctorInfo.doctorId)
            // room
            const findRoom: RoomTreatmentT | null | undefined = dataRooms?.find(room => room?.id === roomInfo.roomId)

            setValueInputEditConfirmPatient({
                patientId,
                emailAdmin: findAdmin?.email as string,
                dateConfirm: dateConfirmInfo.dateConfirm,
                confirmHour: dateConfirmInfo.confirmHour,
                treatmentHours: dateConfirmInfo.treatmentHours,
                nameDoctor: findDoctor?.name as string,
                doctorSpecialist: findDoctor?.deskripsi as string,
                roomName: findRoom?.room as string,
                queueNumber: roomInfo?.queueNumber,
                presence: roomInfo?.presence
            })

            setTimeout(() => {
                loadDataAdmin()
                loadDataSpecialist()
                loadDataDoctor(findDoctor?.deskripsi as string)
                loadDataRoom()
            }, 0)
        } else {
            alert('an error occurred, please try again or reload the page')
        }
    }

    function changeEditConfirmPatient(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setValueInputEditConfirmPatient({
            ...valueInputEditConfirmPatient,
            [e.target.name]: e.target.value
        })

        setErrEditInputConfirmPatient({
            ...errEditInputConfirmPatient,
            [e.target.name]: ''
        })
    }

    function handleInputSelectConfirmPatient(
        idElement: string,
        nameInput: 'emailAdmin' | 'doctorSpecialist' | 'nameDoctor' | 'roomName' | 'presence',
        cb?: (id: string, p2?: boolean) => void,
        cb2?: (p1?: boolean) => void
    ): void {
        const selectEl = document.getElementById(idElement) as HTMLSelectElement
        const id = selectEl?.options[selectEl.selectedIndex].value
        if (id) {
            setValueInputEditConfirmPatient({
                ...valueInputEditConfirmPatient,
                [nameInput]: id
            })

            if (typeof cb === 'function') {
                cb(id, true)
            }
            if (typeof cb2 === 'function') {
                cb2(true)
            }
        }
    }

    function changeDateConfirm(e: ChangeEvent<HTMLInputElement> | Date | undefined, inputName: string): void {
        setValueInputEditConfirmPatient({
            ...valueInputEditConfirmPatient,
            [inputName]: !e ? '' : `${e as Date}`
        })

        setErrEditInputConfirmPatient({
            ...errEditInputConfirmPatient,
            [inputName]: ''
        })
    }

    function closePopupEditConfirmPatient(): void {
        setOnPopupEditConfirmPatient(false)
    }

    function clickOnEditDetailPatient(): void {
        setOnPopupEditPatientDetail(true)
        setOnPopupSettings(false)
    }

    function activeSelectEditConfirmPatient(
        idElement: string,
        indexActive: number
    ): void {
        const element = document.getElementById(idElement) as HTMLSelectElement
        if (element && indexActive !== -1) {
            element.selectedIndex = indexActive
        }
    }

    function activeSelectEmailAdmin(): void {
        if (selectEmailAdmin.length > 0) {
            const findIndexAdmin: number = selectEmailAdmin.findIndex(admin => admin.id === valueInputEditConfirmPatient?.emailAdmin)

            activeSelectEditConfirmPatient('selectAdmin', findIndexAdmin)
        }
    }

    function activeSelectSpecialist(): void {
        if (selectDoctorSpecialist.length > 0) {
            const findIndexSpecialist: number = selectDoctorSpecialist.findIndex(specialist => specialist.id === valueInputEditConfirmPatient?.doctorSpecialist)

            activeSelectEditConfirmPatient('selectSpecialist', findIndexSpecialist)
        }
    }

    function activeSelectDoctor(): void {
        if (selectDoctor.length > 0) {
            const findIndexDoctor: number = selectDoctor.findIndex(doctor => doctor.id === valueInputEditConfirmPatient?.nameDoctor)

            activeSelectEditConfirmPatient('selectDoctor', findIndexDoctor)
        }
    }

    function activeSelectRoom(): void {
        if (selectRoom.length > 0) {
            const findIndexRoom: number = selectRoom.findIndex(doctor => doctor.id === valueInputEditConfirmPatient?.roomName)

            activeSelectEditConfirmPatient('selectRoom', findIndexRoom)
        }
    }

    function activeSelectPresence(): void {
        const findIndexPresence: number = selectPresence.findIndex(presence => presence.id === valueInputEditConfirmPatient?.presence)

        activeSelectEditConfirmPatient('selectPresence', findIndexPresence)
    }

    function clickOnEditConfirmPatient(): void {
        setOnPopupEditConfirmPatient(true)
        setOnPopupSettings(false)
        setEditActiveManualQueue(true)
        setEditActiveAutoQueue(false)

        setTimeout(() => {
            activeSelectEmailAdmin()
            activeSelectSpecialist()
            activeSelectDoctor()
            activeSelectRoom()
            activeSelectPresence()
        }, 500);
    }

    function toggleChangeManualQueue(): void {
        setEditActiveManualQueue(!editActiveManualQueue)
        setEditActiveAutoQueue(false)

        changeActiveToggle('setAutoNumber', false)
    }

    function toggleSetAutoQueue(): void {
        setEditActiveManualQueue(true)
        setEditActiveAutoQueue(!editActiveAutoQueue)

        changeActiveToggle('toggle', false)
    }

    function changeActiveToggle(idElement: string, checked: boolean): void {
        const toggleManual = document.getElementById(idElement) as HTMLInputElement
        if (toggleManual) {
            toggleManual.checked = checked
        }
    }

    function submitEditConfirmPatient(): void {
        const findIdWaitSubmitEditConfirmPatient = idWaitToSubmitConfirmPatient.find(id => id === idPatientToEditConfirmPatient)

        if (!findIdWaitSubmitEditConfirmPatient) {
            validateEditConfirmPatient()
                .then(res => {
                    if (window.confirm(`Update confirmation data from patient "${nameEditConfirmPatient}"?`)) {
                        setErrEditInputConfirmPatient({} as InputEditConfirmPatientT)
                        pushToUpdateConfirmPatient()
                    }
                })
        }
    }

    async function validateEditConfirmPatient(): Promise<{ message: string }> {
        let err: InputEditConfirmPatientT = {} as InputEditConfirmPatientT

        const {
            patientId,
            emailAdmin,
            dateConfirm,
            confirmHour,
            treatmentHours,
            nameDoctor,
            doctorSpecialist,
            roomName,
            queueNumber,
            presence
        } = valueInputEditConfirmPatient

        if (!patientId.trim()) {
            err.patientId = 'Must be required'
        }
        if (emailAdmin === 'Select Admin') {
            err.emailAdmin = 'Please select admin'
        }
        if (!dateConfirm.trim()) {
            err.dateConfirm = 'Must be required'
        }
        if (!confirmHour.trim()) {
            err.confirmHour = 'Must be required'
        }
        if (!treatmentHours.trim()) {
            err.treatmentHours = 'Must be required'
        }
        if (!nameDoctor.trim()) {
            err.nameDoctor = 'Please select doctor'
        }
        if (!doctorSpecialist.trim()) {
            err.doctorSpecialist = 'Please select specialist doctor'
        }
        if (!roomName.trim()) {
            err.roomName = 'Please select room'
        }
        if (!queueNumber.trim()) {
            err.queueNumber = 'Please select attendance'
        }
        if (!presence.trim()) {
            err.presence = 'Please select attendance'
        }

        return await new Promise((resolve, reject) => {
            if (Object.keys(err).length === 0) {
                resolve({ message: 'success' })
            } else {
                reject({ message: `an error occurred while submitting input` })
                setErrEditInputConfirmPatient(err)
            }
        })
    }

    function pushToUpdateConfirmPatient(): void {
        setIdWaitToSubmitConfirmPatient((current) => [...current, idPatientToEditConfirmPatient as string])
        const findIdSubmitEdit = idSubmitEditConfirmPatient.find(id => id === idPatientToEditConfirmPatient)
        if (!findIdSubmitEdit) {
            setIdSubmitEditConfirmPatient((current) => [...current, idPatientToEditConfirmPatient as string])
        }

        const findId = dataConfirmationPatients?.find(patient => patient.patientId === idPatientToEditConfirmPatient)

        const {
            patientId,
            emailAdmin,
            dateConfirm,
            confirmHour,
            treatmentHours,
            nameDoctor,
            doctorSpecialist,
            roomName,
            queueNumber,
            presence
        } = valueInputEditConfirmPatient

        // admin
        const findAdmin: AdminT | null | undefined = dataAdmin?.find(admin => admin?.email === emailAdmin)
        // doctor
        const findDoctor: ProfileDoctorT | null | undefined = doctors?.find(doctor =>
            doctor?.name === nameDoctor && doctor?.deskripsi === doctorSpecialist
        )
        // room
        const findRoom: RoomTreatmentT | null | undefined = dataRooms?.find(room => room?.room === roomName)

        const data: SubmitEditConfirmPatientT = {
            patientId,
            adminInfo: { adminId: findAdmin?.id as string },
            dateConfirmInfo: {
                dateConfirm,
                confirmHour,
                treatmentHours
            },
            doctorInfo: { doctorId: findDoctor?.id as string },
            roomInfo: {
                roomId: findRoom?.id as string,
                queueNumber,
                presence
            }
        }

        API().APIPutPatientData(
            'confirmation-patients',
            findId?.id,
            data
        )
            .then((res: any) => {
                alert('patient confirmation data successfully updated')

                const findIdWaitSubmitConfirmPatient = idWaitToSubmitConfirmPatient.filter(id => {
                    const findIdSubmit = idSubmitEditConfirmPatient.find(idWait => idWait === id)

                    return !findIdSubmit
                })

                setIdWaitToSubmitConfirmPatient(findIdWaitSubmitConfirmPatient)
            })
            .catch((err: any) => {
                alert('a server error occurred while updating the data.\nplease try again')
                console.log(err)

                const findIdWaitSubmitConfirmPatient = idWaitToSubmitConfirmPatient.filter(id => id !== idPatientToEditConfirmPatient)

                setIdWaitToSubmitConfirmPatient(findIdWaitSubmitConfirmPatient)
            })
    }

    // on loading edit detail patient
    const findIdWaitSubmitEditDetailPatient = idWaitToSubmitEditDetailPatient.find(id => id === idPatientToEditDetailPatient)

    // on loading edit confirmation patient
    const findIdWaitSubmitConfirmPatient = idWaitToSubmitConfirmPatient.find(id => id === idPatientToEditConfirmPatient)

    return (
        <>
            {/* popup edit patient detail / profile patient */}
            {onPopupEditPatientDetail && (
                <ContainerPopup
                    className='flex justify-center overflow-y-auto'
                >
                    <FormPopup
                        tag="div"
                        title='Patient of'
                        namePatient={nameEditDetailPatient}
                        clickClose={closePopupEditPatientDetail}
                    >
                        <TitleInput title='Patient Name' />
                        <Input
                            type='text'
                            nameInput='patientName'
                            changeInput={changeEditDetailPatient}
                            valueInput={valueInputEditDetailPatient?.patientName}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputDetailPatient?.patientName}
                        />

                        <TitleInput title='Phone' />
                        <Input
                            type='number'
                            nameInput='phone'
                            changeInput={changeEditDetailPatient}
                            valueInput={valueInputEditDetailPatient?.phone}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputDetailPatient?.phone}
                        />

                        <TitleInput title='Email' />
                        <Input
                            type='email'
                            nameInput='emailAddress'
                            changeInput={changeEditDetailPatient}
                            valueInput={valueInputEditDetailPatient?.emailAddress}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputDetailPatient?.emailAddress}
                        />

                        <TitleInput title='Date of Birth' />
                        <InputSearch
                            icon={faCalendarDays}
                            selected={!valueInputEditDetailPatient?.dateOfBirth ? undefined : new Date(valueInputEditDetailPatient?.dateOfBirth)}
                            onCalendar={true}
                            renderCustomHeader={renderCustomHeader}
                            changeInput={(e) => changeDateEditDetailPatient(e, 'dateOfBirth')}
                            classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                            classDate='text-[#000] text-sm'
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputDetailPatient?.dateOfBirth}
                        />

                        <TitleInput title='Appointment Date' />
                        <InputSearch
                            icon={faCalendarDays}
                            selected={!valueInputEditDetailPatient?.appointmentDate ? undefined : new Date(valueInputEditDetailPatient?.appointmentDate)}
                            renderCustomHeader={renderCustomHeader}
                            onCalendar={true}
                            changeInput={(e) => changeDateEditDetailPatient(e, 'appointmentDate')}
                            classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                            classDate='text-[#000] text-sm'
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputDetailPatient?.appointmentDate}
                        />

                        <TitleInput title='Message' />
                        <InputArea
                            nameInput='message'
                            changeInput={changeEditDetailPatient}
                            valueInput={valueInputEditDetailPatient?.message}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputDetailPatient?.message}
                        />

                        <TitleInput title='Patient Complaints' />
                        <InputArea
                            nameInput='patientComplaints'
                            changeInput={changeEditDetailPatient}
                            valueInput={valueInputEditDetailPatient?.patientComplaints}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputDetailPatient?.patientComplaints}
                        />

                        <TitleInput title='Submission Date' />
                        <InputSearch
                            icon={faCalendarDays}
                            selected={!valueInputEditDetailPatient?.submissionDate ? undefined : new Date(valueInputEditDetailPatient?.submissionDate)}
                            renderCustomHeader={renderCustomHeader}
                            changeInput={(e) => changeDateEditDetailPatient(e, 'submissionDate')}
                            onCalendar={true}
                            classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                            classDate='text-[#000] text-sm'
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputDetailPatient?.submissionDate}
                        />

                        <TitleInput title='Clock' />
                        <Input
                            type='text'
                            nameInput='clock'
                            changeInput={changeEditDetailPatient}
                            valueInput={valueInputEditDetailPatient?.clock}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputDetailPatient?.clock}
                        />

                        <Button
                            nameBtn="UPDATE"
                            classLoading={findIdWaitSubmitEditDetailPatient ? 'flex' : 'hidden'}
                            classBtn={findIdWaitSubmitEditDetailPatient ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                            clickBtn={submitEditDetailPatient}
                        />
                    </FormPopup>
                </ContainerPopup>
            )}
            {/* end popup edit detail patient */}

            {/* popup edit confirmation data */}
            {onPopupEditConfirmPatient && (
                <ContainerPopup
                    className='flex justify-center overflow-y-auto'
                >
                    <FormPopup
                        tag="div"
                        title='Patient of'
                        namePatient={nameEditConfirmPatient}
                        clickClose={closePopupEditConfirmPatient}
                    >
                        <TitleInput title='Patient Id' />
                        <Input
                            type='number'
                            nameInput='patientId'
                            changeInput={changeEditConfirmPatient}
                            valueInput={valueInputEditConfirmPatient?.patientId}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputConfirmPatient?.patientId}
                        />

                        <TitleInput title='Email Admin' />
                        <InputSelect
                            id='selectAdmin'
                            classWrapp='mt-2 border-bdr-one border-color-young-gray'
                            data={selectEmailAdmin}
                            handleSelect={() => handleInputSelectConfirmPatient('selectAdmin', 'emailAdmin')}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputConfirmPatient?.emailAdmin}
                        />

                        <TitleInput title='Confirmation Date' />
                        <InputSearch
                            icon={faCalendarDays}
                            selected={!valueInputEditConfirmPatient?.dateConfirm ? undefined : new Date(valueInputEditConfirmPatient?.dateConfirm)}
                            renderCustomHeader={renderCustomHeader}
                            changeInput={(e) => changeDateConfirm(e, 'dateConfirm')}
                            onCalendar={true}
                            classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                            classDate='text-[#000] text-sm'
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputConfirmPatient?.dateConfirm}
                        />

                        <TitleInput title='Confirmation Hour' />
                        <Input
                            type='text'
                            nameInput='confirmHour'
                            changeInput={changeEditConfirmPatient}
                            valueInput={valueInputEditConfirmPatient?.confirmHour}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputConfirmPatient?.confirmHour}
                        />

                        <TitleInput title='Select Specialist' />
                        <InputSelect
                            id='selectSpecialist'
                            classWrapp='mt-2 border-bdr-one border-color-young-gray'
                            data={selectDoctorSpecialist}
                            handleSelect={() => handleInputSelectConfirmPatient('selectSpecialist', 'doctorSpecialist', (id, p2) => loadDataDoctor(id, p2), (p1) => loadDataRoom(p1))}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputConfirmPatient?.doctorSpecialist}
                        />

                        <TitleInput title='Select Doctor' />
                        <InputSelect
                            id='selectDoctor'
                            classWrapp='mt-2 border-bdr-one border-color-young-gray'
                            data={selectDoctor}
                            handleSelect={() => handleInputSelectConfirmPatient('selectDoctor', 'nameDoctor')}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputConfirmPatient?.nameDoctor}
                        />

                        <TitleInput title='Select Room' />
                        <InputSelect
                            id='selectRoom'
                            classWrapp='mt-2 border-bdr-one border-color-young-gray'
                            data={selectRoom}
                            handleSelect={() => handleInputSelectConfirmPatient('selectRoom', 'roomName')}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputConfirmPatient?.roomName}
                        />

                        <TitleInput title='Queue Number' />
                        <Input
                            type='number'
                            nameInput='queueNumber'
                            changeInput={changeEditConfirmPatient}
                            valueInput={valueInputEditConfirmPatient?.queueNumber}
                            readonly={editActiveManualQueue}
                        />
                        {/* options */}
                        <div
                            className='flex flex-wrap justify-end items-center'
                        >
                            <Toggle
                                labelText='Change manually'
                                clickToggle={toggleChangeManualQueue}
                            />
                            <Toggle
                                labelText='Set auto number'
                                classWrapp='ml-2'
                                idToggle='setAutoNumber'
                                clickToggle={toggleSetAutoQueue}
                            />
                        </div>
                        <ErrorInput
                            {...styleError}
                            error={errEditInputConfirmPatient?.queueNumber}
                        />

                        <TitleInput title='Treatment Hours (08:00 - 12:00)' />
                        <Input
                            type='text'
                            nameInput='treatmentHours'
                            changeInput={changeEditConfirmPatient}
                            valueInput={valueInputEditConfirmPatient?.treatmentHours}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputConfirmPatient?.treatmentHours}
                        />

                        <TitleInput title='Presence' />
                        <InputSelect
                            id='selectPresence'
                            classWrapp='mt-2 border-bdr-one border-color-young-gray'
                            data={selectPresence}
                            handleSelect={() => handleInputSelectConfirmPatient('selectPresence', 'presence')}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInputConfirmPatient?.presence}
                        />

                        <Button
                            nameBtn="UPDATE"
                            classLoading={findIdWaitSubmitConfirmPatient ? 'flex' : 'hidden'}
                            classBtn={findIdWaitSubmitConfirmPatient ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                            clickBtn={submitEditConfirmPatient}
                        />
                    </FormPopup>
                </ContainerPopup>
            )}
            {/* end popup edit confirmation patient */}

            {/* popup choose update */}
            {onPopupSettings && (
                <ContainerPopup
                    className='flex justify-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={closePopupSetting}
                        title='What do you want to edit?'
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
                                // indexActiveEdit={loadingSubmitEditDetailPatient && patient.id === indexActiveEdit ? indexActiveEdit : undefined}
                                clickEdit={(e) => {
                                    clickEditToDetailPatient(patient.id, patient.data[0]?.name)
                                    clickEditToConfirmPatient(patient.id, patient.data[0]?.name)
                                    setOnPopupSettings(true)
                                    e?.stopPropagation()
                                }}
                                clickDelete={(e) => {
                                    // clickDelete(patient.id, patient.data[0]?.name)
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