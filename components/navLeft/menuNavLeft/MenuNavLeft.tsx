'use client'

import { ReactNode } from "react"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

type MenuNameProps = {
    name: string
    classWrappMenuChild?: string,
    menuActive?: boolean
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
    clickBtnTagA?: ()=>void
}

type DefaultProps = ActionProps

export function MenuNavLeft({
    icon,
    classWrappMenuChild,
    dropIconActive,
    name,
    iconDrop,
    click,
    clickBtnTagA,
    dataChild,
    childPath,
    menuActive,
    children,
}: DefaultProps) {
    return (
        <>
            {dataChild ? (
                <li
                    className={`flex flex-col py-3 ${menuActive ? 'border-color-default text-color-default' : 'text-font-color-2 border-transparent'} cursor-pointer border-l-[5px] hover:border-color-default hover:text-color-default overflow-hidden transition-all`}
                    onClick={click}
                    style={{
                        height: classWrappMenuChild
                    }}
                >
                    <div
                        className="flex w-full items-center justify-between"
                    >
                        <div className="flex">
                            <div className="px-6">
                                <FontAwesomeIcon
                                    icon={icon}
                                    className="text-sm"
                                />
                            </div>
                            <span
                                className="text-[0.9rem]"
                            >{name}</span>
                        </div>
                        {dropIconActive && (
                            <FontAwesomeIcon
                                icon={iconDrop}
                                className="text-sm mr-4"
                            />
                        )}
                    </div>
                    {children}
                </li>
            ) : (
                <Link
                    href={childPath}
                    className={`flex flex-col py-3 ${menuActive ? 'border-color-default text-color-default' : 'text-font-color-2 border-transparent'} cursor-pointer transition-all border-l-[5px] hover:border-color-default hover:text-color-default`}
                    onClick={clickBtnTagA}
                >
                    <div
                        className="flex w-full items-center"
                    >
                        <div className="px-6">
                            <FontAwesomeIcon
                                icon={icon}
                                className="text-sm"
                            />
                        </div>
                        <span className="text-[0.9rem]">{name}</span>
                    </div>
                </Link>
            )}
        </>
    )
}