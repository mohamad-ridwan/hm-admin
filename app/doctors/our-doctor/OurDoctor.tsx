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
        changeInputAddMedsos
    } = FormAddDoctor()

    const {
        resultFilterData
    } = UseTableColumns({ currentFilter, selectCurrentFilter, searchText })

    return (
        <>
            {/* popup add new doctor */}
            {onPopupAddDoctor && (
                <AddDoctor
                    inputValueAddDoctor={inputValueAddDoctor}
                    clickClosePopupEdit={closePopupAddDoctor}
                    errInputAddDoctor={errInputAddDoctor}
                    clickOpenImage={clickOpenImage}
                    getImgFile={getImgFile}
                    deleteImg={deleteImg}
                    changeInputAddDoctor={changeInputAddDoctor}
                    onAddMedsos={onAddMedsos}
                />
            )}

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
                    classBtn="hover:bg-white py-[0.5rem]"
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