'use client'

import { useState } from "react"

export function UsePersonalFT(){
    const [isActiveMenu, setIsActiveMenu] = useState<boolean>(false)

    function clickMenu():void{
        setIsActiveMenu(!isActiveMenu)
    }

    return{
        isActiveMenu,
        clickMenu
    }
}