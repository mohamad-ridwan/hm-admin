'use client'

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { AlertsT, DataTableResultT, HeadDataTableT, PopupSettings } from "lib/types/TableT.type"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { RoomTreatmentT } from "lib/types/PatientT.types"
import { DataOptionT, DataTableContentT } from "lib/types/FilterT"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"
import { InputAddRoomT, InputSubmitAddRoomT } from "lib/types/InputT.type"
import { faBan, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons"
import { API } from "lib/api"
import { navigationStore } from "lib/useZustand/navigation"
import { createDateFormat } from "lib/formats/createDateFormat"
import { createHourFormat } from "lib/formats/createHourFormat"
import { specialistDoctor } from "lib/formats/specialistDoctor"
import { useSwr } from "lib/useFetch/useSwr"
import { endpoint } from "lib/api/endpoint"
import { AuthRequiredError } from "lib/errorHandling/exceptions"

type Props = {
    setOnModalSettings?: Dispatch<SetStateAction<PopupSettings>>
}

export function UseRooms({
    setOnModalSettings
}: Props) {
    const [searchText, setSearchText] = useState<string>('')
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(true)
    const [selectDate, setSelectDate] = useState<Date | undefined>(undefined)
    const [indexActiveColumnMenu, setIndexActiveColumnMenu] = useState<number | null>(null)
    const [inputAddRoom, setInputAddRoom] = useState<InputAddRoomT>({
        room: '',
        roomType: 'Select Room Type',
        procurementDate: '',
        procurementHours: '',
        roomActive: 'Select Room Active'
    })
    const [onAddRooms, setOnAddRooms] = useState<boolean>(false)
    const [errInputAddRoom, setErrInputAddRoom] = useState<InputAddRoomT>({} as InputAddRoomT)
    const [loadingSubmitAddRoom, setLoadingSubmitAddRoom] = useState<boolean>(false)
    const [onEditRoom, setOnEditRoom] = useState<boolean>(false)
    const [inputEditRoom, setInputEditRoom] = useState<InputAddRoomT>({
        room: '',
        roomType: 'Select Room Type',
        procurementDate: '',
        procurementHours: '',
        roomActive: 'Select Room Active'
    })
    const [errInputEditRoom, setErrInputEditRoom] = useState<InputAddRoomT>({} as InputAddRoomT)
    const [roomName, setRoomName] = useState<string>('')
    const [loadingIdEditRoom, setLoadingIdEditRoom] = useState<string[]>([])
    const [editIdRoom, setEditIdRoom] = useState<string | null>(null)
    const [loadingIdDelete, setLoadingIdDelete] = useState<string[]>([])
    const [getLastPage, setGetLastPage] = useState<number>(1)
    const [currentFilterRoom, setCurrentFilterRoom] = useState<{id: string, title: string}>({
        id: 'Select Room Type',
        title: 'Select Room Type'
    })
    const [currentFilterRoomActive, setCurrentFilterRoomActive] = useState<{id: string, title: string}>({
        id: 'Select Room Active',
        title: 'Select Room Active'
    })
    const [head] = useState<HeadDataTableT>([
        {
            name: 'Room'
        },
        {
            name: 'Room Type'
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
    ])
    const [roomTypeOptions, setRoomTypeOptions] = useState<DataOptionT>(specialistDoctor)
    const roomActiveOptions: DataOptionT = [
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
        },
    ]

    const {
        // loadDataService,
        dataRooms,
        pushTriggedErr
    } = ServicingHours({})

    const pageSize: number = 5

    const {data: newDataTable, error: errDataTable, isLoading: loadingDataTable} = useSwr(endpoint.getDataTableRooms(
        searchText,
        currentFilterRoom.title,
        currentFilterRoomActive.title,
        currentPage,
        pageSize
    ))
    const dataTableRoom = newDataTable as DataTableResultT

    if(
        !loadingDataTable &&
        errDataTable
    ){
        throw new AuthRequiredError('A server error occurred. Occurs when retrieving room data resources')
    }

    const { setOnAlerts } = navigationStore()

    function loadDataTable():void{
        if(dataTableRoom?.data){
            setDataColumns(dataTableRoom.data)
            setGetLastPage(dataTableRoom.pagination.lastPage)
        }
    }

    useEffect(()=>{
        loadDataTable()
    }, [dataTableRoom])

    // function loadGetRoomsData(
    //     roomsData: RoomTreatmentT[]
    // ): void {
    //     const rooms: DataTableContentT[] = roomsData.map((room, idx) => {
    //         return {
    //             id: room.id,
    //             data: [
    //                 {
    //                     name: room.room
    //                 },
    //                 {
    //                     name: room?.roomType ?? '-'
    //                 },
    //                 {
    //                     name: room?.dates?.procurementDate ?? ''
    //                 },
    //                 {
    //                     name: room?.dates?.procurementHours ?? '-'
    //                 },
    //                 {
    //                     name: room?.roomActive ?? '-'
    //                 },
    //                 {
    //                     name: room.id
    //                 },
    //                 {
    //                     name: ''
    //                 }
    //             ]
    //         }
    //     })
    //     setDataColumns(rooms)
    // }

    // useEffect(() => {
    //     if (
    //         !loadDataService &&
    //         Array.isArray(dataRooms) &&
    //         dataRooms.length > 0
    //     ) {
    //         loadGetRoomsData(dataRooms)
    //     }
    // }, [loadDataService, dataRooms])

    useEffect(() => {
        setRoomTypeOptions((current) => [{
            id: 'Select Room Type',
            title: 'Select Room Type'
        }, ...current])
    }, [])

    // const filterText: DataTableContentT[] = dataColumns.length > 0 ? dataColumns.filter(room => {
    //     const names = room.data.filter(roomData => roomData.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))
    //     return names.length > 0
    // }) : []

    // const currentTableData = useMemo((): DataTableContentT[] => {
    //     const firstPageIndex = (currentPage - 1) * pageSize
    //     const lastPageIndex = firstPageIndex + pageSize
    //     return filterText.slice(firstPageIndex, lastPageIndex)
    // }, [filterText, currentPage])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchText])

    // const lastPage: number = filterText.length < 5 ? 1 : Math.ceil(filterText.length / pageSize)
    const lastPage: number = getLastPage
    const maxLength: number = 7

    function handleSearchText(e?: ChangeEvent<HTMLInputElement>): void {
        setSearchText(e?.target?.value as string)
    }

    function clickCloseSearchTxt(): void {
        setSearchText('')
        setCurrentPage(1)
    }

    function handleSearchDate(e?: ChangeEvent<HTMLInputElement> | Date | undefined): void {
        setSelectDate(e as Date)
    }

    function clickCloseSearchDate(): void {
        setSelectDate(undefined)
        setCurrentPage(1)
    }

    function clickColumnMenu(index: number): void {
        if (indexActiveColumnMenu === index) {
            setIndexActiveColumnMenu(null)
        } else {
            setIndexActiveColumnMenu(index)
        }
    }

    function clickNewRoom(): void {
        setOnAddRooms(!onAddRooms)
    }

    function changeInputAddRoom(e: ChangeEvent<HTMLInputElement>): void {
        setInputAddRoom({
            ...inputAddRoom,
            [e.target.name]: e.target.value
        })
        setErrInputAddRoom({
            ...errInputAddRoom,
            [e.target.name]: ''
        })
    }

    function submitAddRoom(): void {
        if (
            loadingSubmitAddRoom === false &&
            validateFormAddRoom() &&
            setOnModalSettings
        ) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'Add Room?',
                classIcon: 'text-font-color-2',
                iconPopup: faPlus,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmSubmitAddRoom(),
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

    function validateFormAddRoom(): string | undefined {
        let err = {} as InputAddRoomT
        if (!inputAddRoom.room.trim()) {
            err.room = 'Must be required'
        }
        if (inputAddRoom.roomType === 'Select Room Type') {
            err.roomType = 'Must be required'
        }
        if (inputAddRoom.roomActive === 'Select Room Active') {
            err.roomActive = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputAddRoom(err)
            return
        }
        return 'success'
    }

    function confirmSubmitAddRoom(): void {
        setLoadingSubmitAddRoom(true)
        if (setOnModalSettings) {
            setOnModalSettings({} as PopupSettings)
        }
        API().APIPostPatientData(
            'room',
            dataSubmitRoom()
        )
            .then(res => {
                setLoadingSubmitAddRoom(false)
                setOnAlerts({
                    onAlert: true,
                    title: 'Successfully added treatment room',
                    desc: 'A new specialist room has been added'
                })
                setTimeout(() => {
                    setOnAlerts({} as AlertsT)
                }, 3000);
            })
            .catch(err => pushTriggedErr('A server error occurred. happened when adding a treatment room. Please try again'))
    }

    function dataSubmitRoom(): RoomTreatmentT {
        return {
            id: `${new Date().getTime()}`,
            room: inputAddRoom.room,
            roomType: inputAddRoom.roomType,
            dates: {
                procurementDate: createDateFormat(new Date()),
                procurementHours: createHourFormat(new Date())
            },
            roomActive: inputAddRoom.roomActive as 'Active'
        }
    }

    function activeRoomType(roomType: string): void {
        const elem = document.getElementById('editSelectRoomType') as HTMLSelectElement
        const roomIndex: number = roomTypeOptions.findIndex(item => item.id === roomType)
        if (elem) elem.selectedIndex = roomIndex
    }

    function idxRoomActive(): void {
        const findIndex = roomActiveOptions.findIndex(item => item.id === inputEditRoom.roomActive)
        const elem = document.getElementById('roomActiveOpt') as HTMLSelectElement
        if (elem) elem.selectedIndex = findIndex
    }

    useEffect(() => {
        idxRoomActive()
    }, [inputEditRoom])

    function clickEditRoom(
        roomId: string,
        roomName: string
    ): void {
        const findRoom = dataRooms?.find(room => room.id === roomId)
        if (findRoom) {
            setOnEditRoom(true)
            setRoomName(roomName)
            setEditIdRoom(roomId)
            setIndexActiveColumnMenu(null)
            const {
                room,
                roomType,
                dates,
                roomActive
            } = findRoom
            setInputEditRoom({
                room,
                roomType: typeof roomType === 'undefined' ? '' : roomType,
                procurementDate: dates?.procurementDate ?? '',
                procurementHours: dates?.procurementHours ?? '',
                roomActive: typeof roomActive !== 'undefined' ? roomActive : 'Not Active'
            })
            setErrInputEditRoom({} as InputAddRoomT)
            setTimeout(() => {
                activeRoomType(roomType as string)
            }, 0)
        } else {
            setOnAlerts({
                onAlert: true,
                title: 'Room not found',
                desc: 'Room not found, please reload browser'
            })
            setTimeout(() => {
                setOnAlerts({} as AlertsT)
            }, 3000);
        }
    }

    function clickCloseEditRoom(): void {
        setOnEditRoom(!onEditRoom)
    }

    function changeEditRoom(e: ChangeEvent<HTMLInputElement>): void {
        setInputEditRoom({
            ...inputEditRoom,
            [e.target.name]: e.target.value
        })
        setErrInputEditRoom({
            ...errInputEditRoom,
            [e.target.name]: ''
        })
    }

    function handleSubmitUpdate(): void {
        const findLoadingId = loadingIdEditRoom.find(id => id === editIdRoom)
        if (
            !findLoadingId &&
            validateFormEditRoom() &&
            setOnModalSettings
        ) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `Edit "${roomName}" room?`,
                classIcon: 'text-font-color-2',
                iconPopup: faPencil,
                actionsData: [
                    {
                        nameBtn: 'Save',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmSubmitEditRoom(),
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

    function validateFormEditRoom(): string | undefined {
        let err = {} as InputAddRoomT
        if (!inputEditRoom.room.trim()) {
            err.room = 'Must be required'
        }
        if (!inputEditRoom.roomType.trim()) {
            err.roomType = 'Must be required'
        }
        if (!inputEditRoom.procurementDate.trim()) {
            err.procurementDate = 'Must be required'
        }
        if (!inputEditRoom.procurementHours.trim()) {
            err.procurementHours = 'Must be required'
        }
        if (inputEditRoom.roomActive === 'Select Room Active') {
            err.roomActive = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputEditRoom(err)
            return
        }
        return 'success'
    }

    function confirmSubmitEditRoom(): void {
        setLoadingIdEditRoom((current) => [editIdRoom as string, ...current])
        API().APIPutPatientData(
            'room',
            editIdRoom as string,
            dataEditSubmitRoom()
        )
            .then(res => {
                const removeLoadingId = loadingIdEditRoom.filter(id => id !== res?.id)
                setLoadingIdEditRoom(removeLoadingId)
                setOnAlerts({
                    onAlert: true,
                    title: 'Successfully updated the room',
                    desc: 'Specialist room has been updated'
                })
                setTimeout(() => {
                    setOnAlerts({} as AlertsT)
                }, 3000);
                window.location.reload()
            })
            .catch(err => pushTriggedErr('A server error occurred. Occurs when updating room data. Please try again'))
        if (setOnModalSettings) {
            setOnModalSettings({} as PopupSettings)
        }
    }

    function dataEditSubmitRoom(): InputSubmitAddRoomT {
        const {
            room,
            roomType,
            procurementDate,
            procurementHours,
            roomActive
        } = inputEditRoom
        return {
            room,
            roomType,
            dates: {
                procurementDate,
                procurementHours,
            },
            roomActive: roomActive as 'Active'
        }
    }

    function selectRoomType(): void {
        const elem = document.getElementById('selectRoomType') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        if (value) {
            setInputAddRoom({
                ...inputAddRoom,
                roomType: value
            })
            setErrInputAddRoom({
                ...errInputAddRoom,
                roomType: ''
            })
        }
    }

    function editSelectRoomType(): void {
        const elem = document.getElementById('editSelectRoomType') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        if (value) {
            setInputEditRoom({
                ...inputEditRoom,
                roomType: value
            })
            setErrInputEditRoom({
                ...errInputEditRoom,
                roomType: ''
            })
        }
    }

    function clickDelete(
        id: string,
        roomName: string
    ): void {
        const loadingId = loadingIdDelete.find(loadId => loadId === id)
        if (
            !loadingId &&
            setOnModalSettings
        ) {
            setIndexActiveColumnMenu(null)
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `Delete specialist room "${roomName}"?`,
                classIcon: 'text-font-color-2',
                iconPopup: faBan,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmDeleteRoom(id, roomName),
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

    function confirmDeleteRoom(
        id: string,
        roomName: string
    ): void {
        setLoadingIdDelete((current) => [...current, id])
        API().APIDeletePatientData(
            'room',
            id,
            id
        )
            .then(res => {
                const removeLoadingId = loadingIdDelete.filter(loadId => loadId !== id)
                setLoadingIdDelete(removeLoadingId)
                setOnAlerts({
                    onAlert: true,
                    title: `Has successfully deleted specialist room ${roomName}`,
                    desc: 'Specialist room has been removed'
                })
                setTimeout(() => {
                    setOnAlerts({} as AlertsT)
                }, 3000);
                window.location.reload()
            })
            .catch(err => pushTriggedErr('A server error occurred. occurs when deleting specialist room'))
        if (setOnModalSettings) {
            setOnModalSettings({} as PopupSettings)
        }
    }

    function changeDateEditRoom(
        e?: ChangeEvent<HTMLInputElement> | Date,
        nameInput?: 'procurementDate'
    ): void {
        setInputEditRoom({
            ...inputEditRoom,
            [nameInput as 'procurementDate']: e ? `${createDateFormat(e as Date, 'MM/DD/YYYY')}` : ''
        })
        setErrInputEditRoom({
            ...errInputEditRoom,
            [nameInput as 'procurementDate']: ''
        })
    }

    function selectRoomActive(): void {
        const elem = document.getElementById('roomActiveOpt') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        if (value) {
            setInputEditRoom({
                ...inputEditRoom,
                roomActive: value as 'Active'
            })
            setErrInputEditRoom({
                ...errInputEditRoom,
                roomActive: ''
            })
        }
    }

    function selectAddRoomActive(): void {
        const elem = document.getElementById('roomActiveOpt') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        if (value) {
            setInputAddRoom({
                ...inputAddRoom,
                roomActive: value as 'Active'
            })
            setErrInputAddRoom({
                ...errInputAddRoom,
                roomActive: ''
            })
        }
    }

    function handleSelectRoomType():void{
        const elem = document.getElementById('filterRoomType') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        if(value){
            setCurrentFilterRoom({
                id: value,
                title: value
            })
            setCurrentPage(1)
        }
    }

    function handleSelectRoomActive():void{
        const elem = document.getElementById('filterRoomActive') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        if(value){
            setCurrentFilterRoomActive({
                id: value,
                title: value
            })
            setCurrentPage(1)
        }
    }

    return {
        head,
        searchText,
        handleSearchText,
        clickCloseSearchTxt,
        displayOnCalendar,
        handleSearchDate,
        selectDate,
        clickCloseSearchDate,
        // currentTableData,
        dataColumns,
        lastPage,
        maxLength,
        indexActiveColumnMenu,
        clickColumnMenu,
        currentPage,
        setCurrentPage,
        clickNewRoom,
        inputAddRoom,
        errInputAddRoom,
        onAddRooms,
        changeInputAddRoom,
        loadingSubmitAddRoom,
        submitAddRoom,
        clickEditRoom,
        onEditRoom,
        clickCloseEditRoom,
        changeEditRoom,
        roomName,
        inputEditRoom,
        errInputEditRoom,
        loadingIdEditRoom,
        editIdRoom,
        handleSubmitUpdate,
        selectRoomType,
        roomTypeOptions,
        editSelectRoomType,
        clickDelete,
        loadingIdDelete,
        roomActiveOptions,
        changeDateEditRoom,
        selectRoomActive,
        selectAddRoomActive,
        loadingDataTable,
        handleSelectRoomType,
        handleSelectRoomActive
    }
}