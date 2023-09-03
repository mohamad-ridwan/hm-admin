import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { CSSProperties } from "react"
import { DataTableContentT } from "./FilterT"

export type HeadDataTableT = { name: string }[]

export type PopupSetting = {
    title: string
    classIcon?: string
    classBtnNext?: string
    iconPopup?: IconDefinition
    nameBtnNext: string
    patientId?: string
    categoryAction: string
}

type ActionsPopupData = {
    nameBtn: string
    classBtn: string
    classLoading: string
    clickBtn: () => void
    styleBtn: CSSProperties
}

export type PopupSettings = {
    clickClose:()=>void
    title: string
    classIcon: string
    iconPopup: IconDefinition
    patientId?: string
    categoryAction?: string
    actionsData: ActionsPopupData[]
}

export type ActionsDataT = {
    id?: string
    classWrapp?: string
    name: string
    click: () => void
}

export type AlertsT={
    onAlert: boolean
    title?: string
    desc: string
}

export type NotificationT={
    onNotif: boolean
    title: string
    desc: string
}

export type DataTableResultT = {
    message: string
    data: DataTableContentT[]
    pagination:{
        currentPage: string | number
        lastPage: number
        totalData: number
    }
}

export type CounterInfoT = {
    title: string
    total: number | string
}

export type QueueNumberCIT = {
    documentId: string | null
    patientId: string | null
    queueNumber: number
}

export type DataCounterInfoResultT = {
    message: string
    data: {
        counterInfo: CounterInfoT[]
        queueNumber: QueueNumberCIT
    }
}