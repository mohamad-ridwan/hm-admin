'use client'

import { PatientRegistration } from "./patientRegistration/PatientRegistration"
import { ConfirmationPatient } from "./confirmationPatient/ConfirmationPatient"
import { FinishedTreatment } from "./finishedTreatment/FinishedTreatment"
import { DrugCounter } from "./drugCounter/DrugCounter"

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
            <DrugCounter params={params}/>
            <FinishedTreatment params={params}/>
        </>
    )
}