import { QRCodeCanvas } from 'qrcode.react'
import { PdfStyle } from "./PdfStyle"

type Props = {
    bodyCounter: {
        loketName: string
        queueNumber: string
        url: string
    }
}

export function CounterInfo({
    bodyCounter
}: Props) {
    const {
        loketName,
        queueNumber,
        url
    } = bodyCounter
    
    const valueQR: string = url

    return (
        <div style={PdfStyle.styleWrappCounter}>
            <h1 style={PdfStyle.titleCounter}>{loketName}</h1>
            <h1 style={PdfStyle.titleCounter}>{queueNumber}</h1>

            <QRCodeCanvas
                value={valueQR}
                size={300}
                bgColor='#ffffff'
                fgColor='#000000'
                level='H'
                style={PdfStyle.QRCode}
            />
        </div>
    )
}