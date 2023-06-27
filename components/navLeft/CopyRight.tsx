'use client'

import { navigationStore } from "lib/useZustand/navigation"

export function CopyRight() {
    const {onNavLeft} = navigationStore()

    return (
        <div
            className='py-4 px-6 border-t-bdr-one border-bdr-bottom flex-col'
            style={{
                display: onNavLeft ? 'none' : 'flex'
            }}
        >
            <h1
                className="font-bold text-font-color-2 text-xl"
            >
                Created by
            </h1>
            <span
                className="text-sm text-font-color-2 mt-2"
            >Ridwan</span>
        </div>
    )
}