'use client'

import { PatientRegistration } from "./patientRegistration/PatientRegistration"
import { ConfirmationPatient } from "./confirmationPatient/ConfirmationPatient"

type Props = {
    params: string
}

export function PersonalData(
    {
        params
    }: Props) {

    return (
        <>
            <PatientRegistration params={params}/>

            <ConfirmationPatient params={params}/>
        </>
    )
}