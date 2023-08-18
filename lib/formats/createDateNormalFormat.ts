import localizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import { dayNamesEng } from "lib/formats/dayNamesEng"
import { dayNamesInd } from "lib/formats/dayNamesInd"
import { monthNames } from "lib/formats/monthNames"
import { monthNamesInd } from "lib/formats/monthNamesInd"

export const createDateNormalFormat = ((date: string, offDays?: boolean): string => {
    dayjs.extend(localizedFormat)
    const localFormatDay = dayjs(date).format('ddd')?.toLowerCase()
    const getMonth = dayjs(date).format('MMM')
    const localFormatDate = dayjs(date).format('LL')?.replace(',', '')?.split(' ')

    const getDate = localFormatDate[1].length === 1 ? `0${localFormatDate[1]}` : localFormatDate[1]

    const findMonthIdx: number = monthNames.findIndex(month=>month === getMonth)
    const monthInd = monthNamesInd.find((month, index)=>index === findMonthIdx)

    const findDayIdx: number = dayNamesEng.findIndex(day=>day === localFormatDay)
    const findDayInd = dayNamesInd.find((day, index)=>index === findDayIdx)
    const dayInd = `${findDayInd?.substr(0, 1)?.toUpperCase()}${findDayInd?.substr(1, findDayInd.length - 1)}`

    return offDays ? `${monthInd} ${getDate} ${localFormatDate[2]}`: `${monthInd} ${getDate} ${localFormatDate[2]}, ${dayInd}`
})