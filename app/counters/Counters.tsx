'use client'

import { useState } from 'react'
import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { UseCounters } from "./UseCounters"
import { TableHead } from "components/table/TableHead"
import { TableColumns } from "components/table/TableColumns"
import { TableData } from "components/table/TableData"
import { TableFilter } from "components/table/TableFilter"
import { InputSearch } from "components/input/InputSearch"
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons"
import Pagination from "components/pagination/Pagination"
import Button from "components/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AddCounter } from "./AddCounter"
import { ActionsDataT, PopupSettings } from 'lib/types/TableT.type'
import { ContainerPopup } from 'components/popup/ContainerPopup'
import { SettingPopup } from 'components/popup/SettingPopup'
import { EditCounter } from './EditCounter'

export function Counters() {
    const [onModalSettings, setOnModalSettings] = useState<PopupSettings>({} as PopupSettings)

    const {
        head,
        currentTableData,
        lastPage,
        maxLength,
        indexActiveColumnMenu,
        currentPage,
        setCurrentPage,
        searchText,
        handleSearchText,
        clickCloseSearchTxt,
        clickNewCounter,
        onAddCounter,
        changeInputAddCounter,
        errInputAddCounter,
        inputAddCounter,
        loadingSubmitAddCounter,
        submitAddCounter,
        clickColumnMenu,
        clickEdit,
        idEditCounter,
        counterName,
        inputEditCounter,
        errInputEditCounter,
        onEditCounter,
        clickCloseEditCounter,
        changeInputEditCounter,
        loadingIdEditCounter,
        submitEditCounter
    } = UseCounters({ setOnModalSettings })

    return (
        <>
            {onAddCounter && (
                <AddCounter
                    clickCloseAddCounter={clickNewCounter}
                    changeInputAddCounter={changeInputAddCounter}
                    inputAddCounter={inputAddCounter}
                    errInputAddCounter={errInputAddCounter}
                    loadingSubmitAddCounter={loadingSubmitAddCounter}
                    submitAddCounter={submitAddCounter}
                />
            )}

            {onEditCounter && (
                <EditCounter
                    clickCloseEditCounter={clickCloseEditCounter}
                    counterName={counterName}
                    changeInputEditCounter={changeInputEditCounter}
                    inputEditCounter={inputEditCounter}
                    errInputEditCounter={errInputEditCounter}
                    loadingIdEditCounter={loadingIdEditCounter}
                    idEditCounter={idEditCounter as string}
                    submitEditCounter={submitEditCounter}
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

            <div
                className="flex justify-end"
            >
                <Button
                    iconLeft={<FontAwesomeIcon
                        icon={faPlus}
                        className="mr-2"
                    />}
                    nameBtn="New counter"
                    classBtn="hover:bg-white py-[7px]"
                    classLoading="hidden"
                    clickBtn={clickNewCounter}
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
                    </>
                }
                rightChild={<></>}
            />

            <ContainerTableBody>
                <TableBody>
                    <TableHead
                        data={head}
                        id='tHead'
                    />
                    <tbody>
                        {currentTableData.length > 0 ? currentTableData.map((loket, index) => {
                            const actionsData: ActionsDataT[] = [
                                {
                                    name: 'Edit',
                                    classWrapp: 'cursor-pointer',
                                    click: (e?: MouseEvent) => {
                                        clickEdit(loket.id, loket.data[0].name)
                                        e?.stopPropagation()
                                    }
                                },
                                {
                                    name: 'Delete',
                                    classWrapp: 'text-red-default cursor-pointer',
                                    click: (e?: MouseEvent) => {
                                        e?.stopPropagation()
                                    }
                                }
                            ]

                            return (
                                <TableColumns
                                    key={index}
                                    clickBtn={() => { return }}
                                >
                                    {loket.data.map((item, idx) => {
                                        return (
                                            <TableData
                                                key={idx}
                                                classWrappMenu={indexActiveColumnMenu === index && idx === head.length - 1 ? 'flex ml-[-6rem]' : 'hidden'}
                                                actionsData={actionsData}
                                                clickColumnMenu={() => clickColumnMenu(index)}
                                                styleAction={{
                                                    display: idx === head.length - 1 ? 'flex' : 'none'
                                                }}
                                                id={`tData${index}${idx}`}
                                                name={item.name}
                                            />
                                        )
                                    })}
                                </TableColumns>
                            )
                        }) : (
                            <tr
                                className='flex justify-center'
                            >
                                <td
                                    className='p-8'
                                >No counters data</td>
                            </tr>
                        )}
                    </tbody>
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