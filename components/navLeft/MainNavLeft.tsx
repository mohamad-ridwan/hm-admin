'use client'

import { ReactNode } from "react"
import { navigationStore } from "lib/useZustand/navigation"

type Props = {
    children: ReactNode
}

export function MainNavLeft({
    children
}: Props){
    const {isNavigation, onNavLeft} = navigationStore()

    if(isNavigation === false){
        return <></>
    }

    return(
        <main
        className={`fixed hidden tablet:flex flex-col bg-white w-[${onNavLeft ? '70px' : '250px'}] left-0 bottom-0 top-0 z-20 transition duration-500 ease-out overflow-hidden`}
        >
            {children}
        </main>
    )
}