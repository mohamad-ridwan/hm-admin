import Image from "next/image"
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat"
import { ConfirmInfoPDFT, PatientRegistrationT } from "lib/types/PatientT.types"
import logo from 'images/logo.png'
import { PdfStyle } from "./PdfStyle"
import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"

type Props = {
    patientRegis: PatientRegistrationT | undefined
    confirmDataInfoPDF: ConfirmInfoPDFT
}

export function RegistrationInfo({
    patientRegis,
    confirmDataInfoPDF
}: Props) {
    const dataRegis: {
        title: string
        textInfo: string
    }[] = patientRegis?.id ? [
        {
            title: "Appointment Date",
            textInfo: `${createDateNormalFormat(patientRegis.appointmentDate)}`
        },
        {
            title: "Submission Date",
            textInfo: `${createDateNormalFormat(patientRegis.submissionDate.submissionDate)}`
        },
        {
            title: `${`O'Clock`}`,
            textInfo: patientRegis.submissionDate.clock
        },
        {
            title: "Patient Name",
            textInfo: patientRegis.patientName
        },
        {
            title: "Email",
            textInfo: patientRegis.emailAddress
        },
        {
            title: "Date of Birth",
            textInfo: `${createDateNormalFormat(patientRegis.dateOfBirth)}`
        },
        {
            title: "Phone",
            textInfo: patientRegis.phone
        },
        {
            title: "Patient ID",
            textInfo: patientRegis.id
        },
        {
            title: 'Patient Complaints',
            textInfo: patientRegis.patientMessage.patientComplaints
        },
        {
            title: 'Patient Message',
            textInfo: patientRegis.patientMessage.message
        },
    ] : []

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
            <h1 style={PdfStyle.patient}>Queue Number : {confirmDataInfoPDF?.queueNumber}</h1>
            <h1 style={PdfStyle.patient}>{patientRegis?.patientName} - Patient</h1>
            <div style={PdfStyle.borderPatient}></div>

            <p>&nbsp;</p>
            <h1 style={PdfStyle.patient}>Registration Information</h1>

            <Container
                isNavleft={false}
                styleHead={PdfStyle.styleHead}
                styleContainer={PdfStyle.styleContainer}
            >
                {dataRegis.length > 0 && dataRegis.map((item, index) => {
                    return (
                        <CardInfo
                            key={index}
                            title={item.title}
                            textInfo={item.textInfo}
                            styleWrapp={PdfStyle.cardInfo}
                            styleTitle={PdfStyle.titleInfo}
                            styleTextInfo={PdfStyle.textInfo}
                        />
                    )
                })}
            </Container>
        </>
    )
}