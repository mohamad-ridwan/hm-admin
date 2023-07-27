import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { CSSProperties } from "react"

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