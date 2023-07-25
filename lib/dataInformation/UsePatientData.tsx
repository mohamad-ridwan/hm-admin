'use client'

import { useEffect, useState } from "react"
import { ConfirmationPatientsT, DrugCounterT, PatientFinishTreatmentT, PatientRegistrationT } from "lib/types/PatientT.types"
import ServicingHours from "lib/dataInformation/ServicingHours"

export function UsePatientData({ params }: { params?: string }) {
    const [detailDataPatientRegis, setDetailDataPatientRegis] = useState<PatientRegistrationT>({} as PatientRegistrationT)
    const [dataConfirmPatient, setDataConfirmPatient] = useState<ConfirmationPatientsT>({} as ConfirmationPatientsT)
    const [dataPatientFinishTreatment, setDataPatientFinishTreatment] = useState<PatientFinishTreatmentT>({} as PatientFinishTreatmentT)
    const [drugCounterPatient, setDrugCounterPatient] = useState<DrugCounterT>({} as DrugCounterT)

    const {
        dataService,
        dataPatientRegis,
        dataConfirmationPatients,
        dataDrugCounter,
        dataFinishTreatment,
        loadDataService,
        loadDataDoctors,
        dataLoket,
        doctors,
        dataRooms,
        pushTriggedErr
    } = ServicingHours()

    function getPatientRegis(): void {
        if (typeof params !== 'undefined') {
            const findPatient = dataPatientRegis?.find(patient => patient?.id === params[4])
            if (findPatient) {
                setDetailDataPatientRegis(findPatient)
            } else {
                pushTriggedErr(`no patient found with id "${params[4]}"`)
            }
        }
    }

    function getPatientConfirmation(): void {
        if (typeof params !== 'undefined') {
            const findPatient = dataConfirmationPatients?.find(patient => patient?.patientId === params[4])
            if (findPatient) {
                setDataConfirmPatient(findPatient)
            }
        }
    }

    function getPatientInCounter(): void {
        if (typeof params !== 'undefined') {
            const findPatient = dataDrugCounter?.find(patient => patient?.patientId === params[4])
            if (findPatient) {
                setDrugCounterPatient(findPatient)
            }
        }
    }

    function getPatientFinishTreatment(): void {
        if (typeof params !== 'undefined') {
            const findPatient = dataFinishTreatment?.find(patient => patient?.patientId === params[4])
            if (findPatient) {
                setDataPatientFinishTreatment(findPatient)
            }
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
        getPatientConfirmation()
        getPatientInCounter()
        getPatientFinishTreatment()
    }, [loadDataService, dataService])

    return {
        detailDataPatientRegis,
        dataConfirmPatient,
        drugCounterPatient,
        dataPatientFinishTreatment,
        doctors,
        dataRooms,
        dataConfirmationPatients,
        dataPatientRegis,
        dataLoket,
        pushTriggedErr
    }
}