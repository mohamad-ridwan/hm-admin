'use client'

import { useEffect } from 'react';
import {notFound} from 'next/navigation'
import { UsePDF } from 'lib/pdf/UsePDF';
import ServicingHours from 'lib/actions/ServicingHours';
import { ConfirmInfoPDFT } from 'lib/types/PatientT.types';

type Props = {
    params: {params: string}
}

export function LoadPDF({
    params,
}: Props){
    if(
        params.params.length < 4 ||
        params.params.length > 5
    ){
        notFound()
    }

    const {
        loadDataService,
        dataPatientRegis,
        dataConfirmationPatients,
        dataFinishTreatment,
        dataLoket,
        dataAdmin,
        dataRooms,
        doctors,
        dataService,
        pushTriggedErr
    } = ServicingHours()

    const patientRegis = dataPatientRegis?.find(patient=>patient.id === params.params[0])
    const confirmPatient = dataConfirmationPatients?.find(patient=>patient.patientId === params.params[0])
    const finishPatient = dataFinishTreatment?.find(patient=>patient.patientId === params.params[0])

    const room = dataRooms?.find(room=>room.id === confirmPatient?.roomInfo?.roomId)
    const doctor = doctors?.find(docs=>docs.id === confirmPatient?.doctorInfo?.doctorId)
    const admin = dataAdmin?.find(admins=>admins.id === confirmPatient?.adminInfo?.adminId)

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

    if(
        !loadDataService &&
        !patientRegis &&
        !confirmPatient
    ){
        pushTriggedErr(`Found no patient by id : ${params.params[0]}`)
    }

    if(
        params.params.length === 5 &&
        !finishPatient
    ){
        pushTriggedErr(`Found no patient by id : ${params.params[0]}`)
    }

    function downloadPdf():void{
        if(
            !loadDataService &&
            patientRegis &&
            confirmPatient
        ){
            const element = document.getElementById('patientPDF') as HTMLElement
            if(element){
                UsePDF(
                    element,
                    patientRegis.patientName
                )
            }
        }
    }

    useEffect(()=>{
        setTimeout(() => {
            downloadPdf()
        }, 500)
    }, [loadDataService, dataService])

    return {
        patientRegis,
        confirmDataInfoPDF,
    }
}