export type DataOptionT = {
    id: string
    title: string
}[]

type AdditionalDataT = {
    fontWeightName?: string
    filterRoom?: boolean
    queueNumber?: string
    treatmentHours?: string
    confirmHour?: string
    fontWeightFirstDesc?: string
}

export type DataOnDataTableContentT = AdditionalDataT &  {
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
    url?: string
    data: DataOnDataTableContentT[]
}