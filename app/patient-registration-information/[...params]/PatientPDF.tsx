'use client'

import { PdfStyle } from "app/patient-registration-information/[...params]/PdfStyle"
import { LoadPDF } from "./LoadPDF"
import { RegistrationInfo } from "app/patient-registration-information/[...params]/RegistrationInfo"
import { ConfirmInfo } from "app/patient-registration-information/[...params]/ConfirmInfo"
import { CounterInfo } from "./CounterInfo"

export function PatientPDF({ params }: { params: { params: string } }) {
    const {
        patientRegis,
        confirmDataInfoPDF,
        currentRoute,
        bodyCounter
    } = LoadPDF({ params })

    return (
        <>
            {patientRegis?.id && (
                <div
                    id="patientPDF" style={
                        currentRoute === 'registration' ? PdfStyle.page : PdfStyle.pageCounter
                    }
                >
                    {currentRoute === 'registration' && (
                        <>
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
                        </>
                    )}

                    {currentRoute === 'drug-counter' && (
                        <CounterInfo
                        bodyCounter={bodyCounter.bodyCounter}
                        />
                    )}
                </div>
            )}
        </>
    )
}