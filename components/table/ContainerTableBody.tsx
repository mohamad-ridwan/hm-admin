import { CSSProperties, ReactNode } from "react"

type Props = {
    children: ReactNode
    style?: CSSProperties
}

export function ContainerTableBody({
    children,
    style
}: Props){
    return(
        <div
        className="flex flex-col border-collapse w-full overflow-x-auto"
        style={style}
        >
            {children}
        </div>
    )
}