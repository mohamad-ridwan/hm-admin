'use client'

import { useEffect, useState } from "react"
import { API } from "lib/api"
import { preloadFetch } from 'lib/useFetch/preloadFetch'
import { endpoint } from "lib/api/endpoint"
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT } from "lib/types/PatientT.types"
import ServicingHours from "lib/actions/ServicingHours"
import { DataTableContentT } from "lib/types/FilterT"

type Props = {
    findDataRegistration: (
        dataPatientRegis: PatientRegistrationT[] | undefined,
        dataConfirmationPatients: ConfirmationPatientsT[] | undefined,
        dataFinishTreatment: PatientFinishTreatmentT[] | undefined
    ) => void
    dataColumns: DataTableContentT[]
}

export function DeletePatient({
    findDataRegistration,
    dataColumns
}: Props) {
    const [idLoadingDeletePatient, setIdLoadingDeletePatient] = useState<string[]>([])

    const {
        pushTriggedErr
    } = ServicingHours()

    function preloadDataRegistration(
        dataService: { [key: string]: any } | { [key: string]: any }[],
        patientId: string
    ): void {
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

            setTimeout(() => {
                const removeIdLoading = idLoadingDeletePatient.filter(id=> id !== patientId)
                setIdLoadingDeletePatient(removeIdLoading)
            }, 0);
        }, 500)
    }

    function clickDelete(
        id: string,
        name: string,
    ): void {
        const findId = idLoadingDeletePatient.find(patientId => patientId === id)
        if (
            !findId &&
            window.confirm(`Delete patient of "${name}"`)
        ) {
            setIdLoadingDeletePatient((current) => [...current, id])
            deleteDataPersonalPatient(id, name)
        }
    }

    function deleteDataPersonalPatient(id: string, name: string): void {
        API().APIDeletePatientData(
            'patient-registration',
            id,
            id
        )
            .then((deleteResult) => {
                preloadFetch(endpoint.getServicingHours())
                    .then((res) => {
                        if (res?.data) {
                            let newId: {[key: string]: any} = deleteResult as {[key: string]: any}
                            preloadDataRegistration(res, newId?.id as string)
                            alert(`Successfully deleted data from "${name}" patient`)
                        } else {
                            pushTriggedErr('error preload data service. no property "data" found')
                        }
                    })
                    .catch(err => {
                        pushTriggedErr('error preload data service')
                    })
            })
            .catch((err: any) => {
                pushTriggedErr('a server error has occurred. Please try again later')
            })
    }

    function onLoadingDelete(): void {
        if (
            dataColumns.length > 0
        ) {
            dataColumns.forEach(patient => {
                const deleteIconEl = document.getElementById(`iconDelete${patient.id}`) as HTMLElement
                const loadingIconEl = document.getElementById(`loadDelete${patient.id}`) as HTMLElement

                if (
                    deleteIconEl &&
                    loadingIconEl
                ) {
                    deleteIconEl.style.display = 'flex'
                    loadingIconEl.style.display = 'none'
                }

                idLoadingDeletePatient.forEach(id => {
                    const deleteIconEl = document.getElementById(`iconDelete${id}`) as HTMLElement
                    const loadingIconEl = document.getElementById(`loadDelete${id}`) as HTMLElement

                    if (
                        deleteIconEl &&
                        loadingIconEl
                    ) {
                        deleteIconEl.style.display = 'none'
                        loadingIconEl.style.display = 'flex'
                    }
                })
            })
        }
    }

    useEffect(() => {
        onLoadingDelete()
    }, [idLoadingDeletePatient, dataColumns])

    return {
        clickDelete,
    }
}