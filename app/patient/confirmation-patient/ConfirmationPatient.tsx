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
import { renderCustomHeader } from 'lib/dates/renderCustomHeader'
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
import { ActionsDataT, PopupSetting } from 'lib/types/TableT.type'
import { FormPopup } from 'components/popup/FormPopup'
import { TitleInput } from 'components/input/TitleInput'
import Input from 'components/input/Input'
import ErrorInput from 'components/input/ErrorInput'

export function ConfirmationPatient() {
    const [onPopupSetting, setOnPopupSetting] = useState<PopupSetting>({} as PopupSetting)
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
    } = FormPatientRegistration({ setOnPopupSetting })

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
        nextSubmitEditConfirmPatient
    } = FormPatientConfirmation({ setOnPopupSetting })

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
    } = DeletePatient({ user, setOnPopupSetting, onPopupSetting })

    const router = useRouter()

    function toPage(path: string): void {
        router.push(path)
    }

    function closePopupSetting(e?: MouseEvent): void {
        setOnPopupSettings(false)
        e?.stopPropagation
    }

    function clickOnEditDetailPatient(): void {
        setOnPopupEdit(true)
        setOnPopupSettings(false)
    }

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

            {/* popup choose update */}
            {onPopupSettings && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={closePopupSetting}
                        title='What do you want to edit?'
                        classIcon='text-color-default'
                        iconPopup={faPenToSquare}
                    >
                        <Button
                            nameBtn="Edit patient detail"
                            classBtn='hover:bg-white'
                            classLoading='hidden'
                            clickBtn={clickOnEditDetailPatient}
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem'
                            }}
                        />
                        <Button
                            nameBtn="Edit confirmation data"
                            classBtn='bg-orange border-orange hover:border-orange hover:bg-white hover:text-orange'
                            classLoading='hidden'
                            clickBtn={clickOnEditConfirmPatient}
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem'
                            }}
                        />
                        <Button
                            nameBtn="Cancel"
                            classLoading='hidden'
                            classBtn='bg-white border-none'
                            clickBtn={closePopupSetting}
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem',
                                color: '#495057',
                            }}
                        />
                    </SettingPopup>
                </ContainerPopup>
            )}

            {/* popup choose delete */}
            {onPopupChooseDelete && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        title='What do you want to delete?'
                        classIcon='text-red-default'
                        desc={`${namePatientToDelete} - patient`}
                        clickClose={closePopupChooseDelete}
                        iconPopup={faBan}
                    >
                        <Button
                            nameBtn="All data"
                            classBtn='bg-orange hover:bg-white border-orange hover:border-orange hover:text-orange'
                            classLoading='hidden'
                            clickBtn={clickDeleteDetailAndConfirmData}
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem'
                            }}
                        />
                        <Button
                            nameBtn="Confirmation data"
                            classBtn='bg-pink-old hover:bg-white border-pink-old hover:border-pink-old hover:text-pink-old'
                            classLoading='hidden'
                            clickBtn={clickDeleteConfirmationData}
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem'
                            }}
                        />
                        <Button
                            nameBtn="Cancel"
                            classLoading='hidden'
                            classBtn='bg-white border-none'
                            clickBtn={closePopupChooseDelete}
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem',
                                color: '#495057',
                            }}
                        />
                    </SettingPopup>
                </ContainerPopup>
            )}

            {/* popup next / cancel actions */}
            {onPopupSetting?.title && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={() => setOnPopupSetting({} as PopupSetting)}
                        title={onPopupSetting.title}
                        classIcon={onPopupSetting.classIcon}
                        iconPopup={onPopupSetting.iconPopup}
                    >
                        <Button
                            nameBtn={onPopupSetting.nameBtnNext}
                            classBtn={onPopupSetting?.classBtnNext}
                            classLoading="hidden"
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.6rem',
                                marginTop: '0.5rem'
                            }}
                            clickBtn={() => {
                                if (onPopupSetting.categoryAction === 'edit-patient') {
                                    nextSubmitUpdate()
                                } else if (onPopupSetting.categoryAction === 'edit-confirm-patient') {
                                    nextSubmitEditConfirmPatient()
                                } else if (onPopupSetting.categoryAction === 'cancel-treatment') {
                                    nextCancelTreatment()
                                } else if (onPopupSetting.categoryAction === 'delete-confirmation') {
                                    nextDeleteConfirmationData()
                                } else if (onPopupSetting.categoryAction === 'delete-detail-and-confirmation') {
                                    nextDeleteDetailAndConfirmData()
                                }
                            }}
                        />
                        <Button
                            nameBtn="Cancel"
                            classBtn="bg-white border-none"
                            colorBtnTxt="text-orange-young"
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
                                    setOnPopupSettings(true)
                                    setIndexActiveTableMenu(null)
                                    e?.stopPropagation()
                                }
                            },
                            {
                                name: 'Cancel Treatment',
                                classWrapp: findIdLoadingCancelT ? 'text-text-not-allowed hover:bg-white hover:text-text-not-allowed cursor-not-allowed' : '',
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
                                classWrapp: findIdLoadingDelete ? 'text-text-not-allowed hover:bg-white hover:text-text-not-allowed cursor-not-allowed' : '',
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
                                // idLoadingDelete={`loadDelete${patient.id}`}
                                // idIconDelete={`iconDelete${patient.id}`}
                                // idIconCancel={`iconCancel${patient.id}`}
                                // idLoadingCancel={`loadingCancel${patient.id}`}
                                // iconCancel={faBan}
                                actionsData={actionsData}
                                classWrappMenu={indexActiveTableMenu === index ? 'flex' : 'hidden'}
                                // styleColumnMenu={{
                                //     display: indexActiveTableMenu === index ? 'flex' : 'none'
                                // }}
                                clickBtn={() => toPage(pathUrlToDataDetail)}
                                // clickEdit={(e) => {
                                //     clickEdit(patient.id, patient.data[0]?.name)
                                //     clickEditToConfirmPatient(patient.id, patient.data[0]?.name)
                                //     setOnPopupSettings(true)
                                //     setIndexActiveTableMenu(null)
                                //     e?.stopPropagation()
                                // }}
                                // clickCancel={(e) => {
                                //     clickCancelTreatment(patient.id, patient.data[0]?.name)
                                //     setIndexActiveTableMenu(null)
                                //     e?.stopPropagation()
                                // }}
                                // clickDelete={(e) => {
                                //     clickDeleteIcon(patient.id, patient.data[0]?.name)
                                //     setIndexActiveTableMenu(null)
                                //     e?.stopPropagation()
                                // }}
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