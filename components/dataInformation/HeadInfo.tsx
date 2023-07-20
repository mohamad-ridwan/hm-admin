import { CSSProperties } from "react"
import { IconDefinition, faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { WrappMenu } from "components/navbar/dropMenu/WrappMenu"
import Button from "components/Button"
import { ActionsDataT } from "lib/types/TableT.type"
import { Menu } from "components/navbar/dropMenu/Menu"

type ActionProps = {
    clickEdit?: () => void
    clickDelete?: () => void
    clickDownload?: () => void
    clickSend?: () => void
    clickMenu?: ()=>void
}

type IconProps = {
    icon?: IconDefinition
    iconRight?: IconDefinition
    editIcon?: IconDefinition
    deleteIcon?: IconDefinition
    downloadIcon?: IconDefinition
    sendIcon?: IconDefinition
}

type Props = IconProps & ActionProps & {
    classTitle?: string
    title?: string
    titleInfo: string
    styleHeadTop?: CSSProperties
    titleRight?: string
    styleHeadRight?: CSSProperties
    classEditBtn?: string
    classDeleteBtn?: string
    classLoadingEdit?: string
    classLoadingDelete?: string,
    classDownloadBtn?: string,
    classLoadingDownload?: string
    classSendIcon?: string
    classLoadingSend?: string
    actionsData?: ActionsDataT[]
    classWrappMenu?: string
}

export function HeadInfo({
    classTitle,
    icon,
    title,
    titleInfo,
    styleHeadTop,
    iconRight,
    titleRight,
    styleHeadRight,
    classEditBtn,
    classDeleteBtn,
    editIcon,
    deleteIcon,
    downloadIcon,
    sendIcon,
    classLoadingEdit,
    classLoadingDelete,
    classDownloadBtn,
    classLoadingDownload,
    classSendIcon,
    classLoadingSend,
    clickEdit,
    clickDelete,
    clickDownload,
    clickSend,
    actionsData,
    classWrappMenu,
    clickMenu
}: Props) {
    return (
        <div
            className="flex flex-col"
        >
            <div
                className={`flex flex-wrap py-4 border-b-bdr-one border-bdr-bottom items-center text-color-default-old ${classTitle}`}
                style={styleHeadTop}
            >
                <div
                    className="flex flex-wrap items-center"
                >
                    {typeof icon !== 'undefined' && (
                        <FontAwesomeIcon
                            icon={icon}
                            className="text-2xl mr-2"
                        />
                    )}
                    <h1
                        className={`text-2xl text-start font-bold`}
                    >
                        {title}
                    </h1>
                </div>
                <div
                    className="flex flex-wrap items-center ml-2"
                    style={styleHeadRight}
                >
                    {typeof iconRight !== 'undefined' && (
                        <FontAwesomeIcon
                            icon={iconRight}
                            className="text-2xl mr-2"
                        />
                    )}
                    <h1
                        className={`text-2xl text-start font-bold`}
                    >
                        {titleRight}
                    </h1>
                </div>
            </div>

            <div
                className="flex flex-wrap justify-between my-8 relative"
            >
                {/* <div
                    className="flex flex-wrap justify-end"
                >
                    {typeof clickEdit !== 'undefined' && (
                        <EditBtn
                            icon={editIcon}
                            classBtn={classEditBtn}
                            classLoading={classLoadingEdit}
                            clickBtn={clickEdit}
                        />
                    )}

                    {typeof clickDownload !== 'undefined' && (
                        <EditBtn
                            icon={downloadIcon}
                            classBtn={classDownloadBtn}
                            classLoading={classLoadingDownload}
                            clickBtn={clickDownload}
                        />
                    )}

                    {typeof clickSend !== 'undefined' && (
                        <EditBtn
                            icon={sendIcon}
                            classBtn={classSendIcon}
                            classLoading={classLoadingSend}
                            clickBtn={clickSend}
                        />
                    )}

                    {typeof clickDelete !== 'undefined' && (
                        <EditBtn
                            icon={deleteIcon}
                            classBtn={classDeleteBtn}
                            classLoading={classLoadingDelete}
                            clickBtn={clickDelete}
                        />
                    )}
                </div> */}

                <WrappMenu
                classWrapp={`${classWrappMenu} bg-white shadow-lg`}
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

                <h1
                    className="text-[1.3rem] text-start font-bold text-font-color-4"
                >
                    {titleInfo}
                </h1>
                <Button
                    classBtn="hover:text-white rounded-sm px-[0.4rem] h-7"
                    classLoading="hidden"
                    clickBtn={clickMenu}
                    icon={<>
                        <FontAwesomeIcon icon={faEllipsis} className="text-lg" />
                    </>}
                />
            </div>
        </div>
    )
}