import { CSSProperties, ReactNode } from "react"

type Props = {
    children: ReactNode
    style?: CSSProperties
}

export function TableContainer({
    children,
    style
}: Props){
    return(
        <div
        className="flex flex-col w-full rounded py-6 px-2 bg-white shadow overflow-x-auto"
        style={style}
        >
            {children}
        </div>
    )
}