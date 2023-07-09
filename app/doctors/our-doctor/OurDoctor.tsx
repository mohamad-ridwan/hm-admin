'use client'

import { useEffect, useState } from "react"
import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { TableHead } from "components/table/TableHead"
import { TableColumns } from "components/table/TableColumns"
import { TableData } from "components/table/TableData"
import { TableFilter } from "components/table/TableFilter"
import { InputSearch } from "components/input/InputSearch"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { InputSelect } from "components/input/InputSelect"
import UseTableColumns from "./UseTableColumns"
import UseTableFilter from "./UseTableFilter"

export function OurDoctor() {
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

    const {
        searchText,
        handleSearchText,
        setCurrentPage,
        setSearchText,
        handleFilterBy,
        filterBy,
        currentFilter,
        chooseFilter,
        handleCurrentFilter,
        selectCurrentFilter,
    } = UseTableFilter()

    const {
        dataColumns,
        resultFilterData
    } = UseTableColumns({currentFilter, selectCurrentFilter, searchText})

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
                            id='filterBy'
                            classWrapp='mt-2'
                            data={filterBy}
                            handleSelect={handleFilterBy}
                        />
                        {currentFilter.id !== 'Filter By' && (
                            <InputSelect
                            id='currentFilter'
                            classWrapp='mt-2'
                            data={chooseFilter}
                            handleSelect={handleCurrentFilter}
                        />
                        )}
                    </>
                }
            />

            <ContainerTableBody>
                <TableBody>
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {resultFilterData.length > 0 ? resultFilterData.map((item, index) => {
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