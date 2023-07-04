import { CSSProperties, ReactNode } from "react"

type Props = {
    children: ReactNode
    style?: CSSProperties
    width?: string
}

export function TableBody({
    children,
    style,
    width
}: Props){
    return(
        <div
        className={`flex flex-col ${width ? width : 'w-[1300px]'}`}
        style={style}
        >
            {children}
        </div>
    )
}