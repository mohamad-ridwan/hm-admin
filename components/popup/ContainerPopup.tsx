'use client'

import { ReactNode } from "react"

type Props = {
    className: string
    click?: ()=>void
    children: ReactNode
}

export function ContainerPopup({
    className,
    click,
    children
}: Props){
    return(
        <div
        className={`${className} fixed top-0 left-0 right-0 bottom-0 bg-pop-up z-50`}
        onClick={click}
        >
            {children}
        </div>
    )
}