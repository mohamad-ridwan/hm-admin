'use client'

import { CSSProperties, useState, useEffect } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCoins, faHospitalUser, faIdCard, faMoneyBill, faUserCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons'
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
            icon: faMoneyBill,
            title: 'Earning',
            value: 0,
            styleIcon: {
                background: '#FF296D'
            }
        },
    ])
    const [yearsOnFinishTreatment, setYearsOnFinishTreatment] = useState<string>(`${new Date().getFullYear()}`)
    const [yearsOnPaymentInfo, setYearsOnPaymentInfo] = useState<string>(`${new Date().getFullYear()}`)

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
            setOverview([
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
                    value: totalCashOrBPJSPMethod(dataFinishTreatment, 'cash'),
                    styleIcon: {
                        background: '#F85084'
                    }
                },
                {
                    id: 5,
                    icon: faIdCard,
                    title: 'BPJS Payment Method',
                    value: totalCashOrBPJSPMethod(dataFinishTreatment, 'BPJS'),
                    styleIcon: {
                        background: '#0AB110'
                    }
                },
                {
                    id: 6,
                    icon: faMoneyBill,
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
    function totalCashOrBPJSPMethod(
        value: PatientFinishTreatmentT[],
        paymentMethod: 'cash' | 'BPJS'
    ): number {
        return value.filter(patient => {
            const findCounter = dataDrugCounter?.find(patientC =>
                patientC.patientId === patient.patientId &&
                patientC.isConfirm.confirmState &&
                patientC.isConfirm.paymentInfo.paymentMethod === paymentMethod
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

    const getYearPTOfSelectOptions = range(2020, getYear(new Date()) + 1, 1)
    const yearPTOfSelectOptions = getYearPTOfSelectOptions?.length > 0 ? getYearPTOfSelectOptions.map((year: number) => ({ id: year, title: year })) : []

    // polar area chart (finished treatment)
    // finished treatment on current years
    const totalFTOnYears: number =
        Array.isArray(dataFinishTreatment) &&
            dataFinishTreatment.length > 0 ?
            dataFinishTreatment.filter(patient => {
                const checkYear = patient.confirmedTime.dateConfirm.split('/')[2] === yearsOnFinishTreatment
                return checkYear
            }).length
            : 0
    // patient completed or cancelled on current years
    function totalCompletedOrCancelled(
        isCanceled: boolean
    ): number {
        const total: number =
            Array.isArray(dataFinishTreatment) &&
                dataFinishTreatment.length > 0 ?
                dataFinishTreatment.filter(patient => {
                    const checkYear =
                        patient.confirmedTime.dateConfirm.split('/')[2] === yearsOnFinishTreatment &&
                        patient?.isCanceled === isCanceled
                    return checkYear
                }).length
                : 0

        return total
    }

    const dataPolarFT = {
        labels: ['Finished Treatment', 'Patient Completed', 'Patient Cancelled'],
        datasets: [
            {
                label: 'total',
                data: [
                    totalFTOnYears,
                    totalCompletedOrCancelled(false),
                    totalCompletedOrCancelled(true)
                ],
                backgroundColor: [
                    '#7600BC',
                    '#288bbc',
                    '#FF0000',
                ],
                borderWidth: 1,
            },
        ],
    }

    const optionsPolarChartFT = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `Total number of patients treated this year (${yearsOnFinishTreatment})`,
            },
        },
    }

    function handleYearsOnFinishTreatment(): void {
        const elem = document.getElementById('yearFinishTreatment') as HTMLSelectElement
        const value = elem?.options[elem.selectedIndex].value
        setYearsOnFinishTreatment(value)
    }

    useEffect(() => {
        const elem = document.getElementById('yearFinishTreatment') as HTMLSelectElement
        if (elem) {
            elem.value = `${new Date().getFullYear()}`
        }
    }, [])
    // end polar area chart (finished treatment)

    // bar area chart (finished treatment)
    const optionsBarFT = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `Patient treated this year (${yearsOnFinishTreatment})`,
            },
        },
    }

    function barPatientFTOnYears(years: string): PatientFinishTreatmentT[] {
        if (
            !loadDataService &&
            !Array.isArray(dataFinishTreatment) ||
            dataFinishTreatment?.length === 0
        ) {
            return []
        }
        const checkPatientOnDate = dataFinishTreatment?.filter(patient => {
            const yearOfConfirm = patient.confirmedTime.dateConfirm.split('/')[2] === years
            return yearOfConfirm
        })

        return checkPatientOnDate as PatientFinishTreatmentT[]
    }

    function checkDateConfirmFT(item: PatientFinishTreatmentT): number {
        const monthOfConfirm = item.confirmedTime.dateConfirm.split('/')[0]
        const checkMonth = monthOfConfirm.substr(0, 1) === '0' ? monthOfConfirm.substr(1) : monthOfConfirm

        return Number(checkMonth)
    }

    function loopPatientFTOnMonth(month: number): number {
        const patientFTInMonthJan = barPatientFTOnYears(yearsOnFinishTreatment)?.length > 0 ?
            barPatientFTOnYears(yearsOnFinishTreatment).filter(item => checkDateConfirmFT(item) === month) :
            []
        return patientFTInMonthJan.length
    }
    const resultPatientFTOnMonth = monthDetailNames.map((v, i) => (loopPatientFTOnMonth(i)))

    function barPatientCompletedOrCancelled(
        years: string,
        isCanceled: boolean
    ): PatientFinishTreatmentT[] {
        if (
            !loadDataService &&
            !Array.isArray(dataFinishTreatment) ||
            dataFinishTreatment?.length === 0
        ) {
            return []
        }

        const checkPatientOnDate = dataFinishTreatment?.filter(patient => {
            const yearOfConfirm = patient.confirmedTime.dateConfirm.split('/')[2] === years
            return yearOfConfirm && patient.isCanceled === isCanceled
        })

        return checkPatientOnDate as PatientFinishTreatmentT[]
    }

    function loopPatientCompletedOnMonth(
        month: number,
        isCanceled: boolean
    ): number {
        const patientFTInMonthJan = barPatientCompletedOrCancelled(yearsOnFinishTreatment, isCanceled)?.length > 0 ?
            barPatientCompletedOrCancelled(yearsOnFinishTreatment, isCanceled).filter(item => checkDateConfirmFT(item) === month) :
            []
        return patientFTInMonthJan.length
    }
    const resultPatientCompletedOnMonth = monthDetailNames.map((v, i) => (loopPatientCompletedOnMonth(i, false)))
    const resultPatientCanceledOnMonth = monthDetailNames.map((v, i) => (loopPatientCompletedOnMonth(i, true)))

    const labels = monthDetailNames

    const dataBarFT = {
        labels,
        datasets: [
            {
                label: 'Finished treatment',
                data: resultPatientFTOnMonth,
                backgroundColor: '#7600BC'
            },
            {
                label: 'Patient Completed',
                data: resultPatientCompletedOnMonth,
                backgroundColor: '#288bbc'
            },
            {
                label: 'Patient Cancelled',
                data: resultPatientCanceledOnMonth,
                backgroundColor: '#FF0000'
            },
        ]
    }
    // end bar area chart (finished treatment)

    // polar area chart (payment information)
    function totalCashOrBPJSPaymentInfo(
        value: PatientFinishTreatmentT[] | undefined,
        paymentMethod: 'cash' | 'BPJS'
    ): number {
        if (
            !loadDataService &&
            Array.isArray(value) &&
            value.length > 0
        ) {
            return value.filter(patient => {
                const findCounter = dataDrugCounter?.find(patientC =>
                    patientC.patientId === patient.patientId &&
                    patientC.isConfirm.confirmState &&
                    patientC.isConfirm.paymentInfo.paymentMethod === paymentMethod
                )

                const years = patient.confirmedTime.dateConfirm.split('/')[2]
                return findCounter && years === yearsOnPaymentInfo
            }).length
        }
        return 0
    }

    const optionsPolarChartPaymentInfo = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `Payment method this year (${yearsOnPaymentInfo})`,
            },
        },
    }

    const dataPolarChartPaymentInfo = {
        labels: ['Cash', 'BPJS'],
        datasets: [
            {
                label: 'total',
                data: [
                    totalCashOrBPJSPaymentInfo(dataFinishTreatment, 'cash'),
                    totalCashOrBPJSPaymentInfo(dataFinishTreatment, 'BPJS'),
                ],
                backgroundColor: [
                    '#F85084',
                    '#0AB110',
                ],
                borderWidth: 1,
            },
        ],
    }

    function handleYearsOnPaymentInfo(): void {
        const elem = document.getElementById('yearPaymentInfo') as HTMLSelectElement
        const value = elem?.options[elem.selectedIndex].value
        setYearsOnPaymentInfo(value)
    }

    useEffect(() => {
        const elem = document.getElementById('yearPaymentInfo') as HTMLSelectElement
        if (elem) {
            elem.value = `${new Date().getFullYear()}`
        }
    }, [])
    // end polar area chart (payment information)

    // bar chart (payment information)
    function totalCashOrBPJSPMOnMonth(
        value: PatientFinishTreatmentT[] | undefined,
        paymentMethod: 'cash' | 'BPJS'
    ): PatientFinishTreatmentT[] {
        if (
            !loadDataService &&
            Array.isArray(value) &&
            value.length > 0
        ) {
            return value.filter(patient => {
                const findCounter = dataDrugCounter?.find(patientC =>
                    patientC.patientId === patient.patientId &&
                    patientC.isConfirm.confirmState &&
                    patientC.isConfirm.paymentInfo.paymentMethod === paymentMethod
                )

                const years = patient.confirmedTime.dateConfirm.split('/')[2]
                return findCounter && years === yearsOnPaymentInfo
            })
        }
        return []
    }

    function loopCashOrBPJSPMethodOnMonth(
        month: number,
        paymentMethod: 'cash' | 'BPJS'
    ): number {
        const patientFTInMonthJan = totalCashOrBPJSPMOnMonth(dataFinishTreatment, paymentMethod)?.length > 0 ?
            totalCashOrBPJSPMOnMonth(dataFinishTreatment, paymentMethod).filter(item => checkDateConfirmFT(item) === month) :
            []
        return patientFTInMonthJan.length
    }
    const resultCashPMethodOnMonth = monthDetailNames.map((v, i) => (loopCashOrBPJSPMethodOnMonth(i, 'cash')))
    const resultBPJSPMethodOnMonth = monthDetailNames.map((v, i) => (loopCashOrBPJSPMethodOnMonth(i, 'BPJS')))

    const optionsBarPaymentInfo = {
        responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: `Payment method this year (${yearsOnPaymentInfo})`,
                },
            },
    }

    const dataBarPaymentInfo = {
        labels,
        datasets: [
            {
                label: 'Cash',
                data: resultCashPMethodOnMonth,
                backgroundColor: '#F85084'
            },
            {
                label: 'BPJS',
                data: resultBPJSPMethodOnMonth,
                backgroundColor: '#0AB110'
            },
        ]
    }
    // end bar chart (payment information)

    return {
        overview,
        optionsBarFT,
        dataBarFT,
        dataPolarFT,
        yearPTOfSelectOptions,
        handleYearsOnFinishTreatment,
        optionsPolarChartFT,
        handleYearsOnPaymentInfo,
        optionsPolarChartPaymentInfo,
        dataPolarChartPaymentInfo,
        optionsBarPaymentInfo,
        dataBarPaymentInfo
    }
}