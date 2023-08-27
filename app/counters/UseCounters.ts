'use client'

import { useState, useEffect, useMemo, ChangeEvent, Dispatch, SetStateAction } from 'react'
import ServicingHours from 'lib/dataInformation/ServicingHours'
import { AlertsT, HeadDataTableT, PopupSettings } from 'lib/types/TableT.type'
import { InfoLoketT } from 'lib/types/PatientT.types'
import { DataOptionT, DataTableContentT } from 'lib/types/FilterT'
import { specialCharacter } from 'lib/regex/specialCharacter'
import { spaceString } from 'lib/regex/spaceString'
import { InputAddCounterT, InputEditCounterT, InputSubmitAddCounterT, SubmitInputEditCounterT } from 'lib/types/InputT.type'
import { faBan, faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import { API } from 'lib/api'
import { navigationStore } from 'lib/useZustand/navigation'
import { createDateFormat } from 'lib/formats/createDateFormat'
import { createHourFormat } from 'lib/formats/createHourFormat'

type Props = {
    setOnModalSettings?: Dispatch<SetStateAction<PopupSettings>>
}

export function UseCounters({
    setOnModalSettings
}: Props) {
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [searchText, setSearchText] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [indexActiveColumnMenu, setIndexActiveColumnMenu] = useState<number | null>(null)
    const [onAddCounter, setOnAddCounter] = useState<boolean>(false)
    const [inputAddCounter, setInputAddCounter] = useState<InputAddCounterT>({
        loketName: '',
        counterType: 'Select Payment Method',
        roomActive: 'Select Room Active'
    })
    const [errInputAddCounter, setErrInputAddCounter] = useState<InputAddCounterT>({} as InputAddCounterT)
    const [loadingSubmitAddCounter, setLoadingSubmitAddCounter] = useState<boolean>(false)
    const [inputEditCounter, setInputEditCounter] = useState<InputEditCounterT>({
        loketName: '',
        counterType: 'Select Payment Method',
        procurementDate: '',
        procurementHours: '',
        roomActive: 'Select Room Active'
    })
    const [errInputEditCounter, setErrInputEditCounter] = useState<InputEditCounterT>({} as InputEditCounterT)
    const [idEditCounter, setIdEditCounter] = useState<string | null>(null)
    const [counterName, setCounterName] = useState<string>('')
    const [onEditCounter, setOnEditCounter] = useState<boolean>(false)
    const [loadingIdEditCounter, setLoadingIdEditCounter] = useState<string[]>([])
    const [loadingDeleteId, setLoadingDeleteId] = useState<string[]>([])

    const {
        loadDataService,
        dataLoket,
        pushTriggedErr
    } = ServicingHours()

    const { setOnAlerts } = navigationStore()

    const head: HeadDataTableT = [
        {
            name: 'Counter Name'
        },
        {
            name: 'Counter Type'
        },
        {
            name: 'Procurement Date'
        },
        {
            name: 'Procurement Hours'
        },
        {
            name: 'Room Active'
        },
        {
            name: 'Id'
        },
        {
            name: 'Action'
        }
    ]

    const counterTypeOpt: DataOptionT = [
        {
            id: 'Select Payment Method',
            title: 'Select Payment Method'
        },
        {
            id: 'cash',
            title: 'cash'
        },
        {
            id: 'BPJS',
            title: 'BPJS'
        },
    ]
    const roomActiveOpt: DataOptionT = [
        {
            id: 'Select Room Active',
            title: 'Select Room Active'
        },
        {
            id: 'Active',
            title: 'Active'
        },
        {
            id: 'Not Active',
            title: 'Not Active'
        }
    ]

    function loadGetDataLoket(
        dataLoket: InfoLoketT[]
    ): void {
        const loket: DataTableContentT[] = dataLoket.map(item => ({
            id: item.id,
            data: [
                {
                    name: item.loketName
                },
                {
                    name: item?.counterType ?? '-'
                },
                {
                    name: item?.dates?.procurementDate ?? ''
                },
                {
                    name: item?.dates?.procurementHours ?? '-'
                },
                {
                    name: item?.roomActive ?? '-'
                },
                {
                    name: item.id
                },
                {
                    name: ''
                }
            ]
        }))
        setDataColumns(loket)
    }

    useEffect(() => {
        if (
            !loadDataService &&
            Array.isArray(dataLoket) &&
            dataLoket.length > 0
        ) {
            loadGetDataLoket(dataLoket)
        }
    }, [loadDataService, dataLoket])

    const filterText: DataTableContentT[] = dataColumns.length > 0 ? dataColumns.filter(loket => {
        const names = loket.data.filter(loketData => loketData.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))
        return names.length > 0
    }) : []

    const pageSize: number = 5

    const currentTableData = useMemo((): DataTableContentT[] => {
        const firstPageIndex = (currentPage - 1) * pageSize
        const lastPageIndex = firstPageIndex + pageSize
        return filterText.slice(firstPageIndex, lastPageIndex)
    }, [filterText, currentPage])

    useMemo(() => {
        setCurrentPage(1)
    }, [searchText])

    const lastPage: number = filterText.length < 5 ? 1 : Math.ceil(filterText.length / pageSize)
    const maxLength: number = 7

    function handleSearchText(e?: ChangeEvent<HTMLInputElement>): void {
        setSearchText(e?.target?.value as string)
    }

    function clickCloseSearchTxt(): void {
        setSearchText('')
        setCurrentPage(1)
    }

    function clickNewCounter(): void {
        setOnAddCounter(!onAddCounter)
    }

    function changeInputAddCounter(e: ChangeEvent<HTMLInputElement>): void {
        setInputAddCounter({
            ...inputAddCounter,
            [e.target.name]: e.target.value
        })
        setErrInputAddCounter({
            ...errInputAddCounter,
            [e.target.name]: ''
        })
    }

    function submitAddCounter(): void {
        if (
            !loadingSubmitAddCounter &&
            validateSubmitAddCounter() &&
            typeof setOnModalSettings === 'function'
        ) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'Add Counter?',
                classIcon: 'text-font-color-2',
                iconPopup: faPlus,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmSubmitAddCounter(),
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
                            marginTop: '0.5rem',
                            color: '#495057'
                        }
                    }
                ]
            })
        }
    }

    function validateSubmitAddCounter(): string | undefined {
        let err = {} as InputAddCounterT
        if (!inputAddCounter.loketName.trim()) {
            err.loketName = 'Must be required'
        }
        if (inputAddCounter.counterType === 'Select Payment Method') {
            err.counterType = 'Must be required'
        }
        if (inputAddCounter.roomActive === 'Select Room Active') {
            err.roomActive = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputAddCounter(err)
            return
        }
        return 'success'
    }

    function confirmSubmitAddCounter(): void {
        setLoadingSubmitAddCounter(true)
        if (typeof setOnModalSettings === 'function') {
            setOnModalSettings({} as PopupSettings)
        }
        API().APIPostPatientData(
            'info-loket',
            dataSubmitAddCounter()
        )
            .then(res => {
                setLoadingSubmitAddCounter(false)
                setInputAddCounter({} as InputAddCounterT)
                setOnAlerts({
                    onAlert: true,
                    title: 'Successful add counter',
                    desc: 'New counter has been added'
                })
                setTimeout(() => {
                    setOnAlerts({} as AlertsT)
                }, 3000);
                window.location.reload()
            })
            .catch(err => pushTriggedErr('A server error occurred. Happens when adding a counter. Please try again'))
    }

    function dataSubmitAddCounter(): InputSubmitAddCounterT {
        const {
            loketName,
            counterType,
            roomActive
        } = inputAddCounter
        return {
            id: `${new Date().getTime()}`,
            loketName,
            counterType: counterType as 'BPJS',
            dates: {
                procurementDate: createDateFormat(new Date()),
                procurementHours: createHourFormat(new Date())
            },
            roomActive: roomActive as 'Active'
        }
    }

    function clickColumnMenu(index: number): void {
        if (indexActiveColumnMenu === index) {
            setIndexActiveColumnMenu(null)
        } else {
            setIndexActiveColumnMenu(index)
        }
    }

    function clickEdit(
        id: string,
        counterName: string
    ): void {
        const findLoket = dataLoket?.find(loket => loket.id === id)
        if (findLoket) {
            const {
                counterType,
                dates,
                roomActive
            } = findLoket
            setCounterName(counterName)
            setIndexActiveColumnMenu(null)
            setIdEditCounter(id)
            setOnEditCounter(true)
            const newCounterType = typeof counterType !== 'undefined' ? counterType : 'Select Payment Method'
            const newRoomActive = roomActive ?? 'Select Room Active'
            setInputEditCounter({
                loketName: counterName,
                counterType: newCounterType,
                procurementDate: dates?.procurementDate ?? '',
                procurementHours: dates?.procurementHours ?? '',
                roomActive: newRoomActive
            })
            setTimeout(() => {
                activeIndexSelect('optCounterType', getIndexCounterType(newCounterType))
                activeIndexSelect('optRoomActive', getIndexRoomActive(newRoomActive))
            }, 0);
        } else {
            setOnAlerts({
                onAlert: true,
                title: 'Counter not found',
                desc: 'Please reload the browser'
            })
            setTimeout(() => {
                setOnAlerts({} as AlertsT)
            }, 3000);
        }
    }

    function getIndexCounterType(value: 'BPJS' | 'cash' | 'Select Payment Method'): number {
        const findIndex = counterTypeOpt.findIndex(item => item.id === value)
        return findIndex
    }

    function getIndexRoomActive(value: 'Active' | 'Not Active' | 'Select Room Active'): number {
        const findIndex = roomActiveOpt.findIndex(item => item.id === value)
        return findIndex
    }

    function activeIndexSelect(
        elementId: 'optCounterType' | 'optRoomActive',
        index: number
    ): void {
        const elem = document.getElementById(elementId) as HTMLSelectElement
        if (elem) {
            elem.selectedIndex = index
        }
    }

    function clickCloseEditCounter(): void {
        setOnEditCounter(false)
    }

    function changeInputEditCounter(e: ChangeEvent<HTMLInputElement>): void {
        setInputEditCounter({
            ...inputEditCounter,
            [e.target.name]: e.target.value
        })
        setErrInputEditCounter({
            ...errInputEditCounter,
            [e.target.name]: ''
        })
    }

    function submitEditCounter(): void {
        const isLoading = loadingIdEditCounter.find(id => id === idEditCounter)
        if (
            !isLoading &&
            validateSubmitEditCounter() &&
            typeof setOnModalSettings === 'function'
        ) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `Update counter "${counterName}"?`,
                classIcon: 'text-font-color-2',
                iconPopup: faPencil,
                actionsData: [
                    {
                        nameBtn: 'Save',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmSubmitEditCounter(),
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
                            marginTop: '0.5rem',
                            color: '#495057'
                        }
                    }
                ]
            })
        }
    }

    function validateSubmitEditCounter(): string | undefined {
        let err = {} as InputEditCounterT
        if (!inputEditCounter.loketName.trim()) {
            err.loketName = 'Must be required'
        }
        if (inputEditCounter.counterType === 'Select Payment Method') {
            err.counterType = 'Must be required'
        }
        if (!inputEditCounter.procurementDate.trim()) {
            err.procurementDate = 'Must be required'
        }
        if (!inputEditCounter.procurementHours.trim()) {
            err.procurementHours = 'Must be required'
        }
        if (inputEditCounter.roomActive === 'Select Room Active') {
            err.roomActive = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputEditCounter(err)
            return
        }

        return 'success'
    }

    function confirmSubmitEditCounter(): void {
        setLoadingIdEditCounter((current) => [...current, idEditCounter as string])
        API().APIPutPatientData(
            'info-loket',
            idEditCounter as string,
            dataSubmitEditCounter()
        )
            .then(res => {
                const removeLoadingId = loadingIdEditCounter.filter(id => id !== res?.id)
                setLoadingIdEditCounter(removeLoadingId)
                setOnAlerts({
                    onAlert: true,
                    title: 'Successfully updated the counter',
                    desc: 'Counter data updated'
                })
                setTimeout(() => {
                    setOnAlerts({} as AlertsT)
                }, 3000);
                window.location.reload()
            })
            .catch(err => pushTriggedErr('A server error occurred. happened while updating the counter'))
        if (typeof setOnModalSettings === 'function') {
            setOnModalSettings({} as PopupSettings)
        }
    }

    function dataSubmitEditCounter(): SubmitInputEditCounterT {
        const {
            loketName,
            counterType,
            procurementDate,
            procurementHours,
            roomActive
        } = inputEditCounter
        return {
            loketName,
            counterType: counterType as 'cash',
            dates: {
                procurementDate,
                procurementHours,
            },
            roomActive: roomActive as 'Active'
        }
    }

    function changeDateEditCounter(
        e?: ChangeEvent<HTMLInputElement> | Date,
        nameInput?: 'procurementDate'
    ): void {
        setInputEditCounter({
            ...inputEditCounter,
            [nameInput as 'procurementDate']: e ? `${createDateFormat(e as Date)}` : ''
        })
        setErrInputEditCounter({
            ...errInputEditCounter,
            [nameInput as 'procurementDate']: ''
        })
    }

    function selectEditCounter(
        e: ChangeEvent<HTMLSelectElement>,
        nameInput: 'counterType' | 'roomActive',
        elementId: 'optCounterType' | 'optRoomActive'
    ): void {
        const elem = document.getElementById(elementId as string) as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        if (value) {
            setInputEditCounter({
                ...inputEditCounter,
                [nameInput]: value
            })
            setErrInputEditCounter({
                ...errInputEditCounter,
                [nameInput]: ''
            })
        }
    }

    function selectAddCounter(
        e: ChangeEvent<HTMLSelectElement>,
        nameInput: 'counterType' | 'roomActive',
        elementId: 'addOptCounterType' | 'addOptRoomActive'
    ): void {
        const elem = document.getElementById(elementId) as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        if (value) {
            setInputAddCounter({
                ...inputAddCounter,
                [nameInput]: value
            })
            setErrInputAddCounter({
                ...errInputAddCounter,
                [nameInput]: ''
            })
        }
    }

    function clickDelete(
        id: string,
        counterName: string
    ): void {
        const loadingId = loadingDeleteId.find(loadId => loadId === id)
        if (
            !loadingId &&
            typeof setOnModalSettings !== 'undefined'
        ) {
            setIndexActiveColumnMenu(null)
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `Delete counter "${counterName}"?`,
                classIcon: 'text-font-color-2',
                iconPopup: faBan,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmDeleteCounter(id),
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
                            marginTop: '0.5rem',
                            color: '#495057'
                        }
                    }
                ]
            })
        }
    }

    function confirmDeleteCounter(
        id: string
    ): void {
        API().APIDeletePatientData(
            'info-loket',
            id,
            id
        )
        .then(res=>{
            setOnAlerts({
                onAlert: true,
                title: 'Has successfully deleted the data counter',
                desc: 'Counter data has been deleted',
            })
            setTimeout(() => {
                setOnAlerts({} as AlertsT)
            }, 3000)
            window.location.reload()
        })
        .catch(err=>pushTriggedErr('A server error occurred. happens when deleting counter data. please try again'))
        if(typeof setOnModalSettings !== 'undefined'){
            setOnModalSettings({} as PopupSettings)
        }
    }

    return {
        head,
        currentTableData,
        lastPage,
        maxLength,
        indexActiveColumnMenu,
        currentPage,
        setCurrentPage,
        searchText,
        handleSearchText,
        clickCloseSearchTxt,
        clickNewCounter,
        onAddCounter,
        changeInputAddCounter,
        errInputAddCounter,
        inputAddCounter,
        loadingSubmitAddCounter,
        submitAddCounter,
        clickColumnMenu,
        clickEdit,
        idEditCounter,
        counterName,
        inputEditCounter,
        errInputEditCounter,
        onEditCounter,
        clickCloseEditCounter,
        changeInputEditCounter,
        loadingIdEditCounter,
        submitEditCounter,
        changeDateEditCounter,
        counterTypeOpt,
        selectEditCounter,
        roomActiveOpt,
        selectAddCounter,
        clickDelete,
        loadingDeleteId
    }
}