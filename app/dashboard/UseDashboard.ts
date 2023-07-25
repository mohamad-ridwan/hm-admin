'use client'

import {CSSProperties, useState} from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faChartLine, faCoins, faHospitalUser, faIdCard, faUserCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import ServicingHours from 'lib/dataInformation/ServicingHours'

export function UseDashboard(){
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
            value: 26,
            styleIcon: {
                background: '#7600BC'
            }
        },
        {
            id: 2,
            icon: faUserCheck,
            title: 'Patient Completed',
            value: 12,
            styleIcon: {
                background: '#288bbc'
            }
        },
        {
            id: 3,
            icon: faUserXmark,
            title: 'Patient Cancelled',
            value: 5,
            styleIcon: {
                background: '#FF0000'
            }
        },
        {
            id: 4,
            icon: faCoins,
            title: 'Cash Payment Method',
            value: 10,
            styleIcon: {
                background: '#F85084'
            }
        },
        {
            id: 5,
            icon: faIdCard,
            title: 'BPJS Payment Method',
            value: 2,
            styleIcon: {
                background: '#0AB110'
            }
        },
        {
            id: 6,
            icon: faChartLine,
            title: 'Earning',
            value: 3500000,
            styleIcon: {
                background: '#FF296D'
            }
        },
    ])

    const {
        loadDataService,
        dataFinishTreatment
    } = ServicingHours()

    return{
        overview
    }
}