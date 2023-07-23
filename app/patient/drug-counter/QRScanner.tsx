'use client'

import { QrScanner } from '@yudiel/react-qr-scanner'
import { UseCounter } from './UseCounter'

export function QRScanner() {

    const {
        onDecode,
        onError
    } = UseCounter()

    const constraints: MediaTrackConstraints = {
        width: {
            min: 640,
            ideal: 720,
            max: 1920
        },
        height: {
            min: 640,
            ideal: 720,
            max: 1080
        },
    }

    return (
        <QrScanner
            onDecode={onDecode}
            onError={onError}
            constraints={constraints}
            hideCount={false}
            tracker={false}
            scanDelay={5000}
        />
    )
}