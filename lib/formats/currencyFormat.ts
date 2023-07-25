export const currencyFormat = (
    number: number,
    format: 'id-ID',
    currency: 'IDR'
    ) => {
    return new Intl.NumberFormat(format, {
        style: 'currency',
        currency: currency
    }).format(number)
}