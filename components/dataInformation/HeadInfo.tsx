import { IconDefinition, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { EditBtn } from "components/editBtn/EditBtn"

type TitleProps = {
    classTitle?: string
    title: string
    titleInfo: string
    icon?: IconDefinition
}

type Props = TitleProps

export function HeadInfo({
    classTitle,
    icon,
    title,
    titleInfo,
}: Props) {
    return (
        <div
            className="flex flex-col"
        >
            <div
                className={`flex flex-wrap py-4 border-b-bdr-one border-bdr-bottom items-center text-color-default-old ${classTitle}`}
            >
                <FontAwesomeIcon
                    icon={icon as IconDefinition}
                    className="text-2xl mr-2"
                />
                <h1
                    className={`text-2xl text-start font-bold`}
                >
                    {title}
                </h1>
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
                    <EditBtn
                        icon={faPencil}
                        classBtn="mr-2 hover:bg-color-default-old hover:text-white"
                    />
                    <EditBtn
                        icon={faTrash}
                        classBtn="bg-pink border-pink hover:border-pink-old hover:bg-pink-old hover:text-white"
                    />
                </div>
            </div>
        </div>
    )
}