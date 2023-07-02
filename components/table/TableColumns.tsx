'use client'

import { ReactNode } from "react"
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons"
import { EditBtn } from "components/editBtn/EditBtn"

type ButtonEditProps = {
    indexActiveEdit?: string | undefined
    indexActiveDelete?: string | undefined
    idLoadingEdit?: string
    idLoadingDelete?: string
    idIconEdit?: string
    idIconDelete?: string
}

type ActionButtonEdit = {
    clickEdit: (e?: MouseEvent)=>void
    clickDelete: (e?: MouseEvent)=>void
}

type ButtonProps = {
    children: ReactNode
    clickBtn: () => void
}

type Props = ButtonProps & ButtonEditProps & ActionButtonEdit

export function TableColumns({
    children,
    clickBtn,
    indexActiveEdit,
    indexActiveDelete,
    idLoadingEdit,
    idLoadingDelete,
    idIconEdit,
    idIconDelete,
    clickEdit,
    clickDelete
}: Props) {
    return (
        <>
            <button
                onClick={clickBtn}
                className="flex even:bg-cyan-table hover:bg-table-hover transition-all items-center"
            >
                {children}

                <div
                    className="flex items-center justify-between pr-2"
                >
                    <EditBtn
                        idIcon={idIconEdit}
                        idLoading={idLoadingEdit}
                        icon={indexActiveEdit !== undefined ? undefined : faPencil}
                        classBtn="hover:text-white hover:bg-color-default-old mr-1"
                        classLoading={indexActiveEdit !== undefined ? 'flex' : 'hidden'}
                        padding={indexActiveEdit !== undefined ? '0.45rem 0.5rem': '0.45rem 0.58rem'}
                        clickBtn={clickEdit}
                    />
                    <EditBtn
                        idIcon={idIconDelete}
                        idLoading={idLoadingDelete}
                        icon={indexActiveDelete !== undefined ? undefined : faTrash}
                        classBtn="bg-pink border-pink hover:text-white hover:border-pink hover:bg-pink-old"
                        classLoading={indexActiveDelete !== undefined ? 'flex' : 'hidden'}
                        padding={indexActiveDelete !== undefined ? '0.45rem 0.5rem': '0.45rem 0.6rem'}
                        clickBtn={clickDelete}
                    />
                </div>
            </button>
        </>
    )
}