'use client'

import { LoadPDF } from "./LoadPDF"
import { ReportTemplate } from "components/pdf/ReportTemplate"

export function PatientPDF({ params }: { params: { params: string } }) {
    const {
        patientRegis,
        confirmDataInfoPDF
    } = LoadPDF({ params })

    return (
        <ReportTemplate
            patientRegis={patientRegis}
            confirmDataInfoPDF={confirmDataInfoPDF}
        />
    )
}