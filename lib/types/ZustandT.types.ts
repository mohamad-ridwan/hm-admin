import { AdminT } from "./AdminT.types"

export type ConditionT = {
    value: boolean
}

export type UserT = {
    user: AdminT | null
}