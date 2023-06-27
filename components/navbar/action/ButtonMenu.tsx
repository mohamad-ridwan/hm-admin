'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { navigationStore } from "lib/useZustand/navigation"

export function ButtonMenu() {
    const {setOnNavLeft, onNavLeft} = navigationStore()

    return (
        <button
        onClick={()=>setOnNavLeft(!onNavLeft)}
        className={`flex tablet:hidden`}
        >
            <FontAwesomeIcon
                icon={faBars}
                className="text-font-color-2"
            />
        </button>
    )
}