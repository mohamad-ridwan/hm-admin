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
import { ContainerPopup } from "components/popup/ContainerPopup"
import { SettingPopup } from "components/popup/SettingPopup"
import { ActionsDataT, PopupSettings } from "lib/types/TableT.type"

export function OurDoctor() {
    const [onModalSettings, setOnModalSettings] = useState<PopupSettings>({} as PopupSettings)
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
        submitEditDoctor,
    } = FormAddDoctor({ setOnModalSettings })

    const {
        currentTableData,
        lastPage,
        maxLength,
        currentPage,
        setCurrentPage,
        indexActiveColumnMenu,
        setIndexActiveColumnMenu,
        idLoadingDelete,
        openPopupDelete
    } = UseTableColumns({ currentFilter, selectCurrentFilter, searchText, setOnModalSettings })

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

            {onModalSettings?.title && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={onModalSettings.clickClose}
                        title={onModalSettings.title}
                        classIcon={onModalSettings.classIcon}
                        iconPopup={onModalSettings.iconPopup}
                    >
                        {onModalSettings.actionsData.length > 0 && onModalSettings.actionsData.map((btn, idx) => {
                            return (
                                <Button
                                    key={idx}
                                    nameBtn={btn.nameBtn}
                                    classBtn={btn.classBtn}
                                    classLoading={btn.classLoading}
                                    clickBtn={btn.clickBtn}
                                    styleBtn={btn.styleBtn}
                                />
                            )
                        })}
                    </SettingPopup>
                </ContainerPopup>
            )}

            {/* popup next / cancel */}
            {/* {onPopupSetting?.title && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={() => setOnPopupSetting({} as PopupSetting)}
                        title={onPopupSetting.title}
                        classIcon="text-font-color-2"
                        iconPopup={onPopupSetting.iconPopup}
                    >
                        <Button
                            nameBtn={onPopupSetting.nameBtnNext}
                            classBtn="hover:bg-white"
                            classLoading="hidden"
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.6rem',
                                marginTop: '0.5rem'
                            }}
                            clickBtn={() => {
                                if (onPopupSetting.categoryAction === 'delete-doctor') {
                                    clickDelete(onPopupSetting.doctorId as string)
                                    setOnPopupSetting({} as PopupSetting)
                                } else if (onPopupSetting.categoryAction === 'edit-doctor') {
                                    nextSubmitEditDoctor()
                                    setOnPopupSetting({} as PopupSetting)
                                } else if (onPopupSetting.categoryAction === 'add-doctor') {
                                    nextSubmitAddDoctor()
                                }
                            }}
                        />
                        <Button
                            nameBtn="Cancel"
                            classBtn="bg-white border-none"
                            classLoading="hidden"
                            styleBtn={{
                                padding: '0.5rem',
                                marginTop: '0.5rem',
                                color: '#495057'
                            }}
                            clickBtn={() => setOnPopupSetting({} as PopupSetting)}
                        />
                    </SettingPopup>
                </ContainerPopup>
            )} */}

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

                        const findCurrentLoading = idLoadingDelete.find(loadingId => loadingId === item.id)

                        const actionsData: ActionsDataT[] = [
                            {
                                name: 'Edit',
                                click: (e?: MouseEvent) => {
                                    clickEdit(item.id)
                                    setIndexActiveColumnMenu(null)
                                    e?.stopPropagation()
                                }
                            },
                            {
                                name: 'Delete',
                                classWrapp: findCurrentLoading ? 'text-not-allowed hover:text-[#f9f9f9] hover:bg-white cursor-not-allowed' : 'text-red-default cursor-pointer',
                                click: (e?: MouseEvent) => {
                                    openPopupDelete(item.id, item.data[0].name)
                                    e?.stopPropagation()
                                }
                            }
                        ]

                        return (
                            <TableColumns
                                key={index}
                                clickBtn={() => pathDoctor}
                                actionsData={actionsData}
                                classWrappMenu={indexActiveColumnMenu === index ? 'flex' : 'hidden'}
                                clickColumnMenu={() => {
                                    if (indexActiveColumnMenu === index) {
                                        setIndexActiveColumnMenu(null)
                                    } else {
                                        setIndexActiveColumnMenu(index)
                                    }
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