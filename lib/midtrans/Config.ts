'use client'

import { useEffect } from "react"

const clientKey: string = process.env.NEXT_PUBLIC_MT_CLIENT_KEY as string

export function Config(){
    useEffect(()=>{
        const snapSrcUrl = 'https://app.sandbox.midtrans.com/snap/snap.js'
        const myMidtransClientKey = `${clientKey}`
        const script = document.createElement('script')
        script.src = snapSrcUrl
        script.setAttribute('data-client-key', myMidtransClientKey)
        script.async = true

        document.body.appendChild(script)

        return ()=>{
            document.body.removeChild(script)
        }
    }, [])

    return {}
}