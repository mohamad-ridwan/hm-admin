export type DataOptionT = {
    id: string
    title: string
}[]

export type DataOnDataTableContentT = {
    firstDesc?: string,
    color?: string,
    colorName?: string,
    marginBottom?: string,
    fontSize?: string,
    filterBy?: string,
    clock?: string,
    name: string,
}

export type DataTableContentT = {
    id: string
    data: DataOnDataTableContentT[]
}