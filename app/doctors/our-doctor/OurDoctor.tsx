'use client'

import { useState } from "react"
import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { TableHead } from "components/table/TableHead"
import { TableColumns } from "components/table/TableColumns"
import { TableData } from "components/table/TableData"
import { TableFilter } from "components/table/TableFilter"
import { InputSearch } from "components/input/InputSearch"
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons"
import { InputSelect } from "components/input/InputSelect"
import UseTableColumns from "./UseTableColumns"
import UseTableFilter from "./UseTableFilter"
import Button from "components/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import FormAddDoctor from "./FormAddDoctor"
import { AddDoctor } from "./AddDoctor"
import { AddMedsos } from "./AddMedsos"
import { AddDoctorSchedule } from "./AddDoctorSchedule"
import { AddHolidaySchedule } from "./AddHolidaySchedule"
import Image from "next/image"
import Pagination from "components/pagination/Pagination"
import profileDefault from 'images/user.png'

export function OurDoctor() {
    const [head] = useState<{ name: string }[]>([
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
        setSearchText,
        handleFilterBy,
        filterBy,
        currentFilter,
        chooseFilter,
        handleCurrentFilter,
        selectCurrentFilter,
    } = UseTableFilter()

    const {
        onPopupAddDoctor,
        closePopupAddDoctor,
        clickNewDoctor,
        inputValueAddDoctor,
        errInputAddDoctor,
        clickOpenImage,
        getImgFile,
        deleteImg,
        changeInputAddDoctor,
        onAddMedsos,
        onPopupAddMedsos,
        inputAddMedsos,
        errInputAddMedsos,
        submitAddMedsos,
        changeInputAddMedsos,
        deleteMedsos,
        onPopupAddDoctorSchedule,
        onAddDoctorSchedule,
        inputAddDoctorSchedule,
        errInputAddDoctorSchedule,
        submitAddDoctorSchedule,
        changeInputAddDocSchedule,
        selectDayAddDoctorSchedule,
        deleteSchedule,
        onPopupAddHolidaySchedule,
        onAddHolidaySchedule,
        inputAddHolidaySchedule,
        errInputAddHolidaySchedule,
        deleteHolidaySchedule,
        selectHolidayDate,
        submitAddHolidaySchedule,
        submitAddDoctor,
        loadingSubmitAddDoctor,
        selectRoomDoctor,
        roomOptions,
        titleFormDoctor,
        // action edit doctor
        idLoadingEdit,
        idEditDoctor,
        clickEdit,
        submitEditDoctor
    } = FormAddDoctor()

    const {
        currentTableData,
        clickDelete,
        lastPage,
        maxLength,
        currentPage,
        setCurrentPage
    } = UseTableColumns({ currentFilter, selectCurrentFilter, searchText })

    return (
        <>
            {/* popup add new doctor */}
            {onPopupAddDoctor && (
                <AddDoctor
                    titleFormDoctor={titleFormDoctor}
                    loadingSubmitAddDoctor={loadingSubmitAddDoctor}
                    inputValueAddDoctor={inputValueAddDoctor}
                    clickClosePopupEdit={closePopupAddDoctor}
                    errInputAddDoctor={errInputAddDoctor}
                    rooms={roomOptions}
                    idLoadingEdit={idLoadingEdit}
                    idEditDoctor={idEditDoctor}
                    clickOpenImage={clickOpenImage}
                    getImgFile={getImgFile}
                    deleteImg={deleteImg}
                    changeInputAddDoctor={changeInputAddDoctor}
                    onAddMedsos={onAddMedsos}
                    deleteMedsos={deleteMedsos}
                    onAddDoctorSchedule={onAddDoctorSchedule}
                    deleteSchedule={deleteSchedule}
                    deleteHolidaySchedule={deleteHolidaySchedule}
                    onAddHolidaySchedule={onAddHolidaySchedule}
                    submitAddDoctor={submitAddDoctor}
                    selectRoomDoctor={selectRoomDoctor}
                    submitEditDoctor={submitEditDoctor}
                />
            )}

            {/* popup edit doctor */}

            {/* popup add medsos */}
            {onPopupAddMedsos && (
                <AddMedsos
                    onAddMedsos={onAddMedsos}
                    submitAddMedsos={submitAddMedsos}
                    inputAddMedsos={inputAddMedsos}
                    errInputAddMedsos={errInputAddMedsos}
                    changeInputAddMedsos={changeInputAddMedsos}
                />
            )}

            {/* popup add doctor schedule */}
            {onPopupAddDoctorSchedule && (
                <AddDoctorSchedule
                    onAddDoctorSchedule={onAddDoctorSchedule}
                    submitAddDoctorSchedule={submitAddDoctorSchedule}
                    inputAddDoctorSchedule={inputAddDoctorSchedule}
                    errInputAddDoctorSchedule={errInputAddDoctorSchedule}
                    changeInputAddDocSchedule={changeInputAddDocSchedule}
                    selectDayAddDoctorSchedule={selectDayAddDoctorSchedule}
                />
            )}

            {/* popup add holiday schedule */}
            {onPopupAddHolidaySchedule && (
                <AddHolidaySchedule
                    onAddHolidaySchedule={onAddHolidaySchedule}
                    inputAddHolidaySchedule={inputAddHolidaySchedule}
                    errInputAddHolidaySchedule={errInputAddHolidaySchedule}
                    selectHolidayDate={selectHolidayDate}
                    submitAddHolidaySchedule={submitAddHolidaySchedule}
                />
            )}

            {/* add new doctor */}
            <div
                className="flex justify-end"
            >
                <Button
                    iconLeft={<FontAwesomeIcon
                        icon={faPlus}
                        className="mr-2"
                    />}
                    nameBtn="New doctor"
                    classBtn="hover:bg-white py-[7px]"
                    classLoading="hidden"
                    clickBtn={clickNewDoctor}
                />
            </div>

            {/* table filter */}
            <TableFilter
                leftChild={
                    <>
                        <InputSearch
                            icon={faMagnifyingGlass}
                            classWrapp='mt-2 mr-2'
                            placeHolder='Search Text'
                            onCloseSearch={searchText.length > 0}
                            valueText={searchText}
                            changeInput={handleSearchText}
                            clickCloseSearch={() => {
                                setCurrentPage(1)
                                setSearchText('')
                            }}
                        />
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

                    {currentTableData.length > 0 ? currentTableData.map((item, index) => {
                        const pathDoctor = `/doctors/profile/${item.id}`

                        return (
                            <TableColumns
                                key={index}
                                idIconDelete={`iconDelete${item.id}`}
                                idLoadingDelete={`loadingDelete${item.id}`}
                                clickBtn={() => pathDoctor}
                                clickEdit={(e) => {
                                    clickEdit(item.id)
                                    e?.stopPropagation()
                                }}
                                clickDelete={(e) => {
                                    clickDelete(item.id)
                                    e?.stopPropagation()
                                }}
                            >
                                {item.data.map((dataItem, indexData) => {
                                    return (
                                        <TableData
                                            key={indexData}
                                            id={`tData${index}${indexData}`}
                                            name={dataItem.name}
                                            leftName={
                                                indexData === 0 &&
                                                    dataItem?.image?.includes('https')
                                                    ?
                                                    <Image
                                                        alt={dataItem.name}
                                                        src={dataItem.image}
                                                        height={10}
                                                        width={10}
                                                        className="rounded-full mr-2 h-[35px] w-[35px] object-cover"
                                                    /> : indexData === 0 ?
                                                        <Image
                                                            alt={dataItem.name}
                                                            src={profileDefault}
                                                            height={10}
                                                            width={10}
                                                            className="rounded-full mr-2 h-[35px] w-[35px] object-cover"
                                                        /> : <></>
                                            }
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