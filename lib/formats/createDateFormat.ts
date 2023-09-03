import dayjs from 'dayjs'

export function createDateFormat(
    currentDate: Date | string,
    format?: 'MM/DD/YYYY'
): string {
    const newFormat: 'MM/DD/YYYY' = format ? format : 'MM/DD/YYYY'
    const days = dayjs(currentDate).format(newFormat)

    return days
}