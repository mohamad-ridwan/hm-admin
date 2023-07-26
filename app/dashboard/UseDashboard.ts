'use client'

import { CSSProperties, useState, useEffect } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faChartLine, faCoins, faHospitalUser, faIdCard, faUserCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import ServicingHours from 'lib/dataInformation/ServicingHours'
import { range } from 'lodash'
import getYear from 'date-fns/getYear'
import { DrugCounterT, PatientFinishTreatmentT } from 'lib/types/PatientT.types'
import { currencyFormat } from 'lib/formats/currencyFormat'
import { monthDetailNames } from 'lib/formats/monthDetailNames'

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
    const [yearsOnFinishTreatment, setYearsOnFinishTreatment] = useState<string>(`${new Date().getFullYear()}`)

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
        const earning = cashPM.map(patient => (patient.isConfirm.paymentInfo.totalCost))
        const earningStr = currencyFormat(eval(earning.join('+')), 'id-ID', 'IDR')
        return earningStr
    }

    useEffect(() => {
        getFinishTreatment()
    }, [loadDataService, dataFinishTreatment, dataDrugCounter])

    // bar area chart (finished treatment)
    const optionsBarFT = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Bar Chart',
            },
        },
    }

    const labels = monthDetailNames

    const dataBarFT = {
        labels,
        datasets: [
            {
                label: 'data1',
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                backgroundColor: '#3face4'
            }
        ]
    }

    const getYearPTOfSelectOptions = range(1900, getYear(new Date()) + 1, 1)
    const yearPTOfSelectOptions = getYearPTOfSelectOptions?.length > 0 ? getYearPTOfSelectOptions.map((year: number) => ({ id: year, title: year })) : []

    // polar area chart (finished treatment)
    const totalFTOnYears: number =
        Array.isArray(dataFinishTreatment) &&
            dataFinishTreatment.length > 0 ?
            dataFinishTreatment.filter(patient => {
                const checkYear = patient.confirmedTime.dateConfirm.split('/')[2] === yearsOnFinishTreatment
                return checkYear
            }).length
            : 0

    const dataPolarFT = {
        labels: ['Finished Treatment', 'Patient Completed', 'Patient Cancelled'],
        datasets: [
            {
                label: 'total',
                data: [totalFTOnYears, 19, 3],
                backgroundColor: [
                    '#7600BC',
                    '#288bbc',
                    '#FF0000',
                ],
                borderWidth: 1,
            },
        ],
    }

    function handleYearsOnFinishTreatment():void{
        const elem = document.getElementById('yearFinishTreatment') as HTMLSelectElement
        const value = elem?.options[elem.selectedIndex].value
        setYearsOnFinishTreatment(value)
    }

    useEffect(()=>{
        const elem = document.getElementById('yearFinishTreatment') as HTMLSelectElement
        elem.value = `${new Date().getFullYear()}`
    }, [])
    // end polar area chart (finished treatment)

    return {
        overview,
        optionsBarFT,
        dataBarFT,
        dataPolarFT,
        yearPTOfSelectOptions,
        handleYearsOnFinishTreatment
    }
}