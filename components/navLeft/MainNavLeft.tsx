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
        className={`fixed hidden tablet:flex flex-col bg-white ${onNavLeft ? 'w-[70px]' : 'w-[250px]'} transition-all left-0 bottom-0 top-0 z-20 overflow-hidden`}
        >
            {children}
        </main>
    )
}