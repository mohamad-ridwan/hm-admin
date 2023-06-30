'use client'

import { useEffect, useMemo, useState } from 'react'
import {useRouter} from 'next/navigation'
import { HeadDataTableT } from 'lib/types/TableT.type'
import { useSwr } from 'lib/useFetch/useSwr'
import { endpoint } from 'lib/api/endpoint'
import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { TableHead } from 'components/table/TableHead'
import Pagination from 'components/pagination/Pagination'
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT } from 'lib/types/PatientT.types'
import { dayNamesInd } from 'lib/namesOfCalendar/dayNamesInd'
import { monthNames } from 'lib/namesOfCalendar/monthNames'
import { monthNamesInd } from 'lib/namesOfCalendar/monthNamesInd'
import { dayNamesEng } from 'lib/namesOfCalendar/dayNamesEng'
import { TableColumns } from 'components/table/TableColumns'
import { TableData } from 'components/table/TableData'
import { API } from 'lib/api'

type DataTableContent = {
    id: string
    data: {
        firstDesc?: string,
        color?: string,
        colorName?: string,
        marginBottom?: string,
        fontSize?: string,
        filterBy?: string,
        clock?: string,
        name: string,
    }[],
}

export function PatientRegistration() {
    const [head] = useState<HeadDataTableT>([
        {
            name: 'Patient Name'
        },
        {
            name: 'Appointment Date'
        },
        {
            name: 'Submission Date'
        },
        {
            name: 'Hours Submitted'
        },
        {
            name: 'Email'
        },
        {
            name: 'Date of Birth'
        },
        {
            name: 'Phone'
        },
    ])
    const [dataColumns, setDataColumns] = useState<DataTableContent[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [indexActiveEdit, setIndexActiveEdit] = useState<number | null>(null)
    const [indexActiveDelete, setIndexActiveDelete] = useState<number | null>(null)

    const router = useRouter()

    // swr fetching data
    const { data: dataService, error: errDataService, isLoading: loadDataService } = useSwr(endpoint.getServicingHours())
    const newPatientRegistration: { [key: string]: any } | undefined = dataService as {}
    const getPatientRegistration: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientRegistrationT) => item?.id === 'patient-registration')
    const dataPatientRegis: PatientRegistrationT[] | undefined = getPatientRegistration?.data

    // confirmation patients
    const getConfirmationPatients: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: ConfirmationPatientsT) => item?.id === 'confirmation-patients')
    const dataConfirmationPatients: ConfirmationPatientsT[] | undefined = getConfirmationPatients?.data

    // finished treatment data
    const getFinishTreatment: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientFinishTreatmentT) => item?.id === 'finished-treatment')
    const dataFinishTreatment: PatientFinishTreatmentT[] | undefined = getFinishTreatment?.data

    function findDataRegistration(): void {
        if (Array.isArray(dataPatientRegis) && dataPatientRegis.length > 0) {
            const findRegistration = dataPatientRegis.filter((patient => {
                // patient already on confirm
                const findPatientOnConfirm = dataConfirmationPatients?.find((patientConfirm) => patientConfirm.patientId === patient.id)
                // patient at finish treatment
                const findPatientFT = dataFinishTreatment?.find((patientFT) => patientFT.patientId === patient.id)

                return !findPatientOnConfirm && !findPatientFT
            }))

            if (findRegistration.length > 0) {
                const newData: DataTableContent[] = []
                const getDataColumns = (): void => {
                    findRegistration.forEach(patient => {
                        // make a normal date
                        const makeNormalDate = ((date: string, dateOfBirth?: boolean): string => {
                            const getDate = `${new Date(date)}`
                            const findIdxDayNameOfAD = dayNamesEng.findIndex(day => day === getDate.split(' ')[0]?.toLowerCase())
                            const getNameOfAD = `${dayNamesInd[findIdxDayNameOfAD]?.substr(0, 1)?.toUpperCase()}${dayNamesInd[findIdxDayNameOfAD]?.substr(1, dayNamesInd[findIdxDayNameOfAD]?.length - 1)}`
                            const findIdxMonthOfAD = monthNames.findIndex(month => month.toLowerCase() === getDate.split(' ')[1]?.toLowerCase())
                            const getMonthOfAD = monthNamesInd[findIdxMonthOfAD]
                            const getDateOfAD = date?.split('/')[1]
                            const getYearOfAD = date?.split('/')[2]

                            return !dateOfBirth ? `${getMonthOfAD} ${getDateOfAD} ${getYearOfAD}, ${getNameOfAD}` : `${getMonthOfAD} ${getDateOfAD} ${getYearOfAD}`
                        })

                        const dataRegis: DataTableContent = {
                            id: patient.id,
                            data: [
                                {
                                    name: patient.patientName
                                },
                                {
                                    firstDesc: makeNormalDate(patient.appointmentDate),
                                    color: '#ff296d',
                                    colorName: '#777',
                                    marginBottom: '4.5px',
                                    fontSize: '12px',
                                    filterBy: 'Appointment Date',
                                    clock: patient.submissionDate.clock,
                                    name: patient.appointmentDate,
                                },
                                {
                                    firstDesc: makeNormalDate(patient.submissionDate.submissionDate),
                                    color: '#7600bc',
                                    colorName: '#777',
                                    marginBottom: '4.5px',
                                    fontSize: '12px',
                                    filterBy: 'Submission Date',
                                    clock: patient.submissionDate.clock,
                                    name: patient.submissionDate.submissionDate,
                                },
                                {
                                    name: patient.submissionDate.clock
                                },
                                {
                                    name: patient.emailAddress
                                },
                                {
                                    firstDesc: makeNormalDate(patient.dateOfBirth, true),
                                    color: '#187bcd',
                                    colorName: '#777',
                                    marginBottom: '4.5px',
                                    fontSize: '12px',
                                    filterBy: 'Date of Birth',
                                    name: patient.dateOfBirth,
                                },
                                {
                                    name: patient.phone
                                },
                            ]
                        }

                        newData.push(dataRegis)
                    })
                }

                getDataColumns()
                if (newData.length === findRegistration.length) {
                    setDataColumns(newData)
                }
            }
        }
    }

    useEffect(() => {
        findDataRegistration()
    }, [loadDataService, dataService])

    const pageSize: number = 5

    const currentTableData = useMemo((): DataTableContent[]=>{
        const firstPageIndex = (currentPage - 1) * pageSize
        const lastPageIndex = firstPageIndex + pageSize
        return dataColumns.slice(firstPageIndex, lastPageIndex)
    }, [dataColumns, currentPage])

    const changeTableStyle = (dataColumnsBody: DataTableContent[]) => {
        if (dataColumnsBody?.length > 0) {
            let elementTHead = document.getElementById('tHead0') as HTMLElement
            let elementTData = document.getElementById('tData00') as HTMLElement

            if (elementTHead !== null) {
                elementTHead = document.getElementById(`tHead0`) as HTMLElement
                elementTHead.style.width = 'calc(100%/7)'
                elementTHead = document.getElementById(`tHead1`) as HTMLElement
                elementTHead.style.width = 'calc(100%/7)'
                elementTHead = document.getElementById(`tHead2`) as HTMLElement
                elementTHead.style.width = 'calc(100%/8)'
                elementTHead = document.getElementById(`tHead3`) as HTMLElement
                elementTHead.style.width = 'calc(100%/8)'
                elementTHead = document.getElementById(`tHead4`) as HTMLElement
                elementTHead.style.width = 'calc(100%/6)'
                elementTHead = document.getElementById(`tHead5`) as HTMLElement
                elementTHead.style.width = 'calc(100%/10)'
            }
            if (elementTData !== null) {
                for (let i = 0; i < dataColumnsBody?.length; i++) {
                    elementTData = document.getElementById(`tData${i}0`) as HTMLElement
                    if (elementTData?.style) {
                        elementTData.style.width = 'calc(100%/7)'
                        elementTData = document.getElementById(`tData${i}1`) as HTMLElement
                        elementTData.style.width = 'calc(100%/7)'
                        elementTData = document.getElementById(`tData${i}2`) as HTMLElement
                        elementTData.style.width = 'calc(100%/8)'
                        elementTData = document.getElementById(`tData${i}3`) as HTMLElement
                        elementTData.style.width = 'calc(100%/8)'
                        elementTData = document.getElementById(`tData${i}4`) as HTMLElement
                        elementTData.style.width = 'calc(100%/6)'
                        elementTData = document.getElementById(`tData${i}5`) as HTMLElement
                        elementTData.style.width = 'calc(100%/10)'
                    }
                }
            }
        }
    }

    useEffect(()=>{
        if(currentTableData.length > 0){
            changeTableStyle(currentTableData)
        }
    }, [currentPage, currentTableData])

    const lastPage: number = dataColumns.length < 5 ? 1 : Math.round(dataColumns.length / pageSize);
    const maxLength: number = 7

    function toPage(path: string){
        router.push(path)
    }

    function clickEdit(
        id: string,
        name: string,
        index: number
    ){
        if(indexActiveEdit === null){
            setIndexActiveEdit(index)
        }
    }

    function clickDelete(
        id: string,
        name: string,
        index: number
        ): void{
        if(indexActiveDelete === null && window.confirm(`Delete patient of "${name}"`)){
            setIndexActiveDelete(index)
            deleteDataPersonalPatient(id, name)
        }
    }

    function deleteDataPersonalPatient(id: string, name: string){
        API().APIDeletePatientData(
            'patient-registration',
            id
        )
        .then((res: any)=>{
            setIndexActiveDelete(null)
            alert(`Successfully deleted data from "${name}" patient`)
        })
        .catch((err: any)=>{
            alert('a server error has occurred.\nPlease try again later')
            setIndexActiveDelete(null)
        })
    }

    return (
        <>
            {/* table filter */}
            {/* <div></div> */}

            <ContainerTableBody>
                <TableBody>
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {/* load data */}
                    {currentTableData.length > 0 ? currentTableData.map((patient, index) => {
                        const pathUrlToDataDetail: string = `/patient/patient-registration/personal-data/not-yet-confirmed/${patient.data[0]?.name}/${patient.id}`

                        return(
                            <TableColumns
                                key={index}
                                clickBtn={()=>toPage(pathUrlToDataDetail)}
                                indexActiveEdit={index === indexActiveEdit ? indexActiveEdit : undefined}
                                indexActiveDelete={index === indexActiveDelete ? indexActiveDelete : undefined}
                                clickEdit={(e)=>{
                                    e?.stopPropagation()
                                    clickEdit(patient.id, patient.data[0]?.name, index)
                                }}
                                clickDelete={(e)=>{
                                    e?.stopPropagation()
                                    clickDelete(patient.id, patient.data[0]?.name, index)
                                }}
                            >
                                {patient.data.map((item, idx)=>{
                                    return(
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
                        <>
                            <p>No patient registration data</p>
                        </>
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