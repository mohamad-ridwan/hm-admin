'use client'

import { UsePatientData } from "lib/actions/dataInformation/UsePatientData"
import { RegistrationData } from "./RegistrationData"

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
            <RegistrationData
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
        </>
    )
}