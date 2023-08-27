'use client'

import { ChangeEvent, useCallback, useState } from "react"
import { DataOptionT } from "lib/types/FilterT"
import ServicingHours from "lib/dataInformation/ServicingHours"

function UseTableFilter() {
    const [searchText, setSearchText] = useState<string>('')
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
            const getDoctors: DataOptionT = doctors.map(doctor=>({
                id: doctor.deskripsi,
                title: doctor.deskripsi
            }))
            setChooseFilter([
                {
                    id: 'Select Specialist',
                    title: 'Select Specialist'
                },
                ...getDoctors
            ])
        }
    }

    // load room data
    function loadRooms(): void {
        if(
            !loadDataService &&
            Array.isArray(dataRooms) &&
            dataRooms.length > 0
        ){
            const roomActive = dataRooms.filter(room=>room?.roomActive === 'Active')
            const rooms: DataOptionT = roomActive.map(room=>({
                id: room.room,
                title: room.room
            }))
            setChooseFilter([
                {
                    id: 'Select Room',
                    title: 'Select Room'
                },
                ...rooms
            ])
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
        selectDate,
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