'use client'

import { useEffect, useState } from "react"
import { DataTableContentT } from "lib/types/FilterT"
import ServicingHours from "lib/actions/ServicingHours"
import { ProfileDoctorT } from "lib/types/DoctorsT.types"
import { RoomTreatmentT } from "lib/types/PatientT.types"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"

type FilterProps = {
    selectCurrentFilter: {id: string, title: string}
    currentFilter: {id: string, title: string}
    searchText: string
}

type Props = FilterProps

function UseTableColumns({
    selectCurrentFilter,
    currentFilter,
    searchText
}: Props){
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])

    const {
        doctors,
        dataRooms,
        loadDataDoctors,
        loadDataService
    } = ServicingHours()

    function getOurDoctors(
        data: ProfileDoctorT[],
        rooms: RoomTreatmentT[]
    ): void {
        const newData: DataTableContentT[] = []
        const getDataColumns = () => {
            data.forEach(doctor => {
                const findRoom = rooms.find(room => room.id === doctor.room)

                const dataDoctors = {
                    id: doctor.id,
                    data: [
                        {
                            name: doctor.name
                        },
                        {
                            name: doctor.deskripsi
                        },
                        {
                            name: 'no email found'
                        },
                        {
                            name: 'no phone found'
                        },
                        {
                            name: findRoom?.room as string
                        },
                        {
                            name: doctor.id
                        },
                    ]
                }

                newData.push(dataDoctors)
            })
        }

        getDataColumns()
        if (newData.length === data.length) {
            setDataColumns(newData)
        }
    }

    useEffect(() => {
        if (
            !loadDataDoctors &&
            Array.isArray(doctors) &&
            doctors.length > 0 &&
            !loadDataService &&
            Array.isArray(dataRooms) &&
            dataRooms.length > 0
        ) {
            getOurDoctors(doctors, dataRooms)
        }
    }, [loadDataDoctors, doctors, loadDataService, dataRooms])

    function onFilterSpecialist():DataTableContentT[]{
        if(
            currentFilter.id === 'Specialist' && 
            selectCurrentFilter.id !== 'Select Specialist'
            ){
            const filterSpecialist = dataColumns.filter(items=>items.data[1].name === selectCurrentFilter.id)
            return filterSpecialist
        }
        return dataColumns
    }

    function onFilterRooms():DataTableContentT[]{
        if(
            currentFilter.id === 'Rooms' &&
            selectCurrentFilter.id !== 'Select Room'
        ){
            const filterRooms = dataColumns.filter(items=>items.data[4].name === selectCurrentFilter.id)
            return filterRooms
        }
        return dataColumns
    }

    function getFilterText(): DataTableContentT[]{
        if(
            currentFilter.id === 'Specialist' &&
            selectCurrentFilter.id !== 'no filter' &&
            selectCurrentFilter.id !== 'Select Specialist'
        ){
            const filterText = onFilterSpecialist().filter(items=>{
                const findItem = items.data.filter(data => data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))

                return findItem
            })

            return filterText
        }else if(
            currentFilter.id === 'Rooms' && 
            selectCurrentFilter.id !== 'no filter' &&
            selectCurrentFilter.id !== 'Select Room'
            ){
            const filterText = onFilterRooms().filter(items=>{
                const findItem = items.data.filter(data => data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))

                return findItem
            })

            return filterText
        }

        const filterText = dataColumns.filter(items=>{
            const findItem = items.data.filter(data => data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))

            return findItem.length > 0
        })

        return filterText
    }

    const resultFilterData:DataTableContentT[] = getFilterText()

    return {
        dataColumns,
        resultFilterData
    }
}

export default UseTableColumns