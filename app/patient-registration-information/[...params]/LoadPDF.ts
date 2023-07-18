'use client'

import { UsePDF } from 'lib/UsePDF';
import { useEffect } from 'react';

export function LoadPDF(){
    function downloadPdf():void{
        const patientPDF = document.getElementById('patientPDF') as HTMLElement
        if(patientPDF){
            UsePDF(
                patientPDF,
                'espy'
            )
        }
    }

    useEffect(()=>{
        setTimeout(() => {
            downloadPdf()
        }, 500)
    }, [])

    return {}
}