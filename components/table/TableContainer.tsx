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
        className="flex flex-col w-full rounded mt-[3rem] py-[40px] px-[30px] bg-white shadow overflow-x-auto"
        style={style}
        >
            {children}
        </div>
    )
}