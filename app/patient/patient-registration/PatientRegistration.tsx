'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { faBan, faCalendarDays, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
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
import { renderCustomHeader } from "lib/dates/renderCustomHeader"
import EditPatientRegistration from 'app/patient/patient-registration/EditPatientRegistration'
import FormPatientRegistration from 'app/patient/patient-registration/FormPatientRegistration'
import { FilterTable } from './FilterTable'
import { DeletePatient } from './DeletePatient'
import { ContainerPopup } from 'components/popup/ContainerPopup'
import { SettingPopup } from 'components/popup/SettingPopup'
import Button from 'components/Button'
import { PopupSetting } from 'lib/types/TableT.type'
import { FormPopup } from 'components/popup/FormPopup'
import { TitleInput } from 'components/input/TitleInput'
import ErrorInput from 'components/input/ErrorInput'
import Input from 'components/input/Input'

export function PatientRegistration() {
    const [onPopupSetting, setOnPopupSetting] = useState<PopupSetting>({} as PopupSetting)
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
        nextSubmitUpdate
    } = FormPatientRegistration({ setOnPopupSetting })

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
        dataColumns,
        clickColumnMenu,
        indexActiveColumnMenu,
        setIndexActiveColumnMenu
    } = FilterTable()

    const {
        clickDelete,
        clickCancelTreatment,
        nextCancelTreatment,
        nextConfirmDelete,
        onMsgCancelTreatment,
        submitCancelTreatment,
        setOnMsgCancelTreatment,
        handleCancelMsg,
        inputMsgCancelPatient
    } = DeletePatient({ findDataRegistration, dataColumns, setOnPopupSetting, onPopupSetting })

    function toPage(path: string): void {
        router.push(path)
    }

    function cancelOnMsgCancelPatient(): void {
        setOnMsgCancelTreatment(false)
    }

    return (
        <>
            {/* popup edit */}
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

            {/* popup next / cancel actions */}
            {onPopupSetting?.title && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={() => setOnPopupSetting({} as PopupSetting)}
                        title={onPopupSetting.title}
                        classIcon='text-font-color-2'
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
                                if (onPopupSetting.categoryAction === 'edit-patient') {
                                    nextSubmitUpdate()
                                } else if (onPopupSetting.categoryAction === 'cancel-treatment') {
                                    nextCancelTreatment()
                                } else if (onPopupSetting.categoryAction === 'delete-patient') {
                                    nextConfirmDelete(onPopupSetting.patientId as string)
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
                        return (
                            <TableColumns
                                key={index}
                                idLoadingDelete={`loadDelete${patient.id}`}
                                idIconDelete={`iconDelete${patient.id}`}
                                idIconCancel={`iconCancel${patient.id}`}
                                idLoadingCancel={`loadingCancel${patient.id}`}
                                iconCancel={faBan}
                                styleColumnMenu={{
                                    display: indexActiveColumnMenu === index ? 'flex' : 'none'
                                }}
                                clickBtn={() => toPage(pathUrlToDataDetail)}
                                clickEdit={(e) => {
                                    clickEdit(patient.id, patient.data[0]?.name)
                                    setOnPopupEdit(true)
                                    setIndexActiveColumnMenu(null)
                                    e?.stopPropagation()
                                }}
                                clickCancel={(e) => {
                                    clickCancelTreatment(patient.id, patient.data[0]?.name)
                                    setIndexActiveColumnMenu(null)
                                    e?.stopPropagation()
                                }}
                                clickDelete={(e) => {
                                    clickDelete(patient.id, patient.data[0]?.name)
                                    setIndexActiveColumnMenu(null)
                                    e?.stopPropagation()
                                }}
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