import { CardInfo } from "components/dataInformation/CardInfo";
import { PdfStyle } from "./PdfStyle";
import { ConfirmInfoPDFT, PatientRegistrationT } from "lib/types/PatientT.types";
import { createDateNormalFormat } from "lib/dates/createDateNormalFormat";
import { Container } from "components/Container";

type Props = {
    patientRegis: PatientRegistrationT | undefined
    confirmDataInfoPDF: ConfirmInfoPDFT
}

export function ReportTemplate({
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

    const dataConfirm: {
        title: string
        textInfo: string
    }[] = confirmDataInfoPDF?.queueNumber ? [
        {
            title: 'Queue Number',
            textInfo: confirmDataInfoPDF.queueNumber
        },
        {
            title: 'Treatment Hours (Doctor Practice)',
            textInfo: confirmDataInfoPDF.treatmentHours
        },
        {
            title: 'Room Name',
            textInfo: confirmDataInfoPDF.roomName
        },
        {
            title: 'Doctor Name',
            textInfo: confirmDataInfoPDF.doctorName
        },
        {
            title: 'Doctor Specialist',
            textInfo: confirmDataInfoPDF.doctorSpecialist
        },
        {
            title: 'Confirmation Hours',
            textInfo: confirmDataInfoPDF.confirmHours
        },
        {
            title: 'Confirmed Date',
            textInfo: `${createDateNormalFormat(confirmDataInfoPDF.confirmDate)}`
        },
    ] : []

    return (
        <>
            {patientRegis?.id && (
                <div id="patientPDF" style={PdfStyle.page}
                >   
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                    <img alt="" src="https://firebasestorage.googleapis.com/v0/b/hospice-medical.appspot.com/o/logo%2Flogo-two.png?alt=media&amp;token=97ed6578-9f6b-4c86-9eab-bd0ef74be168" style={PdfStyle.img} />
                    <h1 style={PdfStyle.titleRS}>HOSPICE MEDICAL</h1>
                    </div>
                    
                    <p>&nbsp;</p>
                    <h1><strong style={PdfStyle.patient}>Queue Number : {confirmDataInfoPDF?.queueNumber}</strong></h1>
                    <h1><strong style={PdfStyle.patient}>{patientRegis?.patientName} - Patient</strong></h1>
                    <div style={PdfStyle.borderPatient}></div>

                    <p>&nbsp;</p>
                    <h1><strong style={PdfStyle.patient}>Registration Information</strong></h1>

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

                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <h1><strong style={PdfStyle.patient}>Confirmation Info</strong></h1>

                    <Container
                        isNavleft={false}
                        styleHead={PdfStyle.styleHead}
                        styleContainer={PdfStyle.styleContainer}
                    >
                        {dataConfirm.length > 0 && dataConfirm.map((item, index) => {
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
                    <p>&nbsp;</p>
                    <h1><strong style={PdfStyle.patient}>Admin Confirmation</strong></h1>
                    <Container
                        isNavleft={false}
                        styleHead={PdfStyle.styleHead}
                        styleContainer={PdfStyle.styleContainer}
                    >
                        <CardInfo
                            title="Admin Email"
                            textInfo={confirmDataInfoPDF?.adminInfo?.email}
                            styleWrapp={PdfStyle.cardInfo}
                            styleTitle={PdfStyle.titleInfo}
                            styleTextInfo={PdfStyle.textInfo}
                        />
                        <CardInfo
                            title="Admin Name"
                            textInfo={confirmDataInfoPDF?.adminInfo?.name}
                            styleWrapp={PdfStyle.cardInfo}
                            styleTitle={PdfStyle.titleInfo}
                            styleTextInfo={PdfStyle.textInfo}
                        />
                    </Container>
                </div>
            )}
        </>
    )
}