export function createDateFormat(
    currentDate: Date | string,
): string {
    const nowDate = new Date(currentDate)

    const month = nowDate.getMonth() + 1
    const newMonth = month.toString().length === 1 ? `0${month}` : month
    const date = nowDate.getDate().toString().length === 1 ? `0${nowDate.getDate()}` : nowDate.getDate()
    const years = `${newMonth}/${date}/${nowDate.getFullYear()}`

    return years
}