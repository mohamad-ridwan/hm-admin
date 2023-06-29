'use client'

import { ReactNode } from "react"

type ButtonProps = {
    children: ReactNode
    clickBtn: ()=>void
}

type Props = ButtonProps

export function TableColumns({
    children,
    clickBtn
}: Props){
    return(
        <>
        <button
        onClick={clickBtn}
        >
            {children}
        </button>
        </>
    )
}