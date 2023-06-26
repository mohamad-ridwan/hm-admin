'use client'

import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

type Props = {
    href: string
    icon: IconDefinition
    name: string
}

export function LeftMenuNavChild({
    href,
    icon,
    name
}: Props) {
    return (
        <Link
            href={href}
            className="border-l-[3px] text-font-color-2 hover:text-color-default border-transparent py-2 px-2 hover:border-color-default transition ease-out"
        >
            <div className="flex items-center">
                <div className="w-4 mr-4">
                    <FontAwesomeIcon
                        icon={icon}
                        className="text-sm"
                    />
                </div>
                <span className="text-sm">{name}</span>
            </div>
        </Link>
    )
}