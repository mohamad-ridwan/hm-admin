'use client'

import { CSSProperties, useState, useEffect } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faChartLine, faCoins, faHospitalUser, faIdCard, faUserCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import ServicingHours from 'lib/dataInformation/ServicingHours'
import { DrugCounterT, PatientFinishTreatmentT } from 'lib/types/PatientT.types'
import { currencyFormat } from 'lib/formats/currencyFormat'

export function UseDashboard() {
    const [overview, setOverview] = useState<{
        id: number
        icon: IconDefinition
        title: string
        value: number | string
        styleIcon?: CSSProperties
    }[]>([
        {
            id: 1,
            icon: faHospitalUser,
            title: 'Finished Treatment',
            value: 0,
            styleIcon: {
                background: '#7600BC'
            }
        },
        {
            id: 2,
            icon: faUserCheck,
            title: 'Patient Completed',
            value: 0,
            styleIcon: {
                background: '#288bbc'
            }
        },
        {
            id: 3,
            icon: faUserXmark,
            title: 'Patient Cancelled',
            value: 0,
            styleIcon: {
                background: '#FF0000'
            }
        },
        {
            id: 4,
            icon: faCoins,
            title: 'Cash Payment Method',
            value: 0,
            styleIcon: {
                background: '#F85084'
            }
        },
        {
            id: 5,
            icon: faIdCard,
            title: 'BPJS Payment Method',
            value: 0,
            styleIcon: {
                background: '#0AB110'
            }
        },
        {
            id: 6,
            icon: faChartLine,
            title: 'Earning',
            value: 0,
            styleIcon: {
                background: '#FF296D'
            }
        },
    ])

    const {
        loadDataService,
        dataFinishTreatment,
        dataDrugCounter
    } = ServicingHours()

    // finish treatment
    function getFinishTreatment(): void {
        if (
            !loadDataService &&
            Array.isArray(dataFinishTreatment) &&
            dataFinishTreatment.length > 0 &&
            Array.isArray(dataDrugCounter) &&
            dataDrugCounter.length > 0
        ) {
            setOverview((current) => [
                {
                    id: 1,
                    icon: faHospitalUser,
                    title: 'Finished Treatment',
                    value: totalPatientFT(dataFinishTreatment),
                    styleIcon: {
                        background: '#7600BC'
                    }
                },
                {
                    id: 2,
                    icon: faUserCheck,
                    title: 'Patient Completed',
                    value: totalPatientCompleted(dataFinishTreatment),
                    styleIcon: {
                        background: '#288bbc'
                    }
                },
                {
                    id: 3,
                    icon: faUserXmark,
                    title: 'Patient Cancelled',
                    value: totalPatientCancelled(dataFinishTreatment),
                    styleIcon: {
                        background: '#FF0000'
                    }
                },
                {
                    id: 4,
                    icon: faCoins,
                    title: 'Cash Payment Method',
                    value: totalCashPaymentMethod(dataFinishTreatment),
                    styleIcon: {
                        background: '#F85084'
                    }
                },
                {
                    id: 5,
                    icon: faIdCard,
                    title: 'BPJS Payment Method',
                    value: totalBPJSPaymentMethod(dataFinishTreatment),
                    styleIcon: {
                        background: '#0AB110'
                    }
                },
                {
                    id: 6,
                    icon: faChartLine,
                    title: 'Earning',
                    value: totalEarning(dataFinishTreatment, dataDrugCounter),
                    styleIcon: {
                        background: '#FF296D'
                    }
                },
            ])
        }
    }

    function totalPatientFT(value: PatientFinishTreatmentT[]): number {
        return value.length
    }
    function totalPatientCompleted(value: PatientFinishTreatmentT[]): number {
        return value.filter(patient => !patient?.isCanceled).length
    }
    function totalPatientCancelled(value: PatientFinishTreatmentT[]): number {
        return value.filter(patient => patient?.isCanceled).length
    }
    function totalCashPaymentMethod(value: PatientFinishTreatmentT[]): number {
        return value.filter(patient => {
            const findCounter = dataDrugCounter?.find(patientC =>
                patient.patientId === patient.patientId &&
                patientC.isConfirm.confirmState &&
                patientC.isConfirm.paymentInfo.paymentMethod === 'cash'
            )

            return findCounter
        }).length
    }
    function totalBPJSPaymentMethod(value: PatientFinishTreatmentT[]): number {
        return value.filter(patient => {
            const findCounter = dataDrugCounter?.find(patientC =>
                patient.patientId === patient.patientId &&
                patientC.isConfirm.confirmState &&
                patientC.isConfirm.paymentInfo.paymentMethod === 'BPJS'
            )

            return findCounter
        }).length
    }
    function totalEarning(
        valuePatientFT: PatientFinishTreatmentT[],
        valuePatientCounter: DrugCounterT[]
    ): string {
        const cashPM = valuePatientCounter.filter(patient => {
            const findPatientFT = valuePatientFT.find(patientFT =>
                patientFT.patientId === patient.patientId &&
                patient.isConfirm.confirmState &&
                patient.isConfirm.paymentInfo.paymentMethod === 'cash'
            )

            return findPatientFT
        })
        const earning = cashPM.map(patient=>(patient.isConfirm.paymentInfo.totalCost))
        const earningStr = currencyFormat(eval(earning.join('+')), 'id-ID', 'IDR')
        return earningStr
    }

    useEffect(() => {
        getFinishTreatment()
    }, [loadDataService, dataFinishTreatment, dataDrugCounter])

    return {
        overview
    }
}