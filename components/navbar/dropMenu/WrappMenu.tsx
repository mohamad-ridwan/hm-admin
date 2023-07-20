import { ReactNode } from "react"

type Props = {
    classWrapp?: string
    children: ReactNode
}

export function WrappMenu({
    classWrapp,
    children
}: Props){
    return(
        <div className={`${classWrapp} flex absolute rounded-md max-w-[10rem]`}>
            <div className="flex flex-col w-full bg-white rounded-md shadow-lg max-h-32 overflow-hidden p-[0.35rem] overflow-y-auto">
                {children}
            </div>
        </div>
    )
}