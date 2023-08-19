'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { faCalendarDays, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons'
import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { TableHead } from 'components/table/TableHead'
import Pagination from 'components/pagination/Pagination'
import { TableColumns } from 'components/table/TableColumns'
import { TableData } from 'components/table/TableData'
import { TableFilter } from 'components/table/TableFilter'
import { InputSearch } from 'components/input/InputSearch'
import { InputSelect } from 'components/input/InputSelect'
import { spaceString } from 'lib/regex/spaceString'
import { specialCharacter } from 'lib/regex/specialCharacter'
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader"
import EditPatientRegistration from 'app/patient/patient-registration/EditPatientRegistration'
import FormPatientRegistration from 'app/patient/patient-registration/FormPatientRegistration'
import { FilterTable } from './FilterTable'
import { DeletePatient } from './DeletePatient'
import { ContainerPopup } from 'components/popup/ContainerPopup'
import { SettingPopup } from 'components/popup/SettingPopup'
import Button from 'components/Button'
import { ActionsDataT, PopupSettings } from 'lib/types/TableT.type'
import { FormPopup } from 'components/popup/FormPopup'
import { TitleInput } from 'components/input/TitleInput'
import ErrorInput from 'components/input/ErrorInput'
import Input from 'components/input/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AddPatient } from './AddPatient'
import { Alerts } from 'components/popup/Alerts'

export function PatientRegistration() {
    const [onModalSettings, setOnModalSettings] = useState<PopupSettings>({} as PopupSettings)
    const router = useRouter()

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
        clickAddPatient,
        onAddPatient,
        changeInputAddPatient,
        inputAddPatient,
        errInputAddPatient,
        changeDateAddPatient,
        handleSelectAddPatient,
        optionsDay,
        submitAddPatient,
        minDateFormAddP,
        maxDateFormAddP,
        filterDate,
        loadingSubmitAddPatient
    } = FormPatientRegistration({ setOnModalSettings })

    const {
        head,
        searchText,
        setSearchText,
        handleSearchText,
        setCurrentPage,
        currentPage,
        displayOnCalendar,
        handleInputDate,
        selectDate,
        setSelectDate,
        handleFilterDate,
        chooseFilterByDate,
        currentTableData,
        dataSortDate,
        handleSortCategory,
        lastPage,
        maxLength,
        findDataRegistration,
        filterBy,
        clickColumnMenu,
        indexActiveColumnMenu,
        setIndexActiveColumnMenu
    } = FilterTable()

    const {
        clickDelete,
        clickCancelTreatment,
        onMsgCancelTreatment,
        submitCancelTreatment,
        setOnMsgCancelTreatment,
        handleCancelMsg,
        inputMsgCancelPatient,
        idLoadingCancelTreatment,
        idLoadingDeletePatient
    } = DeletePatient({ findDataRegistration, setOnModalSettings, onModalSettings })

    function toPage(path: string): void {
        router.push(path)
    }

    function cancelOnMsgCancelPatient(): void {
        setOnMsgCancelTreatment(false)
    }

    return (
        <>
            {/* popup edit */}
            {onAddPatient && (
                <AddPatient
                    clickCloseAddPatient={clickAddPatient}
                    changeInputAddPatient={changeInputAddPatient}
                    inputAddPatient={inputAddPatient}
                    errInputAddPatient={errInputAddPatient}
                    changeDateAddPatient={changeDateAddPatient}
                    handleSelectAddPatient={handleSelectAddPatient}
                    optionsDay={optionsDay}
                    submitAddPatient={submitAddPatient}
                    minDateFormAddP={minDateFormAddP}
                    maxDateFormAddP={maxDateFormAddP}
                    filterDate={filterDate}
                    loadingSubmitAddPatient={loadingSubmitAddPatient}
                />
            )}

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

            <div
                className="flex justify-end"
            >
                <Button
                    iconLeft={<FontAwesomeIcon
                        icon={faPlus}
                        className="mr-2"
                    />}
                    nameBtn="New patient"
                    classBtn="hover:bg-white py-[7px]"
                    classLoading="hidden"
                    clickBtn={clickAddPatient}
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
                <TableBody>
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {/* load data */}
                    {currentTableData.length > 0 ? currentTableData.map((patient, index) => {
                        const cleanName = patient.data[0]?.name.replace(specialCharacter, '')
                        const namePatient = cleanName.replace(spaceString, '')

                        const pathUrlToDataDetail: string = `/patient/patient-registration/personal-data/not-yet-confirmed/${namePatient}/${patient.id}`

                        const findIdLoadingCancelT = idLoadingCancelTreatment.find(id => id === patient.id)
                        const findIdLoadingDelete = idLoadingDeletePatient.find(id => id === patient.id)

                        const actionsData: ActionsDataT[] = [
                            {
                                name: 'Edit',
                                click: (e?: MouseEvent) => {
                                    clickEdit(patient.id, patient.data[0]?.name)
                                    setOnPopupEdit(true)
                                    setIndexActiveColumnMenu(null)
                                    e?.stopPropagation()
                                }
                            },
                            {
                                classWrapp: findIdLoadingCancelT ? 'text-not-allowed hover:bg-white hover:text-[#8f8f8f] cursor-not-allowed' : 'cursor-pointer text-pink-old',
                                name: 'Cancel Treatment',
                                click: (e?: MouseEvent) => {
                                    clickCancelTreatment(patient.id, patient.data[0]?.name)
                                    setIndexActiveColumnMenu(null)
                                    e?.stopPropagation()
                                }
                            },
                            {
                                classWrapp: findIdLoadingDelete ? 'text-not-allowed hover:bg-white hover:text-[#8f8f8f] cursor-not-allowed' : 'cursor-pointer text-red-default',
                                name: 'Delete',
                                click: (e?: MouseEvent) => {
                                    clickDelete(patient.id, patient.data[0]?.name)
                                    setIndexActiveColumnMenu(null)
                                    e?.stopPropagation()
                                }
                            },
                        ]

                        return (
                            <TableColumns
                                key={index}
                                clickBtn={() => toPage(pathUrlToDataDetail)}
                                actionsData={actionsData}
                                classWrappMenu={indexActiveColumnMenu === index ? 'flex' : 'hidden'}
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