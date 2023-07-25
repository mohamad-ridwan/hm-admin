import Image from "next/image"
import { PdfStyle } from "./PdfStyle"
import logo from 'images/logo.png'
import { PatientRegistrationT, TreatmentResultsPDFT } from "lib/types/PatientT.types"
import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"
import { currencyFormat } from "lib/formats/currencyFormat"
import { RenderTextHTML } from "lib/pdf/RenderTextHTML"
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat"

type Props = {
    patientRegis: PatientRegistrationT | undefined
    treatmentResultInfoPDF: TreatmentResultsPDFT
}

export function TreatmentResults({
    patientRegis,
    treatmentResultInfoPDF
}: Props) {
    const dataRegis: {
        title: string
        textInfo: string | JSX.Element
    }[] = patientRegis?.id && treatmentResultInfoPDF?.patientId ? 
    [
        {
            title: 'Doctor Name',
            textInfo: treatmentResultInfoPDF.doctorName,
        },
        {
            title: 'Doctor Specialist',
            textInfo: treatmentResultInfoPDF.doctorSpecialist,
        },
        {
            title: 'Doctor Room',
            textInfo: treatmentResultInfoPDF.doctorRoom,
        },
        {
            title: 'Patient ID',
            textInfo: treatmentResultInfoPDF.patientId,
        },
        {
            title: 'Patient Email',
            textInfo: treatmentResultInfoPDF.patientEmail,
        },
        {
            title: 'Payment Method',
            textInfo: treatmentResultInfoPDF.paymentInfo.paymentMethod,
        },
        {
            title: 'Total Cost',
            textInfo: currencyFormat(Number(treatmentResultInfoPDF.paymentInfo.totalCost), 'id-ID', 'IDR'),
        },
        {
            title: 'Note',
            textInfo: <RenderTextHTML textInfo={treatmentResultInfoPDF.paymentInfo.message}/>
        },
        {
            title: 'Counter Name',
            textInfo: treatmentResultInfoPDF.paymentInfo.counterName,
        },
        {
            title: 'Date Confirm',
            textInfo: createDateNormalFormat(treatmentResultInfoPDF.paymentInfo.dateConfirm),
        },
        {
            title: 'Confirm Hour',
            textInfo: treatmentResultInfoPDF.paymentInfo.confirmHour,
        },
        {
            title: 'Admin Name',
            textInfo: treatmentResultInfoPDF.adminInfo.adminName,
        },
        {
            title: 'Admin Email',
            textInfo: treatmentResultInfoPDF.adminInfo.adminEmail,
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

            <h1 style={PdfStyle.titleTreatment}>Treatment Results</h1>
            <h1 style={PdfStyle.patient}>{patientRegis?.patientName} - Patient</h1>
            <div style={PdfStyle.borderPatient}></div>
            
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