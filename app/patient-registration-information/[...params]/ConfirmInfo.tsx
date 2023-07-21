import { Container } from "components/Container"
import { createDateNormalFormat } from "lib/dates/createDateNormalFormat"
import { ConfirmInfoPDFT } from "lib/types/PatientT.types"
import { PdfStyle } from "./PdfStyle"
import { CardInfo } from "components/dataInformation/CardInfo"

type Props = {
    confirmDataInfoPDF: ConfirmInfoPDFT
}

export function ConfirmInfo({
    confirmDataInfoPDF
}: Props) {
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
            <h1 style={PdfStyle.patient}>Confirmation Info</h1>

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
            <h1 style={PdfStyle.patient}>Admin Confirmation</h1>
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
        </>
    )
}