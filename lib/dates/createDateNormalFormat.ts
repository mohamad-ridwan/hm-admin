import { dayNamesEng } from "lib/namesOfCalendar/dayNamesEng"
import { dayNamesInd } from "lib/namesOfCalendar/dayNamesInd"
import { monthNames } from "lib/namesOfCalendar/monthNames"
import { monthNamesInd } from "lib/namesOfCalendar/monthNamesInd"

export const createDateNormalFormat = ((date: string, offDays?: boolean): string => {
    const getDate = `${new Date(date)}`
    const findIdxDayNameOfAD = dayNamesEng.findIndex(day => day === getDate.split(' ')[0]?.toLowerCase())
    const getNameOfAD = `${dayNamesInd[findIdxDayNameOfAD]?.substr(0, 1)?.toUpperCase()}${dayNamesInd[findIdxDayNameOfAD]?.substr(1, dayNamesInd[findIdxDayNameOfAD]?.length - 1)}`
    const findIdxMonthOfAD = monthNames.findIndex(month => month.toLowerCase() === getDate.split(' ')[1]?.toLowerCase())
    const getMonthOfAD = monthNamesInd[findIdxMonthOfAD]
    const getDateOfAD = date?.split('/')[1]
    const getYearOfAD = date?.split('/')[2]

    return offDays ? `${getMonthOfAD} ${getDateOfAD} ${getYearOfAD}` : `${getMonthOfAD} ${getDateOfAD} ${getYearOfAD}, ${getNameOfAD}`
})