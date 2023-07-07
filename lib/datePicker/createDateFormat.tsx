import { dayNamesEng } from "lib/namesOfCalendar/dayNamesEng"
import { dayNamesInd } from "lib/namesOfCalendar/dayNamesInd"

export function createDateFormat(
    currentDate: Date | string,
    fullFormatDate?: boolean
): string {
    const nowDate = new Date(currentDate)

    const month = nowDate.getMonth() + 1
    const newMonth = month.toString().length === 1 ? `0${month}` : month
    const date = nowDate.getDate().toString().length === 1 ? `0${nowDate.getDate()}` : nowDate.getDate()
    const years = `${newMonth}/${date}/${nowDate.getFullYear()}`

    // with name day
    const findIdxDayNameOfAD = dayNamesEng.findIndex(day => day === `${nowDate}`.split(' ')[0]?.toLowerCase())
    const getNameOfAD = `${dayNamesInd[findIdxDayNameOfAD]?.substr(0, 1)?.toUpperCase()}${dayNamesInd[findIdxDayNameOfAD]?.substr(1, dayNamesInd[findIdxDayNameOfAD]?.length - 1)}`

    if(fullFormatDate){
        return `${newMonth}/${date}/${nowDate.getFullYear()}, ${getNameOfAD}`
    }

    return years
}