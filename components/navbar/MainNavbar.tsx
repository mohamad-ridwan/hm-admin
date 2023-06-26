'use client'

import { navigationStore } from "lib/useZustand/navigation"
import { ReactNode } from "react"

type Props = {
    children: ReactNode
}

export default function MainNavbar({
    children
}: Props){
    const {isNavigation} = navigationStore()

    if(isNavigation === false){
        return <></>
    }

    return (
        <main className='flex justify-between items-center py-4 px-6 bg-white fixed left-[250px] right-0 border-b-[1px] border-b-bdr-bottom z-10'>
            {children}
        </main>
    )
}