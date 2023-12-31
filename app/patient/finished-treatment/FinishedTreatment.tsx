'use client'

import { useState } from "react"
import { ContainerTableBody } from "components/table/ContainerTableBody"
import { useRouter } from 'next/navigation'
import { TableBody } from "components/table/TableBody"
import { UseFinishTreatment } from "./UseFinishTreatment"
import { TableHead } from "components/table/TableHead"
import { TableColumns } from "components/table/TableColumns"
import { TableData } from "components/table/TableData"
import { TableFilter } from "components/table/TableFilter"
import { InputSearch } from "components/input/InputSearch"
import { faCalendarDays, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { InputSelect } from "components/input/InputSelect"
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader"
import Pagination from "components/pagination/Pagination"
import { ActionsDataT, PopupSettings } from "lib/types/TableT.type"
import { ContainerPopup } from "components/popup/ContainerPopup"
import { SettingPopup } from "components/popup/SettingPopup"
import Button from "components/Button"
import FormPatientRegistration from "../patient-registration/FormPatientRegistration"
import EditPatientRegistration from "../patient-registration/EditPatientRegistration"
import { EditFinishTreatment } from "./EditFinishTreatment"
import LoadingSpinner from "components/LoadingSpinner"

export function FinishedTreatment() {
    const [onModalSettings, setOnModalSettings] = useState<PopupSettings>({} as PopupSettings)

    const {
        clickEdit,
        onPopupEdit,
        valueInputEditDetailPatient,
        clickClosePopupEdit,
        patientName,
        errEditInputDetailPatient,
        changeEditDetailPatient,
        changeDateEditDetailPatient,
        handleSubmitUpdate,
        setOnPopupEdit,
        idPatientToEdit,
        idLoadingEdit,
        nextSubmitUpdate
    } = FormPatientRegistration({ setOnModalSettings })

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
        // currentTableData,
        dataColumns,
        lastPage,
        maxLength,
        currentPage,
        setCurrentPage,
        clickColumnMenu,
        indexActiveTableMenu,
        clickEditFinishTreatment,
        openPopupEdit,
        setIndexActiveTableMenu,
        onPopupEditFinishTreatment,
        clickClosePopupEditFT,
        changeEditFT,
        patientNameEditFT,
        errInputEditFinishTreatment,
        inputEditFinishTreatment,
        changeDateEditFT,
        handleSelectEditFT,
        optionsAdminEmail,
        isPatientCanceled,
        submitEditFinishTreatment,
        loadingIdSubmitEditFT,
        idPatientEditFT,
        clickDeleteFT,
        loadingIdDeleteFT,
        loadingDataTable
    } = UseFinishTreatment({ setOnModalSettings, setOnPopupEdit })

    const router = useRouter()

    return (
        <>
            {onPopupEdit && (
                <EditPatientRegistration
                    valueInputEditDetailPatient={valueInputEditDetailPatient}
                    patientName={patientName}
                    errEditInputDetailPatient={errEditInputDetailPatient}
                    clickClosePopupEdit={clickClosePopupEdit}
                    changeDateEditDetailPatient={changeDateEditDetailPatient}
                    changeEditDetailPatient={changeEditDetailPatient}
                    handleSubmitUpdate={handleSubmitUpdate}
                    idPatientToEdit={idPatientToEdit}
                    idLoadingEdit={idLoadingEdit}
                />
            )}
            {onPopupEditFinishTreatment && (
                <EditFinishTreatment
                    clickClosePopupEditFT={clickClosePopupEditFT}
                    changeEditFT={changeEditFT}
                    patientName={patientNameEditFT}
                    errInputEditFinishTreatment={errInputEditFinishTreatment}
                    inputEditFinishTreatment={inputEditFinishTreatment}
                    changeDateEditFT={changeDateEditFT}
                    handleSelectEditFT={handleSelectEditFT}
                    optionsAdminEmail={optionsAdminEmail}
                    isPatientCanceled={isPatientCanceled}
                    loadingIdSubmitEditFT={loadingIdSubmitEditFT}
                    idPatientEditFT={idPatientEditFT}
                    submitEditFinishTreatment={submitEditFinishTreatment}
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

            {/* table filter */}
            <TableFilter
                leftChild={
                    <>
                        <Button
                            nameBtn='Refresh'
                            classLoading='hidden'
                            classBtn='w-fit hover:bg-white mb-3'
                            clickBtn={() => window.location.reload()}
                        />
                        
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
                <div
                    style={{
                        height: '1.5rem',
                        width: '1.5rem'
                    }}
                >
                    {loadingDataTable && (
                        <LoadingSpinner
                            style={{
                                height: '1.5rem',
                                width: '1.5rem'
                            }}
                        />
                    )}
                </div>
                <TableBody>
                    <TableHead
                        data={head}
                        id='tHead'
                    />
                    <tbody>
                        {dataColumns.length > 0 ? dataColumns.map((patient, index) => {
                            const findIdLoadingDelete = loadingIdDeleteFT.find(id => id === patient.id)

                            const actionsData: ActionsDataT[] = [
                                {
                                    name: 'Edit',
                                    click: (e?: MouseEvent) => {
                                        clickEdit(patient.id, patient.data[0].name)
                                        clickEditFinishTreatment(patient.id, patient.data[0].name)
                                        openPopupEdit()
                                        setIndexActiveTableMenu(null)
                                        e?.stopPropagation()
                                    }
                                },
                                {
                                    name: 'Delete',
                                    classWrapp: findIdLoadingDelete ? 'text-not-allowed hover:bg-white hover:text-[#8f8f8f] cursor-not-allowed' : 'cursor-pointer text-red-default',
                                    click: (e?: MouseEvent) => {
                                        if (!findIdLoadingDelete) {
                                            clickDeleteFT(patient.id, patient.data[0].name)
                                            setIndexActiveTableMenu(null)
                                        }
                                        e?.stopPropagation()
                                    }
                                }
                            ]

                            return (
                                <TableColumns
                                    key={index}
                                    clickBtn={() => router.push(patient.url as string)}
                                >
                                    {patient.data.map((item, idx) => {
                                        return (
                                            <TableData
                                                key={idx}
                                                classWrappMenu={indexActiveTableMenu === index && idx === head.length - 1 ? 'flex ml-[-6rem]' : 'hidden'}
                                                actionsData={actionsData}
                                                clickColumnMenu={() => clickColumnMenu(index)}
                                                styleAction={{
                                                    display: idx === head.length - 1 ? 'flex' : 'none'
                                                }}
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
                            <tr
                                className='flex justify-center'
                            >
                                <td
                                    className='p-8'
                                >No patient completed data</td>
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