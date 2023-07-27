'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { TableHead } from "components/table/TableHead"
import { TableFilter } from 'components/table/TableFilter'
import { InputSearch } from 'components/input/InputSearch'
import { faBan, faCalendarDays, faMagnifyingGlass, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { InputSelect } from 'components/input/InputSelect'
import { renderCustomHeader } from 'lib/datePicker/renderCustomHeader'
import Pagination from 'components/pagination/Pagination'
import { TableColumns } from 'components/table/TableColumns'
import { TableData } from 'components/table/TableData'
import { ContainerPopup } from 'components/popup/ContainerPopup'
import { SettingPopup } from 'components/popup/SettingPopup'
import Button from 'components/Button'
import { authStore } from 'lib/useZustand/auth'
import EditPatientRegistration from 'app/patient/patient-registration/EditPatientRegistration'
import EditPatientConfirmation from 'app/patient/confirmation-patient/EditPatientConfirmation'
import FormPatientRegistration from 'app/patient/patient-registration/FormPatientRegistration'
import FormPatientConfirmation from 'app/patient/confirmation-patient/FormPatientConfirmation'
import { FilterTable } from './FilterTable'
import { DeletePatient } from './DeletePatient'
import { specialCharacter } from 'lib/regex/specialCharacter'
import { spaceString } from 'lib/regex/spaceString'
import { ActionsDataT, PopupSetting, PopupSettings } from 'lib/types/TableT.type'
import { FormPopup } from 'components/popup/FormPopup'
import { TitleInput } from 'components/input/TitleInput'
import Input from 'components/input/Input'
import ErrorInput from 'components/input/ErrorInput'

export function ConfirmationPatient() {
    const [onPopupSetting, setOnPopupSetting] = useState<PopupSetting>({} as PopupSetting)
    const [onModalSettings, setOnModalSettings] = useState<PopupSettings>({} as PopupSettings)

    // Form edit patient registration
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

    // form edit confirm patient
    const {
        onPopupEditConfirmPatient,
        clickEditToConfirmPatient,
        valueInputEditConfirmPatient,
        nameEditConfirmPatient,
        errEditInputConfirmPatient,
        closePopupEditConfirmPatient,
        onPopupSettings,
        setOnPopupSettings,
        changeEditConfirmPatient,
        selectEmailAdmin,
        handleInputSelectConfirmPatient,
        changeDateConfirm,
        selectDoctorSpecialist,
        loadDataDoctor,
        loadDataRoom,
        selectDoctor,
        selectRoom,
        editActiveManualQueue,
        toggleChangeManualQueue,
        toggleSetAutoQueue,
        // selectPresence,
        idPatientToEditConfirmPatient,
        submitEditConfirmPatient,
        clickOnEditConfirmPatient,
        idLoadingEditConfirmPatient,
        nextSubmitEditConfirmPatient,
        openPopupEdit
    } = FormPatientConfirmation({ setOnPopupSetting, setOnModalSettings, setOnPopupEdit })

    const {
        head,
        searchText,
        setSearchText,
        handleSearchText,
        currentPage,
        setCurrentPage,
        displayOnCalendar,
        selectDate,
        setSelectDate,
        handleInputDate,
        dataFilterRoom,
        handleFilterByRoom,
        chooseFilterByDate,
        filterBy,
        handleFilterDate,
        currentTableData,
        lastPage,
        maxLength,
        dataSortDate,
        handleSortCategory,
        indexActiveTableMenu,
        clickColumnMenu,
        setIndexActiveTableMenu
    } = FilterTable()

    // zustand store
    const { user } = authStore()

    const {
        clickDeleteIcon,
        namePatientToDelete,
        onPopupChooseDelete,
        closePopupChooseDelete,
        clickDeleteDetailAndConfirmData,
        clickDeleteConfirmationData,
        clickCancelTreatment,
        nextCancelTreatment,
        nextDeleteConfirmationData,
        nextDeleteDetailAndConfirmData,
        handleCancelMsg,
        submitCancelTreatment,
        onMsgCancelTreatment,
        setOnMsgCancelTreatment,
        inputMsgCancelPatient,
        idLoadingCancelTreatment,
        loadingIdPatientsDelete
    } = DeletePatient({ user, setOnPopupSetting, onPopupSetting, setOnModalSettings, onModalSettings })

    const router = useRouter()

    function toPage(path: string): void {
        router.push(path)
    }

    // function closePopupSetting(e?: MouseEvent): void {
    //     setOnPopupSettings(false)
    //     e?.stopPropagation
    // }

    // function clickOnEditDetailPatient(): void {
    //     setOnPopupEdit(true)
    //     setOnPopupSettings(false)
    // }

    function cancelOnMsgCancelPatient(): void {
        setOnMsgCancelTreatment(false)
    }

    return (
        <>
            {/* popup edit patient detail / profile patient */}
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
            {/* end popup edit detail patient */}

            {/* popup edit confirmation data */}
            {onPopupEditConfirmPatient && (
                <EditPatientConfirmation
                    valueInputEditConfirmPatient={valueInputEditConfirmPatient}
                    nameEditConfirmPatient={nameEditConfirmPatient}
                    errEditInputConfirmPatient={errEditInputConfirmPatient}
                    closePopupEditConfirmPatient={closePopupEditConfirmPatient}
                    changeEditConfirmPatient={changeEditConfirmPatient}
                    selectEmailAdmin={selectEmailAdmin}
                    handleInputSelectConfirmPatient={handleInputSelectConfirmPatient}
                    changeDateConfirm={changeDateConfirm}
                    selectDoctorSpecialist={selectDoctorSpecialist}
                    loadDataDoctor={loadDataDoctor}
                    loadDataRoom={loadDataRoom}
                    selectDoctor={selectDoctor}
                    selectRoom={selectRoom}
                    editActiveManualQueue={editActiveManualQueue}
                    toggleChangeManualQueue={toggleChangeManualQueue}
                    toggleSetAutoQueue={toggleSetAutoQueue}
                    // selectPresence={selectPresence}
                    idPatientToEditConfirmPatient={idPatientToEditConfirmPatient}
                    idLoadingEditConfirmPatient={idLoadingEditConfirmPatient}
                    submitEditConfirmPatient={submitEditConfirmPatient}
                />
            )}
            {/* end popup edit confirmation patient */}

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

            {/* form message cancel patient */}
            {onMsgCancelTreatment && (
                <ContainerPopup
                    className='flex justify-center overflow-y-auto'
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
                        {displayOnCalendar && (
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
                        )}
                    </>
                }
                rightChild={
                    <>
                        <InputSelect
                            id='filterRoom'
                            classWrapp='mt-2'
                            data={dataFilterRoom}
                            handleSelect={handleFilterByRoom}
                        />
                        <InputSelect
                            id='filterDateTable'
                            classWrapp='mt-2'
                            data={filterBy}
                            handleSelect={handleFilterDate}
                        />
                        {
                            chooseFilterByDate.id !== 'Filter By' &&
                            currentTableData.length > 0 &&
                            (
                                <InputSelect
                                    id='sortDateTable'
                                    classWrapp='mt-2'
                                    data={dataSortDate}
                                    handleSelect={handleSortCategory}
                                />
                            )
                        }
                    </>
                }
            />

            <ContainerTableBody>
                <TableBody
                    style={{
                        width: '1800px'
                    }}
                >
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {/* load data */}
                    {currentTableData.length > 0 ? currentTableData.map((patient, index) => {
                        const cleanName = patient.data[0]?.name.replace(specialCharacter, '')
                        const namePatient = cleanName.replace(spaceString, '')

                        const pathUrlToDataDetail = `/patient/patient-registration/personal-data/confirmed/${namePatient}/${patient.id}`

                        const findIdLoadingCancelT = idLoadingCancelTreatment.find(id=>id === patient.id)
                        const findIdLoadingDelete = loadingIdPatientsDelete.find(id=>id === patient.id)

                        const actionsData: ActionsDataT[] = [
                            {
                                name: 'Edit',
                                click: (e?: MouseEvent)=>{
                                    clickEdit(patient.id, patient.data[0]?.name)
                                    clickEditToConfirmPatient(patient.id, patient.data[0]?.name)
                                    // setOnPopupSettings(true)
                                    openPopupEdit()
                                    setIndexActiveTableMenu(null)
                                    e?.stopPropagation()
                                }
                            },
                            {
                                name: 'Cancel Treatment',
                                classWrapp: findIdLoadingCancelT ? 'text-not-allowed hover:bg-white hover:text-not-allowed cursor-not-allowed' : 'cursor-pointer text-pink-old',
                                click: (e?: MouseEvent)=>{
                                    clickCancelTreatment(patient.id, patient.data[0]?.name)
                                    if(!findIdLoadingCancelT){
                                        setIndexActiveTableMenu(null)
                                    }
                                    e?.stopPropagation()
                                }
                            },
                            {
                                name: 'Delete',
                                classWrapp: findIdLoadingDelete ? 'text-not-allowed hover:bg-white hover:text-not-allowed cursor-not-allowed' : 'cursor-pointer text-red-default',
                                click: (e?: MouseEvent)=>{
                                    clickDeleteIcon(patient.id, patient.data[0]?.name)
                                    setIndexActiveTableMenu(null)
                                    e?.stopPropagation()
                                }
                            }
                        ]

                        return (
                            <TableColumns
                                key={index}
                                actionsData={actionsData}
                                classWrappMenu={indexActiveTableMenu === index ? 'flex' : 'hidden'}
                                clickBtn={() => toPage(pathUrlToDataDetail)}
                                clickColumnMenu={() => clickColumnMenu(index)}
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
                            >No patient confirmation data</p>
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