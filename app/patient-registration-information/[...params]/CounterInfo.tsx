'use client'

import QRCode from "react-qr-code"
import { PdfStyle } from "./PdfStyle"

export function CounterInfo() {

    const valueQR: string = 'https://hm-admin-six.vercel.app/patient-registration-information/1689491302448/Ridwan/download/pdf'

    return (
        <div style={PdfStyle.styleWrappCounter}>
            <h1 style={PdfStyle.titleCounter}>C.A01</h1>
            <h1 style={PdfStyle.titleCounter}>30</h1>

            {/* <div style={PdfStyle.containerBarcode}>
                <QRCode 
                value={valueQR} 
                size={30}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
                viewBox={`0 0 256 256`}
                />
            </div> */}
            <QRCode
                value={valueQR}
                size={10}
                style={{ height: "auto", maxWidth: "100%", width: "5mm" }}
                viewBox={`0 0 256 256`}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
            />
        </div>
    )
}