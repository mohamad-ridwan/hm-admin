'use client'

import { ChangeEvent, useCallback, useState } from "react"
import { DataOptionT } from "lib/types/FilterT"
import ServicingHours from "lib/actions/ServicingHours"

function UseTableFilter() {
    const [searchText, setSearchText] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [selectDate, setSelectDate] = useState<Date | undefined>()
    const [chooseFilter, setChooseFilter] = useState<DataOptionT>([])
    const [currentFilter, setCurrentFilter] = useState<{
        id: string
        title: string
    }>({
        id: 'Filter By',
        title: 'Filter By'
    })
    const [selectCurrentFilter, setSelectCurrentFilter] = useState<{
        id: string
        title: string
    }>({
        id: 'no filter',
        title: 'no filter'
    })
    const [filterBy] = useState<DataOptionT>([
        {
            id: 'Filter By',
            title: 'Filter By',
        },
        {
            id: 'Specialist',
            title: 'Specialist',
        },
        {
            id: 'Rooms',
            title: 'Rooms',
        },
    ])

    const {
        doctors,
        dataRooms,
        loadDataDoctors,
        loadDataService
    } = ServicingHours()

    const handleSearchText = (e?: ChangeEvent<HTMLInputElement>): void => {
        setSearchText(e?.target.value as string)
    }

    const setDefaultOptions = useCallback(()=>{
        const selectEl = document.getElementById('currentFilter') as HTMLSelectElement
        if(selectEl){
            selectEl.selectedIndex = 0
        }
    }, [currentFilter])

    const handleFilterBy = (): void => {
        const selectEl = document.getElementById('filterBy') as HTMLSelectElement
        const id = selectEl?.options[selectEl.selectedIndex].value
        if (id) {
            if (id === 'Filter By') {
                setChooseFilter([])
            } else if (id === 'Specialist') {
                loadDoctorSpecialist()
            }else if(id === 'Rooms'){
                loadRooms()
            }

            setCurrentFilter({id: id, title: id})
            setSelectCurrentFilter({id: 'no filter', title: 'no filter'})
            setDefaultOptions()
        }
    }

    // load doctor specialist
    function loadDoctorSpecialist(): void {
        if (
            !loadDataDoctors &&
            Array.isArray(doctors) &&
            doctors.length > 0
        ) {
            const newChooseSpecialist = [
                {
                    id: 'Select Specialist',
                    title: 'Select Specialist'
                }
            ]
            let count: number = 0
            doctors.forEach(doctor=>{
                count = count + 1
                const checkSpecialist = newChooseSpecialist.find(specialist=>specialist.id === doctor.deskripsi)
                if(!checkSpecialist){
                    newChooseSpecialist.push({
                        id: doctor.deskripsi,
                        title: doctor.deskripsi
                    })
                }
            })

            if(count === doctors.length){
                setChooseFilter(newChooseSpecialist)
            }
        }
    }

    // load room data
    function loadRooms(): void {
        if(
            !loadDataService &&
            Array.isArray(dataRooms) &&
            dataRooms.length > 0
        ){
            const newChooseRoom = [
                {
                    id: 'Select Room',
                    title: 'Select Room'
                }
            ]
            let count: number = 0
            dataRooms.forEach(rooms=>{
                count = count + 1
                const checkRooms = newChooseRoom.find(filter=>filter.id === rooms.room)
                if(!checkRooms){
                    newChooseRoom.push({
                        id: rooms.room,
                        title: rooms.room
                    })
                }
            })

            if(count === dataRooms.length){
                setChooseFilter(newChooseRoom)
            }
        }
    }

    function handleCurrentFilter():void{
        const selectEl = document.getElementById('currentFilter') as HTMLSelectElement
        const id = selectEl?.options[selectEl.selectedIndex].value
        if(id){
            setSelectCurrentFilter({id, title: id})
        }
    }

    return {
        searchText,
        currentPage,
        selectDate,
        setCurrentPage,
        setSearchText,
        handleSearchText,
        handleFilterBy,
        filterBy,
        chooseFilter,
        currentFilter,
        handleCurrentFilter,
        selectCurrentFilter
    }
}

export default UseTableFilter