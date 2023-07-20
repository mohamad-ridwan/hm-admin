'use client'

import { PdfStyle } from "components/pdf/PdfStyle"
import { LoadPDF } from "./LoadPDF"
import { RegistrationInfo } from "components/pdf/RegistrationInfo"
import { ConfirmInfo } from "components/pdf/ConfirmInfo"

export function PatientPDF({ params }: { params: { params: string } }) {
    const {
        patientRegis,
        confirmDataInfoPDF
    } = LoadPDF({ params })

    return (
        <>
            {patientRegis?.id && (
                <div
                    id="patientPDF" style={PdfStyle.page}
                >
                    <RegistrationInfo
                        patientRegis={patientRegis}
                        confirmDataInfoPDF={confirmDataInfoPDF}
                    />
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <ConfirmInfo
                    confirmDataInfoPDF={confirmDataInfoPDF}
                    />
                </div>
            )}
        </>
    )
}