'use client'

import { ReactNode } from "react"
import { navigationStore } from "lib/useZustand/navigation"

type Props = {
    children: ReactNode
    maxWidth?: string
    overflow?: string
}

export function Container({
    children,
    maxWidth = 'w-[1300px]',
    overflow
}: Props) {
    const {onNavLeft} = navigationStore()

    return (
        <div
            className={`flex justify-center w-full pt-[120px] pr-[20px] pb-[40px] mobile:max-tablet:px-[0.65rem] ${onNavLeft ? 'tablet:pl-[90px]' : 'tablet:pl-[270px]'} transition-all`}
        >
            <div
            className={`flex flex-col ${maxWidth} ${overflow}`}
            >
                {children}
            </div>
        </div>
    )
}