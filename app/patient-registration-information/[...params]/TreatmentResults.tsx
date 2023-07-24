'use client'

import Image from "next/image"
import { PdfStyle } from "./PdfStyle"
import logo from 'images/logo.png'
import { PatientRegistrationT } from "lib/types/PatientT.types"
import { Container } from "components/Container"

type Props = {
    patientRegis: PatientRegistrationT | undefined
}

export function TreatmentResults({
    patientRegis
}: Props) {
    return (
        <>
            <div style={PdfStyle.headStyleRegis}>
                <Image
                    alt="hospice medical"
                    src={logo}
                    height={10}
                    width={10}
                    style={PdfStyle.img}
                />
                <h1 style={PdfStyle.titleRS}>HOSPICE MEDICAL</h1>
            </div>

            <p>&nbsp;</p>
            <h1 style={PdfStyle.titleTreatment}>Treatment Results</h1>
            <h1 style={PdfStyle.patient}>{patientRegis?.patientName} - Patient</h1>
            <div style={PdfStyle.borderPatient}></div>

            <p>&nbsp;</p>
            <h1 style={PdfStyle.patient}>Treatment Information</h1>
            
            <Container
                isNavleft={false}
                styleHead={PdfStyle.styleHead}
                styleContainer={PdfStyle.styleContainer}
            >

            </Container>
        </>
    )
}