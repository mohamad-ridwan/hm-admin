'use client'

import { ReactNode } from "react"
import { navigationStore } from "lib/useZustand/navigation"

type Props = {
    children: ReactNode
}

export function MainNavLeft({
    children
}: Props){
    const {} = navigationStore()

    return(
        <main
        className="fixed flex flex-col bg-white w-[250px] left-0 bottom-0 top-0 z-20 transition duration-500 ease-out"
        >
            {children}
        </main>
    )
}