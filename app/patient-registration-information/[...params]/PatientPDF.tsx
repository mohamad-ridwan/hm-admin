'use client'

import Image from "next/image"
import logo from 'images/logo.png'

export function PatientPDF() {
    // const { } = UsePdf()

    return (
        <div
            id="patientPDF"
            style={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div
            style={{
                display: 'flex',
                alignItems: 'center'
            }}
            >
                <Image
                    src={logo}
                    alt="hospice medical"
                    width={20}
                    height={20}
                    style={{
                        objectFit: 'cover',
                        marginRight: '5px'
                    }}
                />
                <h1><strong>Hospice Medical</strong></h1>
            </div>
        </div>
    )
}