'use client'

import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { UseRooms } from "./UseRooms"
import { TableHead } from "components/table/TableHead"
import { TableFilter } from "components/table/TableFilter"
import { InputSearch } from "components/input/InputSearch"
import { faCalendarDays, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons"
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader"
import { TableColumns } from "components/table/TableColumns"
import { TableData } from "components/table/TableData"
import { ActionsDataT } from "lib/types/TableT.type"
import Pagination from "components/pagination/Pagination"
import Button from "components/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export function Rooms() {
    const {
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
    } = UseRooms()

    return (
        <>
            <div
                className="flex justify-end"
            >
                <Button
                    iconLeft={<FontAwesomeIcon
                        icon={faPlus}
                        className="mr-2"
                    />}
                    nameBtn="New room"
                    classBtn="hover:bg-white py-[7px]"
                    classLoading="hidden"
                    clickBtn={clickNewRoom}
                />
            </div>

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
                            clickCloseSearch={clickCloseSearchTxt}
                        />
                        {/* {displayOnCalendar && (
                            <InputSearch
                                icon={faCalendarDays}
                                classWrapp='mt-2'
                                placeholderText='Search Date'
                                onCalendar={true}
                                changeInput={handleSearchDate}
                                selected={selectDate}
                                onCloseSearch={selectDate !== undefined}
                                renderCustomHeader={renderCustomHeader}
                                clickCloseSearch={clickCloseSearchDate}
                            />
                        )} */}
                    </>
                }
                rightChild={<></>}
            />

            <ContainerTableBody>
                <TableBody
                    width="w-full"
                >
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {currentTableData.length > 0 ? currentTableData.map((room, index) => {
                        const actionsData: ActionsDataT[] = [
                            {
                                name: 'Edit',
                                classWrapp: 'cursor-pointer',
                                click: (e?: MouseEvent) => {
                                    e?.stopPropagation()
                                }
                            },
                            {
                                name: 'Delete',
                                classWrapp: 'text-red-default cursor-pointer',
                                click: (e?: MouseEvent) => {
                                    e?.stopPropagation()
                                }
                            },
                        ]

                        return (
                            <TableColumns
                                key={index}
                                classWrappMenu={indexActiveColumnMenu === index ? 'flex' : 'hidden'}
                                actionsData={actionsData}
                                clickBtn={() => { return }}
                                clickColumnMenu={() => clickColumnMenu(index)}
                            >
                                {room.data.map((item, idx) => {
                                    return (
                                        <TableData
                                            key={idx}
                                            id={`tData${index}${idx}`}
                                            name={item.name}
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
                            >No counters data</p>
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