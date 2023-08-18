'use client'

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { HeadDataTableT, PopupSettings } from "lib/types/TableT.type"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { RoomTreatmentT } from "lib/types/PatientT.types"
import { DataOptionT, DataTableContentT } from "lib/types/FilterT"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"
import { InputAddRoomT } from "lib/types/InputT.type"
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons"
import { API } from "lib/api"

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
        roomType: 'Select Room Type'
    })
    const [onAddRooms, setOnAddRooms] = useState<boolean>(false)
    const [errInputAddRoom, setErrInputAddRoom] = useState<InputAddRoomT>({} as InputAddRoomT)
    const [loadingSubmitAddRoom, setLoadingSubmitAddRoom] = useState<boolean>(false)
    const [onEditRoom, setOnEditRoom] = useState<boolean>(false)
    const [inputEditRoom, setInputEditRoom] = useState<InputAddRoomT>({
        room: '',
        roomType: 'Select Room Type'
    })
    const [errInputEditRoom, setErrInputEditRoom] = useState<InputAddRoomT>({} as InputAddRoomT)
    const [roomName, setRoomName] = useState<string>('')
    const [loadingIdEditRoom, setLoadingIdEditRoom] = useState<string[]>([])
    const [editIdRoom, setEditIdRoom] = useState<string | null>(null)
    const [head] = useState<HeadDataTableT>([
        {
            name: 'Room'
        },
        {
            name: 'Room Type'
        },
        {
            name: 'Id'
        }
    ])
    const [roomTypeOptions] = useState<DataOptionT>([
        {
            id: 'Select Room Type',
            title: 'Select Room Type'
        },
        {
            id: 'Spesialis Anak',
            title: 'Spesialis Anak'
        },
        {
            id: 'Spesialis Mata',
            title: 'Spesialis Mata'
        },
        {
            id: 'Spesialis Kandungan',
            title: 'Spesialis Kandungan'
        },
        {
            id: 'Spesialis Saraf',
            title: 'Spesialis Saraf'
        },
        {
            id: 'Spesialis Kedokteran Jiwa',
            title: 'Spesialis Kedokteran Jiwa'
        },
        {
            id: 'Spesialis Telinga Hidung Tenggorokan',
            title: 'Spesialis Telinga Hidung Tenggorokan'
        },
        {
            id: 'Spesialis Kulit dan Kelamin',
            title: 'Spesialis Kulit dan Kelamin'
        },
        {
            id: 'Spesialis Penyakit Dalam',
            title: 'Spesialis Penyakit Dalam'
        },
    ])

    const {
        loadDataService,
        dataRooms,
        pushTriggedErr
    } = ServicingHours()

    function loadGetRoomsData(
        roomsData: RoomTreatmentT[]
    ): void {
        const rooms: DataTableContentT[] = roomsData.map((room, idx) => {
            return {
                id: room.id,
                data: [
                    {
                        name: room.room
                    },
                    {
                        name: room?.roomType ? room.roomType : ''
                    },
                    {
                        name: room.id
                    }
                ]
            }
        })
        setDataColumns(rooms)
    }

    useEffect(() => {
        if (
            !loadDataService &&
            Array.isArray(dataRooms) &&
            dataRooms.length > 0
        ) {
            loadGetRoomsData(dataRooms)
        }
    }, [loadDataService, dataRooms])

    const filterText: DataTableContentT[] = dataColumns.length > 0 ? dataColumns.filter(room => {
        const names = room.data.filter(roomData => roomData.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))
        return names.length > 0
    }) : []

    const pageSize: number = 5

    const currentTableData = useMemo((): DataTableContentT[] => {
        const firstPageIndex = (currentPage - 1) * pageSize
        const lastPageIndex = firstPageIndex + pageSize
        return filterText.slice(firstPageIndex, lastPageIndex)
    }, [filterText, currentPage])

    useEffect(() => {
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
            typeof setOnModalSettings === 'function'
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

        if (Object.keys(err).length !== 0) {
            setErrInputAddRoom(err)
            return
        }
        return 'success'
    }

    function confirmSubmitAddRoom(): void {
        setLoadingSubmitAddRoom(true)
        if (typeof setOnModalSettings === 'function') {
            setOnModalSettings({} as PopupSettings)
        }
        API().APIPostPatientData(
            'room',
            dataSubmitRoom()
        )
            .then(res => {
                setLoadingSubmitAddRoom(false)
                alert('Successfully added treatment room')
            })
            .catch(err => pushTriggedErr('A server error occurred. happened when adding a treatment room. Please try again'))
    }

    function dataSubmitRoom(): RoomTreatmentT {
        return {
            id: `${new Date().getTime()}`,
            room: inputAddRoom.room,
            roomType: inputAddRoom.roomType
        }
    }

    function activeRoomType(roomType: string):void{
        const elem = document.getElementById('editSelectRoomType') as HTMLSelectElement
        const roomIndex:number = roomTypeOptions.findIndex(item=>item.id === roomType)
        if(elem){
            elem.selectedIndex = roomIndex
        }
    }

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
                roomType
            } = findRoom
            setInputEditRoom({
                room,
                roomType: typeof roomType === 'undefined' ? '' : roomType
            })
            setErrInputEditRoom({} as InputAddRoomT)
            setTimeout(() => {
                activeRoomType(roomType as string)
            }, 0)
        } else {
            alert('Room not found')
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
            ...errInputAddRoom,
            [e.target.name]: ''
        })
    }

    function handleSubmitUpdate(): void {
        const findLoadingId = loadingIdEditRoom.find(id => id === editIdRoom)
        if (
            !findLoadingId &&
            validateFormEditRoom() &&
            typeof setOnModalSettings === 'function'
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

        if (Object.keys(err).length !== 0) {
            setErrInputEditRoom(err)
            return
        }
        return 'success'
    }

    function confirmSubmitEditRoom():void{
        setLoadingIdEditRoom((current)=>[editIdRoom as string, ...current])
        API().APIPutPatientData(
            'room',
            editIdRoom as string,
            dataEditSubmitRoom()
        )
        .then(res=>{
            const removeLoadingId = loadingIdEditRoom.filter(id=> id !== res?.id)
            setLoadingIdEditRoom(removeLoadingId)
            alert('Successfully updated the room')
        })
        .catch(err=>pushTriggedErr('A server error occurred. Occurs when updating room data. Please try again'))
        if(typeof setOnModalSettings === 'function'){
            setOnModalSettings({} as PopupSettings)
        }
    }

    function dataEditSubmitRoom():InputAddRoomT{
        const {
            room,
            roomType
        } = inputEditRoom
        return{
            room,
            roomType
        }
    }

    function selectRoomType():void{
        const elem = document.getElementById('selectRoomType') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        if(value){
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

    function editSelectRoomType():void{
        const elem = document.getElementById('editSelectRoomType') as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        if(value){
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

    return {
        head,
        searchText,
        handleSearchText,
        clickCloseSearchTxt,
        displayOnCalendar,
        handleSearchDate,
        selectDate,
        clickCloseSearchDate,
        currentTableData,
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
        editSelectRoomType
    }
}