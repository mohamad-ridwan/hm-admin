import dayjs from 'dayjs'

export function createDateFormat(
    currentDate: Date | string,
    format?: 'MM/DD/YYYY'
): string {
    const newFormat: 'MM/DD/YYYY' = typeof format === 'undefined' ? 'MM/DD/YYYY' : format
    const days = dayjs(currentDate).format(newFormat)

    return days
}