'use client'

import { UsePatientData } from "lib/actions/dataInformation/UsePatientData"
import { PatientRegistration } from "./PatientRegistration"
import { ConfirmationPatient } from "./ConfirmationPatient"

type Props = {
    params: string
}

export function PersonalData(
    {
        params
    }: Props) {
    const {
        detailDataPatientRegis,
        dataConfirmPatient,
        dataPatientFinishTreatment,
        doctors,
        dataRooms,
        dataConfirmationPatients,
        dataPatientRegis,
        pushTriggedErr
    } = UsePatientData({ params })

    return (
        <>
            <PatientRegistration
                detailDataPatientRegis={detailDataPatientRegis}
                dataConfirmPatient={dataConfirmPatient}
                dataPatientFinishTreatment={dataPatientFinishTreatment}
                dataConfirmationPatients={dataConfirmationPatients}
                params={params}
                doctors={doctors}
                dataRooms={dataRooms}
                idPatientRegistration={detailDataPatientRegis?.id}
                dataPatientRegis={dataPatientRegis}
                pushTriggedErr={pushTriggedErr}
            />

            <ConfirmationPatient
                dataConfirmPatient={dataConfirmPatient}
                detailDataPatientRegis={detailDataPatientRegis}
                dataRooms={dataRooms}
                doctors={doctors}
            />
        </>
    )
}