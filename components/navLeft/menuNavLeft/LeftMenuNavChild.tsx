'use client'

import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

type Props = {
    href: string
    icon: IconDefinition
    name: string
    menuActive?: boolean
}

export function LeftMenuNavChild({
    href,
    icon,
    name,
    menuActive
}: Props) {
    return (
        <Link
            href={href}
            className={`border-l-[3px] ${menuActive ? 'text-color-default border-color-default' : 'text-font-color-2 border-transparent'} hover:text-color-default py-2 px-2 hover:border-color-default transition ease-out`}
        >
            <div className="flex items-center">
                <div className="w-4 mr-4">
                    <FontAwesomeIcon
                        icon={icon}
                        className="text-sm"
                    />
                </div>
                <span className="text-[0.8rem]">{name}</span>
            </div>
        </Link>
    )
}