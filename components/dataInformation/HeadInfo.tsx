import { CSSProperties } from "react"
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { EditBtn } from "components/editBtn/EditBtn"

type ActionProps = {
    clickEdit?: () => void
    clickDelete?: () => void
    clickDownload?: () => void
    clickSend?:() => void
}

type IconProps = {
    icon?: IconDefinition
    iconRight?: IconDefinition
    editIcon?: IconDefinition
    deleteIcon?: IconDefinition
    downloadIcon?: IconDefinition
    sendIcon? : IconDefinition
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
    classLoadingSend? : string
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
    clickSend
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
                className="flex flex-col justify-between my-8"
            >
                <div
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
                </div>

                <h1
                    className="text-[1.3rem] text-start font-bold text-font-color-4"
                >
                    {titleInfo}
                </h1>
            </div>
        </div>
    )
}