'use client'

import { useEffect } from 'react';
import { notFound } from 'next/navigation'
import { UsePDF } from 'lib/pdf/UsePDF';
import ServicingHours from 'lib/actions/ServicingHours';
import { ConfirmInfoPDFT } from 'lib/types/PatientT.types';
import { navigationStore } from 'lib/useZustand/navigation';
import { FormatPDFT, UnitPDFT } from 'lib/types/InputT.type';

type Props = {
    params: { params: string }
}

export function LoadPDF({
    params,
}: Props) {
    const { setIsNotFound } = navigationStore()

    useEffect(() => {
        setIsNotFound(true)
    }, [])

    if (
        params.params.length < 4 ||
        params.params.length > 5
    ) {
        notFound()
    }

    const {
        loadDataService,
        dataPatientRegis,
        dataConfirmationPatients,
        dataDrugCounter,
        dataFinishTreatment,
        dataLoket,
        dataAdmin,
        dataRooms,
        doctors,
        dataService,
        pushTriggedErr
    } = ServicingHours()

    const patientRegis = dataPatientRegis?.find(patient => patient.id === params.params[0])
    const confirmPatient = dataConfirmationPatients?.find(patient => patient.patientId === params.params[0])
    const finishPatient = dataFinishTreatment?.find(patient => patient.patientId === params.params[0])
    const patientCounter = dataDrugCounter?.find(patient => patient.patientId === params.params[0])

    const room = dataRooms?.find(room => room.id === confirmPatient?.roomInfo?.roomId)
    const doctor = doctors?.find(docs => docs.id === confirmPatient?.doctorInfo?.doctorId)
    const admin = dataAdmin?.find(admins => admins.id === confirmPatient?.adminInfo?.adminId)

    const confirmDataInfoPDF: ConfirmInfoPDFT = !loadDataService && confirmPatient ? {
        queueNumber: confirmPatient.roomInfo.queueNumber,
        treatmentHours: confirmPatient.dateConfirmInfo.treatmentHours,
        roomName: room?.room as string,
        doctorName: doctor?.name as string,
        doctorSpecialist: doctor?.deskripsi as string,
        confirmHours: confirmPatient?.dateConfirmInfo?.confirmHour as string,
        confirmDate: confirmPatient?.dateConfirmInfo?.dateConfirm as string,
        adminInfo: {
            email: admin?.email as string,
            name: admin?.name as string,
        }
    } : {} as ConfirmInfoPDFT

    if (
        !loadDataService &&
        !patientRegis &&
        !confirmPatient
    ) {
        pushTriggedErr(`No registration data found with id : ${params.params[0]}`)
    }

    if(
        params.params.length === 5 &&
        params.params[2] !== 'drug-counter' &&
        params.params[2] !== 'treatment-results'
    ){
        notFound()
    }

    if (
        !loadDataService &&
        params.params.length === 5 &&
        params.params[2] === 'drug-counter' &&
        !patientCounter
    ) {
        pushTriggedErr(`No counter patient data found with id : ${params.params[0]}`)
    }

    if (
        !loadDataService &&
        params.params.length === 5 &&
        params.params[2] === 'treatment-results' &&
        !finishPatient
    ) {
        pushTriggedErr(`No data on the results of treatment of patients with id : ${params.params[0]}`)
    }

    const currentRoute: 'registration' | 'drug-counter' | 'treatment-results' | null = 
    params.params.length === 4 ? 'registration' :
    params.params.length === 5 && params.params[2] === 'drug-counter' ? 'drug-counter' :
    params.params.length === 5 && params.params[2] === 'treatment-results' ? 'treatment-results' : null

    function downloadPdf(): void {
        if (
            !loadDataService &&
            patientRegis &&
            confirmPatient
        ) {
            const element = document.getElementById('patientPDF') as HTMLElement
            if (element) {
                const formatForCurrentPDF: FormatPDFT = currentRoute === 'registration' || currentRoute === 'treatment-results' ? 'a4' : currentRoute === 'drug-counter' ? [100, 150] : undefined
                const unitCurrentPDF: UnitPDFT = currentRoute === 'registration' || currentRoute === 'treatment-results' ? 'px' : currentRoute === 'drug-counter' ? 'mm' : undefined
                if(typeof formatForCurrentPDF !== 'undefined'){
                    UsePDF(
                        element,
                        patientRegis.patientName,
                        formatForCurrentPDF,
                        unitCurrentPDF
                    )
                }
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            downloadPdf()
        }, 500)
    }, [loadDataService, dataService])

    return {
        patientRegis,
        confirmDataInfoPDF,
        patientCounter,
        currentRoute
    }
}