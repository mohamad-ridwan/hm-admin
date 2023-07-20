'use client'

import { ReactNode } from "react"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { WrappMenu } from "components/navbar/dropMenu/WrappMenu"
import { ActionsDataT } from "lib/types/TableT.type"
import { Menu } from "components/navbar/dropMenu/Menu"
import Button from "components/Button"

type ButtonEditProps = {
    classWrappMenu?: string
    actionsData?: ActionsDataT[]
}

type ActionButtonEdit = {
    clickBtn: () => void
    clickColumnMenu?: () => void
}

type ChildProps = {
    children: ReactNode
}

type Props = ChildProps & ButtonEditProps & ActionButtonEdit

export function TableColumns({
    children,
    clickBtn,
    clickColumnMenu,
    classWrappMenu,
    actionsData
}: Props) {
    return (
        <>
            <button
                onClick={clickBtn}
                className="flex even:bg-cyan-table hover:bg-table-hover transition-all items-center"
            >
                {children}

                <div
                    className="flex items-center justify-between pr-2 right-0 absolute"
                >
                    <Button
                        classBtn="hover:text-white rounded-sm px-[0.4rem] h-7"
                        classLoading="hidden"
                        icon={<>
                            <FontAwesomeIcon icon={faEllipsis} className="text-lg" />
                        </>}
                        clickBtn={(e?: MouseEvent) => {
                            if (typeof clickColumnMenu === 'function') {
                                clickColumnMenu()
                            }
                            e?.stopPropagation()
                        }}
                    />
                </div>
                <WrappMenu
                    classWrapp={`${classWrappMenu} right-[3rem] bg-white shadow-lg`}
                >
                    {
                        typeof actionsData !== 'undefined' &&
                        actionsData.length > 0 &&
                        actionsData.map((item, index) => {
                            return (
                                <Menu
                                    key={index}
                                    classWrapp={item?.classWrapp}
                                    id={item.id}
                                    name={item.name}
                                    click={item.click}
                                />
                            )
                        })
                    }
                </WrappMenu>
            </button>
        </>
    )
}