'use client'

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { HeadDataTableT, PopupSettings } from "lib/types/TableT.type"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { RoomTreatmentT } from "lib/types/PatientT.types"
import { DataTableContentT } from "lib/types/FilterT"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"
import { InputAddRoomT } from "lib/types/InputT.type"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
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
        roomType: ''
    })
    const [onAddRooms, setOnAddRooms] = useState<boolean>(false)
    const [errInputAddRoom, setErrInputAddRoom] = useState<InputAddRoomT>({} as InputAddRoomT)
    const [loadingSubmitAddRoom, setLoadingSubmitAddRoom] = useState<boolean>(false)
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

    function changeInputAddRoom(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
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
                        clickBtn: ()=>confirmSubmitAddRoom(),
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
        if (!inputAddRoom.roomType.trim()) {
            err.roomType = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputAddRoom(err)
            return
        }
        return 'success'
    }

    function confirmSubmitAddRoom():void{
        setLoadingSubmitAddRoom(true)
        if(typeof setOnModalSettings === 'function'){
            setOnModalSettings({} as PopupSettings)
        }
        API().APIPostPatientData(
            'room',
            dataSubmitRoom()
        )
        .then(res=>{
            setLoadingSubmitAddRoom(false)
            alert('Successfully added treatment room')
        })
        .catch(err=>pushTriggedErr('A server error occurred. happened when adding a treatment room. Please try again'))
    }

    function dataSubmitRoom(): RoomTreatmentT{
        return{
            id: `${new Date().getTime()}`,
            room: inputAddRoom.room,
            roomType: inputAddRoom.roomType
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
        submitAddRoom
    }
}