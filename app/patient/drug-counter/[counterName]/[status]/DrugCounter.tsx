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
import { FormPopup } from "components/popup/FormPopup";
import { TitleInput } from "components/input/TitleInput";
import Input from "components/input/Input";
import ErrorInput from "components/input/ErrorInput";
import LoadingSpinner from "components/LoadingSpinner";

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
        dataColumns,
        loadingDataTable,
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
        loadingIdSubmitEditPatientC,
        editActiveManualQueue,
        toggleChangeManualQueue,
        toggleSetAutoQueue,
        disableUpdtQueue,
        nameEditPatientCounter,
        clickCancelTreatment,
        onMsgCancelTreatment,
        cancelOnMsgCancelPatient,
        handleCancelMsg,
        submitCancelTreatment,
        inputMsgCancelPatient,
        clickDeletePatient
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
                    namePatient={nameEditPatientCounter}
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
                    editActiveManualQueue={editActiveManualQueue}
                    toggleChangeManualQueue={toggleChangeManualQueue}
                    toggleSetAutoQueue={toggleSetAutoQueue}
                    disableUpdtQueue={disableUpdtQueue}
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

            {onMsgCancelTreatment && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <FormPopup
                        tag="div"
                        clickClose={cancelOnMsgCancelPatient}
                        title="Messages for canceled patients"
                    >
                        <TitleInput title='Message' />
                        <Input
                            type='text'
                            nameInput='messageCancelled'
                            changeInput={handleCancelMsg}
                            valueInput={inputMsgCancelPatient}
                        />
                        <ErrorInput
                            error={inputMsgCancelPatient.length === 0 ? 'Must be required' : ''}
                        />

                        <div
                            className="flex flex-wrap justify-end"
                        >
                            <Button
                                nameBtn="Confirm"
                                classBtn="hover:bg-white"
                                classLoading="hidden"
                                styleBtn={{
                                    padding: '0.5rem',
                                    marginTop: '0.5rem',
                                }}
                                clickBtn={submitCancelTreatment}
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
                                clickBtn={cancelOnMsgCancelPatient}
                            />
                        </div>
                    </FormPopup>
                </ContainerPopup>
            )}

            {/* table filter */}
            <TableFilter
                leftChild={
                    <>
                        <Button
                            nameBtn='Refresh'
                            classLoading='hidden'
                            classBtn='w-fit hover:bg-white'
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
                                    classWrapp: findIdLoadingCancelT || params.status === 'already-confirmed' ? 'text-not-allowed hover:bg-white hover:text-[#8f8f8f] cursor-not-allowed' : 'cursor-pointer text-pink-old',
                                    click: (e?: MouseEvent) => {
                                        if (params.status !== 'already-confirmed') {
                                            clickCancelTreatment(patient.id, patient.data[0].name)
                                        }
                                        e?.stopPropagation()
                                    }
                                },
                                {
                                    name: 'Delete',
                                    classWrapp: findIdLoadingDelete ? 'text-not-allowed hover:bg-white hover:text-[#8f8f8f] cursor-not-allowed' : 'cursor-pointer text-red-default',
                                    click: (e?: MouseEvent) => {
                                        clickDeletePatient(patient.id, patient.data[0].name)
                                        e?.stopPropagation()
                                    }
                                }
                            ]

                            return (
                                <TableColumns
                                    key={index}
                                    clickBtn={() => router.push(pathUrlToDataDetail)}
                                >
                                    {patient.data.map((item, idx) => {
                                        return (
                                            <TableData
                                                key={idx}
                                                classWrappMenu={indexActiveTableMenu === index && idx === head.length - 1 ? 'flex ml-[-10rem]' : 'hidden'}
                                                clickColumnMenu={() => clickColumnMenu(index)}
                                                actionsData={actionsData}
                                                styleAction={{
                                                    display: idx === head.length - 1 ? 'flex' : 'none'
                                                }}
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
                            <tr
                                className='flex justify-center'
                            >
                                <td
                                    className='p-8'
                                >No patient registration data</td>
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