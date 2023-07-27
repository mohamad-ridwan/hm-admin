'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContainerTableBody } from "components/table/ContainerTableBody";
import { TableBody } from "components/table/TableBody";
import { UseDrugCounter } from "./UseDrugCounter";
import { TableHead } from "components/table/TableHead";
import Pagination from "components/pagination/Pagination";
import { TableColumns } from "components/table/TableColumns";
import { TableData } from "components/table/TableData";
import { TableFilter } from "components/table/TableFilter";
import { InputSearch } from "components/input/InputSearch";
import { faCalendarDays, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader";
import { InputSelect } from "components/input/InputSelect";
import { specialCharacter } from "lib/regex/specialCharacter";
import { spaceString } from "lib/regex/spaceString";
import { ActionsDataT, PopupSettings } from "lib/types/TableT.type";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { SettingPopup } from "components/popup/SettingPopup";
import Button from "components/Button";
import FormPatientRegistration from "app/patient/patient-registration/FormPatientRegistration";
import EditPatientRegistration from "app/patient/patient-registration/EditPatientRegistration";
import { EditPatientCounter } from "./EditPatientCounter";

type ParamsProps = {
    params: {
        counterName: string
        status: string
    }
}

export function DrugCounter({ params }: ParamsProps) {
    const [onModalSettings, setOnModalSettings] = useState<PopupSettings>({} as PopupSettings)
    const router = useRouter()

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
    } = FormPatientRegistration({ setOnModalSettings })

    const {
        head,
        currentPage,
        setCurrentPage,
        lastPage,
        maxLength,
        currentTableData,
        searchText,
        handleSearchText,
        closeSearch,
        displayOnCalendar,
        selectDate,
        closeDate,
        handleInputDate,
        filterBy,
        handleFilterBy,
        currentFilterBy,
        dataSortByFilter,
        handleSortCategory,
        clickColumnMenu,
        indexActiveTableMenu,
        setIndexActiveTableMenu,
        idLoadingCancelTreatment,
        loadingIdPatientsDelete,
        openPopupEdit,
        clickEditPatientCounter,
        closePopupEditPatientC,
        onPopupEditPatientCounter,
        changeEditPatientC,
        handleSelectCounter,
        handleChangeDate,
        inputValueEditPatientC,
        errInputValueEditPatientC,
        selectCounter,
        selectEmailAdmin,
        setValue,
        value,
        submitEditPatientCounter,
        idToEditPatientCounter,
        loadingIdSubmitEditPatientC
    } = UseDrugCounter({ params, setOnModalSettings, onModalSettings, setOnPopupEdit })

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
            {onPopupEditPatientCounter && (
                <EditPatientCounter
                    namePatient={'ridwan'}
                    closePopupEditPatientC={closePopupEditPatientC}
                    changeEditPatientC={changeEditPatientC}
                    inputValueEditPatientC={inputValueEditPatientC}
                    errInputValueEditPatientC={errInputValueEditPatientC}
                    selectCounter={selectCounter}
                    selectEmailAdmin={selectEmailAdmin}
                    handleSelectCounter={handleSelectCounter}
                    setValue={setValue}
                    value={value}
                    handleChangeDate={handleChangeDate}
                    submitEditPatientCounter={submitEditPatientCounter}
                    idToEditPatientCounter={idToEditPatientCounter}
                    loadingIdSubmitEditPatientC={loadingIdSubmitEditPatientC}
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
                                selected={selectDate}
                                onCloseSearch={selectDate !== undefined}
                                renderCustomHeader={renderCustomHeader}
                                clickCloseSearch={closeDate}
                                changeInput={handleInputDate}
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
                        {
                            currentFilterBy.id !== 'Filter By' && (
                                <InputSelect
                                    id='sortByFilter'
                                    classWrapp='mt-2'
                                    data={dataSortByFilter}
                                    handleSelect={handleSortCategory}
                                />
                            )
                        }
                    </>
                }
            />

            <ContainerTableBody>
                <TableBody style={{
                    width: '1500px'
                }}>
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {currentTableData.length > 0 ? currentTableData.map((patient, index) => {
                        const cleanName = patient.data[0]?.name.replace(specialCharacter, '')
                        const namePatient = cleanName.replace(spaceString, '')
                        const status = params?.status !== 'already-confirmed' ? 'not-yet-confirmed' : 'confirmed'
                        const queueNumber = patient.data[1].name

                        const pathUrlToDataDetail = `/patient/patient-registration/personal-data/confirmed/${namePatient}/${patient.id}/counter/${params?.counterName}/${status}/${queueNumber}`

                        const findIdLoadingCancelT = idLoadingCancelTreatment.find(id => id === patient.id)
                        const findIdLoadingDelete = loadingIdPatientsDelete.find(id => id === patient.id)

                        const actionsData: ActionsDataT[] = [
                            {
                                name: 'Edit',
                                click: (e?: MouseEvent) => {
                                    clickEdit(patient.id, patient.data[0].name)
                                    clickEditPatientCounter(patient.id, patient.data[0].name)
                                    openPopupEdit()
                                    setIndexActiveTableMenu(null)
                                    e?.stopPropagation()
                                }
                            },
                            {
                                name: 'Cancel Treatment',
                                classWrapp: findIdLoadingCancelT ? 'text-not-allowed hover:bg-white hover:text-not-allowed cursor-not-allowed' : 'cursor-pointer text-pink-old',
                                click: (e?: MouseEvent) => {
                                    e?.stopPropagation()
                                }
                            },
                            {
                                name: 'Delete',
                                classWrapp: findIdLoadingDelete ? 'text-not-allowed hover:bg-white hover:text-not-allowed cursor-not-allowed' : 'cursor-pointer text-red-default',
                                click: (e?: MouseEvent) => {
                                    e?.stopPropagation()
                                }
                            }
                        ]

                        return (
                            <TableColumns
                                key={index}
                                classWrappMenu={indexActiveTableMenu === index ? 'flex' : 'hidden'}
                                clickBtn={() => router.push(pathUrlToDataDetail)}
                                clickColumnMenu={() => clickColumnMenu(index)}
                                actionsData={actionsData}
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
                                                marginBottom: item?.marginBottom,
                                                fontWeight: item?.fontWeightFirstDesc
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