import { ReactNode } from "react"

type Props = {
    children: ReactNode
}

export function WrappMenu({
    children
}: Props){
    return(
        <div className="flex absolute top-[4.5rem] min-w-[120px] right-3">
            <div className="flex flex-col w-full bg-white rounded-md shadow-shadow-menu overflow-hidden">
                {children}
            </div>
        </div>
    )
}