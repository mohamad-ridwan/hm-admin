'use client'

import { ChangeEvent, useEffect, useState } from "react"
import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { TableHead } from "components/table/TableHead"
import { TableColumns } from "components/table/TableColumns"
import ServicingHours from "lib/actions/ServicingHours"
import { DataOptionT, DataTableContentT } from "lib/types/FilterT"
import { ProfileDoctorT } from "lib/types/DoctorsT.types"
import { RoomTreatmentT } from "lib/types/PatientT.types"
import { TableData } from "components/table/TableData"
import { TableFilter } from "components/table/TableFilter"
import { InputSearch } from "components/input/InputSearch"
import { faCalendarDays, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { renderCustomHeader } from "lib/dates/renderCustomHeader"
import { InputSelect } from "components/input/InputSelect"

export function OurDoctor() {
    const [dataColumns, setDataColumns] = useState<DataTableContentT[]>([])
    const [searchText, setSearchText] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(false)
    const [selectDate, setSelectDate] = useState<Date | undefined>()
    const [head, setHead] = useState<{ name: string }[]>([
        {
            name: 'Name'
        },
        {
            name: 'Specialist'
        },
        {
            name: 'Email'
        },
        {
            name: 'Phone'
        },
        {
            name: 'Practice Room'
        },
        {
            name: 'Id Doctor'
        }
    ])
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

    const handleSearchText = (e?: ChangeEvent<HTMLInputElement>): void => {
        setSearchText(e?.target.value as string)
    }

    const handleInputDate = (e?: Date | ChangeEvent<HTMLInputElement>): void => {
        setSelectDate(e as Date)
        setCurrentPage(1)
    }

    const handleFilterBy = ():void=>{
        const selectEl = document.getElementById('filterBy') as HTMLSelectElement
        const id = selectEl?.options[selectEl.selectedIndex].value
        if(id){

        }
    }

    return (
        <>
            {/* table filter */}
            <TableFilter
                leftChild={
                    <>
                        <InputSearch
                            icon={faMagnifyingGlass}
                            classWrapp='mt-2'
                            placeHolder='Search Text'
                            onCloseSearch={searchText.length > 0}
                            valueText={searchText}
                            changeInput={handleSearchText}
                            clickCloseSearch={() => {
                                setCurrentPage(1)
                                setSearchText('')
                            }}
                        />
                        {/* not used for now */}
                        {/* {displayOnCalendar && (
                            <InputSearch
                                icon={faCalendarDays}
                                classWrapp='mt-2'
                                placeHolder='Search Date'
                                placeholderText='Search Date'
                                onCalendar={true}
                                changeInput={handleInputDate}
                                selected={selectDate}
                                onCloseSearch={selectDate !== undefined}
                                renderCustomHeader={renderCustomHeader}
                                clickCloseSearch={() => {
                                    setCurrentPage(1)
                                    setSelectDate(undefined)
                                }}
                            />
                        )} */}
                    </>
                }
                rightChild={
                    <>
                        <InputSelect
                            id='filterDateTable'
                            classWrapp='mt-2'
                            data={filterBy}
                            handleSelect={handleFilterBy}
                        />
                    </>
                }
            />

            <ContainerTableBody>
                <TableBody>
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {dataColumns.length > 0 ? dataColumns.map((item, index) => {
                        const pathDoctor = `/doctors/profile/${item.id}`

                        return (
                            <TableColumns
                                key={index}
                                clickBtn={() => pathDoctor}
                                clickEdit={(e) => {
                                    e?.stopPropagation()
                                }}
                                clickDelete={(e) => {
                                    e?.stopPropagation()
                                }}
                            >
                                {item.data.map((dataItem, indexData) => {
                                    return (
                                        <TableData
                                            key={indexData}
                                            id={`tData${index}${indexData}`}
                                            name={dataItem.name}
                                        />
                                    )
                                })}
                            </TableColumns>
                        )
                    }) : (
                        <div
                            className='flex justify-center'
                        >
                            <p
                                className='p-8'
                            >No patient registration data</p>
                        </div>
                    )}

                </TableBody>
            </ContainerTableBody>
        </>
    )
}