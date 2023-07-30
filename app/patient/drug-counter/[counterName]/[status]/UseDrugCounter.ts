'use client'

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react"
import { notFound, useRouter, useParams } from 'next/navigation'
import { DataOptionT, DataTableContentT } from "lib/types/FilterT"
import { HeadDataTableT, PopupSettings } from "lib/types/TableT.type"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { DrugCounterT, InfoLoketT, PatientFinishTreatmentT, PatientRegistrationT } from "lib/types/PatientT.types"
import { createDateFormat } from "lib/formats/createDateFormat"
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"
import { faBan, faPenToSquare, faPencil } from "@fortawesome/free-solid-svg-icons"
import { InputEditPatientCounter, SubmitConfirmDrugCounterT, SubmitDrugCounterT, SubmitFinishedTreatmentT } from "lib/types/InputT.type"
import { API, DataRequest } from "lib/api"
import { createHourFormat } from "lib/formats/createHourFormat"
import { authStore } from "lib/useZustand/auth"
import { AdminT } from "lib/types/AdminT.types"

type ParamsProps = {
    params: {
        counterName: string
        status: string
    }
    setOnPopupEdit?: Dispatch<SetStateAction<boolean>>
    setOnModalSettings: Dispatch<SetStateAction<PopupSettings>>
    onModalSettings: PopupSettings
}

export function UseDrugCounter({
    params,
    setOnModalSettings,
    onModalSettings,
    setOnPopupEdit
}: ParamsProps) {
    const currentDataStatus = useRef<PatientRegistrationT[]>([])
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [selectDate, setSelectDate] = useState<Date | undefined>()
    const [searchText, setSearchText] = useState<string>('')
    const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(false)
    const [indexActiveTableMenu, setIndexActiveTableMenu] = useState<number | null>(null)
    const [idLoadingCancelTreatment, setIdLoadingCancelTreatment] = useState<string[]>([])
    const [loadingIdPatientsDelete, setLoadingIdPatientsDelete] = useState<string[]>([])
    const [nameEditPatientCounter, setNameEditPatientCounter] = useState<string>('')
    const [idToEditPatientCounter, setIdToEditPatientCounter] = useState<string | null>(null)
    const [loadingIdSubmitEditPatientC, setLoadingIdSubmitEditPatientC] = useState<string[]>([])
    const [inputValueEditPatientC, setInputValueEditPatientC] = useState<InputEditPatientCounter>({
        patientId: '',
        loketName: '',
        message: '',
        adminEmail: '',
        queueNumber: '',
        submissionDate: '',
        submitHour: ''
    })
    const [value, setValue] = useState<string>('')
    const [editActiveManualQueue, setEditActiveManualQueue] = useState<boolean>(true)
    const [editActiveAutoQueue, setEditActiveAutoQueue] = useState<boolean>(false)
    const [disableUpdtQueue, setDisableUpdtQueue] = useState<string>('')
    const [onMsgCancelTreatment, setOnMsgCancelTreatment] = useState<boolean>(false)
    const [inputMsgCancelPatient, setInputMsgCancelPatient] = useState<string>('')
    const [errInputValueEditPatientC, setErrInputValueEditPatientC] = useState<InputEditPatientCounter>({} as InputEditPatientCounter)
    const [onPopupEditPatientCounter, setOnpopupEditPatientCounter] = useState<boolean>(false)
    const [selectEmailAdmin, setSelectEmailAdmin] = useState<DataOptionT>([
        {
            id: 'Select Admin',
            title: 'Select Admin'
        }
    ])
    const [selectCounter, setSelectCounter] = useState<DataOptionT>([
        {
            id: 'Select Counter',
            title: 'Select Counter'
        }
    ])
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
        dataFinishTreatment,
        dataConfirmationPatients,
        dataLoket,
        loadDataService,
        dataAdmin,
        pushTriggedErr
    } = ServicingHours()

    const { user } = authStore()
    const router = useRouter()
    const paramsRegistration = useParams()

    const loket = dataLoket?.find(loket => loket?.loketName === params?.counterName)
    const statusURL: ['waiting-patient', 'already-confirmed', 'expired-patient'] = [
        'waiting-patient',
        'already-confirmed',
        'expired-patient'
    ]
    const checkStatusUrl = statusURL?.find(status => status === params?.status)

    if (!paramsRegistration?.params?.includes('/personal-data')) {
        if (!loadDataService && !loket) {
            notFound()
        }
        if (!checkStatusUrl) {
            notFound()
        }
    }

    function findDataRegistration(
        dataPatientRegis: PatientRegistrationT[] | undefined,
        dataDrugCounter: DrugCounterT[] | undefined,
        dataLoket: InfoLoketT[] | undefined,
        dataFinishTreatment: PatientFinishTreatmentT[] | undefined
    ): void {
        if (
            !loadDataService &&
            Array.isArray(dataPatientRegis) &&
            dataPatientRegis.length > 0
        ) {
            const patientWaiting = dataPatientRegis.filter((patient => {
                // finished treatment
                const findPatientFT = dataFinishTreatment?.find(patientFT =>
                    patientFT.patientId === patient.id
                )
                // patient counter
                const findPatientCounter = dataDrugCounter?.find(patientC =>
                    patientC?.patientId === patient.id &&
                    patientC?.loketInfo?.loketId === loket?.id &&
                    patientC?.isConfirm?.confirmState === false &&
                    patientC?.submissionDate?.submissionDate === createDateFormat(new Date())
                )
                return findPatientCounter && !findPatientFT
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
                // finished treatment
                const findPatientFT = dataFinishTreatment?.find(patientFT =>
                    patientFT.patientId === patient.id
                )
                const loket = dataLoket?.find(loket => loket.loketName === params.counterName)
                // patient counter
                const findPatientCounter = dataDrugCounter?.find(patientC =>
                    patientC?.patientId === patient.id &&
                    patientC?.loketInfo?.loketId === loket?.id &&
                    patientC?.isConfirm?.confirmState === false &&
                    patientC?.submissionDate?.submissionDate < createDateFormat(new Date())
                )
                return findPatientCounter && !findPatientFT
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
                        // find patient be passed
                        const isPatientSkipped: 'Skipped' | null = patientCounter?.isConfirm?.isSkipped ? 'Skipped' : null

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
                                    firstDesc: status.toUpperCase(),
                                    name: isPatientSkipped ? `(${isPatientSkipped})` : '',
                                    color: colorStatus,
                                    colorName: '#777',
                                    fontSize: '12px',
                                    fontWeightFirstDesc: 'bold',
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
            dataFinishTreatment,
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
        const findItem = patient.data.filter(data =>
            data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()) ||
            data?.firstDesc?.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase())
        )

        return findItem.length > 0
    })

    useEffect(() => {
        setCurrentPage(1)
    }, [searchText])

    const pageSize: number = 5
    const currentTableData = useMemo((): DataTableContentT[] => {
        const firstPageIndex = (currentPage - 1) * pageSize
        const lastPageIndex = firstPageIndex + pageSize
        return filterText.slice(firstPageIndex, lastPageIndex)
    }, [filterText, currentPage])

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

    const lastPage: number = filterText.length < 5 ? 1 : Math.ceil(filterText.length / pageSize)
    const maxLength: number = 7

    const handleSearchText = (e?: ChangeEvent<HTMLInputElement>): void => {
        setSearchText(e?.target.value as string)
        setCurrentPage(1)
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

    const defaultCtgOptions = (): void => {
        const elem = document.getElementById('sortByFilter') as HTMLSelectElement
        if (elem) {
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

    function clickColumnMenu(index: number): void {
        if (index === indexActiveTableMenu) {
            setIndexActiveTableMenu(null)
        } else {
            setIndexActiveTableMenu(index)
        }
    }

    function clickEditPatientCounter(
        patientId: string,
        patientName: string
    ): void {
        const findPatient = dataDrugCounter?.find(patient => patient.patientId === patientId)
        if (findPatient) {
            const {
                patientId,
                loketInfo,
                message,
                adminInfo,
                submissionDate
            } = findPatient

            const loket = dataLoket?.find(lokets => lokets.id === loketInfo.loketId)
            const admin = dataAdmin?.find(admins => admins.id === adminInfo.adminId)
            setInputValueEditPatientC({
                patientId,
                loketName: loket?.loketName as string,
                message,
                adminEmail: admin?.email as string,
                submissionDate: submissionDate.submissionDate,
                submitHour: submissionDate.submitHours,
                queueNumber: findPatient.queueNumber
            })
            setValue(message)
            setNameEditPatientCounter(patientName)
            setIdToEditPatientCounter(patientId)

            const patientFT = dataFinishTreatment?.find(patient => patient.patientId === patientId)

            const checkExpiredPatient: boolean = (new Date(findPatient?.submissionDate?.submissionDate)).valueOf() < (new Date(createDateFormat(new Date()))).valueOf()
            if (!patientFT && checkExpiredPatient) {
                setDisableUpdtQueue(`Can't update queue number because it expired`)
            } else if (patientFT) {
                setDisableUpdtQueue('Can not update the number because the treatment process has been completed')
            }

            setTimeout(() => {
                loadDataAdmin()
                loadDataCounter()
            }, 0);
        } else {
            alert('an error occurred, please try again or reload the page')
        }
    }

    useEffect(() => {
        setInputValueEditPatientC({
            ...inputValueEditPatientC,
            message: value
        })
    }, [value])

    function loadDataAdmin(): void {
        if (Array.isArray(dataAdmin) && dataAdmin.length > 0) {
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

    function loadDataCounter(): void {
        if (Array.isArray(dataLoket) && dataLoket.length > 0) {
            const newSelectLoket = dataLoket?.map(loket => ({
                id: loket.loketName,
                title: loket.loketName
            }))
            setSelectCounter([
                {
                    id: 'Select Counter',
                    title: 'Select Counter'
                },
                ...newSelectLoket
            ])
        }
    }

    function openPopupEdit(): void {
        setOnModalSettings({
            clickClose: () => setOnModalSettings({} as PopupSettings),
            title: 'What do you want to edit?',
            classIcon: 'text-font-color-2',
            iconPopup: faPenToSquare,
            actionsData: [
                {
                    nameBtn: 'Edit patient detail',
                    classBtn: 'hover:bg-white',
                    classLoading: 'hidden',
                    clickBtn: () => {
                        if (typeof setOnPopupEdit !== 'undefined') {
                            setOnPopupEdit(true)
                        }
                        setOnModalSettings({} as PopupSettings)
                    },
                    styleBtn: {
                        padding: '0.5rem',
                        marginRight: '0.5rem',
                        marginTop: '0.5rem'
                    }
                },
                {
                    nameBtn: 'Edit Counter',
                    classBtn: 'bg-orange border-orange hover:border-orange hover:bg-white hover:text-orange',
                    classLoading: 'hidden',
                    clickBtn: () => {
                        setOnpopupEditPatientCounter(true)
                        setOnModalSettings({} as PopupSettings)
                    },
                    styleBtn: {
                        padding: '0.5rem',
                        marginRight: '0.5rem',
                        marginTop: '0.5rem'
                    }
                },
                {
                    nameBtn: 'Cancel',
                    classBtn: 'bg-white border-none',
                    classLoading: 'hidden',
                    clickBtn: () => setOnModalSettings({} as PopupSettings),
                    styleBtn: {
                        padding: '0.5rem',
                        marginRight: '0.5rem',
                        marginTop: '0.5rem',
                        color: '#495057',
                    }
                },
            ]
        })
    }

    function closePopupEditPatientC(): void {
        setOnpopupEditPatientCounter(!onPopupEditPatientCounter)
    }

    function changeEditPatientC(e: ChangeEvent<HTMLInputElement>): void {
        setInputValueEditPatientC({
            ...inputValueEditPatientC,
            [e.target.name]: e.target.value
        })

        setErrInputValueEditPatientC({
            ...errInputValueEditPatientC,
            [e.target.name]: ''
        })
    }

    function handleSelectCounter(
        idElement: 'selectCounterEdit' | 'selectAdminCounter',
        nameInput: 'loketName' | 'adminEmail'
    ): void {
        const elem = document.getElementById(idElement) as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        setInputValueEditPatientC({
            ...inputValueEditPatientC,
            [nameInput]: value
        })
    }

    function handleChangeDate(
        e: ChangeEvent<HTMLInputElement> | Date | undefined,
        inputName: "submissionDate"
    ): void {
        if (!e) {
            return
        }
        setInputValueEditPatientC({
            ...inputValueEditPatientC,
            [inputName]: `${createDateFormat(e as Date)}`
        })
    }

    function activeSelectEditCounter(
        idElement: 'selectCounterEdit' | 'selectAdminCounter',
        indexActive: number
    ): void {
        const element = document.getElementById(idElement) as HTMLSelectElement
        if (element && indexActive !== -1) {
            element.selectedIndex = indexActive
        }
    }

    function activeSelectCounter(): void {
        if (selectCounter.length > 0) {
            const findIndexCounter = selectCounter.findIndex(counter => counter.id === inputValueEditPatientC.loketName)
            activeSelectEditCounter('selectCounterEdit', findIndexCounter)
        }
    }

    function activeSelectAdmin(): void {
        if (selectEmailAdmin.length > 0) {
            const findIndexAdmin = selectEmailAdmin.findIndex(admins => admins.id === inputValueEditPatientC.adminEmail)
            activeSelectEditCounter('selectAdminCounter', findIndexAdmin)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            activeSelectCounter()
            activeSelectAdmin()
        }, 500);
    }, [onPopupEditPatientCounter, inputValueEditPatientC, selectEmailAdmin])

    function submitEditPatientCounter(): void {
        const findLoadingId = loadingIdSubmitEditPatientC.find(id => id === idToEditPatientCounter)
        if (!findLoadingId && validateFormEdit()) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `update patient counter data "${nameEditPatientCounter}"?`,
                classIcon: 'text-font-color-2',
                iconPopup: faPencil,
                actionsData: [
                    {
                        nameBtn: 'Save',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => nextSubmitEditPatientCounter(),
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.5rem',
                            marginTop: '0.5rem'
                        }
                    },
                    {
                        nameBtn: 'Cancel',
                        classBtn: 'bg-white border-none',
                        classLoading: 'hidden',
                        clickBtn: () => setOnModalSettings({} as PopupSettings),
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057',
                        }
                    },
                ]
            })
        }
    }

    function validateFormEdit(): string | undefined {
        let err = {} as InputEditPatientCounter

        if (!inputValueEditPatientC.patientId.trim()) {
            err.patientId = 'Must be required'
        }
        if (!inputValueEditPatientC.loketName.trim()) {
            err.loketName = 'Must be required'
        }
        if (!inputValueEditPatientC.message.trim()) {
            err.message = 'Must be required'
        }
        if (!inputValueEditPatientC.adminEmail.trim()) {
            err.adminEmail = 'Must be required'
        }
        if (!inputValueEditPatientC.submissionDate.trim()) {
            err.submissionDate = 'Must be required'
        }
        if (!inputValueEditPatientC.submitHour.trim()) {
            err.submitHour = 'Must be required'
        }
        if (!inputValueEditPatientC.queueNumber.trim()) {
            err.queueNumber = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputValueEditPatientC(err)
            return
        }

        return 'success'
    }

    function nextSubmitEditPatientCounter(): void {
        setOnModalSettings({} as PopupSettings)
        const currentPatientC = dataDrugCounter?.find(patient => patient.patientId === idToEditPatientCounter)
        setLoadingIdSubmitEditPatientC((current) => [idToEditPatientCounter as string, ...current])

        API().APIPutPatientData(
            'drug-counter',
            currentPatientC?.id as string,
            dataSubmitEditPatientC()
        )
            .then(res => {
                const findLoadingId = loadingIdSubmitEditPatientC.filter(id => id !== res?.patientId)
                setLoadingIdSubmitEditPatientC(findLoadingId)
                alert('Update patient counter successfully')
            })
            .catch(err => pushTriggedErr(`A server error occurred. occurs when updating patient counter data. please try again`))
    }

    function dataSubmitEditPatientC(): SubmitConfirmDrugCounterT {
        const loket = dataLoket?.find(lokets => lokets.loketName === inputValueEditPatientC.loketName)
        const admin = dataAdmin?.find(admins => admins.email === inputValueEditPatientC.adminEmail)
        const currentPatientC = dataDrugCounter?.find(patient => patient.patientId === idToEditPatientCounter)

        const findPatientToday = dataDrugCounter?.filter(patient => {
            const date = patient.submissionDate.submissionDate === createDateFormat(new Date())
            return date &&
                patient.loketInfo.loketId === loket?.id &&
                patient.patientId !== currentPatientC?.patientId
        })
        const sortQueueNumber: DrugCounterT[] | null =
            Array.isArray(findPatientToday) &&
                findPatientToday.length > 0 ? findPatientToday.sort((a, b) => Number(b.queueNumber) - Number(a.queueNumber)) : null

        const queueNumber: string =
            editActiveAutoQueue ?
                Array.isArray(sortQueueNumber) &&
                    sortQueueNumber.length > 0
                    ? `${Number(sortQueueNumber[0].queueNumber) + 1}` : '1' : inputValueEditPatientC.queueNumber

        if (!currentPatientC?.isConfirm?.confirmState) {
            return dataNotConfirmYet(
                admin,
                queueNumber,
                currentPatientC,
                loket
            )
        } else {
            return dataAlreadyConfirm(
                admin,
                queueNumber,
                currentPatientC,
                loket
            )
        }
    }

    function dataNotConfirmYet(
        admin: AdminT | undefined,
        queueNumber: string,
        currentPatientC: DrugCounterT | undefined,
        loket: InfoLoketT | undefined
    ): SubmitConfirmDrugCounterT {
        return {
            patientId: inputValueEditPatientC.patientId,
            loketInfo: { loketId: loket?.id as string },
            message: inputValueEditPatientC.message,
            adminInfo: { adminId: admin?.id as string },
            submissionDate: {
                submissionDate: inputValueEditPatientC.submissionDate,
                submitHours: inputValueEditPatientC.submitHour
            },
            queueNumber: queueNumber,
            isConfirm: {
                confirmState: currentPatientC?.isConfirm?.confirmState as boolean,
                isSkipped: typeof currentPatientC?.isConfirm?.isSkipped !== 'undefined' ? currentPatientC?.isConfirm?.isSkipped : false
            }
        }
    }

    function dataAlreadyConfirm(
        admin: AdminT | undefined,
        queueNumber: string,
        currentPatientC: DrugCounterT | undefined,
        loket: InfoLoketT | undefined
    ): SubmitConfirmDrugCounterT {
        return {
            patientId: inputValueEditPatientC.patientId,
            loketInfo: { loketId: loket?.id as string },
            message: inputValueEditPatientC.message,
            adminInfo: { adminId: admin?.id as string },
            submissionDate: {
                submissionDate: inputValueEditPatientC.submissionDate,
                submitHours: inputValueEditPatientC.submitHour
            },
            queueNumber: queueNumber,
            isConfirm: {
                confirmState: currentPatientC?.isConfirm?.confirmState as boolean,
                isSkipped: typeof currentPatientC?.isConfirm?.isSkipped !== 'undefined' ? currentPatientC?.isConfirm?.isSkipped : false,
                dateConfirm: currentPatientC?.isConfirm.dateConfirm,
                adminInfo: currentPatientC?.isConfirm?.adminInfo,
                paymentInfo: {
                    paymentMethod: currentPatientC?.isConfirm?.paymentInfo?.paymentMethod as 'cash',
                    bpjsNumber: currentPatientC?.isConfirm?.paymentInfo?.bpjsNumber as string,
                    totalCost: currentPatientC?.isConfirm?.paymentInfo?.totalCost as string,
                    message: currentPatientC?.isConfirm?.paymentInfo?.message as string
                },
            }
        }
    }

    function toggleChangeManualQueue(): void {
        setEditActiveManualQueue(!editActiveManualQueue)
        setEditActiveAutoQueue(false)

        changeActiveToggle('setAutoNumberC', false)

        const findPatient = dataDrugCounter?.find(patient => patient.patientId === idToEditPatientCounter)
        setInputValueEditPatientC({
            ...inputValueEditPatientC,
            queueNumber: findPatient?.queueNumber as string
        })
    }

    function changeActiveToggle(idElement: string, checked: boolean): void {
        const toggleManual = document.getElementById(idElement) as HTMLInputElement
        if (toggleManual) {
            toggleManual.checked = checked
        }
    }

    function toggleSetAutoQueue(): void {
        setEditActiveManualQueue(true)
        setEditActiveAutoQueue(!editActiveAutoQueue)

        changeActiveToggle('toggle', false)

        const findPatient = dataDrugCounter?.find(patient => patient.patientId === idToEditPatientCounter)
        setInputValueEditPatientC({
            ...inputValueEditPatientC,
            queueNumber: findPatient?.queueNumber as string
        })
    }

    function clickCancelTreatment(
        patientId: string,
        patientName: string
    ): void {
        const findLoadingId = idLoadingCancelTreatment.find(id => id === patientId)
        if (!findLoadingId) {
            setIndexActiveTableMenu(null)
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `Cancel treatment from "${patientName}"?`,
                classIcon: 'text-font-color-2',
                iconPopup: faBan,
                patientId: patientId,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => nextCancelTreatment(),
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.6rem',
                            marginTop: '0.5rem'
                        }
                    },
                    {
                        nameBtn: 'Cancel',
                        classBtn: 'bg-white border-none',
                        classLoading: 'hidden',
                        clickBtn: () => setOnModalSettings({} as PopupSettings),
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057',
                        }
                    },
                ]
            })
        }
    }

    function nextCancelTreatment(): void {
        setOnMsgCancelTreatment(true)
    }

    function cancelOnMsgCancelPatient(): void {
        setOnMsgCancelTreatment(false)
    }

    function handleCancelMsg(e: ChangeEvent<HTMLInputElement>): void {
        setInputMsgCancelPatient(e.target.value)
    }

    function submitCancelTreatment(): void {
        if (inputMsgCancelPatient.length > 0) {
            setIdLoadingCancelTreatment((current) => [onModalSettings?.patientId as string, ...current])
            setOnModalSettings({} as PopupSettings)
            setOnMsgCancelTreatment(false)
            pushCancelTreatment()
        }
    }

    function pushCancelTreatment(): void {
        const data: SubmitFinishedTreatmentT = {
            patientId: onModalSettings?.patientId as string,
            confirmedTime: {
                dateConfirm: createDateFormat(new Date),
                confirmHour: createHourFormat(new Date())
            },
            adminInfo: {
                adminId: user.user?.id as string
            },
            isCanceled: true,
            messageCancelled: inputMsgCancelPatient
        }

        API().APIPostPatientData(
            'finished-treatment',
            data
        )
            .then(res => {
                const removeIdLoading = idLoadingCancelTreatment.filter(id => id !== res?.patientId)
                setIdLoadingCancelTreatment(removeIdLoading)

                const findPatientRegis = dataPatientRegis?.find(patient => patient.id === res?.patientId)
                const getName = findPatientRegis?.patientName?.replace(specialCharacter, '')?.replace(spaceString, '')
                const queueNumber = dataDrugCounter?.find(patient => patient.patientId === res?.patientId)?.queueNumber

                setTimeout(() => {
                    router.push(`/patient/patient-registration/personal-data/confirmed/${getName}/${findPatientRegis?.id}/counter/${params.counterName}/not-yet-confirmed/${queueNumber}`)
                }, 0)
            })
            .catch(err => pushTriggedErr('a server error occurred while canceling the patient. please try again'))
    }

    function clickDeletePatient(
        patientId: string,
        patientName: string
    ): void {
        const findLoadingId = loadingIdPatientsDelete.find(id => id === patientId)
        if (!findLoadingId) {
            setIndexActiveTableMenu(null)
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'What do you want to delete?',
                classIcon: 'text-font-color-2',
                iconPopup: faBan,
                actionsData: [
                    {
                        nameBtn: 'All data',
                        classBtn: 'bg-orange hover:bg-white border-orange hover:border-orange hover:text-orange',
                        classLoading: 'hidden',
                        clickBtn: () => clickDeleteAllData(patientId, patientName),
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.5rem',
                            marginTop: '0.5rem'
                        }
                    },
                    {
                        nameBtn: params.status !== 'already-confirmed' ? 'Patient counter' : 'Patient treatment data',
                        classBtn: 'bg-pink-old hover:bg-white border-pink-old hover:border-pink-old hover:text-pink-old',
                        classLoading: 'hidden',
                        clickBtn: () => {
                            if (params.status !== 'already-confirmed') {
                                clickDeletePatientCounter(patientId, patientName)
                                return
                            }
                            clickDeleteFinishedTreatment(patientId, patientName)
                        },
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.5rem',
                            marginTop: '0.5rem'
                        }
                    },
                    {
                        nameBtn: 'Cancel',
                        classBtn: 'bg-white border-none',
                        classLoading: 'hidden',
                        clickBtn: () => setOnModalSettings({} as PopupSettings),
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057',
                        }
                    },
                ]
            })
        }
    }

    function clickDeleteAllData(
        patientId: string,
        patientName: string
    ): void {
        setOnModalSettings({
            clickClose: () => setOnModalSettings({} as PopupSettings),
            title: `Delete all data from patient "${patientName}"?`,
            classIcon: 'text-font-color-2',
            iconPopup: faBan,
            actionsData: [
                {
                    nameBtn: 'Yes',
                    classBtn: 'hover:bg-white',
                    classLoading: 'hidden',
                    clickBtn: () => confirmDeleteAllData(patientId),
                    styleBtn: {
                        padding: '0.5rem',
                        marginRight: '0.5rem',
                        marginTop: '0.5rem'
                    }
                },
                {
                    nameBtn: 'Cancel',
                    classBtn: 'bg-white border-none',
                    classLoading: 'hidden',
                    clickBtn: () => setOnModalSettings({} as PopupSettings),
                    styleBtn: {
                        padding: '0.5rem',
                        marginRight: '0.5rem',
                        marginTop: '0.5rem',
                        color: '#495057',
                    }
                },
            ]
        })
    }

    function confirmDeleteAllData(patientId: string): void {
        setOnModalSettings({} as PopupSettings)
        setLoadingIdPatientsDelete((current) => [patientId, ...current])
        const idDocumentCounter = dataDrugCounter?.find(patient => patient.patientId === patientId)?.id
        const idDocumentConfirmPatient = dataConfirmationPatients?.find(patient => patient.patientId === patientId)?.id

        API().APIDeletePatientData(
            'drug-counter',
            idDocumentCounter as string,
            patientId
        )
            .then(res => {
                return API().APIDeletePatientData(
                    'confirmation-patients',
                    idDocumentConfirmPatient as string,
                    patientId
                )
            })
            .then(res => {
                return API().APIDeletePatientData(
                    'patient-registration',
                    patientId,
                    patientId
                )
            })
            .then(res => {
                const newRes = res as { [key: string]: any }
                const removeIdLoading = loadingIdPatientsDelete.filter(id => id !== newRes?.patientId)
                setLoadingIdPatientsDelete(removeIdLoading)
                alert('Successfully deleted patient data')
            })
            .catch(err => pushTriggedErr(`A server error occurred. occurs when deleting patient counter data. please try again`))
    }

    function clickDeletePatientCounter(
        patientId: string,
        patientName: string
    ): void {
        setOnModalSettings({
            clickClose: () => setOnModalSettings({} as PopupSettings),
            title: `Delete counter data from patient "${patientName}"?`,
            classIcon: 'text-font-color-2',
            iconPopup: faBan,
            actionsData: [
                {
                    nameBtn: 'Yes',
                    classBtn: 'hover:bg-white',
                    classLoading: 'hidden',
                    clickBtn: () => confirmDeletePatientCounter(patientId),
                    styleBtn: {
                        padding: '0.5rem',
                        marginRight: '0.5rem',
                        marginTop: '0.5rem'
                    }
                },
                {
                    nameBtn: 'Cancel',
                    classBtn: 'bg-white border-none',
                    classLoading: 'hidden',
                    clickBtn: () => setOnModalSettings({} as PopupSettings),
                    styleBtn: {
                        padding: '0.5rem',
                        marginRight: '0.5rem',
                        marginTop: '0.5rem',
                        color: '#495057',
                    }
                },
            ]
        })
    }

    function confirmDeletePatientCounter(patientId: string): void {
        setOnModalSettings({} as PopupSettings)
        setLoadingIdPatientsDelete((current) => [patientId, ...current])
        const idDocumentCounter = dataDrugCounter?.find(patient => patient.patientId === patientId)?.id

        API().APIDeletePatientData(
            'drug-counter',
            idDocumentCounter as string,
            patientId
        )
            .then(res => {
                const newRes = res as { [key: string]: any }
                const removeIdLoading = loadingIdPatientsDelete.filter(id => id !== newRes?.patientId)
                setLoadingIdPatientsDelete(removeIdLoading)
                alert('Successfully deleted patient data')
            })
            .catch(err => pushTriggedErr(`A server error occurred. occurs when deleting patient counter data. please try again`))
    }

    function clickDeleteFinishedTreatment(
        patientId: string,
        patientName: string
    ): void {
        setOnModalSettings({
            clickClose: () => setOnModalSettings({} as PopupSettings),
            title: `Delete treatment data from patient "${patientName}"?`,
            classIcon: 'text-font-color-2',
            iconPopup: faBan,
            actionsData: [
                {
                    nameBtn: 'Yes',
                    classBtn: 'hover:bg-white',
                    classLoading: 'hidden',
                    clickBtn: () => confirmDeletePatientTreatment(patientId),
                    styleBtn: {
                        padding: '0.5rem',
                        marginRight: '0.5rem',
                        marginTop: '0.5rem'
                    }
                },
                {
                    nameBtn: 'Cancel',
                    classBtn: 'bg-white border-none',
                    classLoading: 'hidden',
                    clickBtn: () => setOnModalSettings({} as PopupSettings),
                    styleBtn: {
                        padding: '0.5rem',
                        marginRight: '0.5rem',
                        marginTop: '0.5rem',
                        color: '#495057',
                    }
                },
            ]
        })
    }

    function confirmDeletePatientTreatment(patientId: string): void {
        setOnModalSettings({} as PopupSettings)
        setLoadingIdPatientsDelete((current) => [patientId, ...current])
        const idDocumentFinishTreatment = dataFinishTreatment?.find(patient => patient.patientId === patientId)?.id
        const currentPatientC = dataDrugCounter?.find(patient => patient.patientId === patientId)

        API().APIDeletePatientData(
            'finished-treatment',
            idDocumentFinishTreatment as string,
            patientId
        )
            .then(res => {
                if (!currentPatientC) {
                    pushTriggedErr(`Not found patient counter with id "${patientId}"`)
                    return
                }
                return API().APIPutPatientData(
                    'drug-counter',
                    currentPatientC?.id as string,
                    dataEditPatientCounter(currentPatientC as DrugCounterT)
                )
            })
            .then(res => {
                const removeIdLoading = loadingIdPatientsDelete.filter(id => id !== res?.patientId)
                setLoadingIdPatientsDelete(removeIdLoading)
                alert('Successfully deleted patient data')
            })
            .catch(err => pushTriggedErr(`A server error occurred. occurs when deleting patient treatment data. please try again`))
    }

    function dataEditPatientCounter(patientCounter: DrugCounterT): SubmitConfirmDrugCounterT {
        const {
            patientId,
            loketInfo,
            message,
            adminInfo,
            submissionDate,
            queueNumber,
            isConfirm
        } = patientCounter
        return {
            patientId,
            loketInfo,
            message,
            adminInfo,
            submissionDate,
            queueNumber,
            isConfirm: {
                confirmState: false,
                isSkipped: typeof isConfirm?.isSkipped !== 'undefined' ? isConfirm?.isSkipped : false
            }
        }
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
        handleSortCategory,
        clickColumnMenu,
        indexActiveTableMenu,
        setIndexActiveTableMenu,
        idLoadingCancelTreatment,
        loadingIdPatientsDelete,
        onModalSettings,
        openPopupEdit,
        setOnModalSettings,
        clickEditPatientCounter,
        closePopupEditPatientC,
        onPopupEditPatientCounter,
        changeEditPatientC,
        handleSelectCounter,
        handleChangeDate,
        inputValueEditPatientC,
        errInputValueEditPatientC,
        selectCounter,
        selectEmailAdmin,
        setValue,
        value,
        submitEditPatientCounter,
        idToEditPatientCounter,
        loadingIdSubmitEditPatientC,
        editActiveManualQueue,
        toggleChangeManualQueue,
        toggleSetAutoQueue,
        disableUpdtQueue,
        nameEditPatientCounter,
        clickCancelTreatment,
        onMsgCancelTreatment,
        cancelOnMsgCancelPatient,
        handleCancelMsg,
        submitCancelTreatment,
        inputMsgCancelPatient,
        clickDeletePatient,
        setOnpopupEditPatientCounter
    }
}