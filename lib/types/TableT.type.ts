import { IconDefinition } from "@fortawesome/fontawesome-svg-core"

export type HeadDataTableT = {name: string}[]

export type PopupSetting = {
    title: string
    classIcon?: string
    classBtnNext?: string
    iconPopup?: IconDefinition
    nameBtnNext: string
    patientId?: string
    categoryAction: string
}