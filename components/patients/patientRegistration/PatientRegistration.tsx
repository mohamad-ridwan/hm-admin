'use client'

import { CSSProperties, ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { faCalendarDays, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { HeadDataTableT } from 'lib/types/TableT.type'
import { useSwr } from 'lib/useFetch/useSwr'
import { endpoint } from 'lib/api/endpoint'
import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { TableHead } from 'components/table/TableHead'
import Pagination from 'components/pagination/Pagination'
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT } from 'lib/types/PatientT.types'
import { dayNamesInd } from 'lib/namesOfCalendar/dayNamesInd'
import { monthNames } from 'lib/namesOfCalendar/monthNames'
import { monthNamesInd } from 'lib/namesOfCalendar/monthNamesInd'
import { dayNamesEng } from 'lib/namesOfCalendar/dayNamesEng'
import { TableColumns } from 'components/table/TableColumns'
import { TableData } from 'components/table/TableData'
import { API } from 'lib/api'
import { preloadFetch } from 'lib/useFetch/preloadFetch'
import { TableFilter } from 'components/table/TableFilter'
import { InputSearch } from 'components/input/InputSearch'
import { DataOnDataTableContentT, DataOptionT, DataTableContentT } from 'lib/types/FilterT'
import { InputSelect } from 'components/input/InputSelect'
import { spaceString } from 'lib/regex/spaceString'
import { specialCharacter } from 'lib/regex/specialCharacter'
import { ContainerPopup } from 'components/popup/ContainerPopup'
import { FormPopup } from 'components/popup/FormPopup'
import { TitleInput } from 'components/input/TitleInput'
import Input from 'components/input/Input'
import ErrorInput from 'components/input/ErrorInput'
import { InputArea } from 'components/input/InputArea'
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader"
import { mailRegex } from 'lib/regex/mailRegex'
import Button from 'components/Button'
import { createDateFormat } from 'lib/datePicker/createDateFormat'

export function PatientRegistration() {
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
    ])
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [chooseFilterByDate, setChooseFilterByDate] = useState({
        id: 'Off Date',
        title: 'Off Date'
    })
    const [selectDate, setSelectDate] = useState<Date | undefined>()
    const [onSortDate, setOnSortDate] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>('')
    const [indexActiveEdit, setIndexActiveEdit] = useState<number | null>(null)
    const [indexActiveDelete, setIndexActiveDelete] = useState<number | null>(null)
    const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(false)
    const [onPopupEdit, setOnPopupEdit] = useState<boolean>(false)
    const [patientName, setPatientName] = useState<string | null>(null)
    const [loadingSubmitEdit, setLoadingSubmitEdit] = useState<boolean>(false)
    const [waitIndexActiveEdit, setWaitIndexActiveEdit] = useState<number | null>(null)
    const [valueInputEdit, setValueInputEdit] = useState<PatientRegistrationT>({
        id: '',
        patientName: '',
        phone: '',
        emailAddress: '',
        dateOfBirth: '',
        appointmentDate: '',
        patientMessage: {
            message: '',
            patientComplaints: ''
        },
        submissionDate: {
            submissionDate: '',
            clock: ''
        }
    })
    const [errEditInput, setErrEditInput] = useState<PatientRegistrationT>({} as PatientRegistrationT)
    const [chooseOnSortDate, setChooseOnSortDate] = useState<{
        id: string
        title: string
    }>({
        id: 'Off Sort Date',
        title: 'Off Sort Date'
    })
    const [filterBy] = useState<DataOptionT>([
        {
            id: 'Off Date',
            title: 'Off Date',
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
    const [dataSortDate] = useState<DataOptionT>([
        {
            id: 'Off Sort Date',
            title: 'Off Sort Date'
        },
        {
            id: 'On Sort Date',
            title: 'On Sort Date'
        },
    ])

    const router = useRouter()

    // swr fetching data
    const { data: dataService, error: errDataService, isLoading: loadDataService } = useSwr(endpoint.getServicingHours())
    const newPatientRegistration: { [key: string]: any } | undefined = dataService as {}
    const getPatientRegistration: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientRegistrationT) => item?.id === 'patient-registration')
    const dataPatientRegis: PatientRegistrationT[] | undefined = getPatientRegistration?.data

    // confirmation patients
    const getConfirmationPatients: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: ConfirmationPatientsT) => item?.id === 'confirmation-patients')
    const dataConfirmationPatients: ConfirmationPatientsT[] | undefined = getConfirmationPatients?.data

    // finished treatment data
    const getFinishTreatment: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientFinishTreatmentT) => item?.id === 'finished-treatment')
    const dataFinishTreatment: PatientFinishTreatmentT[] | undefined = getFinishTreatment?.data

    function findDataRegistration(
        dataPatientRegis: PatientRegistrationT[] | undefined,
        dataConfirmationPatients: ConfirmationPatientsT[] | undefined,
        dataFinishTreatment: PatientFinishTreatmentT[] | undefined
    ): void {
        if (Array.isArray(dataPatientRegis) && dataPatientRegis.length > 0) {
            const findRegistration = dataPatientRegis.filter((patient => {
                // patient already on confirm
                const findPatientOnConfirm = dataConfirmationPatients?.find((patientConfirm) => patientConfirm.patientId === patient.id)
                // patient at finish treatment
                const findPatientFT = dataFinishTreatment?.find((patientFT) => patientFT.patientId === patient.id)

                return !findPatientOnConfirm && !findPatientFT
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

                        const dataRegis: DataTableContentT = {
                            id: patient.id,
                            data: [
                                {
                                    name: patient.patientName
                                },
                                {
                                    firstDesc: makeNormalDate(patient.appointmentDate),
                                    color: '#ff296d',
                                    colorName: '#777',
                                    marginBottom: '4.5px',
                                    fontSize: '12px',
                                    filterBy: 'Appointment Date',
                                    clock: patient.submissionDate.clock,
                                    name: patient.appointmentDate,
                                },
                                {
                                    firstDesc: makeNormalDate(patient.submissionDate.submissionDate),
                                    color: '#7600bc',
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
                                    firstDesc: makeNormalDate(patient.dateOfBirth, true),
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
            }
        }
    }

    useEffect(() => {
        findDataRegistration(
            dataPatientRegis,
            dataConfirmationPatients,
            dataFinishTreatment
        )
    }, [loadDataService, dataService])

    // preload
    function preloadDataRegistration(dataService: { [key: string]: any } | { [key: string]: any }[]): void {
        const newPatientRegistration: { [key: string]: any } | undefined = dataService as {}
        const getPatientRegistration: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientRegistrationT) => item?.id === 'patient-registration')
        const dataPatientRegis: PatientRegistrationT[] | undefined = getPatientRegistration?.data

        // confirmation patients
        const getConfirmationPatients: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: ConfirmationPatientsT) => item?.id === 'confirmation-patients')
        const dataConfirmationPatients: ConfirmationPatientsT[] | undefined = getConfirmationPatients?.data

        // finished treatment data
        const getFinishTreatment: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientFinishTreatmentT) => item?.id === 'finished-treatment')
        const dataFinishTreatment: PatientFinishTreatmentT[] | undefined = getFinishTreatment?.data

        findDataRegistration(
            dataPatientRegis,
            dataConfirmationPatients,
            dataFinishTreatment
        )
    }

    // useEffect(() => {
    //     preloadFetch(endpoint.getServicingHours())
    //         .then((res) => {
    //             if (res?.data) {
    //                 preloadDataRegistration(res)
    //             } else {
    //                 console.log('error preload data service. no property "data" found')
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err)
    //             console.log('error preload data service')
    //         })
    // }, [])

    // filter table
    const makeFormatDate = (): string => {
        const getCurrentDate = `${selectDate}`.split(' ')
        const getCurrentMonth = monthNames.findIndex(month => month?.toLowerCase() === getCurrentDate[1]?.toLowerCase())
        const getNumberOfCurrentMonth = getCurrentMonth?.toString()?.length === 1 ? `0${getCurrentMonth + 1}` : `${getCurrentMonth + 1}`
        const dateNow = getCurrentDate[2]
        const yearsNow = getCurrentDate[3]
        const currentDate = `${getNumberOfCurrentMonth}/${dateNow}/${yearsNow}`

        return currentDate
    }

    // filter by date
    const filterByDate: DataTableContentT[] = dataColumns?.length > 0 ? dataColumns.filter(patient => {
        function onFilterDate(): DataOnDataTableContentT[] | undefined {
            if (selectDate) {
                const findDate = patient.data.filter(data =>
                    data.filterBy?.toLowerCase() === chooseFilterByDate.id.toLowerCase() &&
                    data.name === makeFormatDate())
                return findDate
            } else if (chooseFilterByDate.id !== 'Off Date') {
                const findDate = patient.data.filter(data =>
                    data.filterBy?.toLowerCase() === chooseFilterByDate.id.toLowerCase())
                return findDate
            }
        }

        // const findDate = selectDate ? patient.data.filter(data =>
        //     data.filterBy?.toLowerCase() === chooseFilterByDate.id.toLowerCase() &&
        //     data.name === makeFormatDate())
        //     : []

        const findDate = onFilterDate()

        return Array.isArray(findDate) && findDate.length > 0
    }) : []

    const checkFilterByDate = (): DataTableContentT[] => {
        if (chooseFilterByDate.id !== 'Off Date') {
            return filterByDate
        }

        return dataColumns
    }

    // sort after filter by date
    const sortDate = onSortDate && filterByDate?.length > 0 ? filterByDate.sort((p1, p2) => {
        const getSort: number = (new Date(getSortDateAfterFilterByDate(p1, p2, chooseFilterByDate.id.toLowerCase(), true).dateOne)).valueOf() - (new Date(getSortDateAfterFilterByDate(p1, p2, chooseFilterByDate.id.toLowerCase(), true).dateTwo)).valueOf()

        return getSort
    }) : []

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
        if (onSortDate) {
            return sortDate
        }
        // else if(onSortDate && chooseFilterByDate.id === 'Appointment Date'){
        //     return specificSortAppointmentDate
        // }

        return checkFilterByDate()
    }

    // filter on search text
    const filterText: DataTableContentT[] = checkSortSubmissionDate().length > 0 ? checkSortSubmissionDate().filter(patient => {
        const findItem = patient.data.filter(data => data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))

        return findItem.length > 0
    }) : []

    useEffect(() => {
        setCurrentPage(1)
    }, [searchText])

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
                elementTHead.style.width = 'calc(100%/8)'
                elementTHead = document.getElementById(`tHead4`) as HTMLElement
                elementTHead.style.width = 'calc(100%/6)'
                elementTHead = document.getElementById(`tHead5`) as HTMLElement
                elementTHead.style.width = 'calc(100%/10)'
            }
            if (elementTData !== null) {
                for (let i = 0; i < dataColumnsBody?.length; i++) {
                    elementTData = document.getElementById(`tData${i}0`) as HTMLElement
                    if (elementTData?.style) {
                        elementTData.style.width = 'calc(100%/7)'
                        elementTData = document.getElementById(`tData${i}1`) as HTMLElement
                        elementTData.style.width = 'calc(100%/7)'
                        elementTData = document.getElementById(`tData${i}2`) as HTMLElement
                        elementTData.style.width = 'calc(100%/8)'
                        elementTData = document.getElementById(`tData${i}3`) as HTMLElement
                        elementTData.style.width = 'calc(100%/8)'
                        elementTData = document.getElementById(`tData${i}4`) as HTMLElement
                        elementTData.style.width = 'calc(100%/6)'
                        elementTData = document.getElementById(`tData${i}5`) as HTMLElement
                        elementTData.style.width = 'calc(100%/10)'
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

    function toPage(path: string): void {
        router.push(path)
    }

    // waiting index active loading edit
    useEffect(() => {
        if (loadingSubmitEdit === false && indexActiveEdit !== null && waitIndexActiveEdit !== null) {
            setIndexActiveEdit(waitIndexActiveEdit as number)
        }
    }, [loadingSubmitEdit, waitIndexActiveEdit])

    function clickEdit(
        id: string,
        name: string,
        index: number
    ): void {
        const findPatient = dataPatientRegis?.find(patient => patient.id === id)
        setWaitIndexActiveEdit(index)
        if(loadingSubmitEdit === false){
            setIndexActiveEdit(index)
        }
        if (findPatient) {
            setValueInputEdit(findPatient as PatientRegistrationT)
            setPatientName(name)
            setOnPopupEdit(true)
        } else {
            alert('an error occurred, please try again or reload the page')
        }
    }

    function clickDelete(
        id: string,
        name: string,
        index: number
    ): void {
        if (
            indexActiveEdit !== index &&
            indexActiveDelete === null &&
            window.confirm(`Delete patient of "${name}"`)
        ) {
            setIndexActiveDelete(index)
            deleteDataPersonalPatient(id, name)
        }
    }

    function deleteDataPersonalPatient(id: string, name: string): void {
        API().APIDeletePatientData(
            'patient-registration',
            id
        )
            .then((res: any) => {
                setIndexActiveDelete(null)
                alert(`Successfully deleted data from "${name}" patient`)
            })
            .catch((err: any) => {
                alert('a server error has occurred.\nPlease try again later')
                setIndexActiveDelete(null)
            })
    }

    const handleSearchText = (e?: ChangeEvent<HTMLInputElement>): void => {
        setSearchText(e?.target.value as string)
    }

    const handleInputDate = (e?: Date | ChangeEvent<HTMLInputElement>): void => {
        setSelectDate(e as Date)
        setCurrentPage(1)
    }

    const handleFilterDate = () => {
        const selectEl = document.getElementById('filterDateTable') as HTMLSelectElement
        const id = selectEl?.options[selectEl.selectedIndex].value
        if (id) {
            if (id !== 'Off Date') {
                setDisplayOnCalendar(true)
            } else {
                setDisplayOnCalendar(false)
                setSelectDate(undefined)
            }
            if (id === 'Off Date' || id === 'Date of Birth') {
                setOnSortDate(false)
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
            if (id !== 'Off Sort Date') {
                setOnSortDate(true)
            } else {
                setOnSortDate(false)
            }

            setChooseOnSortDate({
                id: id,
                title: id
            })
        }
    }

    function handleChangeUpdate(
        e: ChangeEvent<HTMLInputElement>
    ): void {
        setValueInputEdit({
            ...valueInputEdit,
            [e.target.name]: e.target.value
        })
    }

    function handleInputPatientMessage(
        e: ChangeEvent<HTMLTextAreaElement>,
        nameInput?: 'message' | 'patientComplaints'
    ): void {
        let patientMessage = {
            message: valueInputEdit.patientMessage.message,
            patientComplaints: valueInputEdit.patientMessage.patientComplaints
        }
        patientMessage[
            nameInput as 'message' ||
            nameInput as 'patientComplaints'
        ] = e.target.value

        setValueInputEdit({
            ...valueInputEdit,
            patientMessage,
        })
    }

    function handleSubmissionDate(
        event: ChangeEvent<HTMLInputElement>,
        dateValue: Date | undefined,
        nameInput: 'submissionDate' | 'clock'
    ): void {
        let submissionDate = {
            submissionDate: valueInputEdit.submissionDate.submissionDate,
            clock: valueInputEdit.submissionDate.clock
        }
        submissionDate[
            nameInput as 'submissionDate' ||
            nameInput as 'clock'
        ] = nameInput === 'submissionDate' ? `${dateValue}` : event.target.value


        setValueInputEdit({
            ...valueInputEdit,
            submissionDate,
        })
    }

    function handleChangeEditDate(
        e: ChangeEvent<HTMLInputElement> | Date,
        nameInput: 'dateOfBirth' | 'appointmentDate'
    ) {
        setValueInputEdit({
            ...valueInputEdit,
            [nameInput]: `${e as Date}`
        })
    }

    // submit update
    function handleSubmitUpdate(): void {
        if (loadingSubmitEdit === false) {
            validateSubmitUpdate()
                .then(res => {
                    if (window.confirm(`update patient data from "${patientName}"?`)) {
                        setLoadingSubmitEdit(true)
                        setErrEditInput({} as PatientRegistrationT)
                        pushToUpdatePatient()
                    }
                })
        }
    }

    async function validateSubmitUpdate(): Promise<{ message: string }> {
        let err = {} as PatientRegistrationT

        if (!valueInputEdit.patientName.trim()) {
            err.patientName = 'Must be required'
        }
        if (!valueInputEdit.phone.trim()) {
            err.patientName = 'Must be required'
        }
        if (!valueInputEdit.emailAddress.trim()) {
            err.emailAddress = 'Must be required'
        } else if (!mailRegex.test(valueInputEdit.emailAddress)) {
            err.emailAddress = 'Invalid e-mail address'
        }
        if (!valueInputEdit.dateOfBirth.trim()) {
            err.dateOfBirth = 'Must be required'
        }
        if (!valueInputEdit.appointmentDate.trim()) {
            err.appointmentDate = 'Must be required'
        }
        if (!valueInputEdit.patientMessage.message.trim()) {
            err.patientMessage.message = 'Must be required'
        }
        if (!valueInputEdit.patientMessage.patientComplaints.trim()) {
            err.patientMessage.patientComplaints = 'Must be required'
        }
        if (!valueInputEdit.submissionDate.submissionDate.trim()) {
            err.submissionDate.clock = 'Must be required'
        }

        return await new Promise((resolve, reject) => {
            if (Object.keys(err).length === 0) {
                resolve({ message: 'success' })
            } else {
                setErrEditInput(err)
            }
        })
    }

    // push to update patient data
    function pushToUpdatePatient(): void{
        const {
            patientName,
            phone,
            emailAddress,
            dateOfBirth,
            appointmentDate,
            patientMessage,
            submissionDate
        } = valueInputEdit

        const data = {
            patientName,
            phone,
            emailAddress,
            dateOfBirth: createDateFormat(dateOfBirth),
            appointmentDate: createDateFormat(appointmentDate),
            patientMessage,
            submissionDate: {
                submissionDate: createDateFormat(submissionDate.submissionDate),
                clock: submissionDate.clock
            }
        }

        API().APIPutPatientData(
            'patient-registration',
            valueInputEdit.id,
            data
        )
        .then((res: any)=>{
            alert(`Patient data from "${patientName}" updated successfully`)
            setLoadingSubmitEdit(false)
        })
        .catch((err: any)=>{
            alert('a server error occurred. please try again later')
            setLoadingSubmitEdit(false)
        })
    }

    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    function clickClosePopupEdit(): void {
        setOnPopupEdit(false)
        setValueInputEdit({
            id: '',
            patientName: '',
            phone: '',
            emailAddress: '',
            dateOfBirth: '',
            appointmentDate: '',
            patientMessage: {
                message: '',
                patientComplaints: ''
            },
            submissionDate: {
                submissionDate: '',
                clock: ''
            }
        })
    }

    return (
        <>
            {/* popup edit */}
            {onPopupEdit && (
                <ContainerPopup
                    className='flex justify-center overflow-y-auto'
                >
                    <FormPopup
                        tag="div"
                        clickClose={clickClosePopupEdit}
                        title="Patient of"
                        namePatient={patientName as string}
                    >
                        <TitleInput title='Patient Name' />
                        <Input
                            type='text'
                            nameInput='patientName'
                            changeInput={handleChangeUpdate}
                            valueInput={valueInputEdit?.patientName}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInput?.patientName}
                        />

                        <TitleInput title='Phone' />
                        <Input
                            type='number'
                            nameInput='phone'
                            changeInput={handleChangeUpdate}
                            valueInput={valueInputEdit?.phone}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInput?.phone}
                        />

                        <TitleInput title='Email' />
                        <Input
                            type='email'
                            nameInput='emailAddress'
                            changeInput={handleChangeUpdate}
                            valueInput={valueInputEdit?.emailAddress}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInput?.emailAddress}
                        />

                        <TitleInput title='Date of Birth' />
                        <InputSearch
                            icon={faCalendarDays}
                            selected={valueInputEdit?.dateOfBirth ? new Date(valueInputEdit?.dateOfBirth) : undefined}
                            onCalendar={true}
                            renderCustomHeader={renderCustomHeader}
                            changeInput={(e) => handleChangeEditDate(
                                e as ChangeEvent<HTMLInputElement>,
                                'dateOfBirth'
                            )}
                            classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                            classDate='text-[#000] text-sm'
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInput?.dateOfBirth}
                        />

                        <TitleInput title='Appointment Date' />
                        <InputSearch
                            icon={faCalendarDays}
                            selected={valueInputEdit?.appointmentDate ? new Date(valueInputEdit?.appointmentDate) : undefined}
                            renderCustomHeader={renderCustomHeader}
                            onCalendar={true}
                            changeInput={(e) => handleChangeEditDate(
                                e as ChangeEvent<HTMLInputElement>,
                                'appointmentDate'
                            )}
                            classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                            classDate='text-[#000] text-sm'
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInput?.appointmentDate}
                        />

                        <TitleInput title='Message' />
                        <InputArea
                            nameInput='message'
                            changeInput={(e) => handleInputPatientMessage(e, 'message')}
                            valueInput={valueInputEdit?.patientMessage?.message}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInput?.patientMessage?.message}
                        />

                        <TitleInput title='Patient Complaints' />
                        <InputArea
                            nameInput='patientComplaints'
                            changeInput={(e) => handleInputPatientMessage(e, 'patientComplaints')}
                            valueInput={valueInputEdit?.patientMessage?.patientComplaints}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInput?.patientMessage?.patientComplaints}
                        />

                        <TitleInput title='Submission Date' />
                        <InputSearch
                            icon={faCalendarDays}
                            selected={valueInputEdit?.submissionDate?.submissionDate ? new Date(valueInputEdit?.submissionDate?.submissionDate) : undefined}
                            renderCustomHeader={renderCustomHeader}
                            changeInput={(e) => handleSubmissionDate(
                                e as ChangeEvent<HTMLInputElement>,
                                e as Date | undefined,
                                'submissionDate'
                            )}
                            onCalendar={true}
                            classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                            classDate='text-[#000] text-sm'
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInput?.submissionDate?.submissionDate}
                        />

                        <TitleInput title='Clock' />
                        <Input
                            type='text'
                            nameInput='clock'
                            changeInput={(e) => handleSubmissionDate(
                                e as ChangeEvent<HTMLInputElement>,
                                undefined,
                                'clock'
                            )}
                            valueInput={valueInputEdit?.submissionDate?.clock}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errEditInput?.submissionDate?.clock}
                        />

                        <Button
                            nameBtn="UPDATE"
                            classLoading={loadingSubmitEdit ? 'flex' : 'hidden'}
                            classBtn={loadingSubmitEdit ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                            clickBtn={handleSubmitUpdate}
                        />
                    </FormPopup>
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
                            id='filterDateTable'
                            classWrapp='mt-2'
                            data={filterBy}
                            handleSelect={handleFilterDate}
                        />
                        {
                            chooseFilterByDate.id !== 'Off Date' &&
                            chooseFilterByDate.id !== 'Date of Birth' &&
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
                <TableBody>
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {/* load data */}
                    {currentTableData.length > 0 ? currentTableData.map((patient, index) => {
                        const pathUrlToDataDetail: string = `/patient/patient-registration/personal-data/not-yet-confirmed/${patient.data[0]?.name}/${patient.id}`
                        return (
                            <TableColumns
                                key={index}
                                clickBtn={() => toPage(pathUrlToDataDetail)}
                                indexActiveEdit={loadingSubmitEdit && index === indexActiveEdit ? indexActiveEdit : undefined}
                                indexActiveDelete={index === indexActiveDelete ? indexActiveDelete : undefined}
                                clickEdit={(e) => {
                                    clickEdit(patient.id, patient.data[0]?.name, index)
                                    e?.stopPropagation()
                                }}
                                clickDelete={(e) => {
                                    clickDelete(patient.id, patient.data[0]?.name, index)
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
                            >No patient registration data</p>
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