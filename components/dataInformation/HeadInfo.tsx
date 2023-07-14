import { CSSProperties } from "react"
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { EditBtn } from "components/editBtn/EditBtn"

type ActionProps = {
    clickEdit?: () => void
    clickDelete?: () => void
}

type IconProps = {
    icon?: IconDefinition
    iconRight?: IconDefinition
    editIcon?: IconDefinition
    deleteIcon?: IconDefinition
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
    classLoadingDelete?: string
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
    classLoadingEdit,
    classLoadingDelete,
    clickEdit,
    clickDelete
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
                className="flex flex-wrap justify-between my-8"
            >
                <h1
                    className="text-[1.3rem] text-start font-bold text-font-color-4"
                >
                    {titleInfo}
                </h1>
                <div
                    className="flex flex-wrap justify-end"
                >
                    {typeof editIcon !== 'undefined' && (
                        <EditBtn
                            icon={editIcon}
                            classBtn={`${classEditBtn} mr-1 hover:bg-color-default-old hover:text-white`}
                            classLoading={classLoadingEdit}
                            clickBtn={clickEdit}
                        />
                    )}
                    {typeof deleteIcon !== 'undefined' && (
                        <EditBtn
                            icon={editIcon}
                            classBtn={`${classDeleteBtn} bg-pink border-pink hover:border-pink-old hover:bg-pink-old hover:text-white`}
                            classLoading={classLoadingDelete}
                            clickBtn={clickDelete}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}