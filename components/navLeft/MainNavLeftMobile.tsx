'use client'

import { navigationStore } from "lib/useZustand/navigation"
import { ReactNode } from "react"

export function MainNavLeftMobile({
    children
}: {children: ReactNode}) {
    const {isNavigation, onNavLeft, setOnNavLeft} = navigationStore()

    if(isNavigation === false){
        return <></>
    }

    return (
        <main
            className={`fixed hidden ${onNavLeft ? 'mobile:max-tablet:hidden' : 'mobile:max-tablet:flex'} left-0 bottom-0 top-0 right-0 z-20 bg-overlay`}
            onClick={()=>setOnNavLeft(!onNavLeft)}
        >
            <div
                className={`flex flex-col h-full bg-white w-[250px] ${onNavLeft ? 'translate-x-[-250px]' : 'translate-x-[0px]'} z-30 transition-all`}
                onClick={(e)=>e.stopPropagation()}
            >
                {children}
            </div>
        </main>

    )
}