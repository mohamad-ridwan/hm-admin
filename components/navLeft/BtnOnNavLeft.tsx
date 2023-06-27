'use client'

import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { navigationStore } from "lib/useZustand/navigation"

export function BtnOnNavLeft() {
    const { onNavLeft, setOnNavLeft } = navigationStore()

    return <button
        className={`flex w-full ${onNavLeft ? 'justify-center' : 'justify-end'} cursor-pointer py-4 px-6 text-sm text-font-color-2 border-t-bdr-one`}
        onClick={() => setOnNavLeft(!onNavLeft)}
    >
        <FontAwesomeIcon icon={onNavLeft ? faAngleRight : faAngleLeft} />
    </button>
}