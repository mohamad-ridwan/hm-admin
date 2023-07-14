'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { API } from "lib/api"
import { UsePatientData } from "lib/actions/dataInformation/UsePatientData"

export function DeletePatient({ params }: { params?: string }) {
    const [onPopupDelete, setOnPopupDelete] = useState<boolean>(false)
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)

    const {
        dataConfirmPatient,
        drugCounterPatient,
        dataPatientFinishTreatment,
        pushTriggedErr
    } = UsePatientData({ params })

    const router = useRouter()

    async function pushDeletePatient(
        roleId: string,
        idDocument: string,
        patientId: string,
        errMessage: string
    ): Promise<{ [key: string]: any }> {
        return await new Promise((resolve, reject) => {
            API().APIDeletePatientData(
                roleId,
                idDocument,
                patientId
            )
                .then((res) => {
                    const newData = res as { [key: string]: any }
                    if (newData?.patientId) {
                        resolve(newData)
                    } else {
                        reject(errMessage)
                    }
                })
                .catch(err => reject(errMessage))
        })
    }

    function clickDelete(patientId: string): void {
        if (loadingDelete === false) {
            setOnPopupDelete(false)
            setLoadingDelete(true)
            pushDeletePatient(
                'finished-treatment',
                dataPatientFinishTreatment?.id,
                patientId,
                'There was an error deleting patient data after treatment. please try again'
            )
                .then(res => {
                    return pushDeletePatient(
                        'drug-counter',
                        drugCounterPatient?.id,
                        patientId,
                        'There was an error deleting counter patient data. please try again'
                    )
                })
                .then(res => {
                    return pushDeletePatient(
                        'confirmation-patients',
                        dataConfirmPatient?.id,
                        patientId,
                        'There was an error deleting patient confirmation data. please try again'
                    )
                })
                .then(res => {
                    return pushDeletePatient(
                        'patient-registration',
                        patientId,
                        patientId,
                        'There was an error deleting patient registration data. please try again'
                    )
                })
                .then(res => {
                    successDelete()
                })
                .catch(err => pushTriggedErr(err as string))
        }
    }

    function successDelete(): void {
        router.push('/patient/patient-registration')
        setLoadingDelete(false)
        setTimeout(() => {
            alert('Successfully deleted all patient data')
        }, 500)
    }

    return {
        clickDelete,
        loadingDelete,
        onPopupDelete,
        setOnPopupDelete
    }
}