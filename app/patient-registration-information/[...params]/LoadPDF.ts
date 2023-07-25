'use client'

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation'
import { UsePDF } from 'lib/pdf/UsePDF';
import ServicingHours from 'lib/actions/ServicingHours';
import { ConfirmInfoPDFT, TreatmentResultsPDFT } from 'lib/types/PatientT.types';
import { navigationStore } from 'lib/useZustand/navigation';
import { FormatPDFT, UnitPDFT } from 'lib/types/InputT.type'

type Props = {
    params: { params: string }
}

export function LoadPDF({
    params,
}: Props) {
    const [bodyCounter, setBodyCounter] = useState<{
        bodyCounter: {
            loketName: string
            queueNumber: string
            url: string
        }
    }>({
        bodyCounter: {
            loketName: '',
            queueNumber: '',
            url: ''
        }
    })
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
        loadDataDoctors,
        pushTriggedErr
    } = ServicingHours()

    const patientRegis = dataPatientRegis?.find(patient => patient.id === params.params[0])
    const confirmPatient = dataConfirmationPatients?.find(patient => patient.patientId === params.params[0])
    const finishPatient = dataFinishTreatment?.find(patient => patient.patientId === params.params[0])
    const patientCounter = dataDrugCounter?.find(patient => patient.patientId === params.params[0])
    const patientCounterOn = dataLoket?.find(loket => loket.id === patientCounter?.loketInfo?.loketId)

    const room = dataRooms?.find(room => room.id === confirmPatient?.roomInfo?.roomId)
    const doctor = doctors?.find(docs => docs.id === confirmPatient?.doctorInfo?.doctorId)
    const admin = dataAdmin?.find(admins => admins.id === confirmPatient?.adminInfo?.adminId)
    const adminDrugCounter = dataAdmin?.find(admins => admins.id === patientCounter?.adminInfo?.adminId)

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

    const treatmentResultInfoPDF: TreatmentResultsPDFT = {
        doctorName: doctor?.name as string,
        doctorSpecialist: doctor?.deskripsi as string,
        doctorRoom: room?.room as string,
        patientName: patientRegis?.patientName as string,
        patientId: patientRegis?.id as string,
        patientEmail: patientRegis?.emailAddress as string,
        adminInfo: {
            adminName: adminDrugCounter?.name as string,
            adminEmail: adminDrugCounter?.email as string
        },
        paymentInfo: {
            message: patientCounter?.isConfirm.paymentInfo.message as string,
            paymentMethod: patientCounter?.isConfirm.paymentInfo.paymentMethod as string,
            totalCost: patientCounter?.isConfirm.paymentInfo.totalCost as string,
            counterName: patientCounterOn?.loketName as string,
            dateConfirm: patientCounter?.isConfirm.dateConfirm.dateConfirm as string,
            confirmHour: patientCounter?.isConfirm.dateConfirm.confirmHour as string
        }
    }

    if (
        !loadDataService &&
        !patientRegis &&
        !confirmPatient
    ) {
        pushTriggedErr(`No registration data found with id : ${params.params[0]}`)
    }

    if (
        params.params.length === 5 &&
        params.params[2] !== 'drug-counter' &&
        params.params[2] !== 'treatment-results'
    ) {
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
            !loadDataDoctors &&
            patientRegis &&
            confirmPatient
        ) {
            const element = document.getElementById('patientPDF') as HTMLElement
            if (element) {
                const formatForCurrentPDF: FormatPDFT = currentRoute === 'registration' || currentRoute === 'treatment-results' ? 'a4' : currentRoute === 'drug-counter' ? [100, 150] : undefined
                const unitCurrentPDF: UnitPDFT = currentRoute === 'registration' || currentRoute === 'treatment-results' ? 'px' : currentRoute === 'drug-counter' ? 'mm' : undefined
                const fileName:
                    'patient-registration-information' |
                    'queue-number' |
                    'treatment-result'
                    = currentRoute === 'registration' ? 'patient-registration-information' : currentRoute === 'drug-counter' ? 'queue-number' : 'treatment-result'
                if (Array.isArray(formatForCurrentPDF)) {
                    createCounterURL()
                }
                setTimeout(() => {
                    UsePDF(
                        element,
                        patientRegis.patientName,
                        formatForCurrentPDF,
                        unitCurrentPDF,
                        fileName
                    )
                }, 500);
            }
        }
    }

    function createCounterURL(): void {
        const urlOrigin = window.location.origin
        const isCounterConfirm: 'confirmed' | 'not-yet-confirmed' = patientCounter?.isConfirm?.confirmState ? 'confirmed' : 'not-yet-confirmed'
        const counterURL: string = `${urlOrigin}/patient/patient-registration/personal-data/confirmed/${params.params[1]}/${params.params[0]}/counter/${patientCounterOn?.loketName}/${isCounterConfirm}/${patientCounter?.queueNumber}`
        setBodyCounter(() => ({
            bodyCounter: {
                loketName: patientCounterOn?.loketName as string,
                queueNumber: patientCounter?.queueNumber as string,
                url: counterURL
            }
        }))
    }

    useEffect(() => {
        setTimeout(() => {
            downloadPdf()
        }, 500)
    }, [loadDataService, loadDataDoctors, dataService])

    return {
        patientRegis,
        confirmDataInfoPDF,
        patientCounter,
        currentRoute,
        bodyCounter,
        treatmentResultInfoPDF,
        loadDataService,
        loadDataDoctors
    }
}