import { CSSProperties, ReactElement } from "react"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "components/Button"
import { Menu } from "components/navbar/dropMenu/Menu"
import { WrappMenu } from "components/navbar/dropMenu/WrappMenu"
import { ActionsDataT } from "lib/types/TableT.type"

type PropsDefault = {
    id?: string
}

type PropsFirstDesc = {
    firstDesc?: string
    styleFirstDesc?: CSSProperties
}

type ButtonEditProps = {
    classWrappMenu?: string
    actionsData?: ActionsDataT[]
    styleAction?: CSSProperties
}

type ActionButtonEdit = {
    clickColumnMenu?: () => void
}

type PropsName = {
    name: string
    styleName?: CSSProperties
    leftName?: ReactElement
}

type Props = PropsDefault & PropsFirstDesc & PropsName & ButtonEditProps & ActionButtonEdit

export function TableData({
    id,
    name,
    firstDesc,
    styleFirstDesc,
    styleName,
    leftName,
    classWrappMenu,
    actionsData,
    clickColumnMenu,
    styleAction
}: Props) {
    return (
        <td
            id={id}
            // className="flex w-[calc(100%/7)] p-[20px]"
            // className="px-6 py-4"
            className="px-6 py-4 whitespace-nowrap"
        >
            <div
                className="flex flex-col w-full"
            >
                <p
                    style={styleFirstDesc}
                    className="text-[0.82rem] text-start whitespace-nowrap"
                >{firstDesc}</p>
                <div
                    className="flex items-center"
                >
                    {leftName}
                    <p
                        style={styleName}
                        className="text-[0.82rem] text-start whitespace-nowrap"
                    >
                        {name}
                    </p>
                </div>
            </div>
            <WrappMenu
                classWrapp={`${classWrappMenu} bg-white shadow-lg z-10`}
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
            <div
                // className="flex items-center justify-between pr-2 right-0 absolute mt-6 mr-4"
                style={styleAction}
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
        </td>
    )
}