'use client'

import emailjs from '@emailjs/browser'
import {EmailJSResponseStatus} from '@emailjs/browser'

export async function sendEmail(
    serviceId: string,
    templateId: string,
    dataSend: {[key: string]: string},
    publicKey: string
): Promise<EmailJSResponseStatus>{
    return await new Promise((resolve, reject)=>{
        emailjs.send(
            serviceId,
            templateId,
            dataSend,
            publicKey
        )
        .then(result=>{
            resolve(result)
        }, (error)=>reject(error))
    })
}