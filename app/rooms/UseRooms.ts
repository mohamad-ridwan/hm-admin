'use client'

import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { HeadDataTableT } from "lib/types/TableT.type"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { RoomTreatmentT } from "lib/types/PatientT.types"
import { DataTableContentT } from "lib/types/FilterT"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"

export function UseRooms(){
    const [searchText, setSearchText] = useState<string>('')
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(true)
    const [selectDate, setSelectDate] = useState<Date | undefined>(undefined)
    const [indexActiveColumnMenu, setIndexActiveColumnMenu] = useState<number | null>(null)
    const [head] = useState<HeadDataTableT>([
        {
            name: 'Room'
        },
        {
            name: 'Id'
        }
    ])

    const {
        loadDataService,
        dataRooms
    } = ServicingHours()

    function loadGetRoomsData(
        roomsData: RoomTreatmentT[]
    ):void{
        const rooms:DataTableContentT[] = roomsData.map((room, idx)=>{
            return {
                id: room.id,
                data: [
                    {
                        name: room.room
                    },
                    {
                        name: room.id
                    }
                ]
            }
        })
        setDataColumns(rooms)
    }

    useEffect(()=>{
        if(
            !loadDataService &&
            Array.isArray(dataRooms) &&
            dataRooms.length > 0
        ){
            loadGetRoomsData(dataRooms)
        }
    }, [loadDataService, dataRooms])

    const filterText: DataTableContentT[] = dataColumns.length > 0 ? dataColumns.filter(room=>{
        const names = room.data.filter(roomData=>roomData.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))
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

    function handleSearchText(e?: ChangeEvent<HTMLInputElement>):void{
        setSearchText(e?.target?.value as string)
    }

    function clickCloseSearchTxt():void{
        setSearchText('')
        setCurrentPage(1)
    }

    function handleSearchDate(e?: ChangeEvent<HTMLInputElement> | Date | undefined):void{
        setSelectDate(e as Date)
    }

    function clickCloseSearchDate():void{
        setSelectDate(undefined)
        setCurrentPage(1)
    }

    function clickColumnMenu(index: number):void{
        if(indexActiveColumnMenu === index){
            setIndexActiveColumnMenu(null)
        }else{
            setIndexActiveColumnMenu(index)
        }
    }

    function clickNewRoom():void{

    }

    return{
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
        clickNewRoom
    }
}