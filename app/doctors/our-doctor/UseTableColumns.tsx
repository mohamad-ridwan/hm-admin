'use client'

import { useEffect, useMemo, useState } from "react"
import { DataTableContentT } from "lib/types/FilterT"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { ProfileDoctorT } from "lib/types/DoctorsT.types"
import { RoomTreatmentT } from "lib/types/PatientT.types"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"
import { API } from "lib/api"
import { preloadFetch } from "lib/useFetch/preloadFetch"
import { endpoint } from "lib/api/endpoint"

type FilterProps = {
    selectCurrentFilter: { id: string, title: string }
    currentFilter: { id: string, title: string }
    searchText: string
}

type Props = FilterProps

function UseTableColumns({
    selectCurrentFilter,
    currentFilter,
    searchText
}: Props) {
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [idLoadingDelete, setIdLoadingDelete] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [indexActiveColumnMenu, setIndexActiveColumnMenu] = useState<number | null>(null)

    const {
        doctors,
        dataRooms,
        loadDataDoctors,
        loadDataService,
        pushTriggedErr
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
                            name: doctor.name,
                            image: doctor.image
                        },
                        {
                            name: doctor.deskripsi
                        },
                        {
                            name: doctor.email
                        },
                        {
                            name: doctor.phone
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
        } else if (
            !loadDataDoctors &&
            Array.isArray(doctors) &&
            doctors.length === 0
        ) {
            setDataColumns([])
        }
    }, [loadDataDoctors, doctors, loadDataService, dataRooms])

    function preloadDoctors(
        doctors: { [key: string]: any }
    ): void {
        const getDoctorDocument: { [key: string]: any } | undefined = doctors?.find((data: { [key: string]: any }) => data?.id === 'doctor')
        const currentDoctors: ProfileDoctorT[] | undefined = getDoctorDocument?.data

        setTimeout(() => {
            if (
                Array.isArray(currentDoctors) &&
                currentDoctors.length > 0 &&
                !loadDataService &&
                Array.isArray(dataRooms) &&
                dataRooms.length > 0
            ) {
                getOurDoctors(
                    currentDoctors as ProfileDoctorT[],
                    dataRooms
                )
            }
        }, 500);
    }

    function onFilterSpecialist(): DataTableContentT[] {
        if (
            currentFilter.id === 'Specialist' &&
            selectCurrentFilter.id !== 'Select Specialist'
        ) {
            const filterSpecialist = dataColumns.filter(items => items.data[1].name === selectCurrentFilter.id)
            return filterSpecialist
        }
        return dataColumns
    }

    function onFilterRooms(): DataTableContentT[] {
        if (
            currentFilter.id === 'Rooms' &&
            selectCurrentFilter.id !== 'Select Room'
        ) {
            const filterRooms = dataColumns.filter(items => items.data[4].name === selectCurrentFilter.id)
            return filterRooms
        }
        return dataColumns
    }

    function getFilterText(): DataTableContentT[] {
        if (
            currentFilter.id === 'Specialist' &&
            selectCurrentFilter.id !== 'no filter' &&
            selectCurrentFilter.id !== 'Select Specialist'
        ) {
            const filterText = onFilterSpecialist().filter(items => {
                const findItem = items.data.filter(data => data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))

                return findItem
            })

            return filterText
        } else if (
            currentFilter.id === 'Rooms' &&
            selectCurrentFilter.id !== 'no filter' &&
            selectCurrentFilter.id !== 'Select Room'
        ) {
            const filterText = onFilterRooms().filter(items => {
                const findItem = items.data.filter(data => data.name.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))

                return findItem
            })

            return filterText
        }

        const filterText = dataColumns.filter(items => {
            const findItem = items.data?.filter(data => data?.name?.replace(specialCharacter, '')?.replace(spaceString, '')?.toLowerCase()?.includes(searchText?.replace(spaceString, '')?.toLowerCase()))

            return findItem.length > 0
        })

        return filterText
    }

    const resultFilterData: DataTableContentT[] = getFilterText()

    const pageSize: number = 5

    const currentTableData = useMemo((): DataTableContentT[] => {
        const firstPageIndex = (currentPage - 1) * pageSize
        const lastPageIndex = firstPageIndex + pageSize
        return resultFilterData.slice(firstPageIndex, lastPageIndex)
    }, [resultFilterData, currentPage])

    useEffect(() => {
        if (currentTableData.length === 0 && currentPage > 1) {
            setCurrentPage((current) => current - 1)
        }
    }, [idLoadingDelete, currentTableData])

    const lastPage: number = resultFilterData.length < 5 ? 1 : Math.ceil(resultFilterData.length / pageSize)
    const maxLength: number = 7

    const changeTableStyle = (currentData: DataTableContentT[]): void => {
        if (currentData.length > 0) {
            let elementTHead = document.getElementById('tHead0') as HTMLElement
            let elementTData = document.getElementById('tData00') as HTMLElement

            if (elementTHead !== null) {
                elementTHead = document.getElementById(`tHead0`) as HTMLElement
                elementTHead.style.width = 'calc(100%/4.5)'
            }
            if (elementTData !== null) {
                for (let i = 0; i < currentData.length; i++) {
                    elementTData = document.getElementById(`tData${i}0`) as HTMLElement
                    if (elementTData?.style) {
                        elementTData.style.width = 'calc(100%/4.5)'
                        elementTData.style.overflowX = 'auto'
                        elementTData = document.getElementById(`tData${i}2`) as HTMLElement
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

    // action delete
    function clickDelete(id: string): void {
        setIdLoadingDelete((current) => [...current, id])

        API().APIDeleteProfileDoctor(
            'doctor',
            id
        )
            .then(res => {
                preloadFetch(endpoint.getDoctors())
                    .then(doctor => {
                        if (doctor?.data) {
                            preloadDoctors(doctor.data)
                        } else {
                            deleteFailed()
                        }
                    })
                    .catch(err => {
                        deleteFailed()
                    })
                const doctor = res as { [key: string]: any }
                const removeLoadingId = idLoadingDelete.filter(doctorId => doctorId !== doctor?.doctorId)
                setIdLoadingDelete(removeLoadingId)
                alert('Delete successfully')
            })
            .catch(err => {
                deleteFailed()
            })
    }

    function deleteFailed(): void {
        pushTriggedErr('a server error occurred while deleting doctor data. please try again')
    }

    return {
        currentTableData,
        clickDelete,
        lastPage,
        maxLength,
        currentPage,
        setCurrentPage,
        indexActiveColumnMenu,
        setIndexActiveColumnMenu,
        idLoadingDelete
    }
}

export default UseTableColumns