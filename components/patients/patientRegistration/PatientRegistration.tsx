'use client'

import { useEffect, useState } from 'react'
import { HeadDataTableT } from 'lib/types/TableT.type'
import { useSwr } from 'lib/useFetch/useSwr'
import { endpoint } from 'lib/api/endpoint'
import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { TableHead } from 'components/table/TableHead'
import Pagination from 'components/pagination/Pagination'

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
    const [currentPage, setCurrentPage] = useState<number>(1);

    // swr fetching data
    const {data: dataService, error: errDataService, isLoading: loadDataService} = useSwr(endpoint.getServicingHours())
    const newPatientRegistration: {[key: string]: any} | undefined = dataService as {}
    const getPatientRegistration: {[key: string]: any} | undefined = newPatientRegistration?.data?.find((item: {[key: string]: any})=> item?.id === 'patient-registration')

    function findDataRegistration(): void{
        if(getPatientRegistration){
            console.log('masuk')
        }else if(!loadDataService && !getPatientRegistration){
            window.location.reload()
        }
    }

    useEffect(()=>{
        findDataRegistration()
    }, [loadDataService, dataService])

    const lastPage: number = 20;
    const maxLength: number = 7

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
                </TableBody>
            </ContainerTableBody>

            <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                maxLength={maxLength}
                setCurrentPage={setCurrentPage}
            />
        </>
    )
}