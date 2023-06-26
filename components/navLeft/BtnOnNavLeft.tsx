'use client'

import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export function BtnOnNavLeft(){
    return <button
    className="flex w-full justify-end cursor-pointer py-4 px-6 text-sm text-font-color-2"
    >
        <FontAwesomeIcon icon={faAngleLeft}/>
    </button>
}