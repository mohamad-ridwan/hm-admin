'use client'

import { CSSProperties, ReactNode } from "react"
import { IconDefinition, faEllipsis, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { WrappMenu } from "components/navbar/dropMenu/WrappMenu"
import { ActionsDataT } from "lib/types/TableT.type"
import { Menu } from "components/navbar/dropMenu/Menu"

type ButtonEditProps = {
    indexActiveEdit?: string | undefined
    indexActiveDelete?: string | undefined
    idLoadingEdit?: string
    idLoadingDelete?: string
    idIconEdit?: string
    idIconDelete?: string
    iconLeft?: IconDefinition
    iconRight?: IconDefinition
    iconCancel?: IconDefinition
    idIconCancel?: string
    idLoadingCancel?: string
    styleColumnMenu?: CSSProperties
    classWrappMenu?: string
    actionsData?: ActionsDataT[]
}

type ActionButtonEdit = {
    clickEdit?: (e?: MouseEvent) => void
    clickDelete?: (e?: MouseEvent) => void
    clickBtn: () => void
    clickCancel?: (e?: MouseEvent) => void
    clickColumnMenu?: () => void
}

type ChildProps = {
    children: ReactNode
}

type Props = ChildProps & ButtonEditProps & ActionButtonEdit

export function TableColumns({
    children,
    clickBtn,
    indexActiveEdit,
    indexActiveDelete,
    idLoadingEdit,
    idLoadingDelete,
    idIconEdit,
    idIconDelete,
    iconLeft = faPencil,
    iconRight = faTrash,
    iconCancel,
    clickEdit,
    clickDelete,
    clickCancel,
    idIconCancel,
    idLoadingCancel,
    clickColumnMenu,
    styleColumnMenu,
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

                    {/* <div
                        className="hidden absolute ml-[-6rem] mt-[-6rem] bg-white shadow-lg p-3 rounded-sm items-center"
                        style={styleColumnMenu}
                    >
                        <EditBtn
                            idIcon={idIconEdit}
                            idLoading={idLoadingEdit}
                            icon={indexActiveEdit !== undefined ? undefined : iconLeft}
                            classBtn="hover:text-white hover:bg-color-default-old mr-1"
                            classLoading={indexActiveEdit !== undefined ? 'flex' : 'hidden'}
                            padding={indexActiveEdit !== undefined ? '0.45rem 0.5rem' : '0.45rem 0.58rem'}
                            clickBtn={clickEdit}
                        />
                        {typeof iconCancel !== 'undefined' && (
                            <EditBtn
                                idIcon={idIconCancel}
                                idLoading={idLoadingCancel}
                                icon={iconCancel}
                                classBtn="bg-orange-young border-orange-young hover:text-white hover:border-orange hover:bg-orange"
                                classLoading='hidden'
                                padding="0.45rem 0.5rem"
                                clickBtn={clickCancel}
                            />
                        )}
                        <EditBtn
                            idIcon={idIconDelete}
                            idLoading={idLoadingDelete}
                            icon={indexActiveDelete !== undefined ? undefined : iconRight}
                            classBtn="bg-pink border-pink hover:text-white hover:border-pink hover:bg-pink-old ml-1"
                            classLoading={indexActiveDelete !== undefined ? 'flex' : 'hidden'}
                            padding={indexActiveDelete !== undefined ? '0.45rem 0.5rem' : '0.45rem 0.6rem'}
                            clickBtn={clickDelete}
                        />
                    </div> */}
                    <button
                        className="flex justify-center items-center rounded-sm bg-color-default text-white py-[0.3rem] px-[0.4rem]"
                        onClick={(e) => {
                            if (typeof clickColumnMenu === 'function') {
                                clickColumnMenu()
                            }
                            e.stopPropagation()
                        }}
                    >
                        <FontAwesomeIcon icon={faEllipsis} className="text-lg" />
                    </button>
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