import { MouseEventHandler } from "react";

export type RenderCustomHeaderT = {
    date: Date | number,
    changeYear: (value: string)=>void,
    changeMonth: (value: number)=>void,
    decreaseMonth: MouseEventHandler,
    increaseMonth: MouseEventHandler,
    prevMonthButtonDisabled: boolean | undefined,
    nextMonthButtonDisabled: boolean | undefined,
}