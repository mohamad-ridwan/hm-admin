'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { faCalendarDays, faMagnifyingGlass, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { endpoint } from 'lib/api/endpoint'
import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { TableHead } from 'components/table/TableHead'
import Pagination from 'components/pagination/Pagination'
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT } from 'lib/types/PatientT.types'
import { TableColumns } from 'components/table/TableColumns'
import { TableData } from 'components/table/TableData'
import { API } from 'lib/api'
import { preloadFetch } from 'lib/useFetch/preloadFetch'
import { TableFilter } from 'components/table/TableFilter'
import { InputSearch } from 'components/input/InputSearch'
import { InputSelect } from 'components/input/InputSelect'
import { spaceString } from 'lib/regex/spaceString'
import { specialCharacter } from 'lib/regex/specialCharacter'
import { renderCustomHeader } from "lib/dates/renderCustomHeader"
import EditPatientRegistration from 'app/patient/patient-registration/EditPatientRegistration'
import FormPatientRegistration from 'app/patient/patient-registration/FormPatientRegistration'
import { ContainerPopup } from 'components/popup/ContainerPopup'
import { SettingPopup } from 'components/popup/SettingPopup'
import Button from 'components/Button'
import { FilterTable } from './FilterTable'

export function PatientRegistration() {
    const [patientsIdToDelete, setPatientsIdToDelete] = useState<string[]>([])
    const [onPopupSettings, setOnPopupSettings] = useState<boolean>(false)
    const [patientsIdToDeleteSuccess, setPatientsIdToDeleteSuccess] = useState<string[]>([])
    const [patientsIdToDeleteFailed, setPatientsIdToDeleteFailed] = useState<string[]>([])
    const router = useRouter()

    // Form edit patient registration
    const {
        clickEdit,
        onPopupEdit,
        loadingSubmitEdit,
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
        dataColumns
    } = FilterTable()

    // preload
    function preloadDataRegistration(dataService: { [key: string]: any } | { [key: string]: any }[]): void {
        const newPatientRegistration: { [key: string]: any } | undefined = dataService as {}
        const getPatientRegistration: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientRegistrationT) => item?.id === 'patient-registration')
        const dataPatientRegis: PatientRegistrationT[] | undefined = getPatientRegistration?.data

        // confirmation patients
        const getConfirmationPatients: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: ConfirmationPatientsT) => item?.id === 'confirmation-patients')
        const dataConfirmationPatients: ConfirmationPatientsT[] | undefined = getConfirmationPatients?.data

        // finished treatment data
        const getFinishTreatment: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientFinishTreatmentT) => item?.id === 'finished-treatment')
        const dataFinishTreatment: PatientFinishTreatmentT[] | undefined = getFinishTreatment?.data

        setTimeout(() => {
            findDataRegistration(
                dataPatientRegis,
                dataConfirmationPatients,
                dataFinishTreatment
            )
        }, 500)
    }

    useEffect(() => {
        if (currentTableData.length === 0 && currentPage > 1) {
            setCurrentPage((current) => current - 1)
        }
    }, [patientsIdToDeleteSuccess, currentTableData])

    function toPage(path: string): void {
        router.push(path)
    }

    // delete action
    function loadingDelete(): void {
        patientsIdToDelete.forEach(id => {
            const iconDeleteElement = document.getElementById(`iconDelete${id}`) as HTMLElement
            const loadingDeleteElement = document.getElementById(`loadDelete${id}`) as HTMLElement

            if (iconDeleteElement && loadingDeleteElement) {
                iconDeleteElement.style.display = 'none'
                loadingDeleteElement.style.display = 'flex'
            }
        })
    }

    useEffect(() => {
        if (patientsIdToDelete.length > 0 && dataColumns.length > 0) {
            loadingDelete()
        }
    }, [patientsIdToDelete, dataColumns])

    // when delete is successful
    function loadIconDeleteSuccess(): void {
        let count: number = 0
        dataColumns.forEach(patient => {
            count = count + 1

            const iconDeleteElement = document.getElementById(`iconDelete${patient.id}`) as HTMLElement
            const loadingDeleteElement = document.getElementById(`loadDelete${patient.id}`) as HTMLElement

            if (iconDeleteElement && loadingDeleteElement) {
                iconDeleteElement.style.display = 'flex'
                loadingDeleteElement.style.display = 'none'
            }
        })

        if (count === dataColumns.length) {
            setTimeout(() => {
                loadingDelete()
            }, 500);
        }
    }

    useEffect(() => {
        if (patientsIdToDeleteSuccess.length > 0 && dataColumns.length > 0) {
            loadIconDeleteSuccess()
        }
    }, [patientsIdToDeleteSuccess, dataColumns])

    // when delete is failed
    function loadDeleteFailed(): void {
        patientsIdToDeleteFailed.forEach(id => {
            const iconDeleteElement = document.getElementById(`iconDelete${id}`) as HTMLElement
            const loadingDeleteElement = document.getElementById(`loadDelete${id}`) as HTMLElement

            if (iconDeleteElement && loadingDeleteElement) {
                iconDeleteElement.style.display = 'flex'
                loadingDeleteElement.style.display = 'none'
            }
        })
    }

    useEffect(() => {
        if (patientsIdToDeleteSuccess.length > 0 && dataColumns.length > 0) {
            loadDeleteFailed()
        }
    }, [patientsIdToDeleteFailed, dataColumns])

    function clickDelete(
        id: string,
        name: string,
    ): void {
        const findId = patientsIdToDelete.find(patientId => patientId === id)
        if (
            !findId &&
            window.confirm(`Delete patient of "${name}"`)
        ) {
            setPatientsIdToDelete((current) => [...current, id])
            deleteDataPersonalPatient(id, name)
        }
    }

    function deleteDataPersonalPatient(id: string, name: string): void {
        API().APIDeletePatientData(
            'patient-registration',
            id
        )
            .then((res: any) => {
                preloadFetch(endpoint.getServicingHours())
                    .then((res) => {
                        if (res?.data) {
                            setPatientsIdToDeleteSuccess((current) => [...current, id])
                            preloadDataRegistration(res)
                            alert(`Successfully deleted data from "${name}" patient`)
                        } else {
                            console.log('error preload data service. no property "data" found')
                            setPatientsIdToDeleteSuccess((current) => [...current, id])
                            alert(`Successfully deleted data from "${name}" patient`)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        console.log('error preload data service')
                        alert(`Successfully deleted data from "${name}" patient`)
                    })
            })
            .catch((err: any) => {
                alert('a server error has occurred.\nPlease try again later')
                console.log(err)
                setPatientsIdToDeleteFailed((current) => [...current, id])
            })
    }

    function onEditPatientRegis():void{
        setOnPopupSettings(false)
        setOnPopupEdit(true)
    }

    return (
        <>
            {/* popup edit */}
            {onPopupEdit && (
                <EditPatientRegistration
                loadingSubmitEdit={loadingSubmitEdit}
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

            {/* popup choose update */}
            {onPopupSettings && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={()=>setOnPopupSettings(false)}
                        title='Edit patient registration data?'
                        classIcon='text-color-default'
                        iconPopup={faPenToSquare}
                    >
                        <Button
                            nameBtn="Edit patient detail"
                            classBtn='hover:bg-white'
                            classLoading='hidden'
                            clickBtn={onEditPatientRegis}
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem'
                            }}
                        />
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
                                clickBtn={() => toPage(pathUrlToDataDetail)}
                                clickEdit={(e) => {
                                    clickEdit(patient.id, patient.data[0]?.name)
                                    setOnPopupSettings(true)
                                    e?.stopPropagation()
                                }}
                                clickDelete={(e) => {
                                    clickDelete(patient.id, patient.data[0]?.name)
                                    e?.stopPropagation()
                                }}
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