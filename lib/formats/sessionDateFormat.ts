export const sessionDateFormat = (
    dayLength: number
): Date=>{
    const toDate = new Date(new Date().getTime()+(dayLength*24*60*60*1000))
    return toDate
}