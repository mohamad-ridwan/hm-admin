'use client'

import { ContainerTableBody } from "components/table/ContainerTableBody"
import {useRouter} from 'next/navigation'
import { TableBody } from "components/table/TableBody"
import { FilterTable } from "./FilterTable"
import { TableHead } from "components/table/TableHead"
import { TableColumns } from "components/table/TableColumns"
import { TableData } from "components/table/TableData"
import { TableFilter } from "components/table/TableFilter"
import { InputSearch } from "components/input/InputSearch"
import { faCalendarDays, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { InputSelect } from "components/input/InputSelect"
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader"
import Pagination from "components/pagination/Pagination"
import { ActionsDataT } from "lib/types/TableT.type"

export function FinishedTreatment() {
    const {
        head,
        searchText,
        handleSearchText,
        closeSearch,
        filterBy,
        handleFilterBy,
        sortOptions,
        handleSort,
        currentFilterBy,
        displayOnCalendar,
        selectDate,
        handleInputDate,
        closeSearchDate,
        currentTableData,
        lastPage,
        maxLength,
        currentPage,
        setCurrentPage,
    } = FilterTable()

    const router = useRouter()

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
                            clickCloseSearch={closeSearch}
                        />

                        {displayOnCalendar && (
                            <InputSearch
                                icon={faCalendarDays}
                                classWrapp='mt-2'
                                placeholderText='Search Date'
                                onCalendar={true}
                                changeInput={handleInputDate}
                                selected={selectDate}
                                onCloseSearch={selectDate !== undefined}
                                renderCustomHeader={renderCustomHeader}
                                clickCloseSearch={closeSearchDate}
                            />
                        )}
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

                        {currentFilterBy !== 'Filter By' && (
                            <InputSelect
                                id='sortBy'
                                classWrapp='mt-2'
                                data={sortOptions}
                                handleSelect={handleSort}
                            />
                        )}
                    </>
                }
            />

            <ContainerTableBody>
                <TableBody
                    style={{
                        width: '1400px'
                    }}
                >
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {currentTableData.length > 0 ? currentTableData.map((patient, index) => {
                        const actionsData: ActionsDataT[] = [
                            {
                                name: 'Edit',
                                click: (e?: MouseEvent)=>{
                                    e?.stopPropagation()
                                }
                            },
                            {
                                name: 'Delete',
                                click: (e?: MouseEvent)=>{
                                    e?.stopPropagation()
                                }
                            }
                        ]

                        return (
                            <TableColumns
                                key={index}
                                clickBtn={() => router.push(patient.url as string)}
                                actionsData={actionsData}
                                classWrappMenu="hidden"
                            >
                                {patient.data.map((item, idx) => {
                                    return (
                                        <TableData
                                            key={idx}
                                            id={`tData${index}${idx}`}
                                            name={item.name}
                                            firstDesc={item?.firstDesc}
                                            styleFirstDesc={{
                                                color: item?.color,
                                                marginBottom: item?.marginBottom
                                            }}
                                            styleName={{
                                                fontSize: item?.fontSize,
                                                fontWeight: item?.fontWeightName,
                                                color: item?.colorName
                                            }}
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

            <div
                className='flex justify-end mt-4'
            >
                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    maxLength={maxLength}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </>
    )
}