'use client'

import { useEffect, useState } from "react"
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT } from "lib/types/PatientT.types"
import ServicingHours from "lib/actions/ServicingHours"

export function UsePatientData({ params }: { params: string }) {
    const [detailDataPatientRegis, setDetailDataPatientRegis] = useState<PatientRegistrationT>({} as PatientRegistrationT)
    const [dataConfirmPatient, setDataConfirmPatient] = useState<ConfirmationPatientsT>({} as ConfirmationPatientsT)
    const [dataPatientFinishTreatment, setDataPatientFinishTreatment] = useState<PatientFinishTreatmentT>({} as PatientFinishTreatmentT)

    const {
        dataService,
        dataPatientRegis,
        dataConfirmationPatients,
        dataFinishTreatment,
        dataAdmin,
        dataRooms,
        doctors,
        loadDataService,
        loadDataDoctors,
        loadGetDataAdmin,
        pushTriggedErr
    } = ServicingHours()

    function getPatientRegis(): void {
        const findPatient = dataPatientRegis?.find(patient => patient?.id === params[4])
        if (findPatient) {
            setDetailDataPatientRegis(findPatient)
        } else {
            pushTriggedErr(`no patient found with id "${params[4]}"`)
        }
    }

    function getPatientConfirmation(): void {
        const findPatient = dataConfirmationPatients?.find(patient => patient?.patientId === params[4])
        if (findPatient) {
            setDataConfirmPatient(findPatient)
        }
    }

    function getPatientFinishTreatment():void{
        const findPatient = dataFinishTreatment?.find(patient => patient?.patientId === params[4])
        if (findPatient) {
            setDataPatientFinishTreatment(findPatient)
        }
    }

    useEffect(() => {
        if (
            !loadDataService &&
            Array.isArray(dataPatientRegis) &&
            dataPatientRegis.length > 0
        ) {
            getPatientRegis()
        }

        if (
            !loadDataService &&
            Array.isArray(dataConfirmationPatients) &&
            dataConfirmationPatients.length > 0
        ) {
            getPatientConfirmation()
        }

        if(
            !loadDataService &&
            Array.isArray(dataPatientFinishTreatment) &&
            dataPatientFinishTreatment.length > 0
        ){
            getPatientFinishTreatment()
        }
    }, [loadDataService, dataService])

    return {
        detailDataPatientRegis,
        dataConfirmPatient,
        dataPatientFinishTreatment
    }
}