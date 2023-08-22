'use client'

import { useState, useEffect, useMemo, ChangeEvent, Dispatch, SetStateAction } from 'react'
import ServicingHours from 'lib/dataInformation/ServicingHours'
import { AlertsT, HeadDataTableT, PopupSettings } from 'lib/types/TableT.type'
import { InfoLoketT } from 'lib/types/PatientT.types'
import { DataTableContentT } from 'lib/types/FilterT'
import { specialCharacter } from 'lib/regex/specialCharacter'
import { spaceString } from 'lib/regex/spaceString'
import { InputAddCounterT, InputEditCounterT } from 'lib/types/InputT.type'
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import { API } from 'lib/api'
import { navigationStore } from 'lib/useZustand/navigation'

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
        loketName: ''
    })
    const [errInputAddCounter, setErrInputAddCounter] = useState<InputAddCounterT>({} as InputAddCounterT)
    const [loadingSubmitAddCounter, setLoadingSubmitAddCounter] = useState<boolean>(false)
    const [inputEditCounter, setInputEditCounter] = useState<InputEditCounterT>({
        loketName: ''
    })
    const [errInputEditCounter, setErrInputEditCounter] = useState<InputEditCounterT>({} as InputEditCounterT)
    const [idEditCounter, setIdEditCounter] = useState<string | null>(null)
    const [counterName, setCounterName] = useState<string>('')
    const [onEditCounter, setOnEditCounter] = useState<boolean>(false)
    const [loadingIdEditCounter, setLoadingIdEditCounter] = useState<string[]>([])

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
            name: 'Id'
        },
        {
            name: 'Action'
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
            loketName: e.target.value
        })
        setErrInputAddCounter({
            loketName: ''
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
        const data: InputAddCounterT & {
            id: string
        } = {
            id: `${new Date().getTime()}`,
            loketName: inputAddCounter.loketName
        }
        API().APIPostPatientData(
            'info-loket',
            data
        )
            .then(res => {
                setLoadingSubmitAddCounter(false)
                setInputAddCounter({ loketName: '' })
                setOnAlerts({
                    onAlert: true,
                    title: 'Successful add counter',
                    desc: 'New counter has been added'
                })
                setTimeout(() => {
                    setOnAlerts({} as AlertsT)
                }, 3000);
            })
            .catch(err => pushTriggedErr('A server error occurred. Happens when adding a counter. Please try again'))
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
            setCounterName(counterName)
            setIndexActiveColumnMenu(null)
            setIdEditCounter(id)
            setOnEditCounter(true)
            setInputEditCounter({
                loketName: counterName
            })
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

    function clickCloseEditCounter(): void {
        setOnEditCounter(false)
    }

    function changeInputEditCounter(e: ChangeEvent<HTMLInputElement>): void {
        setInputEditCounter({
            loketName: e.target.value
        })
        setErrInputEditCounter({
            loketName: ''
        })
    }

    function submitEditCounter(): void {
        const isLoading = loadingIdEditCounter.find(id => id === idEditCounter)
        if (
            !isLoading &&
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

    function confirmSubmitEditCounter(): void {
        setLoadingIdEditCounter((current) => [...current, idEditCounter as string])
        const { loketName } = inputEditCounter
        const data: InputEditCounterT = {
            loketName
        }
        API().APIPutPatientData(
            'info-loket',
            idEditCounter as string,
            data
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
            })
            .catch(err => pushTriggedErr('A server error occurred. happened while updating the counter'))
        if (typeof setOnModalSettings === 'function') {
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
        submitEditCounter
    }
}