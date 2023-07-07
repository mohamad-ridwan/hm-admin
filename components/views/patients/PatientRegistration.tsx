'use client'

import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { faCalendarDays, faMagnifyingGlass, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { HeadDataTableT } from 'lib/types/TableT.type'
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
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader"
import ServicingHours from 'lib/actions/ServicingHours'
import EditPatientRegistration from 'lib/actions/editPatient/editPatientRegistration/EditPatientRegistration'
import FormPatientRegistration from 'lib/actions/editPatient/editPatientRegistration/FormPatientRegistration'
import { ContainerPopup } from 'components/popup/ContainerPopup'
import { SettingPopup } from 'components/popup/SettingPopup'
import Button from 'components/Button'

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
    const [chooseFilterByDate, setChooseFilterByDate] = useState<{
        id: string
        title: string
    }>({
        id: 'Filter By',
        title: 'Filter By'
    })
    const [selectDate, setSelectDate] = useState<Date | undefined>()
    const [searchText, setSearchText] = useState<string>('')
    const [patientsIdToDelete, setPatientsIdToDelete] = useState<string[]>([])
    const [onPopupSettings, setOnPopupSettings] = useState<boolean>(false)
    const [patientsIdToDeleteSuccess, setPatientsIdToDeleteSuccess] = useState<string[]>([])
    const [patientsIdToDeleteFailed, setPatientsIdToDeleteFailed] = useState<string[]>([])
    const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(false)
    const [chooseOnSortDate, setChooseOnSortDate] = useState<{
        id: string
        title: string
    }>({
        id: 'Sort By',
        title: 'Sort By'
    })
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

    const router = useRouter()

    // swr fetching data
    // servicing hours
    const {
        dataService,
        dataPatientRegis,
        dataConfirmationPatients,
        dataFinishTreatment,
        loadDataService,
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

        setTimeout(() => {
            findDataRegistration(
                dataPatientRegis,
                dataConfirmationPatients,
                dataFinishTreatment
            )
        }, 500)
    }

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

    useEffect(() => {
        if (currentTableData.length === 0 && currentPage > 1) {
            setCurrentPage((current) => current - 1)
        }
    }, [patientsIdToDeleteSuccess, currentTableData])

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

    // delete action
    function loadingDelete(): void {
        patientsIdToDelete.forEach(id => {
            const iconDeleteElement = document.getElementById(`iconDelete${id}`) as HTMLElement
            const loadingDeleteElement = document.getElementById(`loadDelete${id}`) as HTMLElement

            if (iconDeleteElement && loadingDeleteElement) {
                iconDeleteElement.style.display = 'none'
                loadingDeleteElement.style.display = 'flex'
            }
        })
    }

    useEffect(() => {
        if (patientsIdToDelete.length > 0 && dataColumns.length > 0) {
            loadingDelete()
        }
    }, [patientsIdToDelete, dataColumns])

    // when delete is successful
    function loadIconDeleteSuccess(): void {
        let count: number = 0
        dataColumns.forEach(patient => {
            count = count + 1

            const iconDeleteElement = document.getElementById(`iconDelete${patient.id}`) as HTMLElement
            const loadingDeleteElement = document.getElementById(`loadDelete${patient.id}`) as HTMLElement

            if (iconDeleteElement && loadingDeleteElement) {
                iconDeleteElement.style.display = 'flex'
                loadingDeleteElement.style.display = 'none'
            }
        })

        if (count === dataColumns.length) {
            setTimeout(() => {
                loadingDelete()
            }, 500);
        }
    }

    useEffect(() => {
        if (patientsIdToDeleteSuccess.length > 0 && dataColumns.length > 0) {
            loadIconDeleteSuccess()
        }
    }, [patientsIdToDeleteSuccess, dataColumns])

    // when delete is failed
    function loadDeleteFailed(): void {
        patientsIdToDeleteFailed.forEach(id => {
            const iconDeleteElement = document.getElementById(`iconDelete${id}`) as HTMLElement
            const loadingDeleteElement = document.getElementById(`loadDelete${id}`) as HTMLElement

            if (iconDeleteElement && loadingDeleteElement) {
                iconDeleteElement.style.display = 'flex'
                loadingDeleteElement.style.display = 'none'
            }
        })
    }

    useEffect(() => {
        if (patientsIdToDeleteSuccess.length > 0 && dataColumns.length > 0) {
            loadDeleteFailed()
        }
    }, [patientsIdToDeleteFailed, dataColumns])

    function clickDelete(
        id: string,
        name: string,
    ): void {
        const findId = patientsIdToDelete.find(patientId => patientId === id)
        if (
            !findId &&
            window.confirm(`Delete patient of "${name}"`)
        ) {
            setPatientsIdToDelete((current) => [...current, id])
            deleteDataPersonalPatient(id, name)
        }
    }

    function deleteDataPersonalPatient(id: string, name: string): void {
        API().APIDeletePatientData(
            'patient-registration',
            id
        )
            .then((res: any) => {
                preloadFetch(endpoint.getServicingHours())
                    .then((res) => {
                        if (res?.data) {
                            setPatientsIdToDeleteSuccess((current) => [...current, id])
                            preloadDataRegistration(res)
                            alert(`Successfully deleted data from "${name}" patient`)
                        } else {
                            console.log('error preload data service. no property "data" found')
                            setPatientsIdToDeleteSuccess((current) => [...current, id])
                            alert(`Successfully deleted data from "${name}" patient`)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        console.log('error preload data service')
                        alert(`Successfully deleted data from "${name}" patient`)
                    })
            })
            .catch((err: any) => {
                alert('a server error has occurred.\nPlease try again later')
                console.log(err)
                setPatientsIdToDeleteFailed((current) => [...current, id])
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

    function onEditPatientRegis():void{
        setOnPopupSettings(false)
        setOnPopupEdit(true)
    }

    return (
        <>
            {/* popup edit */}
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

            {/* popup choose update */}
            {onPopupSettings && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={()=>setOnPopupSettings(false)}
                        title='Edit patient registration data?'
                        classIcon='text-color-default'
                        iconPopup={faPenToSquare}
                    >
                        <Button
                            nameBtn="Edit patient detail"
                            classBtn='hover:bg-white'
                            classLoading='hidden'
                            clickBtn={onEditPatientRegis}
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
                <TableBody>
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {/* load data */}
                    {currentTableData.length > 0 ? currentTableData.map((patient, index) => {
                        const cleanName = patient.data[0]?.name.replace(specialCharacter, '')
                        const namePatient = cleanName.replace(spaceString, '')

                        const pathUrlToDataDetail: string = `/patient/patient-registration/personal-data/not-yet-confirmed/${namePatient}/${patient.id}`
                        return (
                            <TableColumns
                                key={index}
                                idLoadingDelete={`loadDelete${patient.id}`}
                                idIconDelete={`iconDelete${patient.id}`}
                                clickBtn={() => toPage(pathUrlToDataDetail)}
                                clickEdit={(e) => {
                                    clickEdit(patient.id, patient.data[0]?.name)
                                    setOnPopupSettings(true)
                                    e?.stopPropagation()
                                }}
                                clickDelete={(e) => {
                                    clickDelete(patient.id, patient.data[0]?.name)
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