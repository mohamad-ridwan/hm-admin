'use client'

import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { ReactNode } from "react"

type MenuNameProps = {
    name: string
    classWrappMenuChild?: string
}

type IconProps = MenuNameProps & {
    icon: IconDefinition
    dropIconActive: boolean
    iconDrop: IconDefinition
}

type ChildrenProps = IconProps & {
    childPath: string
    dataChild: boolean
    children?: ReactNode
}

type ActionProps = ChildrenProps & {
    click?: () => void
}

type DefaultProps = ActionProps

export function MenuNavLeft({
    icon,
    classWrappMenuChild,
    dropIconActive,
    name,
    iconDrop,
    click,
    dataChild,
    childPath,
    children
}: DefaultProps) {
    return (
        <>
            {dataChild ? (
                <li
                    className={`flex flex-col py-3 text-font-color-2 pr-4 cursor-pointer border-l-[5px] border-transparent hover:border-color-default hover:text-color-default ${classWrappMenuChild} overflow-hidden transition duration-[500] ease-out`}
                    onClick={click}
                >
                    <div
                        className="flex w-full items-center justify-between"
                    >
                        <div className="flex">
                            <div className="px-7">
                                <FontAwesomeIcon
                                    icon={icon}
                                    className="text-sm"
                                />
                            </div>
                            <span
                                className=""
                            >{name}</span>
                        </div>
                        {dropIconActive && (
                            <FontAwesomeIcon
                                icon={iconDrop}
                                className="text-sm"
                            />
                        )}
                    </div>
                    {children}
                </li>
            ) : (
                <Link
                    href={childPath}
                    className="flex flex-col py-3 text-font-color-2 pr-4 cursor-pointer transition ease-out border-l-[5px] border-transparent hover:border-color-default hover:text-color-default"
                >
                    <div
                        className="flex w-full items-center"
                    >
                        <div className="px-7">
                            <FontAwesomeIcon
                                icon={icon}
                                className="text-sm"
                            />
                        </div>
                        <span
                            className=""
                        >{name}</span>
                    </div>
                </Link>
            )}
        </>
    )
}