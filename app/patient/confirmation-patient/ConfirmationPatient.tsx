'use client'

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

export function ConfirmationPatient() {
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
    } = FormPatientRegistration()

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
        selectPresence,
        idPatientToEditConfirmPatient,
        submitEditConfirmPatient,
        clickOnEditConfirmPatient,
        idLoadingEditConfirmPatient
    } = FormPatientConfirmation()

    const {
        head,
        dataColumns,
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
        clickCancelTreatment
    } = DeletePatient({user, dataColumns})

    const router = useRouter()

    function toPage(path: string): void {
        router.push(path)
    }

    function closePopupSetting(): void {
        setOnPopupSettings(false)
    }

    function clickOnEditDetailPatient(): void {
        setOnPopupEdit(true)
        setOnPopupSettings(false)
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
                    selectPresence={selectPresence}
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
                                marginTop: '0.5rem'
                            }}
                        />
                    </SettingPopup>
                </ContainerPopup>
            )}

            {/* popup choose delete */}
            {onPopupChooseDelete && (
                <ContainerPopup
                    className='flex justify-center overflow-y-auto'
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
                        {/* <Button
                            nameBtn="Cancel Treatment"
                            classBtn='bg-red hover:bg-white border-red-default hover:border-red-default hover:text-red-default'
                            classLoading='hidden'
                            clickBtn={clickCancelTreatment}
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem'
                            }}
                        /> */}
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

                        return (
                            <TableColumns
                                key={index}
                                idLoadingDelete={`loadDelete${patient.id}`}
                                idIconDelete={`iconDelete${patient.id}`}
                                idIconCancel={`iconCancel${patient.id}`}
                                idLoadingCancel={`loadingCancel${patient.id}`}
                                iconCancel={faBan}
                                styleColumnMenu={{
                                    display: indexActiveTableMenu === index ? 'flex' : 'none'
                                }}
                                clickBtn={() => toPage(pathUrlToDataDetail)}
                                clickEdit={(e) => {
                                    clickEdit(patient.id, patient.data[0]?.name)
                                    clickEditToConfirmPatient(patient.id, patient.data[0]?.name)
                                    setOnPopupSettings(true)
                                    setIndexActiveTableMenu(null)
                                    e?.stopPropagation()
                                }}
                                clickDelete={(e) => {
                                    clickDeleteIcon(patient.id, patient.data[0]?.name)
                                    setIndexActiveTableMenu(null)
                                    e?.stopPropagation()
                                }}
                                clickCancel={(e)=>{
                                    clickCancelTreatment(patient.id, patient.data[0]?.name)
                                    setIndexActiveTableMenu(null)
                                    e?.stopPropagation()
                                }}
                                clickColumnMenu={()=>clickColumnMenu(index)}
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