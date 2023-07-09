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
        dataPatientFinishTreatment
    } = UsePatientData({ params })

    return (
        <>
            <RegistrationData
                detailDataPatientRegis={detailDataPatientRegis}
                dataConfirmPatient={dataConfirmPatient}
                dataPatientFinishTreatment={dataPatientFinishTreatment}
                params={params}
            />
        </>
    )
}