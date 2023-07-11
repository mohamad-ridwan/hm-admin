export type DataOptionT = {
    id: string
    title: string
}[]

type DataTableConfirmation = {
    fontWeightName?: string
    filterRoom?: boolean
    queueNumber?: string
    treatmentHours?: string
    confirmHour?: string
}

export type DataOnDataTableContentT = DataTableConfirmation &  {
    firstDesc?: string,
    color?: string,
    colorName?: string,
    marginBottom?: string,
    fontSize?: string,
    filterBy?: string,
    clock?: string,
    image?: string
    name: string,
}

export type DataTableContentT = {
    id: string
    data: DataOnDataTableContentT[]
}